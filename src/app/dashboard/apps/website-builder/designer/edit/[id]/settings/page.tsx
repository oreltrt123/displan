import { createClient } from "../../../../../../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"
import ProjectSettings from "../../../components/project-settings"

interface ProjectSettingsPageProps {
  params: {
    id: string
  }
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { id } = params
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access project settings")
  }

  const user = session.user

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  // Get project details
  const { data: project } = await supabase
    .from("website_projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  // If project doesn't exist or doesn't belong to user, redirect
  if (!project) {
    redirect("/dashboard/apps/website-builder/designer?message=Project not found")
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <DashboardNavbar hasProfile={hasProfile} />

      <main className="w-full pt-6">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/dashboard/apps/website-builder/designer"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to projects
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Project Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage settings for {project.name || "Untitled"}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
            <ProjectSettings project={project} />
          </div>
        </div>
      </main>
    </div>
  )
}
