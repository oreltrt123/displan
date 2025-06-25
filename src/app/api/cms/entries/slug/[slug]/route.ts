import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const collectionSlug = searchParams.get("collection_slug")

    if (!projectId || !collectionSlug) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get the entry with all its content
    const { data: entry, error } = await supabase
      .from("cms_v3_update_canvas_srsrr2_entries")
      .select(`
        *,
        collection:cms_v3_update_canvas_srsrr2_collections!inner(name, slug),
        featured_image:cms_v3_update_canvas_srsrr2_media_library(file_url, alt_text),
        entry_media:cms_v3_update_canvas_srsrr2_entry_media(
          *,
          media:cms_v3_update_canvas_srsrr2_media_library(*)
        ),
        entry_code_blocks:cms_v3_update_canvas_srsrr2_entry_code_blocks(*),
        entry_tables:cms_v3_update_canvas_srsrr2_entry_tables(*),
        entry_links:cms_v3_update_canvas_srsrr2_entry_links(*)
      `)
      .eq("project_id", projectId)
      .eq("slug", params.slug)
      .eq("collection.slug", collectionSlug)
      .single()

    if (error || !entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Format the response with all content
    const formattedEntry = {
      ...entry,
      featured_image_url: entry.featured_image?.file_url,
      media_items: entry.entry_media || [],
      code_blocks: entry.entry_code_blocks || [],
      tables: entry.entry_tables || [],
      links: entry.entry_links || [],
    }

    return NextResponse.json(formattedEntry)
  } catch (error) {
    console.error("Error fetching entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
