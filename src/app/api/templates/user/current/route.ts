import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../../../supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the current user from session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      console.error("❌ Authentication error:", sessionError)
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      )
    }

    const userId = session.user.id
    console.log("🔄 Loading templates for user:", userId)

    const { data, error } = await supabase.rpc("get_user_templates_with_creator", {
      p_user_id: userId,
    })

    if (error) {
      console.error("❌ Error loading templates:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ Templates loaded:", data?.length || 0)
    return NextResponse.json({
      success: true,
      templates: data || [],
    })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to load templates" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic"
