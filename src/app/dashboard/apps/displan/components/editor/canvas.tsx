"use client"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BottomToolbar } from "./bottom-toolbar"
import BackgroundSettingsModal from "./background-settings-modal"
import { useCanvasState } from "../../hooks/use-canvas-state"
import { useCanvasEventHandlers } from "../../handlers/canvas-event-handlers"
import { CanvasStyles } from "./canvas-styles"
import { ElementRenderer } from "./element-renderer"
import { CanvasUI } from "./canvas-ui"
import { getCanvasBackgroundStyle } from "../../utils/canvas-utils"
import type { CanvasProps } from "../../types/canvas-types" // Renamed to avoid redeclaration
import { useState } from "react"

interface CMSEntry {
  id: string
  title: string
  slug: string
  date: string
  status: "draft" | "published"
  content: string
  collection_id: string
}

export default function Canvas({
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
  currentPageId, // Add this line
  isPreviewMode = false,
  customCode = "",
  canvasWidth = 1200,
  canvasHeight = 800,
  previewDevice = "desktop",
  onBackgroundSave,
  onBackgroundLoad,
}: CanvasProps) {
  // Updated to use CanvasPropsType
  const router = useRouter()
  const state = useCanvasState()

  // Add these state variables after the existing state declarations
  const [cmsEntry, setCmsEntry] = useState<CMSEntry | null>(null)
  const [isCmsMode, setIsCmsMode] = useState(false)
  const [cmsLoading, setCmsLoading] = useState(false)

  // Template element update handler - simplified for V232
  const handleUpdateTemplateElement = useCallback(
    async (elementId: string, elementType: string, properties: any) => {
      console.log("Template V232 - Updating element:", { elementId, elementType, properties })
      // The template renderer handles its own saving now
      return { success: true }
    },
    [projectId, state.currentPageId],
  )

  // Load page-specific background on mount and page change
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

  // Stable element ID generation for templates
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

  // Sync elements with local state
  useEffect(() => {
    state.setLocalElements(elements)
  }, [elements, state.setLocalElements])

  // Handle new comment animation
  useEffect(() => {
    if (state.newCommentId) {
      const timer = setTimeout(() => state.setNewCommentId(""), 2000)
      return () => clearTimeout(timer)
    }
  }, [state.newCommentId, state.setNewCommentId])

  // Enhanced text editing focus management
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

  // Add this function to detect if current page is a CMS entry
  const detectAndLoadCmsEntry = useCallback(async (pageId: string) => {
    if (pageId.startsWith("cms-")) {
      const parts = pageId.split("-")
      if (parts.length >= 3) {
        const collectionId = parts[1]
        const entrySlug = parts.slice(2).join("-")

        setIsCmsMode(true)
        setCmsLoading(true)

        try {
          const response = await fetch(`/api/cms/collections/${collectionId}/entries`)
          if (response.ok) {
            const entries = await response.json()
            const foundEntry = entries.find((e: CMSEntry) => e.slug === entrySlug)

            if (foundEntry) {
              setCmsEntry(foundEntry)
              // Convert CMS content to canvas elements
              await convertCmsToCanvasElements(foundEntry)
            }
          }
        } catch (error) {
          console.error("Failed to load CMS entry:", error)
        } finally {
          setCmsLoading(false)
        }
      }
    } else {
      setIsCmsMode(false)
      setCmsEntry(null)
    }
  }, [])

  const convertCmsToCanvasElements = useCallback(
    async (entry: CMSEntry) => {
      if (!onAddElement) return

      // Wait a bit for any existing elements to be cleared
      setTimeout(() => {
        // Add title as a heading element
        onAddElement("text", canvasWidth / 2 - 200, 100, {
          text: entry.title,
          fontSize: 32,
          fontWeight: "bold",
          color: "#000000",
          textAlign: "center",
          width: 400,
          height: 50,
        })

        // Add date as a subtitle
        const formattedDate = new Date(entry.date).toLocaleDateString()
        onAddElement("text", canvasWidth / 2 - 100, 170, {
          text: formattedDate,
          fontSize: 14,
          color: "#666666",
          textAlign: "center",
          width: 200,
          height: 25,
        })

        // Add status badge
        onAddElement("text", canvasWidth / 2 - 50, 210, {
          text: entry.status.toUpperCase(),
          fontSize: 12,
          fontWeight: "bold",
          color: entry.status === "published" ? "#10B981" : "#F59E0B",
          textAlign: "center",
          width: 100,
          height: 25,
        })

        // Split content into paragraphs and add as separate text elements
        const paragraphs = entry.content.split("\n").filter((p) => p.trim())
        let yPosition = 280

        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            onAddElement("text", 100, yPosition, {
              text: paragraph.trim(),
              fontSize: 16,
              color: "#333333",
              lineHeight: 1.6,
              width: canvasWidth - 200,
              height: Math.max(60, Math.ceil(paragraph.length / 80) * 25),
            })
            yPosition += Math.max(80, Math.ceil(paragraph.length / 80) * 30)
          }
        })
      }, 100)
    },
    [onAddElement, canvasWidth],
  )

  // Add this useEffect after the existing ones
  useEffect(() => {
    if (currentPageId) {
      detectAndLoadCmsEntry(currentPageId)
    }
  }, [currentPageId, detectAndLoadCmsEntry])

  // Add this function to handle saving CMS changes
  const saveCmsChanges = useCallback(async () => {
    if (!cmsEntry || !isCmsMode) return

    // Extract content from canvas elements
    const titleElement = elements.find((el) => el.y === 100 && el.element_type === "text")
    const contentElements = elements.filter((el) => el.y >= 280 && el.element_type === "text")

    const updatedContent = contentElements
      .sort((a, b) => a.y - b.y)
      .map((el) => el.text || "")
      .join("\n\n")

    const updatedEntry = {
      ...cmsEntry,
      title: titleElement?.text || cmsEntry.title,
      content: updatedContent,
    }

    try {
      const response = await fetch(`/api/cms/entries/${cmsEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      })

      if (response.ok) {
        setCmsEntry(updatedEntry)
        console.log("CMS entry updated successfully")
      }
    } catch (error) {
      console.error("Failed to save CMS changes:", error)
    }
  }, [cmsEntry, isCmsMode, elements])

  // Add auto-save functionality
  useEffect(() => {
    if (isCmsMode && elements.length > 0) {
      const saveTimer = setTimeout(saveCmsChanges, 2000) // Auto-save after 2 seconds of inactivity
      return () => clearTimeout(saveTimer)
    }
  }, [elements, isCmsMode, saveCmsChanges])

  // Initialize event handlers
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
    // State setters
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

  // AI element addition handler
  const handleAIAddElement = useCallback(
    (elementType: string, x: number, y: number, properties: any = {}) => {
      if (onAddElement) {
        onAddElement(elementType, x, y, properties)
      }
    },
    [onAddElement],
  )

  // Global window functions for AI integration
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

  // Dynamic cursor based on current state
  const getCursor = useCallback(() => {
    if (state.showCommentInput || state.textEditingState.isActive) return "default"
    if (currentTool === "hand") return state.isDragging ? "grabbing" : "grab"
    if (currentTool === "comment") return "crosshair"
    if (currentTool === "cursor" && (state.draggedElement || state.isResizing)) return "grabbing"
    return "default"
  }, [
    state.showCommentInput,
    state.textEditingState.isActive,
    currentTool,
    state.isDragging,
    state.draggedElement,
    state.isResizing,
  ])

  // Filter elements by type
  const menuElements = state.localElements.filter((el) => el.element_type.startsWith("menu-"))
  const otherElements = state.localElements.filter((el) => !el.element_type.startsWith("menu-"))
  const visibleElements = isPreviewMode
    ? otherElements.filter((el) => !el.device_type || el.device_type === previewDevice)
    : otherElements

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
        {/* Add this right after the canvas div opening tag */}
        {cmsLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading CMS entry...</p>
            </div>
          </div>
        )}

        {/* Add CMS mode indicator */}
        {isCmsMode && cmsEntry && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm z-40">
            CMS: {cmsEntry.title}
          </div>
        )}
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
          {/* Background media */}
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

          {/* Custom HTML code container */}
          <div id="html-code-container" className="w-full" />

          {/* Menu elements (templates) */}
          <div className="w-full">
            {menuElements.map((element) => {
              if (isPreviewMode && element.device_type && element.device_type !== previewDevice) {
                return null
              }
              return (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  selectedElement={selectedElement}
                  selectedElements={state.selectedElements}
                  draggedElement={state.draggedElement}
                  isPreviewMode={isPreviewMode}
                  previewDevice={previewDevice}
                  projectId={projectId}
                  textEditingState={state.textEditingState}
                  editableElements={state.editableElements}
                  onElementClick={eventHandlers.handleElementClick}
                  onElementMouseDown={() => {}}
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

          {/* Regular elements */}
          {visibleElements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              selectedElement={selectedElement}
              selectedElements={state.selectedElements}
              draggedElement={state.draggedElement}
              isPreviewMode={isPreviewMode}
              previewDevice={previewDevice}
              projectId={projectId}
              textEditingState={state.textEditingState}
              editableElements={state.editableElements}
              onElementClick={eventHandlers.handleElementClick}
              onElementMouseDown={() => {}}
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
          ))}

          {/* Canvas UI overlays */}
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

      {/* Bottom toolbar */}
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

      {/* Background settings modal */}
      <BackgroundSettingsModal
        isOpen={state.showBackgroundModal}
        onClose={() => state.setShowBackgroundModal(false)}
        onBackgroundChange={eventHandlers.handleBackgroundChange}
        currentBackground={state.canvasBackground.value}
      />
    </div>
  )
}
