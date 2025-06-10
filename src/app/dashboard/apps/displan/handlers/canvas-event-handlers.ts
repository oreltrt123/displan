"use client"

import type React from "react"
import { useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Tool, CanvasBackground, EditableTemplateElement } from "../types/canvas-types"
import { DisplanCanvasElement } from '../lib/types/displan-canvas-types'

interface EventHandlersProps {
  currentTool: Tool
  isPreviewMode: boolean
  projectId: string
  showCommentInput: boolean
  textEditingState: any
  isResizing: string | null
  canvasRef: React.RefObject<HTMLDivElement>
  localElements: DisplanCanvasElement[]
  onSelectElement: (element: DisplanCanvasElement | null) => void
  onCreateComment: (x: number, y: number, message: string) => void
  onMoveElement: (elementId: string, x: number, y: number) => void
  onUpdateElement: (elementId: string, properties: any) => void
  onUpdateTemplateElement?: (elementId: string, elementType: string, properties: any) => void
  onDeleteAllElements?: () => void
  onBackgroundSave?: (background: CanvasBackground, pageId: string) => void
  // State setters
  setSelectedTemplateElement: (id: string | null) => void
  setSelectedElements: (elements: string[]) => void
  setSelectionBox: (box: any) => void
  setContextMenu: (menu: any) => void
  setCommentPosition: (pos: { x: number; y: number }) => void
  setShowCommentInput: (show: boolean) => void
  setIsDragging: (dragging: boolean) => void
  setDragStart: (start: { x: number; y: number }) => void
  setDraggedElement: (id: string | null) => void
  setDragOffset: (offset: { x: number; y: number }) => void
  setIsResizing: (id: string | null) => void
  setResizeHandle: (handle: any) => void
  setResizeStartData: (data: any) => void
  setIsSelecting: (selecting: boolean) => void
  setLocalElements: (
    elements: DisplanCanvasElement[] | ((prev: DisplanCanvasElement[]) => DisplanCanvasElement[]),
  ) => void
  setTextEditingState: (state: any) => void
  setEditableElements: (elements: any) => void
  setShowBackgroundModal: (show: boolean) => void
  setCanvasBackground: (bg: CanvasBackground) => void
  setCanvasPosition: (pos: { x: number; y: number }) => void
  setCommentMessage: (message: string) => void
  setNewCommentId: (id: string) => void
  // Other state
  canvasPosition: { x: number; y: number }
  dragStart: { x: number; y: number }
  draggedElement: string | null
  dragOffset: { x: number; y: number }
  resizeStartData: any
  resizeHandle: any
  selectionBox: any
  isSelecting: boolean
  editableElements: Map<string, any>
  currentPageId: string
  commentMessage: string
  commentPosition: { x: number; y: number }
  isDragging: boolean
}

export function useCanvasEventHandlers(props: EventHandlersProps) {
  const router = useRouter()

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('[data-canvas="true"]') &&
        !target.closest('[data-element="true"]') &&
        !target.closest('[data-template-element="true"]') &&
        !target.closest(".edit-input") &&
        !target.closest(".context-menu") &&
        !target.closest(".template-draggable-element")
      ) {
        props.onSelectElement(null)
        props.setSelectedTemplateElement(null)
        props.setSelectedElements([])
        props.setSelectionBox(null)
        props.setContextMenu({ x: 0, y: 0, visible: false })
      }
    },
    [
      props.onSelectElement,
      props.setSelectedTemplateElement,
      props.setSelectedElements,
      props.setSelectionBox,
      props.setContextMenu,
    ],
  )

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (props.showCommentInput || props.textEditingState.isActive || props.isResizing) return

      // Handle right-click for context menu
      if (e.button === 2) {
        e.preventDefault()
        e.stopPropagation()

        const canvasElement = e.currentTarget.querySelector('[data-canvas="true"]') as HTMLElement
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const canvasRect = e.currentTarget.getBoundingClientRect()

          const x = e.clientX - canvasRect.left
          const y = e.clientY - canvasRect.top

          const menuWidth = 200
          const menuHeight = 100
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          let finalX = x
          let finalY = y

          if (x + menuWidth > viewportWidth) {
            finalX = x - menuWidth
          }
          if (y + menuHeight > viewportHeight) {
            finalY = y - menuHeight
          }

          finalX = Math.max(10, finalX)
          finalY = Math.max(10, finalY)

          props.setContextMenu({ x: finalX, y: finalY, visible: true })
        }
        return
      }

      if (props.currentTool === "hand") {
        props.setIsDragging(true)
        props.setDragStart({
          x: e.clientX - props.canvasPosition.x,
          y: e.clientY - props.canvasPosition.y,
        })
      } else if (props.currentTool === "comment") {
        const canvasElement = e.currentTarget.querySelector('[data-canvas="true"]') as HTMLElement
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          props.setCommentPosition({ x, y })
          props.setShowCommentInput(true)
        }
      } else if (props.currentTool === "cursor" && e.button === 0) {
        const canvasElement = props.canvasRef.current?.querySelector('[data-canvas="true"]') as HTMLElement
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          props.setSelectionBox({ startX: x, startY: y, endX: x, endY: y })
          props.setIsSelecting(true)
        }
      }
    },
    [
      props.currentTool,
      props.canvasPosition,
      props.showCommentInput,
      props.textEditingState.isActive,
      props.isResizing,
      props.setIsDragging,
      props.setDragStart,
      props.setCommentPosition,
      props.setShowCommentInput,
      props.setSelectionBox,
      props.setIsSelecting,
      props.setContextMenu,
    ],
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (props.currentTool === "hand" && props.isDragging) {
        const newX = e.clientX - props.dragStart.x
        const newY = e.clientY - props.dragStart.y
        props.setCanvasPosition({ x: newX, y: newY })
      }
    },
    [props.currentTool, props.isDragging, props.dragStart, props.setCanvasPosition],
  )

  const handleCanvasMouseUp = useCallback(() => {
    if (props.currentTool === "hand" && props.isDragging) {
      props.setIsDragging(false)
    }
  }, [props.currentTool, props.isDragging, props.setIsDragging])

  const handleCanvasMouseLeave = useCallback(() => {
    if (props.currentTool === "hand" && props.isDragging) {
      props.setIsDragging(false)
    }
  }, [props.currentTool, props.isDragging, props.setIsDragging])

  const handleElementClick = useCallback(
    (element: DisplanCanvasElement, e: React.MouseEvent) => {
      e.stopPropagation()

      if (props.isPreviewMode && element.element_type.startsWith("button-")) {
        if (element.link_url) {
          window.open(element.link_url, "_blank")
        } else if (element.link_page) {
          router.push(`/dashboard/apps/displan/editor/${props.projectId}?page=${element.link_page}`)
        }
        return
      }

      if (props.currentTool === "cursor" && !props.isPreviewMode) {
        props.onSelectElement(element)
        props.setSelectedTemplateElement(null)
        props.setSelectedElements([element.id])

        if (props.textEditingState.isActive && props.textEditingState.elementId !== element.id) {
          handleTextEditSubmit(props.textEditingState.elementId!)
        }
      }
    },
    [props.currentTool, props.isPreviewMode, props.onSelectElement, props.projectId, router, props.textEditingState],
  )

  const handleTextEditSubmit = useCallback(
    (elementId: string) => {
      const editableElement = props.editableElements.get(elementId)
      if (editableElement) {
        const newContent = editableElement.content.trim() || editableElement.originalContent

        // Check if this is a template element
        if (elementId.includes("_")) {
          // This is a template element - use template update function
          const elementType = editableElement.elementType || "text"
          if (props.onUpdateTemplateElement) {
            props.onUpdateTemplateElement(elementId, elementType, { content: newContent })
          }
        } else {
          // Regular element
          props.onUpdateElement(elementId, { content: newContent })
        }
      }

      props.setTextEditingState({
        elementId: null,
        isActive: false,
        shouldFocus: false,
      })

      props.setEditableElements((prev: Map<string, any>) => {
        const newMap = new Map(prev)
        newMap.delete(elementId)
        return newMap
      })
    },
    [
      props.editableElements,
      props.onUpdateElement,
      props.onUpdateTemplateElement,
      props.setTextEditingState,
      props.setEditableElements,
    ],
  )

  const handleContextMenuClick = useCallback(
    (action: string, e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      props.setContextMenu({ x: 0, y: 0, visible: false })

      if (action === "background") {
        props.setShowBackgroundModal(true)
      } else if (action === "deleteAll") {
        if (props.onDeleteAllElements) {
          props.onDeleteAllElements()
        }
        props.setSelectedElements([])
        props.onSelectElement(null)
      }
    },
    [
      props.onDeleteAllElements,
      props.onSelectElement,
      props.setContextMenu,
      props.setShowBackgroundModal,
      props.setSelectedElements,
    ],
  )

  const handleBackgroundChange = useCallback(
    (background: string, type: "color" | "gradient" | "image" | "video" | "gif") => {
      console.log("Background changed:", { type, background, pageId: props.currentPageId })

      const newBackground: CanvasBackground = { type, value: background }
      props.setCanvasBackground(newBackground)

      if (props.onBackgroundSave) {
        props.onBackgroundSave(newBackground, props.currentPageId)
      }
    },
    [props.currentPageId, props.onBackgroundSave, props.setCanvasBackground],
  )

  // Template element handlers
  const handleTemplateElementClick = useCallback(
    (elementId: string, elementType: string, content: string, event: React.MouseEvent) => {
      event.stopPropagation()

      if (props.isPreviewMode) return

      console.log("Template element clicked:", { elementId, elementType, content })

      props.setSelectedTemplateElement(elementId)
      props.setSelectedElements([elementId])
      props.onSelectElement(null)

      // If we're currently editing another element, submit it first
      if (props.textEditingState.isActive && props.textEditingState.elementId !== elementId) {
        handleTextEditSubmit(props.textEditingState.elementId!)
      }
    },
    [
      props.isPreviewMode,
      props.setSelectedTemplateElement,
      props.setSelectedElements,
      props.onSelectElement,
      props.textEditingState,
      handleTextEditSubmit,
    ],
  )

  const handleTemplateElementDoubleClick = useCallback(
    (elementId: string, content: string, event: React.MouseEvent) => {
      event.stopPropagation()

      if (props.isPreviewMode) return

      console.log("Template element double-clicked for editing:", { elementId, content })

      // Start editing
      props.setTextEditingState({
        elementId: elementId,
        isActive: true,
        shouldFocus: true,
      })

      props.setEditableElements((prev: Map<string, EditableTemplateElement>) => {
        const newMap = new Map(prev)
        newMap.set(elementId, {
          id: elementId,
          content: content,
          isEditing: true,
          originalContent: content,
          elementType: "text", // We'll determine this from the elementId
        })
        return newMap
      })
    },
    [props.isPreviewMode, props.setTextEditingState, props.setEditableElements],
  )

  const handleTextChange = useCallback(
    (elementId: string, newContent: string) => {
      console.log("Text changed:", { elementId, newContent })

      props.setEditableElements((prev: Map<string, EditableTemplateElement>) => {
        const newMap = new Map(prev)
        const existing = newMap.get(elementId)
        if (existing) {
          newMap.set(elementId, {
            ...existing,
            content: newContent,
          })
        }
        return newMap
      })
    },
    [props.setEditableElements],
  )

  const handleTextEditKeyDown = useCallback(
    (e: React.KeyboardEvent, elementId: string) => {
      if (e.key === "Enter") {
        e.preventDefault()
        console.log("Enter pressed, submitting text edit for:", elementId)
        handleTextEditSubmit(elementId)
      } else if (e.key === "Escape") {
        e.preventDefault()
        console.log("Escape pressed, canceling text edit for:", elementId)
        // Cancel editing - restore original content
        props.setTextEditingState({
          elementId: null,
          isActive: false,
          shouldFocus: false,
        })
        props.setEditableElements((prev: Map<string, EditableTemplateElement>) => {
          const newMap = new Map(prev)
          newMap.delete(elementId)
          return newMap
        })
      }
    },
    [handleTextEditSubmit, props.setTextEditingState, props.setEditableElements],
  )

  // Comment handlers
  const handleCommentInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setCommentMessage(e.target.value)
    },
    [props.setCommentMessage],
  )

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmitComment()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCloseComment()
    }
  }, [])

  const handleSubmitComment = useCallback(() => {
    if (props.commentMessage && props.commentMessage.trim() && props.commentPosition) {
      const commentId = `comment-${Date.now()}`
      const x = props.commentPosition.x || 0
      const y = props.commentPosition.y || 0
      props.onCreateComment(x, y, props.commentMessage.trim())
      props.setNewCommentId(commentId)
      props.setCommentMessage("")
      props.setShowCommentInput(false)
    }
  }, [
    props.commentMessage,
    props.commentPosition,
    props.onCreateComment,
    props.setNewCommentId,
    props.setCommentMessage,
    props.setShowCommentInput,
  ])

  const handleCloseComment = useCallback(() => {
    props.setCommentMessage("")
    props.setShowCommentInput(false)
  }, [props.setCommentMessage, props.setShowCommentInput])

  return {
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
    handleElementClick,
    handleTextEditSubmit,
    handleContextMenuClick,
    handleBackgroundChange,
    handleTemplateElementClick,
    handleTemplateElementDoubleClick,
    handleTextChange,
    handleTextEditKeyDown,
    handleCommentInputClick,
    handleInputChange,
    handleInputKeyDown,
    handleSubmitComment,
    handleCloseComment,
  }
}
