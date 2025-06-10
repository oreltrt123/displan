import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, pageSlug, templateElementId, elementType, properties } = body

    console.log("Updating template element:", {
      projectId,
      pageSlug,
      templateElementId,
      elementType,
      properties,
    })

    // Call the Supabase function
    const { data, error } = await supabase.rpc("update_template_element_properties", {
      project_id_param: projectId,
      page_slug_param: pageSlug,
      template_element_id_param: templateElementId,
      element_type_param: elementType,
      properties: properties,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("Template element updated successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
