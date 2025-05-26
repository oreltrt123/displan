"use server"

import { createClient } from "../../../../../../supabase/server"

export interface WorkingComment {
  id: string
  board_id: string
  user_email: string
  comment_text: string
  position_x: number
  position_y: number
  created_at: string
}

export async function addNewComment(boardId: string, x: number, y: number, text: string) {
  try {
    console.log("💬 ADDING NEW COMMENT:", { boardId, x, y, text })

    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log("❌ User not authenticated:", userError)
      return { data: null, error: "User not authenticated" }
    }

    console.log("👤 User authenticated:", user.email)

    // Insert comment
    const { data, error } = await supabase
      .from("design_comments")
      .insert({
        board_id: boardId,
        user_email: user.email,
        comment_text: text,
        position_x: x,
        position_y: y,
      })
      .select()
      .single()

    if (error) {
      console.log("❌ Error inserting comment:", error)
      return { data: null, error: error.message }
    }

    console.log("✅ Comment added successfully:", data)
    return { data, error: null }
  } catch (error) {
    console.log("❌ Unexpected error:", error)
    return { data: null, error: "Failed to add comment" }
  }
}

export async function getAllComments(boardId: string) {
  try {
    console.log("📋 GETTING ALL COMMENTS for board:", boardId)

    const supabase = createClient()

    const { data, error } = await supabase
      .from("design_comments")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false })

    if (error) {
      console.log("❌ Error fetching comments:", error)
      return { data: null, error: error.message }
    }

    console.log("✅ Comments fetched:", data)
    return { data, error: null }
  } catch (error) {
    console.log("❌ Unexpected error:", error)
    return { data: null, error: "Failed to fetch comments" }
  }
}
