// Add this interface to your existing types file or create it if it doesn't exist
export interface DisplanCanvasElement {
  id: string
  element_type: string
  content?: string
  src?: string
  x: number
  y: number
  width: number
  height: number
  z_index: number
  opacity: number
  visible?: boolean
  background_color?: string
  text_color?: string
  font_size?: number
  font_weight?: string
  font_family?: string
  text_align?: string
  border_radius?: number
  border_width?: number
  border_color?: string
  link_url?: string
  link_page?: string
  styles?: {
    backgroundColor?: string
    textColor?: string
    fontSize?: number
    fontWeight?: string
    fontFamily?: string
    textAlign?: string
    borderRadius?: number
    borderWidth?: number
    borderColor?: string
    opacity?: number
    display?: string
    justifyContent?: string
    alignItems?: string
    flexDirection?: string
    flexWrap?: string
    marginTop?: number
    marginRight?: number
    marginBottom?: number
    marginLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    paddingLeft?: number
    customClass?: string
    customId?: string
    customStyles?: string
    htmlTag?: string
    linkUrl?: string
    linkPage?: string
    linkTarget?: string
    elementName?: string
  }
  // 🔥🔥🔥 NEW: Store original button style data
  style_data?: {
    isMovingBorder?: boolean
    borderRadius?: string
    className?: string
    content?: string
  }
}
