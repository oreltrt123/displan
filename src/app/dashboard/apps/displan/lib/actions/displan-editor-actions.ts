"use server"

import { createClient } from "../../../../../../../supabase/server"

export async function displan_project_designer_css_create_comment(
  projectId: string,
  pageId: string,
  x: number,
  y: number,
  message: string,
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    console.log("Creating comment:", { projectId, pageId, x, y, message, userId: user.id })

    const { data, error } = await supabase
      .from("displan_project_designer_css_comments")
      .insert({
        project_id: projectId,
        page_id: pageId,
        x_position: Math.round(x),
        y_position: Math.round(y),
        message: message.trim(),
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
        author_avatar: user.user_metadata?.avatar_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating comment:", error)
      return { success: false, error: error.message }
    }

    console.log("Comment created successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Server error creating comment:", error)
    return { success: false, error: "Failed to create comment" }
  }
}

export async function displan_project_designer_css_fetch_comments(projectId: string, pageId: string) {
  try {
    const supabase = createClient()

    console.log("Fetching comments for:", { projectId, pageId })

    const { data, error } = await supabase
      .from("displan_project_designer_css_comments")
      .select("*")
      .eq("project_id", projectId)
      .eq("page_id", pageId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log("Comments fetched:", data?.length || 0)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error fetching comments:", error)
    return { success: false, error: "Failed to fetch comments", data: [] }
  }
}

export async function displan_project_designer_css_delete_comment(commentId: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase
      .from("displan_project_designer_css_comments")
      .delete()
      .eq("id", commentId)
      .eq("author_id", user.id)

    if (error) {
      console.error("Error deleting comment:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error deleting comment:", error)
    return { success: false, error: "Failed to delete comment" }
  }
}

export async function displan_project_designer_css_create_page(
  projectId: string,
  name: string,
  isFolder = false,
  parentId?: string,
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const { data, error } = await supabase
      .from("displan_project_designer_css_pages")
      .insert({
        project_id: projectId,
        name: name,
        slug: slug,
        is_folder: isFolder,
        parent_id: parentId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating page:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Server error creating page:", error)
    return { success: false, error: "Failed to create page" }
  }
}

export async function displan_project_designer_css_fetch_pages(projectId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("displan_project_designer_css_pages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching pages:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error fetching pages:", error)
    return { success: false, error: "Failed to fetch pages", data: [] }
  }
}
