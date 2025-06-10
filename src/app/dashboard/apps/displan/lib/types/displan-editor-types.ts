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





export interface DisplanCanvasElement {
  id: string
  project_id?: string
  page_id?: string
  page_slug?: string
  element_type: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
  width_type?: "fixed" | "relative" | "fill" | "fit-content"
  height_type?: "fixed" | "relative" | "fill" | "fit-content"
  background_color?: string
  text_color?: string
  border_radius?: number
  border_width?: number
  border_color?: string
  font_size?: number
  font_weight?: string
  font_family?: string
  text_align?: string
  padding_top?: number
  padding_right?: number
  padding_bottom?: number
  padding_left?: number
  margin_top?: number
  margin_right?: number
  margin_bottom?: number
  margin_left?: number
  opacity?: number
  visible?: boolean
  cursor?: string
  animation?: string
  transform_rotate?: number
  transform_scale_x?: number
  transform_scale_y?: number
  device_type?: "desktop" | "tablet" | "mobile"
  z_index?: number
  link_url?: string
  link_page?: string
  is_template_element?: boolean
  template_element_id?: string
  styles?: any
  created_at?: string
  updated_at?: string
}
