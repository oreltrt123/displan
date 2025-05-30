"use server"

import { createClient } from "../../../../../../../supabase/server"

export async function displan_project_designer_css_fetch_elements(projectId: string, pageId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("displan_project_designer_css_canvas_elements")
      .select("*")
      .eq("project_id", projectId)
      .eq("page_id", pageId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching canvas elements:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error fetching canvas elements:", error)
    return { success: false, error: "Failed to fetch canvas elements", data: [] }
  }
}

export async function displan_project_designer_css_add_element(
  projectId: string,
  pageId: string,
  elementType: string,
  x: number,
  y: number,
) {
  try {
    const supabase = createClient()

    // Default content based on element type
    let content = "Button"
    let width = 200
    let height = 40

    if (elementType === "text-heading") {
      content = "Heading Text"
      width = 300
      height = 50
    } else if (elementType === "text-paragraph") {
      content = "This is a paragraph of text. Click to edit."
      width = 300
      height = 50
    } else if (elementType === "button-primary" || elementType === "button-secondary") {
      content = "Button"
      width = 200
      height = 40
    } else if (elementType.startsWith("menu-")) {
      content = `Menu Template ${elementType.replace("menu-", "")}`
      width = 1200 // Full width
      height = 600 // Auto height for sections
      x = 0 // Always start at left edge
      y = 0 // Will be positioned by stacking
    }

    console.log("Creating element:", { projectId, pageId, elementType, content, x, y })

    const { data, error } = await supabase
      .from("displan_project_designer_css_canvas_elements")
      .insert({
        project_id: projectId,
        page_id: pageId,
        element_type: elementType,
        content: content,
        x_position: Math.round(x),
        y_position: Math.round(y),
        width: width,
        height: height,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating canvas element:", error)
      return { success: false, error: error.message }
    }

    console.log("Element created successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Server error creating canvas element:", error)
    return { success: false, error: "Failed to create canvas element" }
  }
}

export async function displan_project_designer_css_update_element(
  elementId: string,
  properties: {
    x_position?: number
    y_position?: number
    content?: string
    width?: number
    height?: number
    link_url?: string
    link_page?: string
  },
) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("displan_project_designer_css_canvas_elements")
      .update(properties)
      .eq("id", elementId)

    if (error) {
      console.error("Error updating element properties:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error updating element properties:", error)
    return { success: false, error: "Failed to update element properties" }
  }
}

export async function displan_project_designer_css_save_canvas(projectId: string, pageId: string) {
  try {
    const supabase = createClient()

    // Just update the project's updated_at timestamp
    const { error } = await supabase
      .from("displan_project_designer_css_projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", projectId)

    if (error) {
      console.error("Error saving canvas state:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error saving canvas state:", error)
    return { success: false, error: "Failed to save canvas state" }
  }
}
