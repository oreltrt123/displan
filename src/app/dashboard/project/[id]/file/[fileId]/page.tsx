import { createClient } from "../../../../../../../supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, File, FileText, Code, Download, Edit } from "lucide-react"

interface FilePageProps {
  params: {
    id: string
    fileId: string
  }
}

export default async function FilePage({ params }: FilePageProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return notFound()
  }

  // Get project data
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (projectError || !project) {
    return notFound()
  }

  // Check if user has access to this project
  if (project.visibility === "private" && project.owner_id !== user.id) {
    return notFound()
  }

  // Get file data
  const { data: file, error: fileError } = await supabase
    .from("project_files")
    .select("*")
    .eq("id", params.fileId)
    .eq("project_id", params.id)
    .single()

  if (fileError || !file) {
    return notFound()
  }

  // Get file icon based on file name
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (fileName === "README.md") return <FileText size={24} className="text-blue-400" />
    if (fileName === ".gitignore") return <File size={24} className="text-gray-400" />

    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <Code size={24} className="text-yellow-400" />
      case "html":
        return <Code size={24} className="text-orange-400" />
      case "css":
      case "scss":
        return <Code size={24} className="text-blue-400" />
      case "json":
        return <Code size={24} className="text-green-400" />
      case "md":
        return <FileText size={24} className="text-white" />
      default:
        return <File size={24} className="text-white/70" />
    }
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
        <Link
          href={`/dashboard/project/${params.id}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>

        <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(file.name)}
                <h1 className="text-2xl font-bold">{file.name}</h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/project/${params.id}/file/${params.fileId}/edit`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Link>

                <Link
                  href={`/dashboard/project/${params.id}/file/${params.fileId}/download`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Download size={14} />
                  Download
                </Link>
              </div>
            </div>
          </div>

          <div className="p-0">
            <pre className="bg-white/5 p-6 overflow-x-auto text-sm font-mono whitespace-pre-wrap">{file.content}</pre>
          </div>
        </div>
      </main>
    </div>
  )
}
