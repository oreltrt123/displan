import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Use the view to get collections with entry counts
    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_collections_with_counts")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, project_id, description } = body

    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_collections")
      .insert([
        {
          name,
          slug,
          project_id,
          description: description || null,
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
    console.error("Error creating collection:", error)
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
