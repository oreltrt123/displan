"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../supabase/client"
import { ArrowLeft, Upload, File, X, Info } from "lucide-react"

export default function CreateProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
    addReadme: false,
    addGitignore: false,
    license: "none",
  })

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth error:", error)
          setError("Authentication error. Please sign in again.")
          router.push("/sign-in")
          return
        }

        if (!data.user) {
          setError("You must be logged in to create a project")
          router.push("/sign-in")
          return
        }

        setUser(data.user)
      } catch (err) {
        console.error("Error checking auth:", err)
        setError("Failed to verify authentication")
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("You must be logged in to create a project")
      }

      // Validate project name
      if (!formData.name.trim()) {
        throw new Error("Project name is required")
      }

      // Create project in database
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: formData.name,
          description: formData.description,
          visibility: formData.visibility,
          owner_id: user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Create README.md if selected
      if (formData.addReadme && project) {
        const readmeContent = `# ${formData.name}\n\n${formData.description || "A DisPlan project"}`

        const { error: fileError } = await supabase.from("project_files").insert({
          project_id: project.id,
          name: "README.md",
          content: readmeContent,
          path: "README.md",
          type: "file",
          created_at: new Date().toISOString(),
        })

        if (fileError) throw fileError
      }

      // Create .gitignore if selected
      if (formData.addGitignore && project) {
        const gitignoreContent = `# Node.js\nnode_modules/\nnpm-debug.log\nyarn-error.log\n\n# Build files\ndist/\nbuild/\n\n# Environment variables\n.env\n.env.local\n\n# IDE files\n.idea/\n.vscode/\n*.sublime-*\n\n# OS files\n.DS_Store\nThumbs.db`

        const { error: fileError } = await supabase.from("project_files").insert({
          project_id: project.id,
          name: ".gitignore",
          content: gitignoreContent,
          path: ".gitignore",
          type: "file",
          created_at: new Date().toISOString(),
        })

        if (fileError) throw fileError
      }

      // Upload selected files
      if (selectedFiles.length > 0 && project) {
        for (const file of selectedFiles) {
          const reader = new FileReader()

          await new Promise<void>((resolve, reject) => {
            reader.onload = async (e) => {
              try {
                const content = e.target?.result as string

                const { error: fileError } = await supabase.from("project_files").insert({
                  project_id: project.id,
                  name: file.name,
                  content: content,
                  path: file.name,
                  type: "file",
                  created_at: new Date().toISOString(),
                })

                if (fileError) throw fileError
                resolve()
              } catch (err) {
                reject(err)
              }
            }

            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
            reader.readAsText(file)
          })
        }
      }

      // Redirect to dashboard or project page
      router.push("/dashboard")
    } catch (err) {
      console.error("Error creating project:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to create project. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </div>
    )
  }

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

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">Create a new project</h1>
            <p className="text-white/70 mb-8">A project contains all your files, including the revision history.</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  Project name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="my-awesome-project"
                />
                <p className="text-xs text-white/50">Great project names are short and memorable.</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-white/80">
                  Description <span className="text-white/50">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description of your project..."
                />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Visibility</h3>

                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="public" className="block text-sm font-medium text-white">
                      Public
                    </label>
                    <p className="text-xs text-white/50">
                      Anyone on the internet can see this project. You choose who can collaborate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="private" className="block text-sm font-medium text-white">
                      Private
                    </label>
                    <p className="text-xs text-white/50">You choose who can see and collaborate on this project.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Initialize this project with:</h3>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="addReadme"
                    name="addReadme"
                    checked={formData.addReadme}
                    onChange={handleChange}
                  />
                  <div>
                    <label htmlFor="addReadme" className="block text-sm font-medium text-white">
                      Add a README file
                    </label>
                    <p className="text-xs text-white/50">
                      This is where you can write a long description for your project.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="addGitignore"
                    name="addGitignore"
                    checked={formData.addGitignore}
                    onChange={handleChange}
                  />
                  <div>
                    <label htmlFor="addGitignore" className="block text-sm font-medium text-white">
                      Add .displan
                    </label>
                    <p className="text-xs text-white/50">Choose which files not to track from a list of templates.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Upload files</h3>

                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload size={40} className="text-white/50" />
                    <p className="text-white/70">Drag files here to add them to your project</p>
                    <p className="text-white/50 text-sm">or</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Choose your files
                    </button>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected files:</h4>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <File size={16} className="text-blue-400" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-white/50">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-white/50 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 text-white/70 text-sm">
                <Info size={16} />
                <p>You are creating a {formData.visibility} project in your personal account.</p>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-3 text-base tracking-tight no-underline bg-green-600 font-[560] rounded-[100px] text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create project"}
                </button>

                <Link
                  href="/dashboard"
                  className="px-5 py-3 text-base tracking-tight no-underline bg-white bg-opacity-10 font-[560] rounded-[100px] text-white hover:bg-opacity-20 transition-opacity"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
