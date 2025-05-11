"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import type { ElementType } from "../types"
import { ElementRenderer } from "./element-renderer"
import { useDragDrop } from "./drag-drop-context"

interface DraggableElementProps {
  element: ElementType
  isSelected: boolean
  onClick: () => void
}

export function DraggableElement({ element, isSelected, onClick }: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { startDrag, registerDropTarget, unregisterDropTarget, isDragging, draggedElementId } = useDragDrop()

  useEffect(() => {
    if (elementRef.current) {
      registerDropTarget(element.id, elementRef)
    }
    return () => {
      unregisterDropTarget(element.id)
    }
  }, [element.id, registerDropTarget, unregisterDropTarget])

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", element.id)
    e.dataTransfer.effectAllowed = "move"

    // Add a slight delay to make the drag visual more noticeable
    setTimeout(() => {
      startDrag(element)
    }, 0)
  }

  return (
    <div
      ref={elementRef}
      draggable
      onDragStart={handleDragStart}
      className={`
        relative cursor-move 
        ${isDragging && draggedElementId === element.id ? "opacity-50" : ""}
        ${isDragging && draggedElementId !== element.id ? "drop-target" : ""}
      `}
      data-element-id={element.id}
    >
      <ElementRenderer element={element} isEditing={true} isSelected={isSelected} onClick={onClick} />
    </div>
  )
}
