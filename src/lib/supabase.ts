import { createClient } from "../..//supabase/server"

export async function getSupabaseClient() {
  return createClient()
}

export type Board = {
  id: string
  name: string
  description?: string
  thumbnail_url?: string
  created_at: string
  updated_at: string
  user_id: string
  canvas_data: {
    elements: CanvasElement[]
    viewport: {
      x: number
      y: number
      zoom: number
    }
  }
}

export type CanvasElement = {
  id: string
  type: "rectangle" | "circle" | "text" | "path"
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  text?: string // For text elements
  path?: { x: number; y: number }[] // For drawing paths
}
