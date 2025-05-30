import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, subdomain } = await request.json()

    if (!projectId || !subdomain) {
      return NextResponse.json({ error: "Project ID and subdomain are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 },
      )
    }

    // Check if subdomain is already taken
    const { data: existingProject, error: checkError } = await supabase
      .from("displan_project_designer_css_projects")
      .select("id")
      .eq("subdomain", subdomain)
      .neq("id", projectId)
      .single()

    if (existingProject) {
      return NextResponse.json({ error: "Subdomain is already taken" }, { status: 409 })
    }

    // Update the project with subdomain and publish status
    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .update({
        subdomain: subdomain,
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error deploying project:", error)
      return NextResponse.json({ error: "Failed to deploy project" }, { status: 500 })
    }

    const deployedUrl = `https://${subdomain}.displan.design`

    return NextResponse.json({
      success: true,
      url: deployedUrl,
      subdomain: subdomain,
      project: data,
    })
  } catch (error) {
    console.error("Deploy API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
