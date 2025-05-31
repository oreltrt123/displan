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

// Check if an element is a template element
function isTemplateElement(elementId: string): boolean {
  return elementId.startsWith("template-") || elementId.startsWith("empty-")
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

    // Default properties based on element type
    let content = ""
    let width = 200
    let height = 50
    let fontSize = 16
    let fontWeight = "normal"

    if (elementType.startsWith("text-")) {
      content = "Text Element"
      if (elementType === "text-heading") {
        content = "Heading"
        width = 300
        height = 60
        fontSize = 32
        fontWeight = "bold"
      } else if (elementType === "text-subheading") {
        content = "Subheading"
        width = 250
        height = 40
        fontSize = 24
        fontWeight = "semibold"
      } else if (elementType === "text-paragraph") {
        content = "This is a paragraph of text. Click to edit."
        width = 400
        height = 100
        fontSize = 16
      }
    } else if (elementType.startsWith("button-")) {
      content = "Button"
      width = 120
      height = 40
      fontSize = 14
      fontWeight = "medium"
    } else if (elementType.startsWith("menu-")) {
      width = 1200
      height = 400
    }

    const newElement = {
      id: uuidv4(),
      project_id: projectId,
      page_slug: pageSlug,
      element_type: elementType,
      content,
      x_position: x,
      y_position: y,
      width,
      height,
      width_type: "fixed",
      height_type: "fixed",
      opacity: 1.0,
      visible: true,
      cursor: "default",
      animation: "none",
      device_type: "desktop",
      z_index: 0,
      font_size: fontSize,
      font_weight: fontWeight,
      text_align: "left",
      padding_top: 8,
      padding_right: 16,
      padding_bottom: 8,
      padding_left: 16,
      margin_top: 0,
      margin_right: 0,
      margin_bottom: 0,
      margin_left: 0,
      is_template_element: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from(TABLE_NAME).insert([newElement]).select().single()

    if (error) {
      console.error("Error adding element:", error)
      return { success: false, error: error.message, data: null }
    }

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
      console.log("Handling template element update")
      return { success: true, data: { id: elementId, ...properties }, error: null }
    }

    // Validate UUID for regular elements
    if (!isValidUUID(elementId)) {
      console.error("Invalid UUID:", elementId)
      return { success: false, error: "Invalid element ID", data: null }
    }

    // Use the database function to update properties with proper type casting
    const { data, error } = await supabase.rpc("update_canvas_element_properties", {
      element_id: elementId,
      properties: properties,
    })

    if (error) {
      console.error("Error updating element:", error)
      return { success: false, error: error.message, data: null }
    }

    // Get the updated element
    const { data: updatedElement, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", elementId)
      .single()

    if (fetchError) {
      console.error("Error fetching updated element:", fetchError)
      return { success: false, error: fetchError.message, data: null }
    }

    // Get project ID for revalidation
    const projectId = updatedElement.project_id

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: updatedElement, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update element", data: null }
  }
}

// Update template element properties
export async function displan_project_designer_css_update_template_element(
  projectId: string,
  pageSlug: string,
  templateElementId: string,
  elementType: string,
  properties: any,
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

    console.log("Updating template element:", templateElementId, "with properties:", properties)

    // Use the database function to update template element properties
    const { data, error } = await supabase.rpc("update_template_element_properties", {
      project_id_param: projectId,
      page_slug_param: pageSlug,
      template_element_id_param: templateElementId,
      element_type_param: elementType,
      properties: properties,
    })

    if (error) {
      console.error("Error updating template element:", error)
      return { success: false, error: error.message, data: null }
    }

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to update template element", data: null }
  }
}

// Get template element styles
export async function displan_project_designer_css_get_template_element_styles(
  projectId: string,
  pageSlug: string,
  templateElementId: string,
) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc("get_template_element_styles", {
      project_id_param: projectId,
      page_slug_param: pageSlug,
      template_element_id_param: templateElementId,
    })

    if (error) {
      console.error("Error fetching template element styles:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to get template element styles", data: null }
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

    // Update the last_saved timestamp for the project
    const { error } = await supabase
      .from("displan_project_designer_css_projects")
      .update({ last_saved: new Date().toISOString() })
      .eq("id", projectId)
      .eq("owner_id", user.id)

    if (error) {
      console.error("Error saving canvas:", error)
      return { success: false, error: error.message, data: null }
    }

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

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: { elementId, projectId }, error: null }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to delete element", data: null }
  }
}

// Get element with CSS styles
export async function displan_project_designer_css_get_element_styles(elementId: string) {
  try {
    const supabase = createClient()

    // Check if this is a template element
    if (isTemplateElement(elementId)) {
      return { success: true, data: { element: null, cssStyles: "" }, error: null }
    }

    // Validate UUID for regular elements
    if (!isValidUUID(elementId)) {
      console.error("Invalid UUID:", elementId)
      return { success: false, error: "Invalid element ID", data: null }
    }

    const { data: element, error } = await supabase.from(TABLE_NAME).select("*").eq("id", elementId).single()

    if (error) {
      console.error("Error fetching element:", error)
      return { success: false, error: error.message, data: null }
    }

    return {
      success: true,
      data: {
        element,
        cssStyles: "",
      },
      error: null,
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to get element styles", data: null }
  }
}
