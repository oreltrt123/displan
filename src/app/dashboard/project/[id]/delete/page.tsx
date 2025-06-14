"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../supabase/client"
import { ArrowLeft, AlertCircle, Trash2, X } from "lucide-react"

interface DeleteProjectPageProps {
  params: {
    id: string
  }
}

export default function DeleteProjectPage({ params }: DeleteProjectPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null)
  const [confirmName, setConfirmName] = useState("")

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
          throw new Error("You don't have permission to delete this project")
        }

        setProject(projectData)
      } catch (err) {
        console.error("Error loading project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  const handleDelete = async () => {
    try {
      if (!project) return

      // Verify confirmation name matches project name
      if (confirmName !== project.name) {
        setError("Please type the project name correctly to confirm deletion")
        return
      }

      setIsDeleting(true)
      setError(null)

      // Delete project files first
      const { error: filesError } = await supabase.from("project_files").delete().eq("project_id", params.id)

      if (filesError) throw filesError

      // Delete project collaborators
      const { error: collabError } = await supabase.from("project_collaborators").delete().eq("project_id", params.id)

      if (collabError) throw collabError

      // Delete environment variables
      const { error: envError } = await supabase.from("project_env_vars").delete().eq("project_id", params.id)

      if (envError) throw envError

      // Finally delete the project
      const { error: projectError } = await supabase.from("projects").delete().eq("id", params.id)

      if (projectError) throw projectError

      // Redirect to dashboard
      router.push("/dashboard?deleted=true")
    } catch (err) {
      console.error("Error deleting project:", err)
      setError(err instanceof Error ? err.message : "Failed to delete project")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/project/${params.id}/settings`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Project Settings
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Trash2 size={24} className="text-red-400" />
              <h1 className="text-2xl font-bold">Delete Project</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-400">Warning: This action cannot be undone</h3>
                  <p className="text-sm text-white/70 mt-1">
                    This will permanently delete the <strong>{project?.name}</strong> project, all of its files,
                    settings, and deployment history.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="confirmName" className="block text-sm font-medium text-white/80 mb-1">
                  To confirm, type <span className="font-bold">{project?.name}</span> below:
                </label>
                <input
                  id="confirmName"
                  type="text"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  className="r2552esf25_252trewt3er"
                  placeholder={project?.name}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || confirmName !== project?.name}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "I understand, delete this project"}
                </button>

                <Link
                  href={`/dashboard/project/${params.id}/settings`}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
