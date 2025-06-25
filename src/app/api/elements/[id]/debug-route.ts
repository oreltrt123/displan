import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id
    const properties = await request.json()

    console.log("🔥🔥🔥 DEBUG - ELEMENT ID:", elementId)
    console.log("🔥🔥🔥 DEBUG - PROPERTIES:", JSON.stringify(properties, null, 2))
    console.log("🔥🔥🔥 DEBUG - SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("🔥🔥🔥 DEBUG - HAS SERVICE KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // First, check if element exists
    const { data: existingElement, error: fetchError } = await supabase
      .from("displan_project_designer_css_elements_canvas_csss_style")
      .select("*")
      .eq("id", elementId)
      .single()

    console.log("🔥🔥🔥 DEBUG - EXISTING ELEMENT:", existingElement)
    console.log("🔥🔥🔥 DEBUG - FETCH ERROR:", fetchError)

    if (fetchError) {
      console.error("❌❌❌ ELEMENT NOT FOUND:", fetchError)
      return NextResponse.json(
        {
          error: `Element not found: ${fetchError.message}`,
          elementId,
          fetchError,
        },
        { status: 404 },
      )
    }

    // Call the SQL function with detailed logging
    console.log("🔥🔥🔥 DEBUG - CALLING SQL FUNCTION: update_element_all_properties_final")

    const { data, error } = await supabase.rpc("update_element_all_properties_final", {
      element_id_param: elementId,
      properties: properties,
    })

    console.log("🔥🔥🔥 DEBUG - SQL FUNCTION RESULT:", data)
    console.log("🔥🔥🔥 DEBUG - SQL FUNCTION ERROR:", error)

    if (error) {
      console.error("❌❌❌ SQL FUNCTION ERROR:", error)
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
          elementId,
          properties,
          sqlError: error,
        },
        { status: 500 },
      )
    }

    if (!data?.success) {
      console.error("❌❌❌ SQL FUNCTION FAILED:", data)
      return NextResponse.json(
        {
          error: data?.error || "Update failed",
          elementId,
          properties,
          sqlResult: data,
        },
        { status: 400 },
      )
    }

    console.log("✅✅✅ ELEMENT UPDATED SUCCESSFULLY!")
    console.log("✅✅✅ UPDATED ELEMENT:", JSON.stringify(data.element, null, 2))

    return NextResponse.json({
      success: true,
      element: data.element,
      message: "Element updated successfully",
      debug: {
        elementId,
        properties,
        sqlResult: data,
      },
    })
  } catch (error) {
    console.error("❌❌❌ API ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id

    console.log("🔥🔥🔥 DEBUG - GETTING ELEMENT:", elementId)

    const { data, error } = await supabase
      .from("displan_project_designer_css_elements_canvas_csss_style")
      .select("*")
      .eq("id", elementId)
      .single()

    console.log("🔥🔥🔥 DEBUG - GET RESULT:", data)
    console.log("🔥🔥🔥 DEBUG - GET ERROR:", error)

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          elementId,
          sqlError: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      element: data,
      debug: {
        elementId,
        found: !!data,
      },
    })
  } catch (error) {
    console.error("❌❌❌ GET API ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const elementId = params.id

    console.log("🔥🔥🔥 DEBUG - DELETING ELEMENT:", elementId)

    // Call the delete function
    const { data, error } = await supabase.rpc("delete_element_completely", {
      element_id_param: elementId,
    })

    console.log("🔥🔥🔥 DEBUG - DELETE RESULT:", data)
    console.log("🔥🔥🔥 DEBUG - DELETE ERROR:", error)

    if (error) {
      console.error("❌❌❌ DELETE ERROR:", error)
      return NextResponse.json(
        {
          error: error.message,
          elementId,
          sqlError: error,
        },
        { status: 500 },
      )
    }

    if (!data?.success) {
      console.error("❌❌❌ DELETE FAILED:", data)
      return NextResponse.json(
        {
          error: data?.error || "Delete failed",
          elementId,
          sqlResult: data,
        },
        { status: 400 },
      )
    }

    console.log("✅✅✅ ELEMENT DELETED SUCCESSFULLY!")

    return NextResponse.json({
      success: true,
      message: "Element deleted successfully",
      debug: {
        elementId,
        sqlResult: data,
      },
    })
  } catch (error) {
    console.error("❌❌❌ DELETE API ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
