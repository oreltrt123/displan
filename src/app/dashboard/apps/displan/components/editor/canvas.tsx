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
import type { CanvasProps } from "../../types/canvas-types"

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
  isPreviewMode = false,
  customCode = "",
  canvasWidth = 1200,
  canvasHeight = 800,
  previewDevice = "desktop",
  onBackgroundSave,
  onBackgroundLoad,
}: CanvasProps) {
  const router = useRouter()
  const state = useCanvasState()

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
    console.log("Canvas: Syncing elements", elements.length)
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
      console.log("Canvas: AI adding element", elementType, x, y, properties)
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

  console.log("Canvas: Rendering", state.localElements.length, "total elements,", visibleElements.length, "visible")

  return (
    <div className="flex-1 bg-[#8888881A] dark:bg-[#1D1D1D] p-8 overflow-hidden relative asfsffwsfafw">
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
