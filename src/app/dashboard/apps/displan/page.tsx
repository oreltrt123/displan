import { DisplanDashboard } from "./components/displan-dashboard"
import { displan_project_designer_css_fetch_all } from "./lib/actions/displan-project-actions"
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const result = await displan_project_designer_css_fetch_all()
  const projects = result.success ? result.data : []

  return <DisplanDashboard initialProjects={projects} />
}
