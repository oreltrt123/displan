"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { ElementType } from "../types"
import { useDragDrop } from "./drag-drop-context"

interface ResizeHandlesProps {
  element: ElementType
  onResize: (width: number, height: number) => void
}

export function ResizeHandles({ element, onResize }: ResizeHandlesProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 })
  const [currentHandle, setCurrentHandle] = useState<string | null>(null)
  const elementRef = useRef<HTMLDivElement | null>(null)
  const { snapToGrid } = useDragDrop()

  // Get the parent element to measure
  useEffect(() => {
    if (elementRef.current) {
      const parent = elementRef.current.parentElement
      if (parent) {
        const rect = parent.getBoundingClientRect()
        setInitialSize({ width: rect.width, height: rect.height })
      }
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()

    const parent = elementRef.current?.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()

    setIsResizing(true)
    setCurrentHandle(handle)
    setInitialSize({ width: rect.width, height: rect.height })
    setInitialMousePos({ x: e.clientX, y: e.clientY })

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Prevent text selection during resize
    document.body.style.userSelect = "none"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !currentHandle) return

    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y

    let newWidth = initialSize.width
    let newHeight = initialSize.height

    // Calculate new dimensions based on which handle is being dragged
    switch (currentHandle) {
      case "e":
        newWidth = initialSize.width + deltaX
        break
      case "w":
        newWidth = initialSize.width - deltaX
        break
      case "s":
        newHeight = initialSize.height + deltaY
        break
      case "n":
        newHeight = initialSize.height - deltaY
        break
      case "ne":
        newWidth = initialSize.width + deltaX
        newHeight = initialSize.height - deltaY
        break
      case "nw":
        newWidth = initialSize.width - deltaX
        newHeight = initialSize.height - deltaY
        break
      case "se":
        newWidth = initialSize.width + deltaX
        newHeight = initialSize.height + deltaY
        break
      case "sw":
        newWidth = initialSize.width - deltaX
        newHeight = initialSize.height + deltaY
        break
    }

    // Ensure minimum size
    newWidth = Math.max(20, newWidth)
    newHeight = Math.max(20, newHeight)

    // Snap to grid
    const snapped = snapToGrid({ x: newWidth, y: newHeight })
    newWidth = snapped.x
    newHeight = snapped.y

    // Update the element size
    const parent = elementRef.current?.parentElement
    if (parent) {
      parent.style.width = `${newWidth}px`
      parent.style.height = `${newHeight}px`
    }
  }

  const handleMouseUp = () => {
    if (!isResizing) return

    setIsResizing(false)
    setCurrentHandle(null)

    // Get final dimensions
    const parent = elementRef.current?.parentElement
    if (parent) {
      const rect = parent.getBoundingClientRect()
      onResize(rect.width, rect.height)
    }

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    // Restore text selection
    document.body.style.userSelect = ""
  }

  return (
    <div ref={elementRef} className="resize-handles">
      {/* North */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-n-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "n")}
      />

      {/* South */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-s-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "s")}
      />

      {/* East */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-e-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "e")}
      />

      {/* West */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-w-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "w")}
      />

      {/* North East */}
      <div
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-ne-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "ne")}
      />

      {/* North West */}
      <div
        className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-nw-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "nw")}
      />

      {/* South East */}
      <div
        className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-se-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "se")}
      />

      {/* South West */}
      <div
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-sw-resize z-20"
        onMouseDown={(e) => handleMouseDown(e, "sw")}
      />
    </div>
  )
}
