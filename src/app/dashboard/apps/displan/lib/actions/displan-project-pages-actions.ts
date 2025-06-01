"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function displan_project_designer_css_get_project_pages(projectId: string) {
  try {
    const { data, error } = await supabase
      .from("displan_project_designer_css_pages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching project pages:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in displan_project_designer_css_get_project_pages:", error)
    return { success: false, error: "Failed to fetch project pages" }
  }
}

export async function displan_project_designer_css_get_page_settings(pageId: string) {
  try {
    const { data, error } = await supabase
      .from("displan_project_designer_css_pages")
      .select("*")
      .eq("id", pageId)
      .single()

    if (error) {
      console.error("Error fetching page settings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in displan_project_designer_css_get_page_settings:", error)
    return { success: false, error: "Failed to fetch page settings" }
  }
}

export async function displan_project_designer_css_update_page_settings(
  pageId: string,
  settings: {
    name?: string
    slug?: string
    description?: string
    custom_url?: string
    preview_url?: string
    social_preview_url?: string
    custom_code?: string
  },
) {
  try {
    const updateData = {
      ...settings,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_pages")
      .update(updateData)
      .eq("id", pageId)
      .select()
      .single()

    if (error) {
      console.error("Error updating page settings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in displan_project_designer_css_update_page_settings:", error)
    return { success: false, error: "Failed to update page settings" }
  }
}
