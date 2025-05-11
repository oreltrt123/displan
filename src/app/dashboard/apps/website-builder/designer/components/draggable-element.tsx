"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ElementType } from "../types"
import { ElementRenderer } from "./element-renderer"
import { useDragDrop } from "./drag-drop-context"
import { Move } from 'lucide-react'

interface DraggableElementProps {
  element: ElementType
  isSelected: boolean
  onClick: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAlignChange?: (align: "left" | "center" | "right") => void
  onPositionChange: (id: string, x: number, y: number) => void
}

export function DraggableElement({
  element,
  isSelected,
  onClick,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAlignChange,
  onPositionChange,
}: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: element.style?.x || 0, y: element.style?.y || 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 })
  const { registerDropTarget, unregisterDropTarget, showGrid, snapToGrid } = useDragDrop()

  // Register as drop target
  useEffect(() => {
    if (elementRef.current) {
      registerDropTarget(element.id, elementRef)
    }
    return () => {
      unregisterDropTarget(element.id)
    }
  }, [element.id, registerDropTarget, unregisterDropTarget])

  // Initialize position from element style
  useEffect(() => {
    if (element.style?.x !== undefined && element.style?.y !== undefined) {
      setPosition({ x: element.style.x, y: element.style.y })
    }
  }, [element.style?.x, element.style?.y])

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    
    e.stopPropagation()
    e.preventDefault()
    
    setIsDragging(true)
    setInitialMousePos({ x: e.clientX, y: e.clientY })
    
    // Add global event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    
    // Prevent text selection during drag
    document.body.style.userSelect = "none"
    elementRef.current?.classList.add("dragging")
  }

  // Handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    // Calculate new position
    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y
    
    const newX = position.x + deltaX
    const newY = position.y + deltaY
    
    // Apply new position directly to the element for immediate visual feedback
    if (elementRef.current) {
      const snappedPos = showGrid ? snapToGrid({ x: newX, y: newY }) : { x: newX, y: newY }
      elementRef.current.style.left = `${snappedPos.x}px`
      elementRef.current.style.top = `${snappedPos.y}px`
    }
  }

  // Handle mouse up to end dragging
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Calculate final position
    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y
    
    const newX = position.x + deltaX
    const newY = position.y + deltaY
    
    // Apply snapping if grid is enabled
    const finalPosition = showGrid ? snapToGrid({ x: newX, y: newY }) : { x: newX, y: newY }
    
    // Update state
    setPosition(finalPosition)
    
    // Update parent component with new position
    onPositionChange(element.id, finalPosition.x, finalPosition.y)
    
    // Remove event listeners
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
    
    // Restore text selection
    document.body.style.userSelect = ""
    elementRef.current?.classList.remove("dragging")
  }

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isSelected ? 10 : isDragging ? 100 : 1,
        transition: isDragging ? "none" : "box-shadow 0.2s ease",
        boxShadow: isSelected ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
        width: element.style?.width,
        height: element.style?.height,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        element-wrapper group
        ${isDragging ? "dragging" : ""}
        ${showGrid ? "with-grid" : ""}
      `}
      data-element-id={element.id}
    >
      {/* Drag handle */}
      <div
        className="absolute -top-6 left-0 bg-white shadow-sm rounded-md p-1 cursor-move z-30 opacity-0 group-hover:opacity-100 hover:opacity-100"
        onMouseDown={handleMouseDown}
      >
        <Move className="h-4 w-4 text-gray-500" />
      </div>

      <ElementRenderer element={element} isEditing={true} isSelected={isSelected} onClick={onClick} />

      {/* Element toolbar - simplified for clarity */}
      {isSelected && (
        <div className="absolute -top-8 right-0 bg-white shadow-sm rounded-md flex items-center p-1 z-30">
          {/* Toolbar buttons would go here */}
        </div>
      )}

      {/* Resize handles - simplified for clarity */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-bl-sm cursor-se-resize z-20" />
      )}
    </div>
  )
}
