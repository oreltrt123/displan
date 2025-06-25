import { DisplanDashboard } from "../../components/displan-dashboard"
import { displan_project_designer_css_fetch_by_folder } from "../../lib/actions/displan-project-actions"
import { supabase } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"

export default async function FolderPage({
  params,
  searchParams,
}: {
  params: { folderId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get real user ID from Supabase or use consistent fallback
  let userId = searchParams.id as string

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.id) {
      userId = user.id
    }
  } catch (error) {
    // If no user ID provided, create a consistent one
    if (!userId) {
      userId = "guest_user_" + Math.random().toString(36).substr(2, 16)
    }
  }

  // Fetch projects for this folder
  const result = await displan_project_designer_css_fetch_by_folder(params.folderId)
  const projects = result.success ? result.data : []

  return <DisplanDashboard initialProjects={projects} userId={userId} currentFolderId={params.folderId} />
}
