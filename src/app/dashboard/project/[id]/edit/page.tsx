"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../supabase/client"
import { ArrowLeft, File, FileText, Code, Trash2, Edit, Copy, Save, X, AlertCircle } from "lucide-react"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectVisibility, setProjectVisibility] = useState("public")

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

        // Check if user is the owner or has edit permissions
        if (projectData.owner_id !== userData.user.id) {
          // Check if user is a collaborator with edit permissions
          const { data: collaborator, error: collabError } = await supabase
            .from("project_collaborators")
            .select("*")
            .eq("project_id", params.id)
            .eq("user_id", userData.user.id)
            .single()

          if (collabError || !collaborator || collaborator.role === "viewer") {
            throw new Error("You don't have permission to edit this project")
          }
        }

        setProject(projectData)
        setProjectName(projectData.name)
        setProjectDescription(projectData.description || "")
        setProjectVisibility(projectData.visibility)

        // Get project files
        const { data: filesData, error: filesError } = await supabase
          .from("project_files")
          .select("*")
          .eq("project_id", params.id)
          .order("name", { ascending: true })

        if (filesError) {
          throw filesError
        }

        setFiles(filesData || [])
      } catch (err) {
        console.error("Error loading project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (fileName === "README.md") return <FileText size={18} className="text-blue-400" />
    if (fileName === ".gitignore") return <File size={18} className="text-gray-400" />

    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <Code size={18} className="text-yellow-400" />
      case "html":
        return <Code size={18} className="text-orange-400" />
      case "css":
      case "scss":
        return <Code size={18} className="text-blue-400" />
      case "json":
        return <Code size={18} className="text-green-400" />
      case "md":
        return <FileText size={18} className="text-white" />
      default:
        return <File size={18} className="text-white/70" />
    }
  }

  const handleEditFile = async (fileId: string) => {
    try {
      setEditingFile(fileId)

      // Get file content
      const file = files.find((f) => f.id === fileId)
      if (file) {
        setFileContent(file.content)
      }
    } catch (err) {
      console.error("Error editing file:", err)
      setError(err instanceof Error ? err.message : "Failed to edit file")
    }
  }

  const handleSaveFile = async () => {
    try {
      setIsSaving(true)
      setError(null)

      if (!editingFile) return

      // Update file content
      const { error: updateError } = await supabase
        .from("project_files")
        .update({
          content: fileContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingFile)

      if (updateError) throw updateError

      // Update local state
      setFiles(files.map((f) => (f.id === editingFile ? { ...f, content: fileContent } : f)))

      setSuccess("File updated successfully")
      setEditingFile(null)
    } catch (err) {
      console.error("Error saving file:", err)
      setError(err instanceof Error ? err.message : "Failed to save file")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return
    }

    try {
      setError(null)

      // Delete file
      const { error: deleteError } = await supabase.from("project_files").delete().eq("id", fileId)

      if (deleteError) throw deleteError

      // Update local state
      setFiles(files.filter((f) => f.id !== fileId))
      setSuccess("File deleted successfully")
    } catch (err) {
      console.error("Error deleting file:", err)
      setError(err instanceof Error ? err.message : "Failed to delete file")
    }
  }

  const handleDuplicateFile = async (fileId: string) => {
    try {
      setError(null)

      // Get file to duplicate
      const fileToDuplicate = files.find((f) => f.id === fileId)
      if (!fileToDuplicate) return

      // Create new file name
      const baseName = fileToDuplicate.name.split(".")
      const extension = baseName.pop()
      const newName = `${baseName.join(".")}-copy.${extension}`

      // Insert new file
      const { data: newFile, error: insertError } = await supabase
        .from("project_files")
        .insert({
          project_id: params.id,
          name: newName,
          content: fileToDuplicate.content,
          path: newName,
          type: "file",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update local state
      setFiles([...files, newFile])
      setSuccess("File duplicated successfully")
    } catch (err) {
      console.error("Error duplicating file:", err)
      setError(err instanceof Error ? err.message : "Failed to duplicate file")
    }
  }

  const handleSaveProject = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Update project
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          name: projectName,
          description: projectDescription,
          visibility: projectVisibility,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (updateError) throw updateError

      setSuccess("Project updated successfully")

      // Update local state
      setProject({
        ...project,
        name: projectName,
        description: projectDescription,
        visibility: projectVisibility,
      })
    } catch (err) {
      console.error("Error updating project:", err)
      setError(err instanceof Error ? err.message : "Failed to update project")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Loading project...</div>
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
    <div className="w-full min-h-screen text-white bg-black relative">
      <header className="w-full border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
            DisPlan
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/dashboard/project/${params.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
              <Save size={18} className="text-green-400" />
              {success}
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm mb-8">
            <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Project Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Visibility</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                      checked={projectVisibility === "public"}
                      onChange={() => setProjectVisibility("public")}
                    />
                    <label htmlFor="public">Public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                      checked={projectVisibility === "private"}
                      onChange={() => setProjectVisibility("private")}
                    />
                    <label htmlFor="private">Private</label>
                  </div>
                </div>
              </div> */}

              <div>
                <button
                  onClick={handleSaveProject}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Manage Files</h2>

            {editingFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Editing: {files.find((f) => f.id === editingFile)?.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveFile}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Save size={14} />
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingFile(null)}
                      className="px-3 py-1.5 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>

                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full h-[400px] bg-[#1e1e1e] p-4 font-mono text-sm outline-none resize-none rounded-lg"
                  spellCheck="false"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {files.length > 0 ? (
                  <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Name</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-white/70">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((file) => (
                          <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.name)}
                                <span>{file.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditFile(file.id)}
                                  className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                                  title="Edit file"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDuplicateFile(file.id)}
                                  className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                                  title="Duplicate file"
                                >
                                  <Copy size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                  title="Delete file"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                    <File size={48} className="text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 mb-2">No files yet</p>
                    <Link
                      href={`/dashboard/project/${params.id}/upload`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2 mt-4"
                    >
                      Upload Files
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
