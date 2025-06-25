import { DisplanDashboard } from "./components/displan-dashboard"
import { displan_project_designer_css_fetch_all } from "./lib/actions/displan-project-actions"
import { supabase } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get real user ID from Supabase or create consistent fallback
  let userId = searchParams.id as string

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.id) {
      userId = user.id
    }
  } catch (error) {
    // If no user ID provided, create a consistent one based on browser/session
    if (!userId) {
      userId = "guest_user_" + Math.random().toString(36).substr(2, 16)
    }
  }

  // Fetch projects
  const result = await displan_project_designer_css_fetch_all()
  const projects = result.success ? result.data : []

  return <DisplanDashboard initialProjects={projects} userId={userId} />
}
