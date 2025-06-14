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
      width = properties?.width || 1200
      height = properties?.height || 400
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
      text_align: properties?.text_align || "left",
      background_color: properties?.background_color || null,
      text_color: properties?.text_color || null,
      border_radius: properties?.border_radius || 0,
      border_width: properties?.border_width || 0,
      border_color: properties?.border_color || null,
      padding_top: properties?.padding_top || 8,
      padding_right: properties?.padding_right || 16,
      padding_bottom: properties?.padding_bottom || 8,
      padding_left: properties?.padding_left || 16,
      margin_top: properties?.margin_top || 0,
      margin_right: properties?.margin_right || 0,
      margin_bottom: properties?.margin_bottom || 0,
      margin_left: properties?.margin_left || 0,
      is_template_element: properties?.is_template_element || false,
      template_element_id: properties?.template_element_id || null,
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
      console.log("This is a template element, using special handling")
      
      // For template elements, we'll just return success with the updated properties
      // The actual update will be handled by the canvas component
      return { 
        success: true, 
        data: { 
          id: elementId, 
          ...properties,
          updated_at: new Date().toISOString()
        }, 
        error: null 
      }
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

    // First, check if this template element already exists in the database
    const { data: existingElement, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)
      .eq("template_element_id", templateElementId)
      .maybeSingle()

    if (fetchError) {
      console.error("Error checking for existing template element:", fetchError)
      return { success: false, error: fetchError.message, data: null }
    }

    let result;
    
    if (existingElement) {
      // Update existing template element
      console.log("Updating existing template element in database")
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          content: properties.content !== undefined ? properties.content : existingElement.content,
          background_color: properties.background_color !== undefined ? properties.background_color : existingElement.background_color,
          text_color: properties.text_color !== undefined ? properties.text_color : existingElement.text_color,
          border_radius: properties.border_radius !== undefined ? properties.border_radius : existingElement.border_radius,
          border_width: properties.border_width !== undefined ? properties.border_width : existingElement.border_width,
          border_color: properties.border_color !== undefined ? properties.border_color : existingElement.border_color,
          font_size: properties.font_size !== undefined ? properties.font_size : existingElement.font_size,
          font_weight: properties.font_weight !== undefined ? properties.font_weight : existingElement.font_weight,
          font_family: properties.font_family !== undefined ? properties.font_family : existingElement.font_family,
          text_align: properties.text_align !== undefined ? properties.text_align : existingElement.text_align,
          opacity: properties.opacity !== undefined ? properties.opacity : existingElement.opacity,
          visible: properties.visible !== undefined ? properties.visible : existingElement.visible,
          cursor: properties.cursor !== undefined ? properties.cursor : existingElement.cursor,
          animation: properties.animation !== undefined ? properties.animation : existingElement.animation,
          transform_rotate: properties.transform_rotate !== undefined ? properties.transform_rotate : existingElement.transform_rotate,
          transform_scale_x: properties.transform_scale_x !== undefined ? properties.transform_scale_x : existingElement.transform_scale_x,
          transform_scale_y: properties.transform_scale_y !== undefined ? properties.transform_scale_y : existingElement.transform_scale_y,
          link_url: properties.link_url !== undefined ? properties.link_url : existingElement.link_url,
          link_page: properties.link_page !== undefined ? properties.link_page : existingElement.link_page,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingElement.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating template element:", error)
        return { success: false, error: error.message, data: null }
      }
      
      result = data;
    } else {
      // Create new template element entry
      console.log("Creating new template element in database")
      const newElement = {
        id: uuidv4(),
        project_id: projectId,
        page_slug: pageSlug,
        element_type: elementType,
        template_element_id: templateElementId,
        is_template_element: true,
        content: properties.content || "Template Element",
        x_position: properties.x_position || 0,
        y_position: properties.y_position || 0,
        width: properties.width || 200,
        height: properties.height || 50,
        width_type: properties.width_type || "fixed",
        height_type: properties.height_type || "fixed",
        background_color: properties.background_color || null,
        text_color: properties.text_color || null,
        border_radius: properties.border_radius || 0,
        border_width: properties.border_width || 0,
        border_color: properties.border_color || null,
        font_size: properties.font_size || 16,
        font_weight: properties.font_weight || "400",
        font_family: properties.font_family || "Inter, sans-serif",
        text_align: properties.text_align || "left",
        opacity: properties.opacity || 1.0,
        visible: properties.visible !== undefined ? properties.visible : true,
        cursor: properties.cursor || "default",
        animation: properties.animation || "none",
        transform_rotate: properties.transform_rotate || 0,
        transform_scale_x: properties.transform_scale_x || 1.0,
        transform_scale_y: properties.transform_scale_y || 1.0,
        link_url: properties.link_url || null,
        link_page: properties.link_page || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([newElement])
        .select()
        .single()

      if (error) {
        console.error("Error creating template element:", error)
        return { success: false, error: error.message, data: null }
      }
      
      result = data;
    }

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/apps/displan/editor/${projectId}`)

    return { success: true, data: result, error: null }
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

    // First check if we have a stored version of this template element
    const { data: existingElement, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("project_id", projectId)
      .eq("page_slug", pageSlug)
      .eq("template_element_id", templateElementId)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching template element styles:", fetchError)
      return { success: false, error: fetchError.message, data: null }
    }

    if (existingElement) {
      return { success: true, data: existingElement, error: null }
    }

    // If no stored version exists, return default empty data
    return { 
      success: true, 
      data: {
        template_element_id: templateElementId,
        content: null,
        background_color: null,
        text_color: null,
        font_size: null,
        font_weight: null,
        font_family: null,
        text_align: null
      }, 
      error: null 
    }
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





// New delete functions
export async function displan_project_designer_css_delete_element(elementId: string) {
  try {
    const supabase = createClient()

    // Call the PostgreSQL delete function
    const { data, error } = await supabase.rpc("delete_element_by_id", {
      element_id_param: elementId,
    })

    if (error) {
      console.error("Error deleting element:", error)
      return { success: false, error: error.message }
    }

    return data || { success: true, message: "Element deleted successfully" }
  } catch (error) {
    console.error("Server error deleting element:", error)
    return { success: false, error: "Server error occurred during deletion" }
  }
}

export async function displan_project_designer_css_delete_template_element(
  projectId: string,
  pageSlug: string,
  templateElementId: string,
) {
  try {
    const supabase = createClient()

    // Call the PostgreSQL delete function for template elements
    const { data, error } = await supabase.rpc("delete_template_element_by_id", {
      project_id_param: projectId,
      page_slug_param: pageSlug,
      template_element_id_param: templateElementId,
    })

    if (error) {
      console.error("Error deleting template element:", error)
      return { success: false, error: error.message }
    }

    return data || { success: true, message: "Template element deleted successfully" }
  } catch (error) {
    console.error("Server error deleting template element:", error)
    return { success: false, error: "Server error occurred during template element deletion" }
  }
}