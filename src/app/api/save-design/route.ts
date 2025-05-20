import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the design data from the request
    const designData = await request.json()

    if (!designData.id) {
      return NextResponse.json({ error: "Design ID is required" }, { status: 400 })
    }

    // Add user_id to the design data
    const dataToSave = {
      ...designData,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    // Update the design in Supabase
    const { error } = await supabase.from("designs").update(dataToSave).eq("id", designData.id)

    if (error) {
      console.error("Error saving design:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in save-design route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
