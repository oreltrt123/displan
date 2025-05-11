"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../supabase/client"
import { ArrowLeft, Users, X, UserPlus, Check, AlertCircle } from "lucide-react"

interface CollaboratorsPageProps {
  params: {
    id: string
  }
}

interface Collaborator {
  id: string
  user_id: string
  role: string
  user_name: string
  user_email?: string
}

type CollabRecord = {
    id: string
    user_id: string
    role: string
    profiles: {
      name: string
      email: string
    } | null | { name: string; email: string }[]
  }
  
export default function CollaboratorsPage({ params }: CollaboratorsPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")

  // Load project and collaborators
  useEffect(() => {
    async function loadProject() {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("Auth error:", userError)
          throw new Error(`Authentication error: ${userError.message}`)
        }

        if (!userData.user) {
          router.push("/sign-in")
          return
        }

        // Get project data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single()

        if (projectError) {
          console.error("Project error:", projectError)
          throw new Error(`Project error: ${projectError.message}`)
        }

        if (!projectData) {
          throw new Error("Project not found")
        }

        // Check if user is the owner
        if (projectData.owner_id !== userData.user.id) {
          throw new Error("Only the project owner can manage collaborators")
        }

        setProject(projectData)

        // Load collaborators with a simpler approach
        await loadCollaborators()
      } catch (err) {
        console.error("Error loading project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  // Separate function to load collaborators
  const loadCollaborators = async () => {
    try {
      // Get collaborators directly with a simpler query
      const { data: collabData, error: collabError } = await supabase
        .from("project_collaborators")
        .select(`
          id, 
          user_id, 
          role,
          created_at,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq("project_id", params.id)

      if (collabError) {
        console.error("Collaborators error:", collabError)
        throw new Error(`Failed to load collaborators: ${collabError.message}`)
      }

      if (!collabData || collabData.length === 0) {
        setCollaborators([])
        return
      }

      // Process the data
      const processedCollaborators = collabData.map((collab: CollabRecord) => {
        let profile = null
        if (Array.isArray(collab.profiles)) {
          profile = collab.profiles[0] || null
        } else {
          profile = collab.profiles
        }
  
        return {
          id: collab.id,
          user_id: collab.user_id,
          role: collab.role,
          user_name: profile?.name || "Unknown User",
          user_email: profile?.email || "",
        }
      })
  

      setCollaborators(processedCollaborators)
    } catch (err) {
      console.error("Error loading collaborators:", err)
      // Don't set error here to avoid blocking the UI if only collaborator loading fails
      // Just log it to console
    }
  }

  // Add collaborator
  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    setError(null)
    setSuccess(null)

    try {
      if (!email) {
        throw new Error("Email is required")
      }

      // Use the RPC function to add collaborator
      const { data, error: rpcError } = await supabase.rpc("add_collaborator_by_email", {
        p_project_id: params.id,
        p_email: email,
        p_role: role,
      })

      if (rpcError) {
        console.error("RPC error:", rpcError)
        throw new Error(`Failed to add collaborator: ${rpcError.message}`)
      }

      if (!data || !data.success) {
        throw new Error(data?.message || "Failed to add collaborator")
      }

      setSuccess(data.message)
      setEmail("")

      // Reload collaborators
      await loadCollaborators()
    } catch (err) {
      console.error("Error adding collaborator:", err)
      setError(err instanceof Error ? err.message : "Failed to add collaborator")
    } finally {
      setIsAdding(false)
    }
  }

  // Remove collaborator
  const removeCollaborator = async (id: string) => {
    try {
      setError(null)
      setSuccess(null)

      const { error } = await supabase.from("project_collaborators").delete().eq("id", id)

      if (error) {
        console.error("Remove error:", error)
        throw error
      }

      // Update the list
      setCollaborators(collaborators.filter((c) => c.id !== id))
      setSuccess("Collaborator removed successfully")
    } catch (err) {
      console.error("Error removing collaborator:", err)
      setError(err instanceof Error ? err.message : "Failed to remove collaborator")
    }
  }

  // Update collaborator role
  const updateCollaboratorRole = async (id: string, newRole: string) => {
    try {
      setError(null)
      setSuccess(null)

      const { error } = await supabase.from("project_collaborators").update({ role: newRole }).eq("id", id)

      if (error) {
        console.error("Update role error:", error)
        throw error
      }

      // Update the list
      setCollaborators(collaborators.map((c) => (c.id === id ? { ...c, role: newRole } : c)))
      setSuccess("Collaborator role updated successfully")
    } catch (err) {
      console.error("Error updating collaborator role:", err)
      setError(err instanceof Error ? err.message : "Failed to update collaborator role")
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
            href={`/dashboard/project/${params.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">Manage Collaborators</h1>
            </div>

            {error && (
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

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Add Collaborator</h2>
              <form onSubmit={handleAddCollaborator} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="collaborator@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isAdding || !email}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    {isAdding ? "Adding..." : "Add Collaborator"}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Current Collaborators</h2>

              {collaborators.length > 0 ? (
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-400">
                            {collaborator.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{collaborator.user_name}</p>
                          <p className="text-xs text-white/60">{collaborator.user_email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={collaborator.role}
                          onChange={(e) => updateCollaboratorRole(collaborator.id, e.target.value)}
                          className="text-sm bg-white/10 border border-white/10 rounded-md px-2 py-1 text-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => removeCollaborator(collaborator.id)}
                          className="p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                          title="Remove collaborator"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                  <Users size={48} className="text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">No collaborators yet</p>
                  <p className="text-sm text-white/50">Add team members to work together on this project</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
