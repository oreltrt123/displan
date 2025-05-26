"use client"

import type React from "react"
import { forwardRef, useCallback, useState, useRef, useEffect } from "react"
import type { CanvasElement } from "@/lib/supabase"

interface BoardCanvasProps {
  canvasData: {
    elements: CanvasElement[]
    viewport: { x: number; y: number; zoom: number }
  }
  selectedTool: string
  onCanvasUpdate: (data: any) => void
}

export const BoardCanvas = forwardRef<HTMLDivElement, BoardCanvasProps>(
  ({ canvasData, selectedTool, onCanvasUpdate }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isPanning, setIsPanning] = useState(false)
    const [selectedElements, setSelectedElements] = useState<string[]>([])
    const [viewport, setViewport] = useState(canvasData.viewport)
    const dragStartRef = useRef<{ x: number; y: number } | null>(null)
    const panStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null)

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
          onCanvasUpdate(newCanvasData)
        }
      },
      [viewport, canvasData, onCanvasUpdate],
    )

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = (e.clientX - rect.left - viewport.x) / viewport.zoom
        const y = (e.clientY - rect.top - viewport.y) / viewport.zoom

        if (selectedTool === "hand") {
          setIsPanning(true)
          panStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            viewportX: viewport.x,
            viewportY: viewport.y,
          }
        } else if (selectedTool === "select") {
          setIsDragging(true)
          dragStartRef.current = { x, y }
        } else if (selectedTool === "rectangle") {
          const newElement: CanvasElement = {
            id: `rect_${Date.now()}`,
            type: "rectangle",
            x: x - 50,
            y: y - 50,
            width: 100,
            height: 100,
            fill: "#3b82f6",
            stroke: "#1e40af",
            strokeWidth: 2,
          }

          const newCanvasData = {
            ...canvasData,
            elements: [...canvasData.elements, newElement],
          }
          onCanvasUpdate(newCanvasData)
        } else if (selectedTool === "circle") {
          const newElement: CanvasElement = {
            id: `circle_${Date.now()}`,
            type: "circle",
            x: x - 50,
            y: y - 50,
            width: 100,
            height: 100,
            fill: "#10b981",
            stroke: "#059669",
            strokeWidth: 2,
          }

          const newCanvasData = {
            ...canvasData,
            elements: [...canvasData.elements, newElement],
          }
          onCanvasUpdate(newCanvasData)
        } else if (selectedTool === "text") {
          const newElement: CanvasElement = {
            id: `text_${Date.now()}`,
            type: "text",
            x: x,
            y: y,
            width: 200,
            height: 40,
            fill: "#000000",
            stroke: "transparent",
            strokeWidth: 0,
          }

          const newCanvasData = {
            ...canvasData,
            elements: [...canvasData.elements, newElement],
          }
          onCanvasUpdate(newCanvasData)
        }
      },
      [selectedTool, canvasData, onCanvasUpdate, viewport],
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (isPanning && panStartRef.current) {
          const deltaX = e.clientX - panStartRef.current.x
          const deltaY = e.clientY - panStartRef.current.y

          const newViewport = {
            ...viewport,
            x: panStartRef.current.viewportX + deltaX,
            y: panStartRef.current.viewportY + deltaY,
          }
          setViewport(newViewport)
        }
      },
      [isPanning, viewport],
    )

    const handleMouseUp = useCallback(() => {
      if (isPanning) {
        const newCanvasData = {
          ...canvasData,
          viewport: viewport,
        }
        onCanvasUpdate(newCanvasData)
      }

      setIsDragging(false)
      setIsPanning(false)
      dragStartRef.current = null
      panStartRef.current = null
    }, [isPanning, viewport, canvasData, onCanvasUpdate])

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault()
          // Undo will be handled by parent component
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
      <div
        ref={ref}
        className="w-full h-full relative overflow-hidden"
        style={{
          cursor: selectedTool === "hand" ? "grab" : selectedTool === "text" ? "text" : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
            backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`,
            backgroundColor: "hsl(var(--background))",
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Render canvas elements */}
          {canvasData.elements.map((element) => (
            <div
              key={element.id}
              className="absolute border-2 cursor-move"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                backgroundColor: element.fill,
                borderColor: element.stroke,
                borderWidth: element.strokeWidth,
                borderRadius: element.type === "circle" ? "50%" : "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: element.type === "text" ? "16px" : undefined,
                color: element.type === "text" ? element.fill : undefined,
                backgroundColor: element.type === "text" ? "transparent" : element.fill,
              }}
            >
              {element.type === "text" && "Double click to edit"}
            </div>
          ))}
        </div>
      </div>
    )
  },
)

BoardCanvas.displayName = "BoardCanvas"
