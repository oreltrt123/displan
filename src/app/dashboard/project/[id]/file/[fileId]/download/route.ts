import { createClient } from "../../../../../../../../supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get project data to check visibility
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    )
  }

  // Check if user has access to this project
  if (project.visibility === "private" && (!session || project.owner_id !== session.user.id)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // Get file data
  const { data: file, error: fileError } = await supabase
    .from("project_files")
    .select("*")
    .eq("id", params.fileId)
    .eq("project_id", params.id)
    .single()

  if (fileError || !file) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    )
  }

  // Set headers for file download
  const headers = new Headers()
  headers.set("Content-Disposition", `attachment; filename="${file.name}"`)
  headers.set("Content-Type", "text/plain")

  return new NextResponse(file.content, {
    status: 200,
    headers,
  })
}