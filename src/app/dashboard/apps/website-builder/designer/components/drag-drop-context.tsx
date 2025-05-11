"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"
import type { ElementType } from "../types"

interface DragDropContextType {
  isDragging: boolean
  draggedElement: ElementType | null
  draggedElementId: string | null
  startDrag: (element: ElementType) => void
  endDrag: () => void
  handleDrop: (targetId: string, position: "before" | "after" | "inside") => void
  registerDropTarget: (id: string, ref: React.RefObject<HTMLElement>) => void
  unregisterDropTarget: (id: string) => void
  getDropTargetPosition: (e: React.DragEvent, targetId: string) => "before" | "after" | "inside" | null
}

const DragDropContext = createContext<DragDropContextType | null>(null)

export const useDragDrop = () => {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}

interface DragDropProviderProps {
  children: React.ReactNode
  onElementMove: (elementId: string, targetId: string, position: "before" | "after" | "inside") => void
}

export function DragDropProvider({ children, onElementMove }: DragDropProviderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const dropTargets = useRef<Map<string, React.RefObject<HTMLElement>>>(new Map())

  const startDrag = (element: ElementType) => {
    setIsDragging(true)
    setDraggedElement(element)
    setDraggedElementId(element.id)
  }

  const endDrag = () => {
    setIsDragging(false)
    setDraggedElement(null)
    setDraggedElementId(null)
  }

  const handleDrop = (targetId: string, position: "before" | "after" | "inside") => {
    if (draggedElementId && targetId !== draggedElementId) {
      onElementMove(draggedElementId, targetId, position)
    }
    endDrag()
  }

  const registerDropTarget = (id: string, ref: React.RefObject<HTMLElement>) => {
    dropTargets.current.set(id, ref)
  }

  const unregisterDropTarget = (id: string) => {
    dropTargets.current.delete(id)
  }

  const getDropTargetPosition = (e: React.DragEvent, targetId: string): "before" | "after" | "inside" | null => {
    const targetRef = dropTargets.current.get(targetId)
    if (!targetRef || !targetRef.current) return null

    const rect = targetRef.current.getBoundingClientRect()
    const y = e.clientY

    // Determine if we're in the top third, middle third, or bottom third of the element
    const topThird = rect.top + rect.height / 3
    const bottomThird = rect.bottom - rect.height / 3

    if (y < topThird) {
      return "before"
    } else if (y > bottomThird) {
      return "after"
    } else {
      return "inside"
    }
  }

  return (
    <DragDropContext.Provider
      value={{
        isDragging,
        draggedElement,
        draggedElementId,
        startDrag,
        endDrag,
        handleDrop,
        registerDropTarget,
        unregisterDropTarget,
        getDropTargetPosition,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}
