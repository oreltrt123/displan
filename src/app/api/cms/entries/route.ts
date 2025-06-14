import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      project_id,
      collection_id,
      categories,
      status,
      date,
      excerpt,
      meta_title,
      meta_description,
    } = body

    if (!project_id || !collection_id) {
      return NextResponse.json({ error: "Project ID and Collection ID are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .insert([
        {
          project_id,
          collection_id,
          title,
          slug,
          content,
          excerpt,
          categories: categories || [],
          status: status || "draft",
          date: date || new Date().toISOString().split("T")[0],
          meta_title,
          meta_description,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
