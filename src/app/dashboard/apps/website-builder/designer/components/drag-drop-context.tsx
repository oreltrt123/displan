"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react"
import type { ElementType } from "../types"

interface Position {
  x: number
  y: number
}

interface DragDropContextType {
  isDragging: boolean
  draggedElement: ElementType | null
  draggedElementId: string | null
  dragPosition: Position | null
  dropTargets: Map<string, React.RefObject<HTMLElement>>
  registerDropTarget: (id: string, ref: React.RefObject<HTMLElement>) => void
  unregisterDropTarget: (id: string) => void
  startDrag: (element: ElementType, initialPosition?: Position) => void
  updateDragPosition: (position: Position) => void
  endDrag: (targetId: string | null, position: Position | null) => void
  getRelativePosition: (element: HTMLElement, clientX: number, clientY: number) => Position
  snapToGrid: (position: Position) => Position
  gridSize: number
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  setGridSize: (size: number) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({
  children,
  onElementMove,
  showGrid = true,
  setShowGrid,
  gridSize = 8,
  setGridSize,
}: {
  children: ReactNode
  onElementMove: (elementId: string, targetId: string, position: "before" | "after" | "inside") => void
  showGrid?: boolean
  setShowGrid: (show: boolean) => void
  gridSize?: number
  setGridSize: (size: number) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<Position | null>(null)

  const dropTargets = useRef(new Map<string, React.RefObject<HTMLElement>>()).current

  const registerDropTarget = useCallback(
    (id: string, ref: React.RefObject<HTMLElement>) => {
      dropTargets.set(id, ref)
    },
    [dropTargets],
  )

  const unregisterDropTarget = useCallback(
    (id: string) => {
      dropTargets.delete(id)
    },
    [dropTargets],
  )

  const startDrag = useCallback((element: ElementType, initialPosition?: Position) => {
    setIsDragging(true)
    setDraggedElement(element)
    setDraggedElementId(element.id)
    if (initialPosition) {
      setDragPosition(initialPosition)
    }
  }, [])

  const updateDragPosition = useCallback((position: Position) => {
    setDragPosition(position)
  }, [])

  const endDrag = useCallback(
    (targetId: string | null, position: Position | null) => {
      if (draggedElementId && targetId) {
        // Determine position based on drop location
        let dropPosition: "before" | "after" | "inside" = "inside"

        // If we have more specific position info, we could determine before/after
        // For now, default to "inside" for sections and "after" for elements
        if (targetId.startsWith("section-")) {
          dropPosition = "inside"
        } else {
          dropPosition = "after"
        }

        onElementMove(draggedElementId, targetId, dropPosition)
      }

      setIsDragging(false)
      setDraggedElement(null)
      setDraggedElementId(null)
      setDragPosition(null)
    },
    [draggedElementId, onElementMove],
  )

  const getRelativePosition = useCallback((element: HTMLElement, clientX: number, clientY: number): Position => {
    const rect = element.getBoundingClientRect()
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }, [])

  const snapToGrid = useCallback(
    (position: Position): Position => {
      if (!showGrid) return position

      return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      }
    },
    [gridSize, showGrid],
  )

  const value = {
    isDragging,
    draggedElement,
    draggedElementId,
    dragPosition,
    dropTargets,
    registerDropTarget,
    unregisterDropTarget,
    startDrag,
    updateDragPosition,
    endDrag,
    getRelativePosition,
    snapToGrid,
    gridSize,
    showGrid,
    setShowGrid,
    setGridSize,
  }

  return <DragDropContext.Provider value={value}>{children}</DragDropContext.Provider>
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
