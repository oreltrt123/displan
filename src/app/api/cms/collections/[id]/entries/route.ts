import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .select("*")
      .eq("collection_id", params.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching entries:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, slug, content, project_id, categories, status, date } = body

    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .insert([
        {
          collection_id: params.id,
          project_id,
          title,
          slug,
          content,
          categories: categories || [],
          status: status || "draft",
          date: date || new Date().toISOString().split("T")[0],
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
