import { createClient } from "../../../../supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { projectId, htmlContent } = await request.json()

    if (!projectId || !htmlContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from("website_projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      console.error("Project error:", projectError)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Generate a safe subdomain from the project name
    const subdomain = project.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const fullDomain = `${subdomain}.displan.design`

    // Add metadata to the HTML content
    const enhancedHtml = addMetadataToHtml(htmlContent, project.name, subdomain)

    // Create or update the published website record
    const { data: publishedSite, error } = await supabase
      .from("published_websites")
      .upsert(
        {
          project_id: projectId,
          user_id: user.id,
          subdomain: subdomain,
          full_domain: fullDomain,
          html_content: enhancedHtml,
          published_at: new Date().toISOString(),
          status: "active",
        },
        {
          onConflict: "project_id",
          returning: "representation",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Error publishing website:", error)
      return NextResponse.json({ error: "Failed to publish website" }, { status: 500 })
    }

    // Return the published site information
    return NextResponse.json({
      success: true,
      url: fullDomain,
      publishedSite,
    })
  } catch (error) {
    console.error("Error in publish API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Helper function to add metadata to HTML
function addMetadataToHtml(html: string, projectName: string, subdomain: string): string {
  // Add meta tags for SEO
  const metaTags = `
    <meta name="generator" content="Displan Website Builder">
    <meta property="og:title" content="${projectName}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://${subdomain}.displan.design">
  `

  // Insert meta tags after the head tag
  let enhancedHtml = html.replace("<head>", `<head>${metaTags}`)

  // Add viewport meta tag if it doesn't exist
  if (!enhancedHtml.includes('<meta name="viewport"')) {
    enhancedHtml = enhancedHtml.replace(
      "<head>",
      '<head><meta name="viewport" content="width=device-width, initial-scale=1.0">',
    )
  }

  return enhancedHtml
}
