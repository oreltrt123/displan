import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id
    const body = await request.json()

    console.log("🎯 SAVING ELEMENT:", elementId)
    console.log("🎯 SAVE DATA:", body)

    // Use the simplified function that actually works
    const { data, error } = await supabase.rpc("save_element_properties_enhanced", {
      element_id_param: elementId,
      properties_param: body,
    })

    console.log("🎯 SAVE RESULT:", data)
    console.log("🎯 SAVE ERROR:", error)

    if (error) {
      console.error("❌ DATABASE ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data?.success) {
      console.error("❌ SAVE FAILED:", data?.error)
      return NextResponse.json({ error: data?.error || "Save failed" }, { status: 400 })
    }

    console.log("✅ ELEMENT SAVED SUCCESSFULLY!")

    return NextResponse.json({
      success: true,
      element: data.element,
      message: "Element saved successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id

    console.log("🎯 DELETING ELEMENT:", elementId)

    const { data, error } = await supabase.rpc("delete_element_simple", {
      element_id_param: elementId,
    })

    if (error) {
      console.error("❌ DELETE ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data?.success) {
      console.error("❌ DELETE FAILED:", data?.error)
      return NextResponse.json({ error: data?.error || "Delete failed" }, { status: 400 })
    }

    console.log("✅ ELEMENT DELETED SUCCESSFULLY!")

    return NextResponse.json({
      success: true,
      message: "Element deleted successfully",
    })
  } catch (error) {
    console.error("❌ DELETE API ERROR:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id

    const { data, error } = await supabase
      .from("displan_project_designer_css_elements_canvas_csss_style")
      .select("*")
      .eq("id", elementId)
      .single()

    if (error) {
      console.error("❌ GET ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      element: data,
    })
  } catch (error) {
    console.error("❌ GET API ERROR:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
