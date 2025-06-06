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
}

export async function getPublishedSiteData(subdomain: string): Promise<PublishedSiteData | null> {
  try {
    console.log("🔍 Fetching published site data for subdomain:", subdomain)

    const supabase = createClient()

    // Get the project by subdomain
    const { data: project, error: projectError } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("subdomain", subdomain)
      .eq("is_published", true)
      .single()

    console.log("📦 Project query result:", { project, projectError })

    if (projectError || !project) {
      console.error("❌ Project not found:", projectError)
      return null
    }

    // Get the canvas elements for the project
    const { data: elements, error: elementsError } = await supabase
      .from("displan_project_designer_css_canvas_elements")
      .select("*")
      .eq("project_id", project.id)
      .eq("page_id", "home")
      .order("created_at", { ascending: true })

    console.log("🧩 Elements query result:", {
      elements,
      elementsError,
      elementsCount: elements?.length || 0,
    })

    if (elementsError) {
      console.error("❌ Error fetching elements:", elementsError)
      return null
    }

    const siteData = {
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
    }

    console.log("✅ Final site data:", siteData)
    return siteData
  } catch (error) {
    console.error("💥 Error getting published site data:", error)
    return null
  }
}
