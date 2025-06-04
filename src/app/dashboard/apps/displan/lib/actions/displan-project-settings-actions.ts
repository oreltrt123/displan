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
      .select(
        "id, name, description, custom_url, favicon_url, favicon_light_url, favicon_dark_url, social_preview_url, password_protection, custom_code, subdomain, published_url, is_published, created_at, updated_at",
      )
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
    favicon_light_url?: string
    favicon_dark_url?: string
    social_preview_url?: string
    password_protection?: string
    custom_code?: string
    subdomain?: string
    published_url?: string
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

    // Only update fields that are provided and not undefined
    const updateData: any = {}
    if (settings.name !== undefined) updateData.name = settings.name
    if (settings.description !== undefined) updateData.description = settings.description
    if (settings.custom_url !== undefined) updateData.custom_url = settings.custom_url
    if (settings.favicon_url !== undefined) updateData.favicon_url = settings.favicon_url
    if (settings.favicon_light_url !== undefined) updateData.favicon_light_url = settings.favicon_light_url
    if (settings.favicon_dark_url !== undefined) updateData.favicon_dark_url = settings.favicon_dark_url
    if (settings.social_preview_url !== undefined) updateData.social_preview_url = settings.social_preview_url
    if (settings.password_protection !== undefined) updateData.password_protection = settings.password_protection
    if (settings.custom_code !== undefined) updateData.custom_code = settings.custom_code
    if (settings.subdomain !== undefined) updateData.subdomain = settings.subdomain
    if (settings.published_url !== undefined) updateData.published_url = settings.published_url

    console.log("Updating project with data:", updateData)

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .update(updateData)
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select(
        "id, name, description, custom_url, favicon_url, favicon_light_url, favicon_dark_url, social_preview_url, password_protection, custom_code, subdomain, published_url, is_published",
      )
      .single()

    if (error) {
      console.error("Error updating project settings:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Project settings updated successfully:", data)

    // Revalidate the cache
    revalidatePath(`/editor/${projectId}/settings`)
    revalidatePath(`/editor/${projectId}`)
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}/settings`)
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update project settings", data: null }
  }
}

// New delete function using proper authentication
export async function displan_project_designer_css_delete_project(projectId: string) {
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

    console.log("Deleting project:", { projectId, userId: user.id })

    // First, verify the project exists and belongs to the user
    const { data: projectData, error: fetchError } = await supabase
      .from("displan_project_designer_css_projects")
      .select("id, owner_id, name")
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .single()

    if (fetchError || !projectData) {
      console.error("Project not found or access denied:", fetchError)
      return { success: false, error: "Project not found or access denied", data: null }
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from("displan_project_designer_css_projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", user.id)

    if (deleteError) {
      console.error("Error deleting project:", deleteError)
      return { success: false, error: deleteError.message, data: null }
    }

    console.log("Project deleted successfully:", projectData.name)

    // Revalidate relevant paths
    revalidatePath("/dashboard/apps/displan")
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: { deletedProject: projectData }, error: null }
  } catch (error) {
    console.error("Server error during deletion:", error)
    return { success: false, error: "Failed to delete project", data: null }
  }
}

// Helper function to check if a project has password protection
export async function displan_project_designer_css_check_password_protection(projectId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("password_protection")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error checking password protection:", error)
      return { success: false, error: error.message, isProtected: false, data: null }
    }

    const isProtected = !!data?.password_protection

    return {
      success: true,
      error: null,
      isProtected,
      data: {
        isProtected,
        projectId,
      },
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to check password protection", isProtected: false, data: null }
  }
}

// Function to verify a password for a protected project
export async function displan_project_designer_css_verify_password(projectId: string, password: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("password_protection")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error verifying password:", error)
      return { success: false, error: error.message, isValid: false }
    }

    // Simple password comparison - in production you'd want to use a hashed password
    const isValid = data?.password_protection === password

    return {
      success: true,
      error: null,
      isValid,
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to verify password", isValid: false }
  }
}

// Function to get custom code for a project
export async function displan_project_designer_css_get_custom_code(projectId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("custom_code")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error fetching custom code:", error)
      return { success: false, error: error.message, data: null }
    }

    return {
      success: true,
      error: null,
      data: {
        customCode: data?.custom_code || "",
        projectId,
      },
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch custom code", data: null }
  }
}
