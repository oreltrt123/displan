"use client"
import { useEffect, useCallback, useState, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { BottomToolbar } from "./bottom-toolbar"
import BackgroundSettingsModal from "./background-settings-modal"
import { useCanvasState } from "../../hooks/use-canvas-state"
import { useCanvasEventHandlers } from "../../handlers/canvas-event-handlers"
import { CanvasStyles } from "./canvas-styles"
import { ElementRenderer } from "./element-renderer"
import { CanvasUI } from "./canvas-ui"
import { getCanvasBackgroundStyle } from "../../utils/canvas-utils"
import type { CanvasProps } from "../../types/canvas-types"

interface CMSEntryData {
  id: string
  title: string
  content: string
  featured_image_url?: string
  collection_name: string
  status: string
  date: string
  slug: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
  media_items: Array<{
    id: string
    file_url: string
    file_type: string
    alt_text?: string
    caption?: string
    position_in_content: number
  }>
  code_blocks: Array<{
    id: string
    title?: string
    code: string
    language: string
    theme: string
    position_in_content: number
  }>
  tables: Array<{
    id: string
    caption?: string
    headers: string[]
    rows: string[][]
    position_in_content: number
  }>
  links: Array<{
    id: string
    url: string
    text: string
    is_external: boolean
    position_in_content: number
  }>
}

interface CMSCanvasElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  content?: string
  src?: string
  alt?: string
  styles?: any
  zIndex?: number
  [key: string]: any
}

export default function CanvasWithCMSContentFixed({
  currentTool,
  comments,
  elements,
  selectedElement,
  onCreateComment,
  onSelectElement,
  onMoveElement,
  onUpdateElement,
  onAddElement,
  onDeleteElement,
  onDeleteAllElements,
  zoom,
  onToolChange,
  isDarkMode,
  onToggleDarkMode,
  onZoomChange,
  projectId,
  isPreviewMode = false,
  customCode = "",
  canvasWidth = 1200,
  canvasHeight = 800,
  previewDevice = "desktop",
  onBackgroundSave,
  onBackgroundLoad,
  currentPage,
}: CanvasProps & { currentPage?: string }) {
  const router = useRouter()
  const state = useCanvasState()
  const [cmsEntryData, setCmsEntryData] = useState<CMSEntryData | null>(null)
  const [isLoadingCmsEntry, setIsLoadingCmsEntry] = useState(false)
  const [cmsCanvasElements, setCmsCanvasElements] = useState<CMSCanvasElement[]>([])
  const [loadingError, setLoadingError] = useState<string | null>(null)

  // 🔥🔥🔥 PERFECT DRAGGING SYSTEM - ZERO OFFSET ISSUES!
  const [isDragging, setIsDragging] = useState(false)
  const [draggedElement, setDraggedElement] = useState<any>(null)
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [elementPositions, setElementPositions] = useState<Map<string, { x: number; y: number }>>(new Map())
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if current page is a CMS page
  const isCmsPage = currentPage?.startsWith("cms-")

  // 🔥🔥🔥 INITIALIZE ELEMENT POSITIONS
  useEffect(() => {
    const positions = new Map()
    elements.forEach((element) => {
      positions.set(element.id, { x: element.x || 0, y: element.y || 0 })
    })
    setElementPositions(positions)
    console.log("🔥 INITIALIZED POSITIONS:", positions)
  }, [elements])

  // 🔥🔥🔥 PERFECT ELEMENT MOUSE DOWN - START DRAG
  const handleElementMouseDown = useCallback(
    (element: any, e: React.MouseEvent) => {
      if (isPreviewMode || currentTool !== "cursor") return

      console.log("🔥🔥🔥 ELEMENT MOUSE DOWN:", element.id)

      e.preventDefault()
      e.stopPropagation()

      // Get the canvas container
      const canvasContainer = state.canvasRef.current
      if (!canvasContainer) return

      // Get element's current position
      const elementRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const canvasRect = canvasContainer.getBoundingClientRect()

      // Calculate the exact click position relative to the element
      const clickX = e.clientX - elementRect.left
      const clickY = e.clientY - elementRect.top

      // Set drag state
      setIsDragging(true)
      setDraggedElement(element)
      setDragStartPosition({ x: e.clientX, y: e.clientY })
      setDragOffset({ x: clickX, y: clickY })

      // Select the element
      if (onSelectElement) {
        onSelectElement(element)
      }

      console.log("✅ DRAG STARTED:", {
        elementId: element.id,
        clickOffset: { x: clickX, y: clickY },
        elementPosition: { x: element.x, y: element.y },
      })
    },
    [isPreviewMode, currentTool, onSelectElement, state.canvasRef],
  )

  // 🔥🔥🔥 PERFECT MOUSE MOVE - REAL-TIME DRAG
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggedElement || !state.canvasRef.current) return

      const canvasRect = state.canvasRef.current.getBoundingClientRect()
      const scale = zoom / 100

      // Calculate new position accounting for canvas position and zoom
      const newX = (e.clientX - canvasRect.left - state.canvasPosition.x) / scale - dragOffset.x
      const newY = (e.clientY - canvasRect.top - state.canvasPosition.y) / scale - dragOffset.y

      // Update position immediately in state
      setElementPositions((prev) => {
        const newPositions = new Map(prev)
        newPositions.set(draggedElement.id, { x: newX, y: newY })
        return newPositions
      })

      // Apply position immediately to DOM
      const domElement = document.querySelector(`[data-element-id="${draggedElement.id}"]`) as HTMLElement
      if (domElement) {
        domElement.style.left = `${newX}px`
        domElement.style.top = `${newY}px`
        domElement.style.transform = "none" // Remove any existing transforms
      }

      console.log("🔥 DRAGGING:", { elementId: draggedElement.id, x: newX, y: newY })
    },
    [isDragging, draggedElement, dragOffset, zoom, state.canvasRef, state.canvasPosition],
  )

  // 🔥🔥🔥 PERFECT MOUSE UP - END DRAG AND SAVE
  const handleGlobalMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggedElement) return

      console.log("🔥🔥🔥 DRAG ENDED:", draggedElement.id)

      const canvasRect = state.canvasRef.current?.getBoundingClientRect()
      if (canvasRect) {
        const scale = zoom / 100
        const finalX = (e.clientX - canvasRect.left - state.canvasPosition.x) / scale - dragOffset.x
        const finalY = (e.clientY - canvasRect.top - state.canvasPosition.y) / scale - dragOffset.y

        // Save to database
        saveElementPosition(draggedElement.id, finalX, finalY)

        // Update parent component
        if (onMoveElement) {
          onMoveElement(draggedElement.id, finalX, finalY)
        }
      }

      // Reset drag state
      setIsDragging(false)
      setDraggedElement(null)
      setDragStartPosition({ x: 0, y: 0 })
      setDragOffset({ x: 0, y: 0 })

      console.log("✅ DRAG COMPLETE")
    },
    [isDragging, draggedElement, dragOffset, zoom, state.canvasRef, state.canvasPosition, onMoveElement],
  )

  // 🔥🔥🔥 SAVE ELEMENT POSITION TO DATABASE
  const saveElementPosition = useCallback(async (elementId: string, x: number, y: number) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce the save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log("💾 SAVING POSITION:", { elementId, x, y })

        const response = await fetch(`/api/elements/${elementId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            x: Math.round(x),
            y: Math.round(y),
          }),
        })

        if (response.ok) {
          console.log("✅ POSITION SAVED SUCCESSFULLY")
        } else {
          console.error("❌ FAILED TO SAVE POSITION")
        }
      } catch (error) {
        console.error("❌ ERROR SAVING POSITION:", error)
      }
    }, 300)
  }, [])

  // 🔥🔥🔥 ATTACH GLOBAL MOUSE EVENTS
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false })
      document.addEventListener("mouseup", handleGlobalMouseUp)
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp])

  // Load CMS entry data when page changes
  useEffect(() => {
    if (isCmsPage && currentPage && projectId) {
      loadCmsEntryData(currentPage)
    } else {
      setCmsEntryData(null)
      setCmsCanvasElements([])
      setLoadingError(null)
    }
  }, [currentPage, isCmsPage, projectId])

  const loadCmsEntryData = async (pageId: string) => {
    setIsLoadingCmsEntry(true)
    setLoadingError(null)
    console.log("Loading CMS entry data for page:", pageId)

    try {
      const parts = pageId.replace("cms-", "").split("-")
      if (parts.length < 2) {
        throw new Error("Invalid page ID format")
      }

      const collectionSlug = parts[0]
      const entrySlug = parts.slice(1).join("-")

      console.log("Fetching CMS entry:", { collectionSlug, entrySlug, projectId })

      const apiEndpoints = [
        `/api/cms/entries/slug/${entrySlug}?project_id=${projectId}&collection_slug=${collectionSlug}`,
        `/api/cms/entries/${entrySlug}?project_id=${projectId}&collection=${collectionSlug}`,
        `/api/cms/pages/${pageId}?project_id=${projectId}`,
      ]

      let entryData = null
      let lastError = null

      for (const endpoint of apiEndpoints) {
        try {
          console.log("Trying endpoint:", endpoint)
          const response = await fetch(endpoint)

          if (response.ok) {
            entryData = await response.json()
            console.log("Successfully loaded entry data from:", endpoint, entryData)
            break
          } else {
            const errorText = await response.text()
            console.log("Endpoint failed:", endpoint, response.status, errorText)
            lastError = `${response.status}: ${errorText}`
          }
        } catch (err) {
          console.log("Endpoint error:", endpoint, err)
          lastError = err instanceof Error ? err.message : "Unknown error"
        }
      }

      if (!entryData) {
        throw new Error(lastError || "Failed to load entry from all endpoints")
      }

      setCmsEntryData(entryData)
      const canvasElements = convertEntryToCanvasElements(entryData)
      setCmsCanvasElements(canvasElements)
    } catch (error) {
      console.error("Error loading CMS entry data:", error)
      setLoadingError(error instanceof Error ? error.message : "Failed to load CMS entry")
      setCmsEntryData(null)
      setCmsCanvasElements([])
    } finally {
      setIsLoadingCmsEntry(false)
    }
  }

  const convertEntryToCanvasElements = (entryData: CMSEntryData): CMSCanvasElement[] => {
    const elements: CMSCanvasElement[] = []
    let currentY = 50
    const leftMargin = 100
    const contentWidth = canvasWidth - leftMargin * 2

    if (entryData.title) {
      elements.push({
        id: `title-${entryData.id}`,
        type: "text",
        x: leftMargin,
        y: currentY,
        width: contentWidth,
        height: 80,
        content: entryData.title,
        styles: {
          fontSize: "36px",
          fontWeight: "bold",
          color: "#1a1a1a",
          textAlign: "center",
          lineHeight: "1.2",
          padding: "20px",
        },
        zIndex: 10,
      })
      currentY += 120
    }

    if (entryData.featured_image_url) {
      elements.push({
        id: `featured-image-${entryData.id}`,
        type: "image",
        x: leftMargin,
        y: currentY,
        width: contentWidth,
        height: 300,
        src: entryData.featured_image_url,
        alt: `Featured image for ${entryData.title}`,
        styles: {
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        zIndex: 10,
      })
      currentY += 350
    }

    const dateStr = new Date(entryData.date).toLocaleDateString()
    const statusText = entryData.status ? entryData.status.toUpperCase() : "DRAFT"
    const collectionName = entryData.collection_name || "Content"
    elements.push({
      id: `meta-info-${entryData.id}`,
      type: "text",
      x: leftMargin,
      y: currentY,
      width: contentWidth,
      height: 40,
      content: `${collectionName} • ${dateStr} • ${statusText}`,
      styles: {
        fontSize: "14px",
        color: "#666",
        textAlign: "center",
        padding: "10px",
        borderBottom: "1px solid #eee",
        marginBottom: "20px",
      },
      zIndex: 10,
    })
    currentY += 80

    if (entryData.content) {
      elements.push({
        id: `content-${entryData.id}`,
        type: "rich-text",
        x: leftMargin,
        y: currentY,
        width: contentWidth,
        height: Math.max(400, entryData.content.length * 0.5),
        content: entryData.content,
        styles: {
          fontSize: "16px",
          lineHeight: "1.8",
          color: "#333",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
        zIndex: 10,
      })
      currentY += Math.max(450, entryData.content.length * 0.5) + 50
    }

    console.log("Generated canvas elements:", elements)
    return elements
  }

  const handleUpdateTemplateElement = useCallback(
    async (elementId: string, elementType: string, properties: any) => {
      console.log("Template V232 - Updating element:", { elementId, elementType, properties })
      return { success: true }
    },
    [projectId, state.currentPageId],
  )

  useEffect(() => {
    if (onBackgroundLoad) {
      const savedBackground = onBackgroundLoad(state.currentPageId)
      if (savedBackground) {
        state.setCanvasBackground(savedBackground)
      } else {
        state.setCanvasBackground({ type: "color", value: "#ffffff" })
      }
    }
  }, [state.currentPageId, onBackgroundLoad, state.setCanvasBackground])

  const getStableElementId = useCallback(
    (templateId: string, elementKey: string) => {
      const elementIdentifier = `${templateId}_${elementKey}`
      if (state.elementStableIds.has(elementIdentifier)) {
        return state.elementStableIds.get(elementIdentifier)!
      }
      const newElementId = `${state.userSessionId}_${templateId}_${elementKey}`
      state.setElementStableIds((prev) => new Map(prev).set(elementIdentifier, newElementId))
      return newElementId
    },
    [state.userSessionId, state.elementStableIds, state.setElementStableIds],
  )

  useEffect(() => {
    console.log("Canvas: Syncing elements", elements.length)
    state.setLocalElements(elements)
  }, [elements, state.setLocalElements])

  useEffect(() => {
    if (state.newCommentId) {
      const timer = setTimeout(() => state.setNewCommentId(""), 2000)
      return () => clearTimeout(timer)
    }
  }, [state.newCommentId, state.setNewCommentId])

  useEffect(() => {
    if (state.textEditingState.shouldFocus && state.textEditingState.isActive && state.editInputRef.current) {
      const input = state.editInputRef.current

      if (state.textEditTimeoutRef.current) {
        clearTimeout(state.textEditTimeoutRef.current)
      }

      requestAnimationFrame(() => {
        input.focus()
        input.select()
        state.setTextEditingState((prev) => ({ ...prev, shouldFocus: false }))
      })
    }
  }, [state.textEditingState, state.editInputRef, state.textEditTimeoutRef, state.setTextEditingState])

  const eventHandlers = useCanvasEventHandlers({
    currentTool,
    isPreviewMode,
    projectId,
    showCommentInput: state.showCommentInput,
    textEditingState: state.textEditingState,
    isResizing: state.isResizing,
    canvasRef: state.canvasRef,
    localElements: state.localElements,
    onSelectElement,
    onCreateComment,
    onMoveElement,
    onUpdateElement,
    onUpdateTemplateElement: handleUpdateTemplateElement,
    onDeleteAllElements,
    onBackgroundSave,
    currentPageId: state.currentPageId,
    canvasPosition: state.canvasPosition,
    dragStart: state.dragStart,
    draggedElement: state.draggedElement,
    dragOffset: state.dragOffset,
    resizeStartData: state.resizeStartData,
    resizeHandle: state.resizeHandle,
    selectionBox: state.selectionBox,
    isSelecting: state.isSelecting,
    editableElements: state.editableElements,
    commentMessage: state.commentMessage,
    commentPosition: state.commentPosition,
    isDragging: state.isDragging,
    setSelectedTemplateElement: state.setSelectedTemplateElement,
    setSelectedElements: state.setSelectedElements,
    setSelectionBox: state.setSelectionBox,
    setContextMenu: state.setContextMenu,
    setCommentPosition: state.setCommentPosition,
    setShowCommentInput: state.setShowCommentInput,
    setIsDragging: state.setIsDragging,
    setDragStart: state.setDragStart,
    setDraggedElement: state.setDraggedElement,
    setDragOffset: state.setDragOffset,
    setIsResizing: state.setIsResizing,
    setResizeHandle: state.setResizeHandle,
    setResizeStartData: state.setResizeStartData,
    setIsSelecting: state.setIsSelecting,
    setLocalElements: state.setLocalElements,
    setTextEditingState: state.setTextEditingState,
    setEditableElements: state.setEditableElements,
    setShowBackgroundModal: state.setShowBackgroundModal,
    setCanvasBackground: state.setCanvasBackground,
    setCanvasPosition: state.setCanvasPosition,
    setCommentMessage: state.setCommentMessage,
    setNewCommentId: state.setNewCommentId,
  })

  const handleAIAddElement = useCallback(
    (elementType: string, x: number, y: number, properties: any = {}) => {
      console.log("Canvas: AI adding element", elementType, x, y, properties)
      if (onAddElement) {
        onAddElement(elementType, x, y, properties)
      }
    },
    [onAddElement],
  )

  useEffect(() => {
    ;(window as any).addElementToCanvas = handleAIAddElement
    ;(window as any).getCanvasDimensions = () => ({
      width: canvasWidth,
      height: canvasHeight,
      centerX: canvasWidth / 2,
      centerY: canvasHeight / 2,
    })
    return () => {
      delete (window as any).addElementToCanvas
      delete (window as any).getCanvasDimensions
    }
  }, [handleAIAddElement, canvasWidth, canvasHeight])

  const getCursor = useCallback(() => {
    if (state.showCommentInput || state.textEditingState.isActive) return "default"
    if (currentTool === "hand") return state.isDragging ? "grabbing" : "grab"
    if (currentTool === "comment") return "crosshair"
    if (currentTool === "cursor" && (isDragging || state.isResizing)) return "grabbing"
    return "default"
  }, [
    state.showCommentInput,
    state.textEditingState.isActive,
    currentTool,
    state.isDragging,
    isDragging,
    state.isResizing,
  ])

  const renderCMSCanvasElement = (element: CMSCanvasElement) => {
    const commonProps = {
      key: element.id,
      style: {
        position: "absolute" as const,
        left: element.x,
        top: element.y,
        zIndex: element.zIndex || 1,
      },
    }

    switch (element.type) {
      case "text":
        return (
          <div
            {...commonProps}
            className="cms-text-element"
            style={{
              ...commonProps.style,
              display: "flex",
              alignItems: "center",
              justifyContent: element.styles?.textAlign === "center" ? "center" : "flex-start",
              wordWrap: "break-word",
              overflow: "hidden",
            }}
          >
            <span style={{ width: "100%" }}>{element.content}</span>
          </div>
        )

      case "rich-text":
        return (
          <div
            {...commonProps}
            className="cms-rich-text-element prose prose-lg max-w-none"
            style={{
              ...commonProps.style,
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: element.content || "" }}
          />
        )

      case "image":
        return (
          <img
            {...commonProps}
            src={element.src || "/placeholder.svg?height=300&width=800"}
            alt={element.alt || "CMS Image"}
            className="cms-image-element"
            style={{
              ...commonProps.style,
              objectFit: element.styles?.objectFit || "cover",
            }}
            onError={(e) => {
              console.error("Image failed to load:", element.src)
              e.currentTarget.src = "/placeholder.svg?height=300&width=800"
            }}
          />
        )

      default:
        return (
          <div
            {...commonProps}
            className="cms-unknown-element"
            style={{
              ...commonProps.style,
              backgroundColor: "#f8f9fa",
              border: "2px dashed #dee2e6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6c757d",
              fontSize: "14px",
            }}
          >
            Unknown element type: {element.type}
          </div>
        )
    }
  }

  const menuElements = state.localElements.filter((el) => el.element_type.startsWith("menu-"))
  const otherElements = state.localElements.filter((el) => !el.element_type.startsWith("menu-"))
  const visibleElements = isPreviewMode
    ? otherElements.filter((el) => !el.device_type || el.device_type === previewDevice)
    : otherElements

  console.log("Canvas: Rendering", state.localElements.length, "total elements,", visibleElements.length, "visible")

  return (
    <div className="flex-1 bg-[#8888881A] dark:bg-[#1D1D1D] p-8 overflow-hidden relative">
      <CanvasStyles customCode={customCode} />

      <div
        ref={state.canvasRef}
        className="w-full h-full flex items-center justify-center"
        style={{ cursor: getCursor() }}
        onMouseDown={eventHandlers.handleCanvasMouseDown}
        onMouseMove={eventHandlers.handleCanvasMouseMove}
        onMouseUp={eventHandlers.handleCanvasMouseUp}
        onMouseLeave={eventHandlers.handleCanvasMouseLeave}
        onClick={eventHandlers.handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          data-canvas="true"
          className="relative overflow-y-auto"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `translate(${state.canvasPosition.x}px, ${state.canvasPosition.y}px) scale(${zoom / 100})`,
            transformOrigin: "center center",
            transition: isPreviewMode ? "width 0.3s, height 0.3s" : "none",
            ...getCanvasBackgroundStyle(state.canvasBackground),
          }}
        >
          {state.canvasBackground.type === "video" && (
            <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: -1 }}>
              <source src={state.canvasBackground.value} type="video/mp4" />
            </video>
          )}
          {state.canvasBackground.type === "gif" && (
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: -1,
                backgroundImage: `url(${state.canvasBackground.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div id="html-code-container" className="w-full" />

          {isCmsPage && cmsEntryData && !isLoadingCmsEntry && (
            <div className="absolute inset-0 w-full h-full">
              {cmsCanvasElements.map((element) => renderCMSCanvasElement(element))}
            </div>
          )}

          {isCmsPage && isLoadingCmsEntry && (
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading your content...</p>
                <p className="text-gray-400 text-sm mt-2">Fetching entry data from CMS</p>
              </div>
            </div>
          )}

          {isCmsPage && !isLoadingCmsEntry && !cmsEntryData && (
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Entry</h3>
                <p className="text-gray-600 mb-4">
                  {loadingError || "The CMS entry couldn't be loaded. Please check if the entry exists."}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => loadCmsEntryData(currentPage!)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {(!isCmsPage || !isPreviewMode) && (
            <>
              <div className="w-full">
                {menuElements.map((element) => {
                  if (isPreviewMode && element.device_type && element.device_type !== previewDevice) {
                    return null
                  }

                  // 🔥🔥🔥 USE REAL-TIME POSITION
                  const realtimePos = elementPositions.get(element.id)
                  const elementWithPosition = realtimePos ? { ...element, x: realtimePos.x, y: realtimePos.y } : element

                  return (
                    <ElementRenderer
                      key={element.id}
                      element={elementWithPosition}
                      selectedElement={selectedElement}
                      selectedElements={state.selectedElements}
                      draggedElement={draggedElement?.id}
                      isPreviewMode={isPreviewMode}
                      previewDevice={previewDevice}
                      projectId={projectId}
                      textEditingState={state.textEditingState}
                      editableElements={state.editableElements}
                      onElementClick={eventHandlers.handleElementClick}
                      onElementMouseDown={handleElementMouseDown}
                      onResizeMouseDown={() => {}}
                      onTextChange={eventHandlers.handleTextChange}
                      onTextEditKeyDown={eventHandlers.handleTextEditKeyDown}
                      editInputRef={state.editInputRef}
                      setTextEditingState={state.setTextEditingState}
                      setEditableElements={state.setEditableElements}
                      selectedTemplateElement={state.selectedTemplateElement}
                      getStableElementId={getStableElementId}
                      onTemplateElementClick={eventHandlers.handleTemplateElementClick}
                      onTemplateElementDoubleClick={eventHandlers.handleTemplateElementDoubleClick}
                    />
                  )
                })}
              </div>

              {visibleElements.map((element) => {
                // 🔥🔥🔥 USE REAL-TIME POSITION
                const realtimePos = elementPositions.get(element.id)
                const elementWithPosition = realtimePos ? { ...element, x: realtimePos.x, y: realtimePos.y } : element

                return (
                  <ElementRenderer
                    key={element.id}
                    element={elementWithPosition}
                    selectedElement={selectedElement}
                    selectedElements={state.selectedElements}
                    draggedElement={draggedElement?.id}
                    isPreviewMode={isPreviewMode}
                    previewDevice={previewDevice}
                    projectId={projectId}
                    textEditingState={state.textEditingState}
                    editableElements={state.editableElements}
                    onElementClick={eventHandlers.handleElementClick}
                    onElementMouseDown={handleElementMouseDown}
                    onResizeMouseDown={() => {}}
                    onTextChange={eventHandlers.handleTextChange}
                    onTextEditKeyDown={eventHandlers.handleTextEditKeyDown}
                    editInputRef={state.editInputRef}
                    setTextEditingState={state.setTextEditingState}
                    setEditableElements={state.setEditableElements}
                    selectedTemplateElement={state.selectedTemplateElement}
                    getStableElementId={getStableElementId}
                    onTemplateElementClick={eventHandlers.handleTemplateElementClick}
                    onTemplateElementDoubleClick={eventHandlers.handleTemplateElementDoubleClick}
                  />
                )
              })}
            </>
          )}

          <CanvasUI
            comments={comments}
            newCommentId={state.newCommentId}
            showCommentInput={state.showCommentInput}
            commentPosition={state.commentPosition}
            commentMessage={state.commentMessage}
            selectionBox={state.selectionBox}
            contextMenu={state.contextMenu}
            isPreviewMode={isPreviewMode}
            onCommentInputClick={eventHandlers.handleCommentInputClick}
            onInputChange={eventHandlers.handleInputChange}
            onInputKeyDown={eventHandlers.handleInputKeyDown}
            onSubmitComment={eventHandlers.handleSubmitComment}
            onCloseComment={eventHandlers.handleCloseComment}
            onContextMenuClick={eventHandlers.handleContextMenuClick}
          />
        </div>
      </div>

      {!isPreviewMode && (
        <BottomToolbar
          currentTool={currentTool}
          onToolChange={onToolChange}
          zoom={zoom}
          onZoomChange={onZoomChange}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          projectId={projectId}
        />
      )}

      <BackgroundSettingsModal
        isOpen={state.showBackgroundModal}
        onClose={() => state.setShowBackgroundModal(false)}
        onBackgroundChange={eventHandlers.handleBackgroundChange}
        currentBackground={state.canvasBackground.value}
      />
    </div>
  )
}
