"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../../../supabase/client"
import { ArrowLeft, Save, X } from 'lucide-react'

interface EditFilePageProps {
  params: {
    id: string
    fileId: string
  }
}

export default function EditFilePage({ params }: EditFilePageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<any>(null)
  const [content, setContent] = useState("")
  const [project, setProject] = useState<any>(null)
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    async function loadFile() {
      try {
        setIsLoading(true)
        
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw new Error("You must be logged in to edit files")
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
        
        setProject(projectData)
        
        // Check if user has permission to edit
        const isOwner = projectData.owner_id === userData.user?.id
        
        // Get collaborators (if we had a collaborators table)
        const { data: collaborators, error: collabError } = await supabase
          .from("project_collaborators")
          .select("*")
          .eq("project_id", params.id)
          .eq("user_id", userData.user?.id)
          .single()
        
        const isCollaborator = !collabError && collaborators
        
        if (!isOwner && !isCollaborator) {
          throw new Error("You don't have permission to edit this file")
        }
        
        setCanEdit(true)
        
        // Get file data
        const { data: fileData, error: fileError } = await supabase
          .from("project_files")
          .select("*")
          .eq("id", params.fileId)
          .eq("project_id", params.id)
          .single()
        
        if (fileError || !fileData) {
          throw new Error("File not found")
        }
        
        setFile(fileData)
        setContent(fileData.content)
      } catch (err) {
        console.error("Error loading file:", err)
        setError(err instanceof Error ? err.message : "Failed to load file")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFile()
  }, [params.id, params.fileId, supabase])
  
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      if (!canEdit) {
        throw new Error("You don't have permission to edit this file")
      }
      
      // Update file content
      const { error: updateError } = await supabase
        .from("project_files")
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.fileId)
      
      if (updateError) throw updateError
      
      // Redirect back to file view
      router.push(`/dashboard/project/${params.id}/file/${params.fileId}`)
    } catch (err) {
      console.error("Error saving file:", err)
      setError(err instanceof Error ? err.message : "Failed to save file")
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Loading file...</div>
      </div>
    )
  }
  
  if (error) {
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
            <Link href={`/project/${params.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft size={16} />
              Back to Project
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
            DisPlan
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm tracking-tight no-underline bg-green-600 font-medium rounded-lg text-white hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Save"}
            </button>
            
            <Link
              href={`/dashboard/project/${params.id}/file/${params.fileId}`}
              className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-1"
            >
              <X size={14} />
              Cancel
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href={`/dashboard/project/${params.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-2">
                <ArrowLeft size={16} />
                Back to Project
              </Link>
              <h1 className="text-2xl font-bold">{file?.name}</h1>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[70vh] bg-[#1e1e1e] p-4 font-mono text-sm outline-none resize-none"
              spellCheck="false"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
