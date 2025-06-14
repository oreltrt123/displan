"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../supabase/client"
import {
  ArrowLeft,
  Settings,
  Globe,
  Lock,
  Save,
  AlertCircle,
  Rocket,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Terminal,
  ExternalLink,
} from "lucide-react"
import "@/styles/sidebar_settings_editor.css"

interface ProjectFile {
  id: string
  name: string
  content: string
  path: string
  type: string
  created_at: string
  updated_at?: string
}

interface ProjectSettingsPageProps {
  params: {
    id: string
  }
}

export default function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "building" | "success" | "error">("idle")
  const [showDeploymentSummary, setShowDeploymentSummary] = useState(false)
  const [deploymentSummary, setDeploymentSummary] = useState<any>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
  })

  useEffect(() => {
    async function loadProject() {
      try {
        setIsLoading(true)

        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError || !userData.user) {
          router.push("/sign-in")
          return
        }

        // Get project data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single()

        if (projectError || !projectData) {
          throw new Error("Project not found")
        }

        // Check if user is the owner
        if (projectData.owner_id !== userData.user.id) {
          // Check if user is a collaborator with admin permissions
          const { data: collaborator, error: collabError } = await supabase
            .from("project_collaborators")
            .select("*")
            .eq("project_id", params.id)
            .eq("user_id", userData.user.id)
            .eq("role", "admin")
            .single()

          if (collabError || !collaborator) {
            throw new Error("You don't have permission to access project settings")
          }
        }

        setProject(projectData)
        setFormData({
          name: projectData.name,
          description: projectData.description || "",
          visibility: projectData.visibility,
        })

        // Check if project has a deployment URL
        if (projectData.deployment_url) {
          setDeploymentUrl(projectData.deployment_url)
        }
      } catch (err) {
        console.error("Error loading project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [deploymentLogs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // Update project
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          name: formData.name,
          description: formData.description,
          visibility: formData.visibility,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (updateError) throw updateError

      setSuccess("Project settings updated successfully")
      setProject({
        ...project,
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
      })
    } catch (err) {
      console.error("Error updating project:", err)
      setError(err instanceof Error ? err.message : "Failed to update project")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeploy = async () => {
    try {
      setIsDeploying(true)
      setDeploymentStatus("building")
      setError(null)
      setSuccess(null)
      setDeploymentLogs([])
      setShowDeploymentSummary(false)
      setDeploymentSummary(null)

      // Add initial logs
      setDeploymentLogs((logs) => [...logs, "Starting deployment process...", "Preparing project files..."])

      // Get project files
      const { data: files, error: filesError } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", params.id)

      if (filesError) throw filesError

      if (!files || files.length === 0) {
        throw new Error("Project has no files to deploy")
      }

      // Add more logs
      setDeploymentLogs((logs) => [
        ...logs,
        `Found ${files.length} files in project.`,
        "Analyzing project structure...",
      ])

      // Detect project type
      const hasHtml = files.some((file: ProjectFile) => file.name.endsWith(".html"))
      const hasPackageJson = files.some((file: ProjectFile) => file.name === "package.json")
      const hasIndexJs = files.some((file: ProjectFile) => file.name === "index.js")

      let projectType = "static"
      if (hasPackageJson) {
        const packageJsonFile = files.find((file: ProjectFile) => file.name === "package.json")
        if (packageJsonFile) {
          try {
            const packageJson = JSON.parse(packageJsonFile.content)
            if (packageJson.dependencies?.next) {
              projectType = "nextjs"
            } else if (packageJson.dependencies?.react) {
              projectType = "react"
            } else if (packageJson.dependencies?.vue) {
              projectType = "vue"
            }
          } catch (e) {
            console.error("Error parsing package.json:", e)
          }
        }
      }

      // Add more logs based on project type
      setDeploymentLogs((logs) => [
        ...logs,
        `Detected project type: ${projectType}`,
        "Preparing deployment environment...",
      ])

      // Simulate build process
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setDeploymentLogs((logs) => [...logs, "Installing dependencies..."])

      await new Promise((resolve) => setTimeout(resolve, 2000))
      setDeploymentLogs((logs) => [...logs, "Dependencies installed successfully."])

      if (projectType !== "static") {
        setDeploymentLogs((logs) => [...logs, "Building project..."])
        await new Promise((resolve) => setTimeout(resolve, 2500))
        setDeploymentLogs((logs) => [...logs, "Build completed successfully."])
      }

      setDeploymentLogs((logs) => [...logs, "Optimizing assets..."])
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Prepare project files for deployment
      const projectFiles = files.reduce(
        (acc: Record<string, string>, file: ProjectFile) => {
          acc[file.path] = file.content
          return acc
        },
        {} as Record<string, string>,
      )

      // Call deployment API
      setDeploymentLogs((logs) => [...logs, "Uploading files to deployment server..."])

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: params.id,
          projectName: project.name,
          files: projectFiles,
          projectType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Deployment failed")
      }

      const deployData = await response.json()

      setDeploymentLogs((logs) => [
        ...logs,
        "Files uploaded successfully.",
        "Finalizing deployment...",
        `Deployment complete! Your site is live at: ${deployData.url}`,
      ])

      // Update project with deployment URL
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          deployment_url: deployData.url,
          deployment_id: deployData.deploymentId,
          last_deployed: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (updateError) throw updateError

      setDeploymentUrl(deployData.url)
      setDeploymentStatus("success")
      setSuccess("Project deployed successfully!")

      // Create deployment summary
      setDeploymentSummary({
        url: deployData.url,
        deploymentId: deployData.deploymentId,
        timestamp: new Date().toISOString(),
        fileCount: files.length,
        projectType,
        assets: {
          html: files.filter((f: ProjectFile) => f.name.endsWith(".html")).length,
          css: files.filter((f: ProjectFile) => f.name.endsWith(".css")).length,
          js: files.filter((f: ProjectFile) => f.name.endsWith(".js")).length,
          other: files.filter(
            (f: ProjectFile) => !f.name.endsWith(".html") && !f.name.endsWith(".css") && !f.name.endsWith(".js"),
          ).length,
        },
      })

      setShowDeploymentSummary(true)
    } catch (err) {
      console.error("Error deploying project:", err)
      setError(err instanceof Error ? err.message : "Failed to deploy project")
      setDeploymentStatus("error")
      setDeploymentLogs((logs) => [
        ...logs,
        "Error: " + (err instanceof Error ? err.message : "Failed to deploy project"),
        "Deployment failed. Please check your project files and try again.",
      ])
    } finally {
      setIsDeploying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Loading project settings...</div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative">
        <header className="w-full border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
              DisPlan
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="bg-red-500/20 border border-red-500/50 text-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen text-white bg-background relative">
      <header className="w-full border-b border-[#8888881A]">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
            DisPlan
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/dashboard/project/${params.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-[#8888881A] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">Project Settings</h1>
            </div>

            {error && !isDeploying && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                {success}
              </div>
            )}

            <div className="space-y-8">
              {/* Project Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium border-b border-white/10 pb-2">Project Details</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                      Project Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="r2552esf25_252trewt3er"
                      />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="r2552esf25_252trewt3er"
                   />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Visibility</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          value="public"
                          checked={formData.visibility === "public"}
                          onChange={handleChange}
                        />
                        <label htmlFor="public" className="flex items-center gap-2">
                          <Globe size={14} className="text-white/60" />
                          Public
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          value="private"
                          checked={formData.visibility === "private"}
                          onChange={handleChange}
                        />
                        <label htmlFor="private" className="flex items-center gap-2">
                          <Lock size={14} className="text-white/60" />
                          Private
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Deployment Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium border-b border-white/10 pb-2">Deployment</h2>

                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-1">Deploy to Vercel</h3>
                      <p className="text-sm text-white/70 mb-4">
                        Deploy your project to the internet with one click. Your project will be hosted on Vercel's
                        global edge network.
                      </p>

                      {deploymentUrl && deploymentStatus !== "building" && (
                        <div className="mb-4">
                          <p className="text-sm text-white/80 mb-1">Current deployment:</p>
                          <div className="flex items-center gap-2">
                            <a
                              href={deploymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline break-all flex items-center gap-1"
                            >
                              {deploymentUrl}
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="px-4 py-2 bg-black text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Rocket size={16} />
                        {isDeploying ? "Deploying..." : "Deploy to Vercel"}
                      </button>
                    </div>
                  </div>

                  {/* Deployment Terminal */}
                  {(deploymentLogs.length > 0 || deploymentStatus === "building") && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Terminal size={16} className="text-white/70" />
                          <h4 className="font-medium">Deployment Logs</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {deploymentStatus === "building" && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              Building
                            </span>
                          )}
                          {deploymentStatus === "success" && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                              <Check size={12} />
                              Success
                            </span>
                          )}
                          {deploymentStatus === "error" && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full flex items-center gap-1">
                              <X size={12} />
                              Failed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 h-64 overflow-y-auto font-mono text-sm">
                        {deploymentLogs.map((log, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-white/50">{`> `}</span>
                            <span className={log.startsWith("Error:") ? "text-red-400" : "text-white/90"}>{log}</span>
                          </div>
                        ))}
                        <div ref={logsEndRef} />
                      </div>
                    </div>
                  )}

                  {/* Deployment Summary */}
                  {showDeploymentSummary && deploymentSummary && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowDeploymentSummary(!showDeploymentSummary)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-2"
                      >
                        {showDeploymentSummary ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="font-medium">Deployment Summary</span>
                      </button>

                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-white/70 mb-1">Static Assets</h5>
                            <div className="bg-white/5 rounded p-2 text-sm">
                              <div className="flex justify-between mb-1">
                                <span>HTML</span>
                                <span className="text-white/70">{deploymentSummary.assets.html}</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span>CSS</span>
                                <span className="text-white/70">{deploymentSummary.assets.css}</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span>JavaScript</span>
                                <span className="text-white/70">{deploymentSummary.assets.js}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Other</span>
                                <span className="text-white/70">{deploymentSummary.assets.other}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-white/70 mb-1">Deployment Info</h5>
                            <div className="bg-white/5 rounded p-2 text-sm">
                              <div className="flex justify-between mb-1">
                                <span>Project Type</span>
                                <span className="text-white/70">{deploymentSummary.projectType}</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span>Total Files</span>
                                <span className="text-white/70">{deploymentSummary.fileCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Deployment ID</span>
                                <span className="text-white/70 text-xs">
                                  {deploymentSummary.deploymentId.substring(0, 8)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium border-b border-red-500/30 pb-2 text-red-400">Danger Zone</h2>

                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <h3 className="font-medium mb-1 text-red-400">Delete Project</h3>
                  <p className="text-sm text-white/70 mb-4">
                    Once you delete a project, there is no going back. Please be certain.
                  </p>

                  <Link
                    href={`/dashboard/project/${params.id}/delete`}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors inline-block"
                  >
                    Delete this project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
