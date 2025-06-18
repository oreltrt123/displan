"use server"

import { createClient } from "../../../../../../../supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

const TABLE_NAME = "displan_project_designer_css_elements_canvas_csss_style"

// Check if an ID is a valid UUID
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// Enhanced check for template elements
function isTemplateElement(elementId: string): boolean {
  return (
    elementId.includes("_template-") ||
    elementId.includes("_empty-") ||
    elementId.startsWith("user_") ||
    elementId.includes("_heading") ||
    elementId.includes("_text") ||
    elementId.includes("_image") ||
    elementId.includes("_button") ||
    elementId.includes("_link") ||
    elementId.includes("_component") ||
    elementId.startsWith("template-") ||
    elementId.startsWith("empty-")
  )
}

// Fetch elements for a specific page
export async function displan_project_designer_css_fetch_elements_new(projectId: string, pageSlug: string) {
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

    console.log("Fetching elements for project:", projectId, "page:", pageSlug)

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)
      .order("z_index", { ascending: true })

    if (error) {
      console.error("Error fetching elements:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log("Fetched elements:", data?.length || 0)
    return { success: true, data: data || [], error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch elements", data: [] }
  }
}

// Add a new element to the canvas
export async function displan_project_designer_css_add_element_new(
  projectId: string,
  pageSlug: string,
  elementType: string,
  x: number,
  y: number,
  properties?: any,
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

    console.log("Adding element:", { projectId, pageSlug, elementType, x, y, properties })

    // Default properties based on element type
    let content = properties?.content || ""
    let width = properties?.width || 200
    let height = properties?.height || 50
    let fontSize = properties?.font_size || 16
    let fontWeight = properties?.font_weight || "normal"

    if (elementType.startsWith("text-")) {
      content = properties?.content || "Text Element"
      if (elementType === "text-heading") {
        content = properties?.content || "Heading"
        width = properties?.width || 300
        height = properties?.height || 60
        fontSize = properties?.font_size || 32
        fontWeight = properties?.font_weight || "bold"
      } else if (elementType === "text-subheading") {
        content = properties?.content || "Subheading"
        width = properties?.width || 250
        height = properties?.height || 40
        fontSize = properties?.font_size || 24
        fontWeight = properties?.font_weight || "semibold"
      } else if (elementType === "text-paragraph") {
        content = properties?.content || "This is a paragraph of text. Click to edit."
        width = properties?.width || 400
        height = properties?.height || 100
        fontSize = properties?.font_size || 16
      }
    } else if (elementType.startsWith("button-")) {
      content = properties?.content || "Button"
      width = properties?.width || 120
      height = properties?.height || 40
      fontSize = properties?.font_size || 14
      fontWeight = properties?.font_weight || "medium"
    } else if (elementType.startsWith("menu-")) {
      content = properties?.content || `Menu Template ${elementType.replace("menu-", "")}`
      width = properties?.width || 1200
      height = properties?.height || 400
    }

    const newElement = {
      id: uuidv4(),
      project_id: projectId,
      page_slug: pageSlug,
      element_type: elementType,
      content,
      x_position: Math.round(x),
      y_position: Math.round(y),
      width,
      height,
      width_type: properties?.width_type || "fixed",
      height_type: properties?.height_type || "fixed",
      opacity: properties?.opacity || 1.0,
      visible: properties?.visible !== undefined ? properties.visible : true,
      cursor: properties?.cursor || "default",
      animation: properties?.animation || "none",
      device_type: properties?.device_type || "desktop",
      z_index: properties?.z_index || 0,
      font_size: fontSize,
      font_weight: fontWeight,
      font_family: properties?.font_family || "Inter, sans-serif",
      text_align: properties?.text_align || "left",
      line_height: properties?.line_height || 1.5,
      letter_spacing: properties?.letter_spacing || 0,
      text_decoration: properties?.text_decoration || "none",
      text_transform: properties?.text_transform || "none",
      background_color: properties?.background_color || null,
      text_color: properties?.text_color || null,
      border_color: properties?.border_color || null,
      border_radius: properties?.border_radius || 0,
      border_width: properties?.border_width || 0,
      border_style: properties?.border_style || "solid",
      padding_top: properties?.padding_top || 8,
      padding_right: properties?.padding_right || 16,
      padding_bottom: properties?.padding_bottom || 8,
      padding_left: properties?.padding_left || 16,
      margin_top: properties?.margin_top || 0,
      margin_right: properties?.margin_right || 0,
      margin_bottom: properties?.margin_bottom || 0,
      margin_left: properties?.margin_left || 0,
      transform_rotate: properties?.transform_rotate || 0,
      transform_scale_x: properties?.transform_scale_x || 1.0,
      transform_scale_y: properties?.transform_scale_y || 1.0,
      transform_skew_x: properties?.transform_skew_x || 0,
      transform_skew_y: properties?.transform_skew_y || 0,
      link_url: properties?.link_url || null,
      link_page: properties?.link_page || null,
      link_target: properties?.link_target || "_self",
      is_template_element: properties?.is_template_element || false,
      template_element_id: properties?.template_element_id || null,
      box_shadow_x: properties?.box_shadow_x || 0,
      box_shadow_y: properties?.box_shadow_y || 0,
      box_shadow_blur: properties?.box_shadow_blur || 0,
      box_shadow_spread: properties?.box_shadow_spread || 0,
      box_shadow_color: properties?.box_shadow_color || null,
      display_type: properties?.display_type || "block",
      flex_direction: properties?.flex_direction || "row",
      justify_content: properties?.justify_content || "flex-start",
      align_items: properties?.align_items || "stretch",
      flex_wrap: properties?.flex_wrap || "nowrap",
      position_type: properties?.position_type || "static",
      top_position: properties?.top_position || null,
      right_position: properties?.right_position || null,
      bottom_position: properties?.bottom_position || null,
      left_position: properties?.left_position || null,
      overflow_x: properties?.overflow_x || "visible",
      overflow_y: properties?.overflow_y || "visible",
      custom_css: properties?.custom_css || null,
      custom_classes: properties?.custom_classes || null,
    }

    console.log("Inserting element into database:", newElement)

    const { data, error } = await supabase.from(TABLE_NAME).insert([newElement]).select().single()

    if (error) {
      console.error("Error adding element:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Element added successfully:", data)

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to add element", data: null }
  }
}

// Update an element's properties
export async function displan_project_designer_css_update_element_new(elementId: string, properties: any) {
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

    console.log("Updating element:", elementId, "with properties:", properties)

    // Check if this is a template element
    if (isTemplateElement(elementId)) {
      console.log("This is a template element, using special handling")

      // For template elements, we'll just return success with the updated properties
      // The actual update will be handled by the canvas component
      return {
        success: true,
        data: {
          id: elementId,
          ...properties,
          updated_at: new Date().toISOString(),
        },
        error: null,
      }
    }

    // Validate UUID for regular elements
    if (!isValidUUID(elementId)) {
      console.error("Invalid UUID:", elementId)
      return { success: false, error: "Invalid element ID", data: null }
    }

    // Prepare update data - only include defined properties
    const updateData: any = {}
    Object.keys(properties).forEach((key) => {
      if (properties[key] !== undefined) {
        updateData[key] = properties[key]
      }
    })

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString()

    console.log("Update data:", updateData)

    // Update the element directly
    const { data, error } = await supabase.from(TABLE_NAME).update(updateData).eq("id", elementId).select().single()

    if (error) {
      console.error("Error updating element:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Element updated successfully:", data)

    // Get project ID for revalidation
    const projectId = data.project_id

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update element", data: null }
  }
}

// Save the entire canvas
export async function displan_project_designer_css_save_canvas_new(projectId: string, pageSlug: string) {
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

    console.log("Saving canvas for project:", projectId, "page:", pageSlug)

    // Update the last_saved timestamp for the project
    const { error } = await supabase
      .from("displan_project_designer_css_projects")
      .update({
        last_saved: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("owner_id", user.id)

    if (error) {
      console.error("Error saving canvas:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Canvas saved successfully")

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: { projectId, pageSlug }, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to save canvas", data: null }
  }
}

// Delete an element
export async function displan_project_designer_css_delete_element_new(elementId: string) {
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

    console.log("Deleting element:", elementId)

    // Check if this is a template element
    if (isTemplateElement(elementId)) {
      console.log("Cannot delete template element")
      return { success: false, error: "Cannot delete template elements", data: null }
    }

    // Validate UUID for regular elements
    if (!isValidUUID(elementId)) {
      console.error("Invalid UUID:", elementId)
      return { success: false, error: "Invalid element ID", data: null }
    }

    // Get the project ID before deleting for revalidation
    const { data: element, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("project_id")
      .eq("id", elementId)
      .single()

    if (fetchError) {
      console.error("Error fetching element:", fetchError)
      return { success: false, error: fetchError.message, data: null }
    }

    const projectId = element.project_id

    // Delete the element
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", elementId)

    if (error) {
      console.error("Error deleting element:", error)
      return { success: false, error: error.message, data: null }
    }

    console.log("Element deleted successfully")

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: { elementId, projectId }, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to delete element", data: null }
  }
}
