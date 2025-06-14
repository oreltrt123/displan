import type { DisplanProjectDesignerCssComment, DisplanCanvasElement } from "../lib/types/displan-editor-types"

export type Tool = "cursor" | "hand" | "comment"

export interface CanvasProps {
  currentTool: Tool
  comments: DisplanProjectDesignerCssComment[]
  elements: DisplanCanvasElement[]
  selectedElement: DisplanCanvasElement | null
  onCreateComment: (x: number, y: number, message: string) => void
  onSelectElement: (element: DisplanCanvasElement | null) => void
  onMoveElement: (elementId: string, x: number, y: number) => void
  onUpdateElement: (elementId: string, properties: any) => void
  onAddElement?: (elementType: string, x: number, y: number, properties?: any) => void
  onDeleteElement?: (elementId: string) => void
  onDeleteAllElements?: () => void
  zoom: number
  onToolChange: (tool: Tool) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onZoomChange: (zoom: number) => void
  projectId: string
  isPreviewMode?: boolean
  customCode?: string
  canvasWidth?: number
  currentPageId?: string
  canvasHeight?: number
  previewDevice?: "desktop" | "tablet" | "mobile"
  onBackgroundSave?: (background: CanvasBackground, pageId: string) => void
  onBackgroundLoad?: (pageId: string) => CanvasBackground | null
}

export interface EditableTemplateElement {
  id: string
  content: string
  isEditing: boolean
  originalContent: string
}

export interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

export interface ContextMenu {
  x: number
  y: number
  visible: boolean
}

export interface CanvasBackground {
  type: "color" | "gradient" | "image" | "video" | "gif"
  value: string
  opacity?: number
}

export interface TextEditingState {
  elementId: string | null
  isActive: boolean
  shouldFocus: boolean
}

export interface ResizeData {
  x: number
  y: number
  width: number
  height: number
  elementX: number
  elementY: number
}

export interface ElementStyle {
  backgroundColor?: string
  color?: string
  borderRadius?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  padding?: string
  margin?: string
  boxShadow?: string
  border?: string
  textAlign?: string
}

export interface StyleEditingState {
  elementId: string | null
  isActive: boolean
  position: { x: number; y: number }
}
