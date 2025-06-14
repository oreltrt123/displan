import { createClient } from "../../../../supabase/server"

export interface PublishedSiteData {
  id: string
  name: string
  description: string | null
  subdomain: string
  favicon_light_url: string | null
  favicon_dark_url: string | null
  social_preview_url: string | null
  custom_code: string | null
  elements: any[]
  is_published: boolean
  canvas_width?: number
  canvas_height?: number
  owner_id: string
  created_at: string
  updated_at: string
}

export async function getPublishedSiteData(subdomain: string): Promise<PublishedSiteData | null> {
  try {
    console.log("🔍 [FIXED] Fetching published site data for subdomain:", subdomain)

    const supabase = createClient()

    // Get the project by subdomain
    const { data: project, error: projectError } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("subdomain", subdomain)
      .eq("is_published", true)
      .single()

    console.log("📦 [FIXED] Project query result:", {
      project: project ? { id: project.id, name: project.name } : null,
      projectError,
    })

    if (projectError || !project) {
      console.error("❌ [FIXED] Project not found:", projectError)
      return null
    }

    // FIXED: Get ALL canvas elements for the project (remove page filter)
    console.log("🔍 [FIXED] Fetching elements for project ID:", project.id)

    const { data: elements, error: elementsError } = await supabase
      .from("displan_project_designer_css_canvas_elements")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true })

    console.log("🧩 [FIXED] Elements query result:", {
      elements: elements ? elements.slice(0, 3) : null, // Show first 3 elements
      elementsError,
      elementsCount: elements?.length || 0,
      elementTypes: elements?.map((e) => e.element_type) || [],
      pageIds: [...new Set(elements?.map((e) => e.page_id) || [])],
    })

    // ADDITIONAL DEBUG: Check if elements exist with different filters
    if (!elements || elements.length === 0) {
      console.log("🔍 [DEBUG] No elements found, checking with broader query...")

      // Check if ANY elements exist for this project
      const { data: allElements, error: allError } = await supabase
        .from("displan_project_designer_css_canvas_elements")
        .select("id, project_id, page_id, element_type")
        .eq("project_id", project.id)

      console.log("🔍 [DEBUG] All elements check:", {
        allElements,
        allError,
        count: allElements?.length || 0,
      })

      // Check if project_id is correct type
      console.log("🔍 [DEBUG] Project ID type check:", {
        projectId: project.id,
        projectIdType: typeof project.id,
      })
    }

    if (elementsError) {
      console.error("❌ [FIXED] Error fetching elements:", elementsError)
    }

    const siteData: PublishedSiteData = {
      id: project.id,
      name: project.name,
      description: project.description,
      subdomain: project.subdomain,
      favicon_light_url: project.favicon_light_url,
      favicon_dark_url: project.favicon_dark_url,
      social_preview_url: project.social_preview_url,
      custom_code: project.custom_code,
      elements: elements || [],
      is_published: project.is_published,
      canvas_width: project.canvas_width || 1200,
      canvas_height: project.canvas_height || 800,
      owner_id: project.owner_id,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }

    console.log("✅ [FIXED] Final site data:", {
      siteName: siteData.name,
      elementsCount: siteData.elements.length,
      hasElements: siteData.elements.length > 0,
      sampleElement: siteData.elements[0] || null,
    })

    return siteData
  } catch (error) {
    console.error("💥 [FIXED] Error getting published site data:", error)
    return null
  }
}
