"use server"

import { createClient } from "../../../../../../../supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

const ASSETS_TABLE = "displan_project_designer_css_assets"

// Upload asset to project
export async function displan_project_designer_css_projects_rtete353sr_upload_asset(formData: FormData) {
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

    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const pageSlug = formData.get("pageSlug") as string

    if (!file || !projectId || !pageSlug) {
      return { success: false, error: "Missing required fields", data: null }
    }

    console.log("Uploading asset:", { filename: file.name, size: file.size, type: file.type })

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = `projects/${projectId}/assets/${uniqueFilename}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("displan-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return { success: false, error: uploadError.message, data: null }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("displan-assets").getPublicUrl(filePath)

    // Get image dimensions if it's an image
    let width: number | null = null
    let height: number | null = null

    if (file.type.startsWith("image/")) {
      try {
        const imageBuffer = await file.arrayBuffer()
        const imageBlob = new Blob([imageBuffer], { type: file.type })
        const imageUrl = URL.createObjectURL(imageBlob)

        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageUrl
        })

        width = img.naturalWidth
        height = img.naturalHeight
        URL.revokeObjectURL(imageUrl)
      } catch (error) {
        console.warn("Could not get image dimensions:", error)
      }
    }

    // Save asset metadata to database
    const assetData = {
      id: uuidv4(),
      project_id: projectId,
      page_slug: pageSlug,
      filename: uniqueFilename,
      original_filename: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      url: urlData.publicUrl,
      width,
      height,
      uploaded_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from(ASSETS_TABLE).insert([assetData]).select().single()

    if (error) {
      console.error("Database insert error:", error)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("displan-assets").remove([filePath])
      return { success: false, error: error.message, data: null }
    }

    console.log("Asset uploaded successfully:", data)

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error uploading asset:", error)
    return { success: false, error: "Failed to upload asset", data: null }
  }
}

// Fetch assets for a project/page
export async function displan_project_designer_css_projects_rtete353sr_fetch_assets(
  projectId: string,
  pageSlug: string,
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    console.log("Fetching assets for project:", projectId, "page:", pageSlug)

    const { data, error } = await supabase
      .from(ASSETS_TABLE)
      .select("*")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching assets:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log("Fetched assets:", data?.length || 0)
    return { success: true, data: data || [], error: null }
  } catch (error) {
    console.error("Server error fetching assets:", error)
    return { success: false, error: "Failed to fetch assets", data: [] }
  }
}

// Delete asset
export async function displan_project_designer_css_projects_rtete353sr_delete_asset(assetId: string) {
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

    console.log("Deleting asset:", assetId)

    // Get asset data first
    const { data: asset, error: fetchError } = await supabase
      .from(ASSETS_TABLE)
      .select("*")
      .eq("id", assetId)
      .eq("uploaded_by", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching asset:", fetchError)
      return { success: false, error: fetchError.message, data: null }
    }

    if (!asset) {
      return { success: false, error: "Asset not found or access denied", data: null }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("displan-assets").remove([asset.file_path])

    if (storageError) {
      console.error("Storage delete error:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from(ASSETS_TABLE)
      .delete()
      .eq("id", assetId)
      .eq("uploaded_by", user.id)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return { success: false, error: deleteError.message, data: null }
    }

    console.log("Asset deleted successfully")

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${asset.project_id}`)

    return { success: true, data: { assetId }, error: null }
  } catch (error) {
    console.error("Server error deleting asset:", error)
    return { success: false, error: "Failed to delete asset", data: null }
  }
}

// Get asset by ID
export async function displan_project_designer_css_projects_rtete353sr_get_asset(assetId: string) {
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

    const { data, error } = await supabase.from(ASSETS_TABLE).select("*").eq("id", assetId).single()

    if (error) {
      console.error("Error fetching asset:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error fetching asset:", error)
    return { success: false, error: "Failed to fetch asset", data: null }
  }
}

// Update asset metadata
export async function displan_project_designer_css_projects_rtete353sr_update_asset(
  assetId: string,
  updates: {
    original_filename?: string
    alt_text?: string
    description?: string
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

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from(ASSETS_TABLE)
      .update(updateData)
      .eq("id", assetId)
      .eq("uploaded_by", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating asset:", error)
      return { success: false, error: error.message, data: null }
    }

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${data.project_id}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error updating asset:", error)
    return { success: false, error: "Failed to update asset", data: null }
  }
}
