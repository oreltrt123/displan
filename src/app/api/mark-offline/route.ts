import { supabase } from "@/lib/supabase-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 })
    }

    // Mark user as offline
    await supabase.rpc("mark_user_offline", {
      p_user_id: userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking user offline:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
