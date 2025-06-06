import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase1"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("cloned_projects").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Supabase get error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Failed to get project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, html_content } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const supabase = createClient()

    const updateData: any = {
      name,
      updated_at: new Date().toISOString(),
    }

    // Only update HTML content if provided
    if (html_content !== undefined) {
      updateData.html_content = html_content
    }

    const { data, error } = await supabase
      .from("cloned_projects")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}
