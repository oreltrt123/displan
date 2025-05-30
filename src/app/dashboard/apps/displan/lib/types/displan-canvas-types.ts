export interface DisplanCanvasElement {
  id: string
  project_id: string
  page_id: string
  element_type: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
  link_url?: string
  link_page?: string
  styles?: any
  created_at: string
  updated_at: string
}
