import type React from "react"
import type { CanvasBackground } from "../types/canvas-types"
import type {  DisplanCanvasElement } from "../lib/types/displan-editor-types"

export const generateElementStyles = (
  element: DisplanCanvasElement,
  isPreviewMode: boolean,
  previewDevice: "desktop" | "tablet" | "mobile",
): React.CSSProperties => {
  const styles: React.CSSProperties = {
    position: "absolute",
    left: element.x_position,
    top: element.y_position,
  }

  if (element.width_type === "fixed") {
    styles.width = element.width
  } else if (element.width_type === "full") {
    styles.width = "100%"
  } else if (element.width_type === "fit-content") {
    styles.width = "fit-content"
  } else if (element.width_type === "relative") {
    styles.width = `${element.width}%`
  }

  if (element.height_type === "fixed") {
    styles.height = element.height
  } else if (element.height_type === "full") {
    styles.height = "100%"
  } else if (element.height_type === "fit-content") {
    styles.height = "fit-content"
  } else if (element.height_type === "relative") {
    styles.height = `${element.height}%`
  }

  if (element.opacity !== undefined) {
    styles.opacity = element.opacity
  }
  if (element.visible === false) {
    styles.display = "none"
  }
  if (element.cursor) {
    styles.cursor = element.cursor
  }
  if (element.background_color) {
    styles.backgroundColor = element.background_color
  }
  if (element.text_color) {
    styles.color = element.text_color
  }
  if (element.border_width && element.border_width > 0) {
    styles.border = `${element.border_width}px solid ${element.border_color || "#000"}`
  }
  if (element.border_radius && element.border_radius > 0) {
    styles.borderRadius = element.border_radius
  }
  if (element.font_size) {
    styles.fontSize = element.font_size
  }
  if (element.font_weight) {
    styles.fontWeight = element.font_weight
  }
  if (element.text_align) {
    styles.textAlign = element.text_align as any
  }
  styles.padding = `${element.padding_top || 0}px ${element.padding_right || 0}px ${element.padding_bottom || 0}px ${element.padding_left || 0}px`
  styles.margin = `${element.margin_top || 0}px ${element.margin_right || 0}px ${element.margin_bottom || 0}px ${element.margin_left || 0}px`
  if (element.z_index !== undefined) {
    styles.zIndex = element.z_index
  }
  if (isPreviewMode && element.device_type && element.device_type !== previewDevice) {
    styles.display = "none"
  }
  return styles
}

export const getCanvasBackgroundStyle = (canvasBackground: CanvasBackground): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {}

  switch (canvasBackground.type) {
    case "color":
      baseStyle.backgroundColor = canvasBackground.value
      break
    case "gradient":
      baseStyle.background = canvasBackground.value
      break
    case "image":
      baseStyle.backgroundImage = `url(${canvasBackground.value})`
      baseStyle.backgroundSize = "cover"
      baseStyle.backgroundPosition = "center"
      baseStyle.backgroundRepeat = "no-repeat"
      break
    case "video":
      baseStyle.backgroundColor = "#000"
      break
    case "gif":
      baseStyle.backgroundImage = `url(${canvasBackground.value})`
      baseStyle.backgroundSize = "cover"
      baseStyle.backgroundPosition = "center"
      baseStyle.backgroundRepeat = "no-repeat"
      break
    default:
      baseStyle.backgroundColor = "#ffffff"
  }

  if (canvasBackground.opacity !== undefined) {
    baseStyle.opacity = canvasBackground.opacity
  }

  return baseStyle
}

export const generateUniqueId = (): string => {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
