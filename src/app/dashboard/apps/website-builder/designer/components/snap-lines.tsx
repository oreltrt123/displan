"use client"

import { useState, useEffect } from "react"
import { useDragDrop } from "./drag-drop-context"

interface SnapLine {
  id: string
  direction: "horizontal" | "vertical"
  position: number
  visible: boolean
}

export function SnapLines() {
  const [snapLines, setSnapLines] = useState<SnapLine[]>([])
  const { isDragging, draggedElementId, dropTargets } = useDragDrop()

  useEffect(() => {
    if (!isDragging || !draggedElementId) {
      setSnapLines([])
      return
    }

    // Find all potential snap lines from other elements
    const lines: SnapLine[] = []

    // Get the dragged element
    const draggedRef = dropTargets.get(draggedElementId)
    if (!draggedRef || !draggedRef.current) return

    const draggedRect = draggedRef.current.getBoundingClientRect()

    // Check each drop target for potential snap lines
    dropTargets.forEach((targetRef, targetId) => {
      if (targetId === draggedElementId || !targetRef.current) return

      const targetRect = targetRef.current.getBoundingClientRect()

      // Horizontal lines (top, center, bottom)
      const targetTop = targetRect.top
      const targetCenter = targetRect.top + targetRect.height / 2
      const targetBottom = targetRect.bottom

      // Vertical lines (left, center, right)
      const targetLeft = targetRect.left
      const targetCenter2 = targetRect.left + targetRect.width / 2
      const targetRight = targetRect.right

      // Add horizontal lines
      lines.push(
        { id: `h-top-${targetId}`, direction: "horizontal", position: targetTop, visible: false },
        { id: `h-center-${targetId}`, direction: "horizontal", position: targetCenter, visible: false },
        { id: `h-bottom-${targetId}`, direction: "horizontal", position: targetBottom, visible: false },
      )

      // Add vertical lines
      lines.push(
        { id: `v-left-${targetId}`, direction: "vertical", position: targetLeft, visible: false },
        { id: `v-center-${targetId}`, direction: "vertical", position: targetCenter2, visible: false },
        { id: `v-right-${targetId}`, direction: "vertical", position: targetRight, visible: false },
      )
    })

    // Check for matches and update visibility
    const draggedTop = draggedRect.top
    const draggedCenter = draggedRect.top + draggedRect.height / 2
    const draggedBottom = draggedRect.bottom
    const draggedLeft = draggedRect.left
    const draggedCenter2 = draggedRect.left + draggedRect.width / 2
    const draggedRight = draggedRect.right

    const threshold = 5 // Snap threshold in pixels

    // Update visibility based on proximity
    const updatedLines = lines.map((line) => {
      if (line.direction === "horizontal") {
        const distance = Math.min(
          Math.abs(line.position - draggedTop),
          Math.abs(line.position - draggedCenter),
          Math.abs(line.position - draggedBottom),
        )
        return { ...line, visible: distance < threshold }
      } else {
        const distance = Math.min(
          Math.abs(line.position - draggedLeft),
          Math.abs(line.position - draggedCenter2),
          Math.abs(line.position - draggedRight),
        )
        return { ...line, visible: distance < threshold }
      }
    })

    setSnapLines(updatedLines)
  }, [isDragging, draggedElementId, dropTargets])

  return (
    <>
      {snapLines
        .filter((line) => line.visible)
        .map((line) => (
          <div
            key={line.id}
            className={`snap-line snap-line-${line.direction}`}
            style={{
              [line.direction === "horizontal" ? "top" : "left"]: `${line.position}px`,
            }}
          />
        ))}
    </>
  )
}
