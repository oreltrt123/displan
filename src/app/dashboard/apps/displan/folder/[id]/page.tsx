import { createClient } from "../../../../../../../supabase/server"
import { DisplanDashboard } from "../../components/displan-dashboard"
import { displan_project_designer_css_fetch_by_folder } from "../../lib/actions/displan-project-actions"
import { redirect } from "next/navigation"

interface FolderPageProps {
  params: {
    id: string
  }
}

export default async function FolderPage({ params }: FolderPageProps) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Fetch projects for this specific folder
  const result = await displan_project_designer_css_fetch_by_folder(params.id)

  if (!result.success) {
    redirect("/dashboard")
  }

  return <DisplanDashboard initialProjects={result.data} currentFolderId={params.id} />
}
