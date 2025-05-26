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
  console.log("💾 Saving canvas data for board:", boardId)
  console.log("📊 Canvas data:", canvasData)

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

    console.log("✅ Canvas saved successfully")
    return { error: null }
  } catch (error) {
    console.error("❌ Catch save error:", error)
    return { error: (error as Error).message }
  }
}

export async function updateBoardCanvasData(boardId: string, canvasData: any) {
  return saveCanvasData(boardId, canvasData)
}
