"use client"

import type React from "react"
import { forwardRef, useCallback, useState, useRef, useEffect } from "react"
import { MiniPropertyPanel } from "./mini-property-panel"
import { CommentMarker } from "./comment-marker"
import { addNewComment, getAllComments, type WorkingComment } from "../../actions/comment-actions"

export interface CanvasElement {
  id: string
  type: "rectangle" | "circle" | "text" | "path"
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  text?: string
  path?: { x: number; y: number }[]
}

interface FullScreenCanvasProps {
  canvasData: {
    elements: CanvasElement[]
    viewport: { x: number; y: number; zoom: number }
  }
  selectedTool: string
  selectedColor: string
  selectedElements: string[]
  onCanvasUpdate: (data: any) => void
  onElementsSelect: (elements: string[]) => void
  boardId: string
}

export const FullScreenCanvas = forwardRef<HTMLDivElement, FullScreenCanvasProps>(
  ({ canvasData, selectedTool, selectedColor, selectedElements, onCanvasUpdate, onElementsSelect, boardId }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isPanning, setIsPanning] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [typingElement, setTypingElement] = useState<string | null>(null)
    const [draggedElement, setDraggedElement] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])

    // Initialize viewport with default values
    const [viewport, setViewport] = useState(() => ({
      x: canvasData.viewport?.x || 0,
      y: canvasData.viewport?.y || 0,
      zoom: canvasData.viewport?.zoom || 1,
    }))

    const [comments, setComments] = useState<WorkingComment[]>([])
    const [showCommentInput, setShowCommentInput] = useState(false)
    const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 })
    const [commentScreenPosition, setCommentScreenPosition] = useState({ x: 0, y: 0 })
    const [commentText, setCommentText] = useState("")

    const dragStartRef = useRef<{ x: number; y: number } | null>(null)
    const panStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null)
    const textInputRef = useRef<HTMLInputElement>(null)
    const commentInputRef = useRef<HTMLInputElement>(null)

    // Update viewport when canvasData changes
    useEffect(() => {
      if (canvasData.viewport) {
        setViewport({
          x: canvasData.viewport.x || 0,
          y: canvasData.viewport.y || 0,
          zoom: canvasData.viewport.zoom || 1,
        })
      }
    }, [canvasData.viewport])

    // Load comments
    useEffect(() => {
      const loadComments = async () => {
        console.log("💬 Loading comments for board:", boardId)
        const { data } = await getAllComments(boardId)
        if (data) {
          console.log("✅ Loaded comments:", data)
          setComments(data)
        }
      }
      loadComments()
    }, [boardId])

    // Get selected element for property panel
    const selectedElement =
      selectedElements.length === 1 ? canvasData.elements.find((el) => el.id === selectedElements[0]) : null

    // Save canvas data to server
    const saveToServer = useCallback(
      (newCanvasData: any) => {
        console.log("💾 Saving canvas data:", newCanvasData)
        onCanvasUpdate(newCanvasData)
      },
      [onCanvasUpdate],
    )

    // Handle mouse wheel for zoom
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? 0.9 : 1.1
          const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * delta))

          const newViewport = { ...viewport, zoom: newZoom }
          setViewport(newViewport)

          const newCanvasData = {
            ...canvasData,
            viewport: newViewport,
          }
          saveToServer(newCanvasData)
        }
      },
      [viewport, canvasData, saveToServer],
    )

    // Get canvas coordinates from mouse event
    const getCanvasCoords = useCallback(
      (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        return {
          x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
          y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
        }
      },
      [viewport],
    )

    // Check if point is inside element
    const isPointInElement = useCallback((point: { x: number; y: number }, element: CanvasElement) => {
      return (
        point.x >= element.x &&
        point.x <= element.x + element.width &&
        point.y >= element.y &&
        point.y <= element.y + element.height
      )
    }, [])

    // Find element at point
    const findElementAtPoint = useCallback(
      (point: { x: number; y: number }) => {
        for (let i = canvasData.elements.length - 1; i >= 0; i--) {
          const element = canvasData.elements[i]
          if (isPointInElement(point, element)) {
            return element
          }
        }
        return null
      },
      [canvasData.elements, isPointInElement],
    )

    // Update element properties and save
    const updateElement = useCallback(
      (elementId: string, updates: Partial<CanvasElement>) => {
        console.log("🔄 Updating element:", elementId, updates)
        const newElements = canvasData.elements.map((element) => {
          if (element.id === elementId) {
            return { ...element, ...updates }
          }
          return element
        })

        const newCanvasData = {
          ...canvasData,
          elements: newElements,
        }
        saveToServer(newCanvasData)
      },
      [canvasData, saveToServer],
    )

    // Add new element and save
    const addElement = useCallback(
      (newElement: CanvasElement) => {
        console.log("➕ Adding element:", newElement)
        const newCanvasData = {
          ...canvasData,
          elements: [...canvasData.elements, newElement],
        }
        saveToServer(newCanvasData)
      },
      [canvasData, saveToServer],
    )

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (showCommentInput) return

        const coords = getCanvasCoords(e)
        const clickedElement = findElementAtPoint(coords)

        if (selectedTool === "comment") {
          setCommentPosition(coords)
          setCommentScreenPosition({ x: e.clientX, y: e.clientY })
          setShowCommentInput(true)
          setTimeout(() => {
            if (commentInputRef.current) {
              commentInputRef.current.focus()
            }
          }, 100)
        } else if (selectedTool === "hand") {
          setIsPanning(true)
          panStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            viewportX: viewport.x,
            viewportY: viewport.y,
          }
        } else if (selectedTool === "select") {
          if (clickedElement) {
            onElementsSelect([clickedElement.id])
            setDraggedElement(clickedElement.id)
            setDragOffset({
              x: coords.x - clickedElement.x,
              y: coords.y - clickedElement.y,
            })
            setIsDragging(true)
          } else {
            onElementsSelect([])
          }
        } else if (selectedTool === "pen") {
          setIsDrawing(true)
          setCurrentPath([coords])
        } else if (selectedTool === "text") {
          const newElement: CanvasElement = {
            id: `text_${Date.now()}`,
            type: "text",
            x: coords.x,
            y: coords.y,
            width: 200,
            height: 40,
            fill: selectedColor,
            stroke: "transparent",
            strokeWidth: 0,
            text: "Type here...",
          }

          addElement(newElement)
          onElementsSelect([newElement.id])
          setIsTyping(true)
          setTypingElement(newElement.id)

          setTimeout(() => {
            if (textInputRef.current) {
              textInputRef.current.focus()
              textInputRef.current.select()
            }
          }, 100)
        } else if (selectedTool === "rectangle") {
          const newElement: CanvasElement = {
            id: `rect_${Date.now()}`,
            type: "rectangle",
            x: coords.x - 50,
            y: coords.y - 50,
            width: 100,
            height: 100,
            fill: selectedColor,
            stroke: selectedColor,
            strokeWidth: 2,
          }
          addElement(newElement)
        } else if (selectedTool === "circle") {
          const newElement: CanvasElement = {
            id: `circle_${Date.now()}`,
            type: "circle",
            x: coords.x - 50,
            y: coords.y - 50,
            width: 100,
            height: 100,
            fill: selectedColor,
            stroke: selectedColor,
            strokeWidth: 2,
          }
          addElement(newElement)
        }
      },
      [
        selectedTool,
        canvasData,
        viewport,
        selectedColor,
        getCanvasCoords,
        findElementAtPoint,
        onElementsSelect,
        showCommentInput,
        addElement,
      ],
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (showCommentInput) return

        const coords = getCanvasCoords(e)

        if (isPanning && panStartRef.current) {
          const deltaX = e.clientX - panStartRef.current.x
          const deltaY = e.clientY - panStartRef.current.y

          const newViewport = {
            ...viewport,
            x: panStartRef.current.viewportX + deltaX,
            y: panStartRef.current.viewportY + deltaY,
          }
          setViewport(newViewport)
        } else if (isDragging && draggedElement) {
          updateElement(draggedElement, {
            x: coords.x - dragOffset.x,
            y: coords.y - dragOffset.y,
          })
        } else if (isDrawing && selectedTool === "pen") {
          setCurrentPath((prev) => [...prev, coords])
        }
      },
      [
        isPanning,
        isDragging,
        isDrawing,
        selectedTool,
        viewport,
        draggedElement,
        dragOffset,
        updateElement,
        getCanvasCoords,
        showCommentInput,
      ],
    )

    const handleMouseUp = useCallback(() => {
      if (showCommentInput) return

      if (isPanning) {
        const newCanvasData = {
          ...canvasData,
          viewport: viewport,
        }
        saveToServer(newCanvasData)
      }

      if (isDrawing && currentPath.length > 1) {
        const newElement: CanvasElement = {
          id: `path_${Date.now()}`,
          type: "path",
          x: Math.min(...currentPath.map((p) => p.x)),
          y: Math.min(...currentPath.map((p) => p.y)),
          width: Math.max(...currentPath.map((p) => p.x)) - Math.min(...currentPath.map((p) => p.x)),
          height: Math.max(...currentPath.map((p) => p.y)) - Math.min(...currentPath.map((p) => p.y)),
          fill: "transparent",
          stroke: selectedColor,
          strokeWidth: 3,
          path: currentPath,
        }

        addElement(newElement)
        setCurrentPath([])
      }

      setIsDragging(false)
      setIsPanning(false)
      setIsDrawing(false)
      setDraggedElement(null)
      dragStartRef.current = null
      panStartRef.current = null
    }, [
      isPanning,
      isDrawing,
      currentPath,
      viewport,
      canvasData,
      saveToServer,
      selectedColor,
      showCommentInput,
      addElement,
    ])

    // Handle comment submission
    const handleCommentSubmit = async () => {
      if (commentText.trim()) {
        console.log("💬 Adding comment:", commentText.trim())
        const { data } = await addNewComment(boardId, commentPosition.x, commentPosition.y, commentText.trim())
        if (data) {
          console.log("✅ Comment added:", data)
          setComments((prev) => [data, ...prev])
        }
      }
      setShowCommentInput(false)
      setCommentText("")
    }

    // Handle comment cancel
    const handleCommentCancel = () => {
      setShowCommentInput(false)
      setCommentText("")
    }

    // Handle text input
    const handleTextInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typingElement) {
          updateElement(typingElement, { text: e.target.value })
        }
      },
      [typingElement, updateElement],
    )

    const handleTextSubmit = useCallback(() => {
      setIsTyping(false)
      setTypingElement(null)
    }, [])

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isTyping) {
          if (e.key === "Enter" || e.key === "Escape") {
            handleTextSubmit()
          }
          return
        }

        if (showCommentInput) {
          if (e.key === "Enter") {
            handleCommentSubmit()
          } else if (e.key === "Escape") {
            handleCommentCancel()
          }
          return
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault()
        }
        if (e.key === "Delete" && selectedElements.length > 0) {
          const newElements = canvasData.elements.filter((el) => !selectedElements.includes(el.id))
          const newCanvasData = {
            ...canvasData,
            elements: newElements,
          }
          saveToServer(newCanvasData)
          onElementsSelect([])
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedElements, canvasData, saveToServer, onElementsSelect, isTyping, handleTextSubmit, showCommentInput])

    return (
      <div
        ref={ref}
        className="w-screen h-screen fixed inset-0 overflow-hidden"
        style={{
          cursor:
            selectedTool === "hand"
              ? "grab"
              : selectedTool === "pen"
                ? "crosshair"
                : selectedTool === "text"
                  ? "text"
                  : selectedTool === "comment"
                    ? "crosshair"
                    : "default",
          background: "#f8f9fa",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Canvas background with dots */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
            backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Render canvas elements */}
          {canvasData.elements.map((element) => (
            <div
              key={element.id}
              className={`absolute ${selectedElements.includes(element.id) ? "ring-2 ring-blue-500" : ""}`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                backgroundColor: element.type === "text" ? "transparent" : element.fill,
                borderColor: element.stroke,
                borderWidth: element.strokeWidth,
                borderStyle: "solid",
                borderRadius: element.type === "circle" ? "50%" : "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: element.type === "text" ? "16px" : undefined,
                color: element.type === "text" ? element.fill : undefined,
                cursor: selectedTool === "select" ? "move" : "default",
                pointerEvents: selectedTool === "select" && !showCommentInput ? "auto" : "none",
                boxShadow: element.type !== "text" && element.fill === "#ffffff" ? "0 0 0 1px #e5e7eb" : "none",
                fontFamily: "Inter, sans-serif",
                fontWeight: element.type === "text" ? "500" : undefined,
              }}
            >
              {element.type === "text" && element.text}
            </div>
          ))}

          {/* Render comment markers */}
          {comments.map((comment) => (
            <CommentMarker key={comment.id} comment={comment} viewport={viewport} />
          ))}

          {/* Render current drawing path */}
          {isDrawing && currentPath.length > 1 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <path
                d={`M ${currentPath.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                stroke={selectedColor}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Render saved paths */}
          {canvasData.elements
            .filter((el) => el.type === "path")
            .map((element) => (
              <svg
                key={element.id}
                className="absolute pointer-events-none"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                }}
              >
                <path
                  d={`M ${element.path?.map((p) => `${p.x - element.x},${p.y - element.y}`).join(" L ")}`}
                  stroke={element.stroke}
                  strokeWidth={element.strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
        </div>

        {/* Mini property panel for selected element */}
        {selectedElement && !showCommentInput && (
          <MiniPropertyPanel element={selectedElement} viewport={viewport} onUpdateElement={updateElement} />
        )}

        {/* Comment input */}
        {showCommentInput && (
          <div
            className="fixed z-50"
            style={{
              left: commentScreenPosition.x - 128,
              top: commentScreenPosition.y + 20,
            }}
          >
            <div className="bg-white/98 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4 w-64">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === "Enter") {
                    handleCommentSubmit()
                  } else if (e.key === "Escape") {
                    handleCommentCancel()
                  }
                }}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={handleCommentCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden text input for typing */}
        {isTyping && (
          <input
            ref={textInputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            value={selectedElement?.text || ""}
            onChange={handleTextInput}
            onBlur={handleTextSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                handleTextSubmit()
              }
            }}
          />
        )}
      </div>
    )
  },
)

FullScreenCanvas.displayName = "FullScreenCanvas"
