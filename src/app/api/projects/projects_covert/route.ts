import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase1"

export async function POST(request: NextRequest) {
  try {
    const { name, url, html_content } = await request.json()

    if (!name || !url || !html_content) {
      return NextResponse.json({ error: "Name, URL, and HTML content are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("cloned_projects")
      .insert([
        {
          name,
          url,
          html_content,
          is_deployed: false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("cloned_projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase select error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects: data || [] })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Failed to get projects" }, { status: 500 })
  }
}
