"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Globe, FileText, ImageIcon, Square, Type } from "lucide-react"

interface NavigatorElement {
  id: string
  element_type: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
  visible?: boolean
  is_template_element?: boolean
  template_element_id?: string
  background_color?: string
  text_color?: string
  font_size?: number
  font_weight?: string
  font_family?: string
  text_align?: string
  border_radius?: number
  border_width?: number
  border_color?: string
  border_style?: string
  opacity?: number
  padding_top?: number
  padding_right?: number
  padding_bottom?: number
  padding_left?: number
  margin_top?: number
  margin_right?: number
  margin_bottom?: number
  margin_left?: number
  line_height?: number
  letter_spacing?: number
  text_decoration?: string
  text_transform?: string
  box_shadow_x?: number
  box_shadow_y?: number
  box_shadow_blur?: number
  box_shadow_spread?: number
  box_shadow_color?: string
  transform_rotate?: number
  transform_scale_x?: number
  transform_scale_y?: number
}

interface NavigatorPanelProps {
  elements: NavigatorElement[]
  currentPage: string
  onElementVisibilityToggle?: (elementId: string, visible: boolean) => void
  onElementSelect?: (elementId: string) => void
}

export function NavigatorPanel({
  elements = [],
  currentPage,
  onElementVisibilityToggle,
  onElementSelect,
}: NavigatorPanelProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [expandedElements, setExpandedElements] = useState<{ [key: string]: boolean }>({})
  const [elementVisibility, setElementVisibility] = useState<{ [key: string]: boolean }>({})
  const [showCSSPreview, setShowCSSPreview] = useState(false)

  // Initialize visibility state from elements
  useEffect(() => {
    const initialVisibility: { [key: string]: boolean } = {}
    elements.forEach((element) => {
      initialVisibility[element.id] = element.visible !== false
    })
    setElementVisibility(initialVisibility)
  }, [elements])

  const getElementIcon = (elementType: string) => {
    if (elementType.startsWith("text-")) return <Type className="w-4 h-4 text-blue-500" />
    if (elementType.startsWith("button-")) return <Square className="w-4 h-4 text-green-500" />
    if (elementType.startsWith("image-")) return <ImageIcon className="w-4 h-4 text-purple-500" />
    if (elementType.startsWith("menu-")) return <Globe className="w-4 h-4 text-orange-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  const getElementDisplayName = (element: NavigatorElement) => {
    if (element.is_template_element && element.template_element_id) {
      return `Template: ${element.template_element_id.replace(/_/g, " ")}`
    }
    if (element.content && element.content.length > 0) {
      return element.content.length > 30 ? `${element.content.substring(0, 30)}...` : element.content
    }
    return element.element_type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const handleVisibilityToggle = (elementId: string) => {
    const newVisibility = !elementVisibility[elementId]
    setElementVisibility((prev) => ({
      ...prev,
      [elementId]: newVisibility,
    }))
    onElementVisibilityToggle?.(elementId, newVisibility)
  }

  const handleElementClick = (elementId: string) => {
    if (selectedElement === elementId) {
      setShowCSSPreview(!showCSSPreview)
    } else {
      setSelectedElement(elementId)
      setShowCSSPreview(true)
      onElementSelect?.(elementId)
    }
  }

  const generateCSSPreview = (element: NavigatorElement) => {
    const styles: string[] = []

    // Basic display and positioning
    styles.push("/* Element Positioning */")
    styles.push("display: block;")
    styles.push(`position: absolute;`)
    styles.push(`left: ${element.x_position}px;`)
    styles.push(`top: ${element.y_position}px;`)
    styles.push(`width: ${element.width}px;`)
    styles.push(`height: ${element.height}px;`)

    // Typography
    if (element.font_size || element.font_weight || element.font_family || element.text_align) {
      styles.push("")
      styles.push("/* Typography */")
      if (element.font_family) styles.push(`font-family: ${element.font_family};`)
      if (element.font_size) styles.push(`font-size: ${element.font_size}px;`)
      if (element.font_weight) styles.push(`font-weight: ${element.font_weight};`)
      if (element.text_align) styles.push(`text-align: ${element.text_align};`)
      if (element.line_height) styles.push(`line-height: ${element.line_height};`)
      if (element.letter_spacing) styles.push(`letter-spacing: ${element.letter_spacing}px;`)
      if (element.text_decoration && element.text_decoration !== "none")
        styles.push(`text-decoration: ${element.text_decoration};`)
      if (element.text_transform && element.text_transform !== "none")
        styles.push(`text-transform: ${element.text_transform};`)
    }

    // Colors
    if (element.background_color || element.text_color) {
      styles.push("")
      styles.push("/* Colors */")
      if (element.background_color) styles.push(`background-color: ${element.background_color};`)
      if (element.text_color) styles.push(`color: ${element.text_color};`)
    }

    // Border
    if (element.border_width && element.border_width > 0) {
      styles.push("")
      styles.push("/* Border */")
      const borderStyle = element.border_style || "solid"
      const borderColor = element.border_color || "#000000"
      styles.push(`border: ${element.border_width}px ${borderStyle} ${borderColor};`)
      if (element.border_radius) styles.push(`border-radius: ${element.border_radius}px;`)
    }

    // Spacing
    if (
      element.padding_top ||
      element.padding_right ||
      element.padding_bottom ||
      element.padding_left ||
      element.margin_top ||
      element.margin_right ||
      element.margin_bottom ||
      element.margin_left
    ) {
      styles.push("")
      styles.push("/* Spacing */")
      if (element.padding_top || element.padding_right || element.padding_bottom || element.padding_left) {
        const pt = element.padding_top || 0
        const pr = element.padding_right || 0
        const pb = element.padding_bottom || 0
        const pl = element.padding_left || 0
        styles.push(`padding: ${pt}px ${pr}px ${pb}px ${pl}px;`)
      }
      if (element.margin_top || element.margin_right || element.margin_bottom || element.margin_left) {
        const mt = element.margin_top || 0
        const mr = element.margin_right || 0
        const mb = element.margin_bottom || 0
        const ml = element.margin_left || 0
        styles.push(`margin: ${mt}px ${mr}px ${mb}px ${ml}px;`)
      }
    }

    // Effects
    if (
      element.opacity !== undefined ||
      element.box_shadow_x ||
      element.box_shadow_y ||
      element.box_shadow_blur ||
      element.transform_rotate ||
      element.transform_scale_x !== 1 ||
      element.transform_scale_y !== 1
    ) {
      styles.push("")
      styles.push("/* Effects */")
      if (element.opacity !== undefined && element.opacity !== 1) {
        styles.push(`opacity: ${element.opacity};`)
      }
      if (element.box_shadow_x || element.box_shadow_y || element.box_shadow_blur) {
        const x = element.box_shadow_x || 0
        const y = element.box_shadow_y || 0
        const blur = element.box_shadow_blur || 0
        const spread = element.box_shadow_spread || 0
        const color = element.box_shadow_color || "rgba(0, 0, 0, 0.1)"
        styles.push(`box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`)
      }
      if (element.transform_rotate || element.transform_scale_x !== 1 || element.transform_scale_y !== 1) {
        const transforms = []
        if (element.transform_rotate) transforms.push(`rotate(${element.transform_rotate}deg)`)
        if (element.transform_scale_x !== 1 || element.transform_scale_y !== 1) {
          const scaleX = element.transform_scale_x || 1
          const scaleY = element.transform_scale_y || 1
          transforms.push(`scale(${scaleX}, ${scaleY})`)
        }
        if (transforms.length > 0) {
          styles.push(`transform: ${transforms.join(" ")};`)
        }
      }
    }

    return styles.join("\n")
  }

  // Filter elements by current page
  const pageElements = elements.filter((element) => {
    // For now, show all elements. In the future, you can filter by page
    return true
  })

  // Group elements by type for better organization
  const groupedElements = pageElements.reduce(
    (acc, element) => {
      const type = element.is_template_element ? "Templates" : element.element_type.split("-")[0]
      if (!acc[type]) acc[type] = []
      acc[type].push(element)
      return acc
    },
    {} as { [key: string]: NavigatorElement[] },
  )

  return (
    <div className="h-full flex flex-col">
      {/* Elements Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Global Root */}
        <div className="flex items-center p-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Globe className="w-4 h-4 mr-2 text-blue-500" />
          Global Root
        </div>

        {/* Body Container */}
        <div className="ml-4">
          <div className="flex items-center p-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4 mr-2 text-green-500" />
            Body ({currentPage})
            <Eye className="w-4 h-4 ml-auto text-gray-400" />
          </div>

          {/* Elements */}
          <div className="ml-4 space-y-1">
            {Object.entries(groupedElements).map(([groupName, groupElements]) => (
              <div key={groupName}>
                {groupElements.map((element) => (
                  <div key={element.id} className="space-y-1">
                    {/* Element Row */}
                    <div
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors group ${
                        selectedElement === element.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => handleElementClick(element.id)}
                    >
                      {getElementIcon(element.element_type)}
                      <span className="ml-2 text-sm flex-1 truncate">{getElementDisplayName(element)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVisibilityToggle(element.id)
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {elementVisibility[element.id] ? (
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {pageElements.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No elements on this page</p>
                <p className="text-xs mt-1">Add elements to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Preview for Selected Element */}
      {selectedElement && showCSSPreview && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">CSS Preview</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">/* Live Preview */</span>
                <button
                  onClick={() => setShowCSSPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded border p-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
                {(() => {
                  const element = pageElements.find((el) => el.id === selectedElement)
                  return element ? generateCSSPreview(element) : "Element not found"
                })()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
