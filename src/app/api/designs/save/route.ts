import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Create a new supabase server client with the cookies
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Get the current user - this will work reliably on the server
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Authentication error:", userError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get the design data from the request
    const designData = await request.json()

    // Validate the design data
    if (!designData.id) {
      return NextResponse.json({ error: "Design ID is required" }, { status: 400 })
    }

    // Prepare the data to save - only include fields that exist in the database
    const dataToSave = {
      id: designData.id,
      name: designData.name || "Untitled Design",
      elements: designData.elements || [],
      width: designData.width || 800,
      height: designData.height || 600,
      background: designData.background || "#ffffff",
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    console.log("Saving design with ID:", dataToSave.id)

    // Check if the design exists first
    const { data: existingDesign, error: checkError } = await supabase
      .from("designs")
      .select("id")
      .eq("id", dataToSave.id)
      .single()

    let result

    if (checkError || !existingDesign) {
      // Design doesn't exist, insert it
      result = await supabase.from("designs").insert(dataToSave).select()
    } else {
      // Design exists, update it
      result = await supabase.from("designs").update(dataToSave).eq("id", dataToSave.id).select()
    }

    if (result.error) {
      console.error("Database error:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Design saved successfully",
      design: result.data?.[0] || null,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
