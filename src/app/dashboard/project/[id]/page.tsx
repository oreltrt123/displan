import { createClient } from "../../../../../supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  GitBranch,
  File,
  Code,
  FileText,
  Clock,
  Lock,
  Globe,
  Download,
  Upload,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return notFound()
  }

  // Get project data
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (error || !project) {
    return notFound()
  }

  // Check if user has access to this project
  if (project.visibility === "private" && project.owner_id !== user.id) {
    // Check if user is a collaborator
    const { data: collaborator } = await supabase
      .from("project_collaborators")
      .select("*")
      .eq("project_id", params.id)
      .eq("user_id", user.id)
      .single()

    if (!collaborator) {
      return notFound()
    }
  }

  // Get project files
  const { data: files } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", params.id)
    .order("name", { ascending: true })

  // Get project collaborators with their profiles
  const { data: collaborators } = await supabase
    .from("project_collaborators")
    .select(`
      id,
      user_id,
      role,
      profiles:user_id(
        name,
        avatar_url
      )
    `)
    .eq("project_id", params.id)

  // Get owner profile
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("user_id", project.owner_id)
    .single()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get file icon based on file name
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (fileName === "README.md") return <FileText size={16} className="text-blue-400" />
    if (fileName === ".gitignore") return <File size={16} className="text-gray-400" />

    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <Code size={16} className="text-yellow-400" />
      case "html":
        return <Code size={16} className="text-orange-400" />
      case "css":
      case "scss":
        return <Code size={16} className="text-blue-400" />
      case "json":
        return <Code size={16} className="text-green-400" />
      case "md":
        return <FileText size={16} className="text-white" />
      default:
        return <File size={16} className="text-white/70" />
    }
  }

  // Check if user is owner
  const isOwner = project.owner_id === user.id
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  // Prepare team members list (owner + collaborators)
  const teamMembers = [
    {
      id: project.owner_id,
      name: ownerProfile?.name || "Project Owner",
      avatar_url: ownerProfile?.avatar_url,
      role: "owner",
    },
    ...(collaborators || []).map((c) => {
      // Fix: Access the profile data correctly
      const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles

      return {
        id: c.user_id,
        name: profile?.name || "Collaborator",
        avatar_url: profile?.avatar_url,
        role: c.role,
      }
    }),
  ]
  const hasProfile = !!profile
  // Limit visible team members to 4
  const visibleTeamMembers = teamMembers.slice(0, 4)
  const hasMoreTeamMembers = teamMembers.length > 4
  const additionalMembersCount = teamMembers.length - 4

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <DashboardNavbar hasProfile={hasProfile} />
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch size={24} className="text-blue-400" />
                <h1 className="text-2xl font-bold">{project.name}</h1>
                {project.visibility === "private" ? (
                  <Lock size={16} className="text-white/60" />
                ) : (
                  <Globe size={16} className="text-white/60" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60 flex items-center gap-1">
                  <Clock size={14} />
                  Created {formatDate(project.created_at)}
                </span>

                {/* <Link
                  href={`/dashboard/project/${params.id}/edit`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  Edit
                </Link> */}

                <Link
                  href={`/dashboard/project/${params.id}/settings`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Settings size={14} />
                  Settings
                </Link>

                <Link
                  href={`/dashboard/project/${params.id}/download`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-white/10 font-medium rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Download size={14} />
                  Download
                </Link>
              </div>
            </div>

            {project.description && <p className="text-white/70 mt-2">{project.description}</p>}

            {/* Display deployment URL if available */}
            {project.deployment_url && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-white/70">Deployed at:</span>
                <a
                  href={project.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  {project.deployment_url}
                </a>
              </div>
            )}

            {/* Team members section */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {visibleTeamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-black"
                    style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                  >
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url || "/placeholder.svg"}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                ))}

                {hasMoreTeamMembers && (
                  <Link
                    href={`/dashboard/project/${params.id}/collaborators`}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ml-[-8px] hover:bg-white/20 transition-colors"
                  >
                    <span className="text-xs font-medium">+{additionalMembersCount}</span>
                  </Link>
                )}
              </div>

              {isOwner && (
                <Link
                  href={`/dashboard/project/${params.id}/collaborators`}
                  className="ml-3 text-sm text-white/70 hover:text-white flex items-center gap-1"
                >
                  <Users size={14} />
                  {collaborators && collaborators.length > 0 ? "Manage collaborators" : "Add collaborators"}
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Files</h2>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/project/${params.id}/add-file`}
                  className="px-3 py-1.5 text-sm tracking-tight no-underline bg-green-500/20 font-medium rounded-lg text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-1"
                >
                  <PlusCircle size={14} />
                  New File
                </Link>
              </div>
            </div>

            {files && files.length > 0 ? (
              <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/70 hidden md:table-cell">
                        Last updated
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/70"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <Link href={`/dashboard/project/${params.id}/file/${file.id}`} className="flex items-center gap-2">
                            {getFileIcon(file.name)}
                            <span>{file.name}</span>
                          </Link>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-white/60 text-sm">
                          {file.updated_at ? formatDate(file.updated_at) : formatDate(file.created_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/dashboard/project/${params.id}/file/${file.id}/download`}
                            className="text-white/60 hover:text-white"
                            title="Download file"
                          >
                            <Download size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                <File size={48} className="text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No files yet</h3>
                <p className="text-white/60 mb-6">Upload files to get started with your project</p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href={`/dashboard/project/${params.id}/add-file`}
                    className="px-5 py-3 text-base tracking-tight no-underline bg-green-500 font-[560] rounded-[100px] text-white hover:bg-green-600 transition-colors inline-flex items-center gap-2"
                  >
                    <PlusCircle size={18} />
                    Create New File
                  </Link>
                  <Link
                    href={`/dashboard/project/${params.id}/upload`}
                    className="px-5 py-3 text-base tracking-tight no-underline bg-blue-500 font-[560] rounded-[100px] text-white hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Upload size={18} />
                    Upload Files
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
