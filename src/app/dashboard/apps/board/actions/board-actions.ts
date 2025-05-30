"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "../../../../../../supabase/server"

export type WorkingBoard = {
  id: string
  board_name: string
  board_description: string | null
  owner_id: string
  thumbnail_url: string | null
  canvas_data?: any
  created_at: string
  updated_at: string
}

export async function createNewBoard(boardName: string, boardDescription?: string) {
  console.log("🎨 Creating board:", { boardName, boardDescription })

  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("❌ No user")
      return { error: "Not authenticated" }
    }

    console.log("👤 User:", user.id)

    const boardData = {
      board_name: boardName,
      board_description: boardDescription || null,
      owner_id: user.id,
      canvas_data: {
        elements: [],
        comments: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      },
    }

    console.log("📝 Inserting:", boardData)

    const { data, error } = await supabase.from("design_boards").insert(boardData).select().single()

    if (error) {
      console.error("❌ DB Error:", error)
      return { error: error.message }
    }

    console.log("✅ Success:", data)
    revalidatePath("/dashboard")
    return { data, error: null }
  } catch (error) {
    console.error("❌ Catch Error:", error)
    return { error: (error as Error).message }
  }
}

export async function getAllBoards() {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: [], error: "Not authenticated" }
    }

    console.log("📋 Getting boards for:", user.id)

    const { data: boards, error } = await supabase
      .from("design_boards")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("❌ Fetch Error:", error)
      return { data: [], error: error.message }
    }

    console.log("✅ Got boards:", boards)
    return { data: boards, error: null }
  } catch (error) {
    console.error("❌ Catch Error:", error)
    return { data: [], error: (error as Error).message }
  }
}

export async function getSingleBoard(id: string) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    console.log("🔍 Getting board:", id)

    const { data, error } = await supabase.from("design_boards").select("*").eq("id", id).single()

    if (error) {
      console.error("❌ Board fetch error:", error)
      return { data: null, error: error.message }
    }

    if (data.owner_id !== user.id) {
      return { data: null, error: "Access denied" }
    }

    console.log("✅ Got board:", data)
    return { data, error: null }
  } catch (error) {
    console.error("❌ Catch error:", error)
    return { data: null, error: (error as Error).message }
  }
}

export async function saveCanvasData(boardId: string, canvasData: any) {
  console.log("💾 SAVING CANVAS DATA for board:", boardId)
  console.log("📊 Canvas data being saved:", JSON.stringify(canvasData, null, 2))

  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("❌ No user for save")
      return { error: "Not authenticated" }
    }

    console.log("👤 User saving:", user.id)

    const { error } = await supabase
      .from("design_boards")
      .update({
        canvas_data: canvasData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)
      .eq("owner_id", user.id)

    if (error) {
      console.error("❌ Save error:", error)
      return { error: error.message }
    }

    console.log("✅ Canvas data saved successfully!")
    return { error: null }
  } catch (error) {
    console.error("❌ Catch save error:", error)
    return { error: (error as Error).message }
  }
}

export async function updateBoardCanvasData(boardId: string, canvasData: any) {
  return saveCanvasData(boardId, canvasData)
}



export async function getStarredBoards() {
  const supabase = await createClient()

  try {
    const { data: boards, error } = await supabase
      .from("working_boards")
      .select("*")
      .eq("starred", true)
      .eq("archived", false)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching starred boards:", error)
      return { data: [], error: error.message }
    }

    return { data: boards || [], error: null }
  } catch (error) {
    console.error("Error in getStarredBoards:", error)
    return { data: [], error: "Failed to fetch starred boards" }
  }
}

export async function toggleStarBoard(boardId: string) {
  const supabase = await createClient()

  try {
    // First get the current starred status
    const { data: board, error: fetchError } = await supabase
      .from("working_boards")
      .select("starred")
      .eq("id", boardId)
      .single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Toggle the starred status
    const { error: updateError } = await supabase
      .from("working_boards")
      .update({
        starred: !board.starred,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath("/dashboard")
    return { success: true, starred: !board.starred }
  } catch (error) {
    console.error("Error toggling star:", error)
    return { success: false, error: "Failed to toggle star" }
  }
}

export async function deleteBoard(boardId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("working_boards").delete().eq("id", boardId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting board:", error)
    return { success: false, error: "Failed to delete board" }
  }
}

export async function duplicateBoard(boardId: string) {
  const supabase = await createClient()

  try {
    // Get the original board
    const { data: originalBoard, error: fetchError } = await supabase
      .from("working_boards")
      .select("*")
      .eq("id", boardId)
      .single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Create a duplicate
    const { data: newBoard, error: createError } = await supabase
      .from("working_boards")
      .insert({
        board_name: `${originalBoard.board_name} (Copy)`,
        board_description: originalBoard.board_description,
        thumbnail_url: originalBoard.thumbnail_url,
        user_id: originalBoard.user_id,
        starred: false,
        archived: false,
      })
      .select()
      .single()

    if (createError) {
      return { success: false, error: createError.message }
    }

    revalidatePath("/dashboard")
    return { success: true, board: newBoard }
  } catch (error) {
    console.error("Error duplicating board:", error)
    return { success: false, error: "Failed to duplicate board" }
  }
}

export async function renameBoard(boardId: string, newName: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("working_boards")
      .update({
        board_name: newName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error renaming board:", error)
    return { success: false, error: "Failed to rename board" }
  }
}

export async function updateBoardDescription(boardId: string, description: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("working_boards")
      .update({
        board_description: description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating description:", error)
    return { success: false, error: "Failed to update description" }
  }
}

export async function archiveBoard(boardId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("working_boards")
      .update({
        archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error archiving board:", error)
    return { success: false, error: "Failed to archive board" }
  }
}
