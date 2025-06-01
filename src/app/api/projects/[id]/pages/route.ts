import { type NextRequest, NextResponse } from "next/server"
import { displan_project_designer_css_get_project_pages } from "../../../../dashboard/apps/displan/lib/actions/displan-project-pages-actions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get project pages
    const result = await displan_project_designer_css_get_project_pages(projectId)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to fetch pages" }, { status: 404 })
    }

    return NextResponse.json({
      pages: result.data || [],
    })
  } catch (error) {
    console.error("Error fetching project pages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
