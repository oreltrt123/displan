"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { CanvasElement, CanvasData } from "../../types/canvas"
import { CanvasElementComponent } from "./canvas-element"
import { cn } from "@/lib/utils"
import { useToast } from "../ui/use-toast"

interface CanvasProps {
  canvasData: CanvasData
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
  onDeleteElement: (id: string) => void
  onUpdateCanvasData: (updates: Partial<CanvasData>) => void
  onFinalPositionUpdate: () => void
  zoom: number
}

export function CanvasComponent({
  canvasData,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onUpdateCanvasData,
  onFinalPositionUpdate,
  zoom = 1,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const { toast } = useToast()

  // Track which element is currently being dragged
  const draggedElementRef = useRef<string | null>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on an element
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      onSelectElement(null)
    }
  }

  const handleElementDragStart = (e: React.MouseEvent, element: CanvasElement) => {
    e.preventDefault() // Prevent default drag behavior
    e.stopPropagation()

    // Select the element if it's not already selected
    if (element.id !== selectedElementId) {
      onSelectElement(element.id)
    }

    setIsDragging(true)
    draggedElementRef.current = element.id

    // Calculate offset from the element's position to the mouse position
    // This ensures the element doesn't jump to have its top-left corner at the mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    setDragOffset({ x: offsetX, y: offsetY })

    // Add event listeners to handle drag
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedElementRef.current || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()

    // Calculate the new position, taking into account the drag offset
    const x = (e.clientX - canvasRect.left - dragOffset.x) / zoom
    const y = (e.clientY - canvasRect.top - dragOffset.y) / zoom

    // Update element position
    onUpdateElement(draggedElementRef.current, { x, y })
  }

  const handleMouseUp = () => {
    if (isDragging && draggedElementRef.current) {
      // Add the final position to history
      onFinalPositionUpdate()
    }

    setIsDragging(false)
    draggedElementRef.current = null
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // Element resize handler would go here
  const handleElementResize = (elementId: string, direction: string, dx: number, dy: number) => {
    // Implementation would depend on your resize logic
    console.log("Resize element", elementId, direction, dx, dy)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 bg-canvas-background overflow-auto h-full flex items-center justify-center p-8",
        isDragging && "cursor-grabbing",
      )}
      onClick={handleCanvasClick}
    >
      <div
        ref={canvasRef}
        className={cn("canvas-content relative border border-gray-200", isDragging && "cursor-grabbing")}
        style={{
          width: `${canvasData.width}px`,
          height: `${canvasData.height}px`,
          backgroundColor: canvasData.background || "#ffffff",
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {canvasData.elements.map((element) => (
          <CanvasElementComponent
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onSelect={() => onSelectElement(element.id)}
            onDelete={() => onDeleteElement(element.id)}
            onDragStart={(e) => handleElementDragStart(e, element)}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            onResize={(direction, dx, dy) => handleElementResize(element.id, direction, dx, dy)}
          />
        ))}
      </div>
    </div>
  )
}
