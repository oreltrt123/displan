import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log("🔍 GETTING TEMPLATES FOR:", params.userId)

    const { data, error } = await supabase.rpc("get_user_templates_working", {
      p_creator_id: params.userId,
    })

    if (error) {
      console.error("❌ GET ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ TEMPLATES LOADED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to get templates" }, { status: 500 })
  }
}
