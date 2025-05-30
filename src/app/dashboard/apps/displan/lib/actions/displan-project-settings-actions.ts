"use server"

import { createClient } from "../../../../../../../supabase/server"
import { revalidatePath } from "next/cache"

export async function displan_project_designer_css_get_project_settings(projectId: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: null }
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("id, name, description, custom_url, favicon_url, social_preview_url, created_at, updated_at")
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching project settings:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch project settings", data: null }
  }
}

export async function displan_project_designer_css_update_project_settings(
  projectId: string,
  settings: {
    name?: string
    description?: string
    custom_url?: string
    favicon_url?: string
    social_preview_url?: string
  },
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: null }
    }

    // Only update fields that are provided and not empty
    const updateData: any = {}
    if (settings.name !== undefined) updateData.name = settings.name
    if (settings.description !== undefined) updateData.description = settings.description
    if (settings.custom_url !== undefined) updateData.custom_url = settings.custom_url
    if (settings.favicon_url !== undefined) updateData.favicon_url = settings.favicon_url
    if (settings.social_preview_url !== undefined) updateData.social_preview_url = settings.social_preview_url

    console.log("Updating project with data:", updateData)

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .update(updateData)
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select("id, name, description, custom_url, favicon_url, social_preview_url")
      .single()

    if (error) {
      console.error("Error updating project settings:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Project settings updated successfully:", data)

    // Revalidate the cache
    revalidatePath(`/editor/${projectId}/settings`)
    revalidatePath(`/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update project settings", data: null }
  }
}
