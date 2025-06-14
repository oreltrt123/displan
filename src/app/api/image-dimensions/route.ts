import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Load image dimensions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const pageSlug = searchParams.get("pageSlug")
    const templateId = searchParams.get("templateId")
    const elementKey = searchParams.get("elementKey")

    console.log("Loading dimensions for:", { projectId, pageSlug, templateId, elementKey })

    if (!projectId || !pageSlug || !templateId || !elementKey) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Query the database for dimensions
    const { data, error } = await supabase
      .from("template_image_dimensions")
      .select("width, height")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)
      .eq("template_id", templateId)
      .eq("element_key", elementKey)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is okay
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    console.log("Found dimensions:", data)

    return NextResponse.json({
      success: true,
      dimensions: data ? { width: Number(data.width), height: Number(data.height) } : null,
    })
  } catch (error) {
    console.error("Error loading image dimensions:", error)
    return NextResponse.json({ success: false, error: "Failed to load dimensions" }, { status: 500 })
  }
}

// POST - Save image dimensions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, pageSlug, templateId, elementKey, dimensions } = body

    console.log("Saving dimensions:", { projectId, pageSlug, templateId, elementKey, dimensions })

    if (!projectId || !pageSlug || !templateId || !elementKey || !dimensions) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Validate dimensions
    if (typeof dimensions.width !== "number" || typeof dimensions.height !== "number") {
      return NextResponse.json({ success: false, error: "Invalid dimensions format" }, { status: 400 })
    }

    // Use upsert to insert or update
    const { data, error } = await supabase
      .from("template_image_dimensions")
      .upsert(
        {
          project_id: projectId,
          page_slug: pageSlug,
          template_id: templateId,
          element_key: elementKey,
          width: dimensions.width,
          height: dimensions.height,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "project_id,page_slug,template_id,element_key",
        },
      )
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to save dimensions" }, { status: 500 })
    }

    console.log("Dimensions saved successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Dimensions saved successfully",
      dimensions,
    })
  } catch (error) {
    console.error("Error saving image dimensions:", error)
    return NextResponse.json({ success: false, error: "Failed to save dimensions" }, { status: 500 })
  }
}
