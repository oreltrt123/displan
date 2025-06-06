export interface DisplanProjectDesignerCssComment {
  id: string
  project_id: string
  page_id: string
  page_slug?: string
  x_position: number
  y_position: number
  message: string
  author_id: string
  author_name: string
  author_avatar?: string
  created_at: string
  updated_at: string
}

export interface DisplanProjectDesignerCssPage {
  id: string
  project_id: string
  name: string
  slug: string
  is_folder: boolean
  parent_id?: string
  created_at: string
  updated_at: string
}

export type EditorTool = "cursor" | "hand" | "comment"
