import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching entry:", error)
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, slug, content, categories, status, date, excerpt, meta_title, meta_description } = body

    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .update({
        title,
        slug,
        content,
        excerpt,
        categories: categories || [],
        status: status || "draft",
        date: date || new Date().toISOString().split("T")[0],
        meta_title,
        meta_description,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating entry:", error)
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("cms_v3_update_canvas_srsrr2_entries").delete().eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting entry:", error)
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
  }
}
