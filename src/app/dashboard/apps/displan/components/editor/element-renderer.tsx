"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import type { EditableTemplateElement, TextEditingState } from "../../types/canvas-types"
import { generateElementStyles } from "../../utils/canvas-utils"
import { TemplateRenderer } from "../../templates/template-renderer"
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"
import type { JSX } from "react" // Import JSX to fix the undeclared variable error
import { getButtonComponent } from "../../shared/button-elements-panel"

interface ElementRendererProps {
  element: DisplanCanvasElement
  selectedElement: DisplanCanvasElement | null
  selectedElements: string[]
  draggedElement: string | null
  isPreviewMode: boolean
  previewDevice: "desktop" | "tablet" | "mobile"
  projectId: string
  textEditingState: TextEditingState
  editableElements: Map<string, EditableTemplateElement>
  onElementClick: (element: DisplanCanvasElement, e: React.MouseEvent) => void
  onElementMouseDown: (element: DisplanCanvasElement, e: React.MouseEvent) => void
  onResizeMouseDown: (
    elementId: string,
    handle: "left" | "right" | "top-left" | "top-right",
    e: React.MouseEvent,
  ) => void
  onTextChange: (elementId: string, newContent: string) => void
  onTextEditKeyDown: (e: React.KeyboardEvent, elementId: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
  setTextEditingState: (state: TextEditingState) => void
  setEditableElements: (
    fn: (prev: Map<string, EditableTemplateElement>) => Map<string, EditableTemplateElement>,
  ) => void
  selectedTemplateElement: string | null
  getStableElementId: (templateId: string, elementKey: string) => string
  onTemplateElementClick: (elementId: string, elementType: string, content: string, event: React.MouseEvent) => void
  onTemplateElementDoubleClick: (elementId: string, content: string, event: React.MouseEvent) => void
}

export function ElementRenderer({
  element,
  selectedElement,
  selectedElements,
  draggedElement,
  isPreviewMode,
  previewDevice,
  projectId,
  textEditingState,
  editableElements,
  onElementClick,
  onElementMouseDown,
  onResizeMouseDown,
  onTextChange,
  onTextEditKeyDown,
  editInputRef,
  setTextEditingState,
  setEditableElements,
  selectedTemplateElement,
  getStableElementId,
  onTemplateElementClick,
  onTemplateElementDoubleClick,
}: ElementRendererProps) {
  const router = useRouter()
  const elementRef = useRef<HTMLDivElement>(null)

  const isSelected = selectedElement?.id === element.id || selectedElements.includes(element.id)
  const isDraggedElement = draggedElement === element.id

  // 🔥🔥🔥 APPLY ALL PROPERTIES FROM DATABASE INCLUDING LAYOUT - REAL TIME
  useEffect(() => {
    if (!elementRef.current) return

    const styles = element.styles || {}
    console.log("🔥🔥🔥 APPLYING ELEMENT PROPERTIES REAL-TIME:", {
      elementId: element.id,
      styles,
    })

    const el = elementRef.current

    // Apply custom class IMMEDIATELY
    if (styles.customClass) {
      // Remove old custom classes first
      el.className = el.className
        .split(" ")
        .filter((cls) => !cls.startsWith("custom-"))
        .join(" ")
      el.classList.add(styles.customClass)
      console.log("✅✅✅ APPLIED CLASS REAL-TIME:", styles.customClass)
    }

    // Apply custom ID IMMEDIATELY
    if (styles.customId) {
      el.id = styles.customId
      console.log("✅✅✅ APPLIED ID REAL-TIME:", styles.customId)
    }

    // Apply custom styles IMMEDIATELY
    if (styles.customStyles) {
      const styleId = `element-styles-${element.id}`
      let styleElement = document.getElementById(styleId) as HTMLStyleElement
      if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }
      styleElement.textContent = styles.customStyles
      console.log("✅✅✅ APPLIED CUSTOM STYLES REAL-TIME:", styles.customStyles)
    }

    // 🔥🔥🔥 APPLY LAYOUT STYLES DIRECTLY TO ELEMENT - REAL TIME
    const layoutStyles: any = {}
    if (styles.display) {
      layoutStyles.display = styles.display
      console.log("✅✅✅ APPLIED DISPLAY REAL-TIME:", styles.display)
    }
    if (styles.justifyContent) {
      layoutStyles.justifyContent = styles.justifyContent
      console.log("✅✅✅ APPLIED JUSTIFY CONTENT REAL-TIME:", styles.justifyContent)
    }
    if (styles.alignItems) {
      layoutStyles.alignItems = styles.alignItems
      console.log("✅✅✅ APPLIED ALIGN ITEMS REAL-TIME:", styles.alignItems)
    }
    if (styles.flexDirection) {
      layoutStyles.flexDirection = styles.flexDirection
    }
    if (styles.flexWrap) {
      layoutStyles.flexWrap = styles.flexWrap
    }

    // Apply spacing IMMEDIATELY
    if (styles.marginTop !== undefined) {
      layoutStyles.marginTop = `${styles.marginTop}px`
      console.log("✅✅✅ APPLIED MARGIN TOP REAL-TIME:", styles.marginTop)
    }
    if (styles.marginRight !== undefined) {
      layoutStyles.marginRight = `${styles.marginRight}px`
    }
    if (styles.marginBottom !== undefined) {
      layoutStyles.marginBottom = `${styles.marginBottom}px`
    }
    if (styles.marginLeft !== undefined) {
      layoutStyles.marginLeft = `${styles.marginLeft}px`
    }
    if (styles.paddingTop !== undefined) {
      layoutStyles.paddingTop = `${styles.paddingTop}px`
      console.log("✅✅✅ APPLIED PADDING TOP REAL-TIME:", styles.paddingTop)
    }
    if (styles.paddingRight !== undefined) {
      layoutStyles.paddingRight = `${styles.paddingRight}px`
    }
    if (styles.paddingBottom !== undefined) {
      layoutStyles.paddingBottom = `${styles.paddingBottom}px`
    }
    if (styles.paddingLeft !== undefined) {
      layoutStyles.paddingLeft = `${styles.paddingLeft}px`
    }

    // Apply layout styles to element IMMEDIATELY
    Object.assign(el.style, layoutStyles)

    // Apply element name as data attribute
    if (styles.elementName) {
      el.setAttribute("data-element-name", styles.elementName)
    }

    // Cleanup function
    return () => {
      if (styles.customClass && el) {
        el.classList.remove(styles.customClass)
      }
    }
  }, [element.styles, element.id])

  // Handle menu templates
  if (element.element_type.startsWith("menu-")) {
    const templateId = element.element_type.replace("menu-", "")
    return (
      <div
        key={element.id}
        ref={elementRef}
        data-element={element.id}
        data-element-id={element.id}
        data-element-type={element.element_type}
        className={`w-full element-container ${isSelected ? "element-selected" : ""}`}
        style={{
          opacity: element.opacity,
          display: element.visible === false ? "none" : "block",
          zIndex: element.z_index,
        }}
        onClick={(e) => {
          if (!isPreviewMode) {
            onElementClick(element, e)
          }
        }}
        onMouseDown={(e) => onElementMouseDown(element, e)}
      >
        <TemplateRenderer
          templateId={templateId}
          selectedTemplateElement={selectedTemplateElement}
          selectedElements={selectedElements}
          textEditingState={textEditingState}
          editableElements={editableElements}
          isPreviewMode={isPreviewMode}
          getStableElementId={getStableElementId}
          onTemplateElementClick={onTemplateElementClick}
          onTemplateElementDoubleClick={onTemplateElementDoubleClick}
          onTextChange={onTextChange}
          onTextEditKeyDown={onTextEditKeyDown}
          editInputRef={editInputRef}
          projectId={projectId}
          pageSlug="main"
        />
      </div>
    )
  }

  // 🔥🔥🔥 GET ELEMENT TAG FROM PROPERTIES PANEL
  const getElementTag = () => {
    const styles = element.styles || {}
    if (styles.htmlTag) {
      console.log("✅✅✅ USING HTML TAG FROM PROPERTIES:", styles.htmlTag)
      return styles.htmlTag
    }
    if (element.element_type?.startsWith("text-h")) return element.element_type.replace("text-", "")
    if (element.element_type?.startsWith("text-")) return "p"
    return "div"
  }

  const ElementTag = getElementTag() as keyof JSX.IntrinsicElements

  // 🔥🔥🔥 GENERATE COMPLETE ELEMENT STYLES WITH LAYOUT SUPPORT
  const elementStyles = {
    ...generateElementStyles(element, isPreviewMode, previewDevice),
    // Override with properties panel styles
    backgroundColor: element.styles?.backgroundColor || element.background_color,
    color: element.styles?.textColor || element.text_color,
    fontSize: element.styles?.fontSize
      ? `${element.styles.fontSize}px`
      : element.font_size
        ? `${element.font_size}px`
        : undefined,
    fontWeight: element.styles?.fontWeight || element.font_weight,
    fontFamily: element.styles?.fontFamily || element.font_family,
    textAlign: element.styles?.textAlign || element.text_align,
    borderRadius: element.styles?.borderRadius
      ? `${element.styles.borderRadius}px`
      : element.border_radius
        ? `${element.border_radius}px`
        : undefined,
    borderWidth: element.styles?.borderWidth
      ? `${element.styles.borderWidth}px`
      : element.border_width
        ? `${element.border_width}px`
        : undefined,
    borderColor: element.styles?.borderColor || element.border_color,
    opacity: element.styles?.opacity || element.opacity,
    // 🔥🔥🔥 ADD LAYOUT STYLES
    display: element.styles?.display || undefined,
    justifyContent: element.styles?.justifyContent || undefined,
    alignItems: element.styles?.alignItems || undefined,
    flexDirection: element.styles?.flexDirection || undefined,
    flexWrap: element.styles?.flexWrap || undefined,
    // 🔥🔥🔥 ADD SPACING STYLES
    marginTop: element.styles?.marginTop !== undefined ? `${element.styles.marginTop}px` : undefined,
    marginRight: element.styles?.marginRight !== undefined ? `${element.styles.marginRight}px` : undefined,
    marginBottom: element.styles?.marginBottom !== undefined ? `${element.styles.marginBottom}px` : undefined,
    marginLeft: element.styles?.marginLeft !== undefined ? `${element.styles.marginLeft}px` : undefined,
    paddingTop: element.styles?.paddingTop !== undefined ? `${element.styles.paddingTop}px` : undefined,
    paddingRight: element.styles?.paddingRight !== undefined ? `${element.styles.paddingRight}px` : undefined,
    paddingBottom: element.styles?.paddingBottom !== undefined ? `${element.styles.paddingBottom}px` : undefined,
    paddingLeft: element.styles?.paddingLeft !== undefined ? `${element.styles.paddingLeft}px` : undefined,
  }

  const baseClasses = isPreviewMode
    ? `absolute element-container`
    : `absolute element-container cursor-pointer ${isSelected ? "element-selected" : ""} ${isDraggedElement ? "z-50" : ""}`

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) {
      // Handle links from properties panel
      const linkUrl = element.styles?.linkUrl || element.link_url
      const linkPage = element.styles?.linkPage || element.link_page
      const linkTarget = element.styles?.linkTarget || "_self"

      if (linkUrl) {
        if (linkTarget === "_blank") {
          window.open(linkUrl, "_blank")
        } else {
          window.location.href = linkUrl
        }
      } else if (linkPage) {
        const newUrl = `/dashboard/apps/displan/editor/${projectId}?page=${linkPage}`
        router.push(newUrl)
      }
    } else {
      onElementClick(element, e)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPreviewMode || !element.element_type.startsWith("text-")) return

    e.stopPropagation()
    setTextEditingState({
      elementId: element.id,
      isActive: true,
      shouldFocus: true,
    })

    setEditableElements((prev) => {
      const newMap = new Map(prev)
      newMap.set(element.id, {
        id: element.id,
        content: element.content || "",
        isEditing: true,
        originalContent: element.content || "",
      })
      return newMap
    })
  }

  // 🔥🔥🔥 RENDER CONTENT BASED ON ELEMENT TYPE
  const content = (() => {
    if (
      textEditingState.isActive &&
      textEditingState.elementId === element.id &&
      element.element_type.startsWith("text-")
    ) {
      const editableElement = editableElements.get(element.id)
      return (
        <input
          ref={editInputRef}
          type="text"
          value={editableElement?.content || element.content}
          onChange={(e) => onTextChange(element.id, e.target.value)}
          onKeyDown={(e) => onTextEditKeyDown(e, element.id)}
          className="edit-input w-full bg-transparent border-none outline-none"
          style={{
            fontSize: "inherit",
            fontWeight: "inherit",
            fontFamily: "inherit",
            color: "inherit",
            textAlign: "inherit",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={(e) => e.target.select()}
        />
      )
    }

    if (element.element_type.startsWith("text-")) {
      return (
        <ElementTag className={`displan-${element.element_type} select-none element-content`}>
          {element.content || "Text Element"}
        </ElementTag>
      )
    }

    // 🔥🔥🔥 ENHANCED BUTTON RENDERING WITH EXACT SAME COMPONENTS
    if (element.element_type.startsWith("button-")) {
      const buttonStyle = element.element_type.replace("button-", "")

      return (
        <div className="w-full h-full flex items-center justify-center select-none element-content">
          {getButtonComponent(buttonStyle, element.content, isPreviewMode)}
        </div>
      )
    }

    if (element.element_type.startsWith("image-")) {
      return (
        <img
          src={element.src || "/placeholder.png"}
          alt="Element"
          className="w-full h-full object-cover select-none element-content"
        />
      )
    }

    if (element.element_type.startsWith("container-")) {
      return (
        <div className={`displan-${element.element_type} w-full h-full element-content`}>
          {element.content && <div className="p-4">{element.content}</div>}
        </div>
      )
    }

    return <div className="element-content">{element.content || "Element"}</div>
  })()

  return (
    <div
      key={element.id}
      ref={elementRef}
      data-element={element.id}
      data-element-id={element.id}
      data-element-type={element.element_type}
      className={baseClasses}
      style={elementStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => onElementMouseDown(element, e)}
    >
      {content}
      {/* 🔥🔥🔥 RESIZE HANDLES FOR SELECTED ELEMENTS */}
      {!isPreviewMode && isSelected && (
        <>
          <div
            className="resize-handle left"
            onMouseDown={(e) => onResizeMouseDown(element.id, "left", e)}
            style={{
              position: "absolute",
              left: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#007bff",
              cursor: "ew-resize",
              zIndex: 1000,
            }}
          />
          <div
            className="resize-handle right"
            onMouseDown={(e) => onResizeMouseDown(element.id, "right", e)}
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#007bff",
              cursor: "ew-resize",
              zIndex: 1000,
            }}
          />
          <div
            className="resize-handle top-left"
            onMouseDown={(e) => onResizeMouseDown(element.id, "top-left", e)}
            style={{
              position: "absolute",
              top: -4,
              left: -4,
              width: 8,
              height: 8,
              backgroundColor: "#007bff",
              cursor: "nw-resize",
              zIndex: 1000,
            }}
          />
          <div
            className="resize-handle top-right"
            onMouseDown={(e) => onResizeMouseDown(element.id, "top-right", e)}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: "#007bff",
              cursor: "ne-resize",
              zIndex: 1000,
            }}
          />
        </>
      )}
    </div>
  )
}
