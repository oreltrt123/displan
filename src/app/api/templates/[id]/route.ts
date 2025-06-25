import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("🔍 GETTING TEMPLATE:", params.id)

    const { data, error } = await supabase.rpc("get_template_by_id", {
      p_template_id: params.id,
    })

    if (error) {
      console.error("❌ GET TEMPLATE ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ TEMPLATE LOADED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to get template" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log("💾 UPDATING TEMPLATE:", params.id, body)

    const { data, error } = await supabase.rpc("update_template_working", {
      p_template_id: params.id,
      p_template_name: body.template_name,
      p_short_description: body.short_description,
      p_full_description: body.full_description,
      p_template_image_url: body.template_image_url,
      p_category: body.category,
      p_tags: body.tags || [],
      p_price: body.price,
      p_is_free: body.is_free,
      p_is_published: body.is_published,
    })

    if (error) {
      console.error("❌ UPDATE TEMPLATE ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ TEMPLATE UPDATED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to update template" }, { status: 500 })
  }
}
