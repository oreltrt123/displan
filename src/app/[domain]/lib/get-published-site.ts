import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { PublishedSiteData } from "../components/published-site-renderer"

export async function getPublishedSiteData(subdomain: string): Promise<PublishedSiteData | null> {
  console.log("🔍 getPublishedSiteData called with subdomain:", subdomain)

  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // First, get the project data
    console.log("📊 Fetching project data...")
    const { data: project, error: projectError } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("subdomain", subdomain)
      .eq("is_published", true)
      .single()

    if (projectError) {
      console.error("❌ Project fetch error:", projectError)
      return null
    }

    if (!project) {
      console.log("❌ No project found for subdomain:", subdomain)
      return null
    }

    console.log("✅ Project found:", {
      id: project.id,
      name: project.name,
      subdomain: project.subdomain,
    })

    // Get elements from the CORRECT table: displan_project_designer_css_elements_canvas_csss_style
    console.log("🎨 Fetching canvas elements from style table...")
    const { data: elements, error: elementsError } = await supabase
      .from("displan_project_designer_css_elements_canvas_csss_style")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true })

    if (elementsError) {
      console.error("❌ Elements fetch error:", elementsError)
      // Don't return null here - we can still show the site without elements
    }

    console.log("🎨 Elements fetched:", {
      count: elements?.length || 0,
      elements: elements || [],
      sampleElement: elements?.[0] || null,
    })

    // Transform the data to match our interface
    const siteData: PublishedSiteData = {
      id: project.id,
      name: project.name,
      description: project.description,
      subdomain: project.subdomain,
      favicon_light_url: project.favicon_light_url,
      favicon_dark_url: project.favicon_dark_url,
      social_preview_url: project.social_preview_url,
      custom_code: project.custom_code,
      canvas_width: 1200, // Default since your table doesn't have this column
      canvas_height: 800, // Default since your table doesn't have this column
      is_published: project.is_published,
      owner_id: project.owner_id,
      created_at: project.created_at,
      updated_at: project.updated_at,
      elements: (elements || []).map((element) => ({
        id: element.id,
        project_id: element.project_id,
        page_id: element.page_slug || element.page_id || "home",
        element_type: element.element_type,
        content: element.content,
        x_position: element.x_position || 0,
        y_position: element.y_position || 0,
        width: element.width || 200,
        height: element.height || 50,
        font_size: element.font_size,
        font_weight: element.font_weight,
        text_color: element.text_color,
        background_color: element.background_color,
        border_radius: element.border_radius,
        border_width: element.border_width,
        border_color: element.border_color,
        text_align: element.text_align,
        z_index: element.z_index || 1,
        src: element.src,
        link_url: element.link_url,
        link_page: element.link_page,
        opacity: element.opacity,
        visible: element.visible !== false, // Default to true if not specified
        styles: element.styles,
        created_at: element.created_at,
        updated_at: element.updated_at,
      })),
    }

    console.log("✅ Final site data prepared:", {
      name: siteData.name,
      elementsCount: siteData.elements.length,
      canvasSize: `${siteData.canvas_width}x${siteData.canvas_height}`,
      elementTypes: siteData.elements.map((e) => e.element_type),
    })

    return siteData
  } catch (error) {
    console.error("💥 Unexpected error in getPublishedSiteData:", error)
    return null
  }
}
