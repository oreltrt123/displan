import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Load template content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const pageSlug = searchParams.get("pageSlug")

    console.log("Loading template content for:", { projectId, pageSlug })

    if (!projectId || !pageSlug) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Query the database for template content
    const { data, error } = await supabase
      .from("template_canvas_content_v232")
      .select("template_id, element_key, content")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to load content" }, { status: 500 })
    }

    // Transform data into the expected format
    const content: Record<string, string> = {}
    data.forEach((item) => {
      const key = `${item.template_id}_${item.element_key}`
      content[key] = item.content
    })

    console.log("Loaded template content:", content)

    return NextResponse.json({
      success: true,
      data: { content },
    })
  } catch (error) {
    console.error("Error loading template content:", error)
    return NextResponse.json({ success: false, error: "Failed to load content" }, { status: 500 })
  }
}

// POST - Save template content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, projectId, pageSlug, templateId, elementKey, content } = body

    console.log("Saving template content:", { action, projectId, pageSlug, templateId, elementKey, content })

    if (!projectId || !pageSlug || !templateId || !elementKey || content === undefined) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    if (action === "update") {
      // Use upsert to insert or update
      const { data, error } = await supabase
        .from("template_canvas_content_v232")
        .upsert(
          {
            project_id: projectId,
            page_slug: pageSlug,
            template_id: templateId,
            element_key: elementKey,
            content: content,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "project_id,page_slug,template_id,element_key",
          },
        )
        .select()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ success: false, error: "Failed to save content" }, { status: 500 })
      }

      console.log("Content saved successfully:", data)

      return NextResponse.json({
        success: true,
        message: "Content saved successfully",
        data: data[0],
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error saving template content:", error)
    return NextResponse.json({ success: false, error: "Failed to save content" }, { status: 500 })
  }
}
