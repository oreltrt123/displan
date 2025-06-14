"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import type { EditableTemplateElement, TextEditingState } from "../../types/canvas-types"
import { generateElementStyles } from "../../utils/canvas-utils"
import { TemplateRenderer } from "../../templates/template-renderer"
import { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"

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
  // Template renderer props
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
  const isSelected = selectedElement?.id === element.id || selectedElements.includes(element.id)
  const isDraggedElement = draggedElement === element.id
  const elementStyles = generateElementStyles(element, isPreviewMode, previewDevice)

  // Handle menu templates
  if (element.element_type.startsWith("menu-")) {
    const templateId = element.element_type.replace("menu-", "")
    return (
      <div
        key={element.id}
        data-element={element.id}
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
          pageSlug="main" // You might want to get this from props or context
        />
      </div>
    )
  }

  const baseClasses = isPreviewMode
    ? `absolute element-container`
    : `absolute element-container cursor-pointer ${isSelected ? "element-selected" : ""} ${isDraggedElement ? "z-50" : ""}`

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) {
      if (element.link_url) {
        window.open(element.link_url, "_blank")
      } else if (element.link_page) {
        const newUrl = `/dashboard/apps/displan/editor/${projectId}?page=${element.link_page}`
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
          className="edit-input"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={(e) => e.target.select()}
        />
      )
    }

    if (element.element_type.startsWith("text-")) {
      return <div className={`displan-${element.element_type} select-none`}>{element.content}</div>
    }

    if (element.element_type.startsWith("button-")) {
      return (
        <button
          className={`displan-${element.element_type} select-none ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {element.content}
        </button>
      )
    }

    if (element.element_type.startsWith("image-")) {
      return (
        <img src={element.src || "/placeholder.png"} alt="Element" className="w-full h-full object-cover select-none" />
      )
    }

    if (element.element_type.startsWith("container-")) {
      return (
        <div className={`displan-${element.element_type} w-full h-full`}>
          {element.content && <div className="p-4">{element.content}</div>}
        </div>
      )
    }

    return null
  })()

  return (
    <div
      key={element.id}
      data-element={element.id}
      className={baseClasses}
      style={elementStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => onElementMouseDown(element, e)}
    >
      {content}
      {!isPreviewMode && isSelected && (
        <>
          <div className="resize-handle left" onMouseDown={(e) => onResizeMouseDown(element.id, "left", e)} />
          <div className="resize-handle right" onMouseDown={(e) => onResizeMouseDown(element.id, "right", e)} />
          <div className="resize-handle top-left" onMouseDown={(e) => onResizeMouseDown(element.id, "top-left", e)} />
          <div className="resize-handle top-right" onMouseDown={(e) => onResizeMouseDown(element.id, "top-right", e)} />
        </>
      )}
    </div>
  )
}
