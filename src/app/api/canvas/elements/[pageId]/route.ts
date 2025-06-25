import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../../../supabase/server"

export async function GET(request: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const supabase = createClient()
    const { pageId } = params

    // Get canvas elements for the specific page
    const { data: elements, error } = await supabase
      .from("canvas_elements")
      .select(`
        *,
        template_elements (
          id,
          template_id,
          element_type,
          content,
          properties
        )
      `)
      .eq("page_id", pageId)
      .order("z_index", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching canvas elements:", error)
      return NextResponse.json({ error: "Failed to fetch elements" }, { status: 500 })
    }

    // Process elements to include template hierarchy
    const processedElements =
      elements?.map((element) => ({
        id: element.id,
        element_type: element.element_type,
        content: element.content || element.text_content || "",
        x_position: element.x_position || element.x || 0,
        y_position: element.y_position || element.y || 0,
        width: element.width || 100,
        height: element.height || 40,
        z_index: element.z_index || 0,
        visible: element.visible !== false,
        locked: element.locked === true,
        is_template_element: element.is_template_element || false,
        template_id: element.template_id,
        template_name: element.template_name,
        parent_id: element.parent_id,
        background_color: element.background_color,
        text_color: element.text_color,
        font_size: element.font_size,
        font_weight: element.font_weight,
        font_family: element.font_family,
        text_align: element.text_align,
        border_radius: element.border_radius,
        border_width: element.border_width,
        border_color: element.border_color,
        opacity: element.opacity,
        animation: element.animation,
        is_ai_generated: element.is_ai_generated || false,
        created_at: element.created_at,
        updated_at: element.updated_at,
        // Include template elements if this is a template
        template_elements: element.template_elements || [],
      })) || []

    return NextResponse.json(processedElements)
  } catch (error) {
    console.error("Error in canvas elements API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const supabase = createClient()
    const { pageId } = params
    const body = await request.json()
    const { elementId, updates } = body

    // Update element properties
    const { data, error } = await supabase
      .from("canvas_elements")
      .update(updates)
      .eq("id", elementId)
      .eq("page_id", pageId)
      .select()
      .single()

    if (error) {
      console.error("Error updating canvas element:", error)
      return NextResponse.json({ error: "Failed to update element" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in canvas elements update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
