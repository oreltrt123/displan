"use server"

import { createClient } from "../../../../../../../supabase/server"
import { redirect } from "next/navigation"

export async function displan_project_designer_css_create() {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .insert({
        name: "Untitled Project",
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    // Redirect to the project editor
    redirect(`/editor/${data.id}`)
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function displan_project_designer_css_fetch_all() {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch projects", data: [] }
  }
}

export async function displan_project_designer_css_search(searchTerm: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("owner_id", user.id)
      .ilike("name", `%${searchTerm}%`)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error searching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to search projects", data: [] }
  }
}

export async function displan_project_designer_css_delete(projectId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase
      .from("displan_project_designer_css_projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", user.id) // Ensure user can only delete their own projects

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}
