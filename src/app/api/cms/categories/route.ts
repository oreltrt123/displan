import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")

    let query = supabase.from("cms_v3_update_canvas_srsrr2_categories").select("*").order("name", { ascending: true })

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, project_id } = body

    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_categories")
      .insert([
        {
          name,
          slug,
          project_id,
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
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
