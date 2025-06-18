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
      .select(`
        id, name, description, custom_url, custom_domain, custom_code, 
        favicon_url, social_preview_url, password_protection, subdomain, 
        published_url, is_published, is_public, seo_title, seo_description, 
        seo_keywords, og_image_url, twitter_card_type, is_password_enabled,
        google_analytics_id, facebook_pixel_id, custom_head_code, custom_body_code,
        custom_css, custom_js, social_sharing_enabled, comments_enabled,
        search_engine_indexing, is_subdomain_active, ssl_enabled, maintenance_mode,
        maintenance_message, redirect_url, canonical_url, cache_enabled,
        compression_enabled, cookie_consent_enabled, privacy_policy_url,
        terms_of_service_url, contact_email, notification_email, theme_name,
        color_scheme, font_family, mobile_optimized, amp_enabled, ecommerce_enabled,
        currency, form_submissions_enabled, max_file_upload_size, two_factor_enabled,
        ip_whitelist, rate_limiting_enabled, site_language, site_description,
        canvas_background, canvas_zoom, canvas_pan_x, canvas_pan_y,
        created_at, updated_at
      `)
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
    custom_domain?: string
    custom_code?: string
    favicon_url?: string
    social_preview_url?: string
    password_protection?: string
    subdomain?: string
    published_url?: string
    is_public?: boolean
    seo_title?: string
    seo_description?: string
    seo_keywords?: string
    og_image_url?: string
    twitter_card_type?: string
    is_password_enabled?: boolean
    google_analytics_id?: string
    facebook_pixel_id?: string
    custom_head_code?: string
    custom_body_code?: string
    custom_css?: string
    custom_js?: string
    social_sharing_enabled?: boolean
    comments_enabled?: boolean
    search_engine_indexing?: boolean
    is_subdomain_active?: boolean
    ssl_enabled?: boolean
    maintenance_mode?: boolean
    maintenance_message?: string
    redirect_url?: string
    canonical_url?: string
    cache_enabled?: boolean
    compression_enabled?: boolean
    cookie_consent_enabled?: boolean
    privacy_policy_url?: string
    terms_of_service_url?: string
    contact_email?: string
    notification_email?: string
    theme_name?: string
    color_scheme?: string
    font_family?: string
    mobile_optimized?: boolean
    amp_enabled?: boolean
    ecommerce_enabled?: boolean
    currency?: string
    form_submissions_enabled?: boolean
    max_file_upload_size?: number
    two_factor_enabled?: boolean
    ip_whitelist?: string[]
    rate_limiting_enabled?: boolean
    site_language?: string
    site_description?: string
    canvas_background?: string
    canvas_zoom?: number
    canvas_pan_x?: number
    canvas_pan_y?: number
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
    Object.keys(settings).forEach((key) => {
      if (settings[key as keyof typeof settings] !== undefined) {
        updateData[key] = settings[key as keyof typeof settings]
      }
    })

    console.log("Updating project with data:", updateData)

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .update(updateData)
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select(`
        id, name, description, custom_url, custom_domain, custom_code, 
        favicon_url, social_preview_url, password_protection, subdomain, 
        published_url, is_published, is_public, seo_title, seo_description,
        site_language, site_description
      `)
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

// Enhanced delete function using proper authentication
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

    // Delete related records first (pages, comments, settings)
    await supabase.from("displan_project_comments").delete().eq("project_id", projectId)
    await supabase.from("displan_project_pages").delete().eq("project_id", projectId)
    await supabase.from("displan_project_settings").delete().eq("project_id", projectId)

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
      .select("password_protection, is_password_enabled")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error checking password protection:", error)
      return { success: false, error: error.message, isProtected: false, data: null }
    }

    const isProtected = !!(data?.password_protection && data?.is_password_enabled)

    return {
      success: true,
      error: null,
      isProtected,
      data: {
        isProtected,
        projectId,
        hasPassword: !!data?.password_protection,
        isEnabled: !!data?.is_password_enabled,
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
      .select("password_protection, is_password_enabled")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error verifying password:", error)
      return { success: false, error: error.message, isValid: false }
    }

    // Check if password protection is enabled and password matches
    const isValid = !!(data?.is_password_enabled && data?.password_protection && data.password_protection === password)

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
      .select("custom_code, custom_css, custom_js, custom_head_code, custom_body_code")
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
        customCss: data?.custom_css || "",
        customJs: data?.custom_js || "",
        customHeadCode: data?.custom_head_code || "",
        customBodyCode: data?.custom_body_code || "",
        projectId,
      },
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch custom code", data: null }
  }
}

// Function to update project name specifically
export async function displan_project_designer_css_update_project_name(projectId: string, name: string) {
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
      .update({ name })
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select("id, name")
      .single()

    if (error) {
      console.error("Error updating project name:", error)
      return { success: false, error: error.message, data: null }
    }

    // Revalidate cache
    revalidatePath(`/editor/${projectId}`)
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)
    revalidatePath("/dashboard/apps/displan")

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update project name", data: null }
  }
}

// Function to publish/unpublish project
export async function displan_project_designer_css_publish_project(
  projectId: string,
  isPublished: boolean,
  publishedUrl?: string,
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

    const updateData: any = { is_published: isPublished }
    if (publishedUrl) {
      updateData.published_url = publishedUrl
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .update(updateData)
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .select("id, name, is_published, published_url")
      .single()

    if (error) {
      console.error("Error updating project publish status:", error)
      return { success: false, error: error.message, data: null }
    }

    // Revalidate cache
    revalidatePath(`/editor/${projectId}`)
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update project publish status", data: null }
  }
}
