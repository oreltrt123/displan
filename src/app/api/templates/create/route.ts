import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🎨 CREATING TEMPLATE:", body)

    const { data, error } = await supabase.rpc("create_template_working", {
      p_creator_id: body.creatorId,
      p_creator_email: body.creatorEmail,
      p_template_name: body.templateName,
      p_short_description: body.shortDescription,
      p_full_description: body.fullDescription || {},
      p_template_image_url: body.templateImageUrl,
      p_category: body.category,
      p_tags: body.tags || [],
      p_project_url: body.projectUrl,
      p_price: body.price || 0,
      p_is_free: body.isFree || false,
      p_is_published: body.isPublished || false,
    })

    if (error) {
      console.error("❌ CREATE ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ TEMPLATE CREATED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to create template" }, { status: 500 })
  }
}
