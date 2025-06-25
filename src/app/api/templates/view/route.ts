import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("👁️ UPDATING VIEW COUNT:", body.templateId)

    const { data, error } = await supabase.rpc("update_template_view_count", {
      p_template_id: body.templateId,
    })

    if (error) {
      console.error("❌ VIEW COUNT ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ VIEW COUNT UPDATED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to update view count" }, { status: 500 })
  }
}
