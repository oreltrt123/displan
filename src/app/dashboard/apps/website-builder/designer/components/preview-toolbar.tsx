"use client"

import type React from "react"

import { useState } from "react"
import { Laptop, Smartphone, Tablet, Maximize, Minimize } from "lucide-react"

interface PreviewToolbarProps {
  previewMode: "desktop" | "tablet" | "mobile"
  onChangePreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  canvasWidth: number
  onCanvasWidthChange: (width: number) => void
}

export function PreviewToolbar({
  previewMode,
  onChangePreviewMode,
  canvasWidth,
  onCanvasWidthChange,
}: PreviewToolbarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartWidth(canvasWidth)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startX
    let newWidth = startWidth + delta

    // Set min and max width constraints
    if (previewMode === "desktop") {
      newWidth = Math.max(768, Math.min(newWidth, 1920))
    } else if (previewMode === "tablet") {
      newWidth = Math.max(480, Math.min(newWidth, 1024))
    } else {
      newWidth = Math.max(320, Math.min(newWidth, 480))
    }

    onCanvasWidthChange(newWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="flex items-center justify-between bg-background border-b border-border p-2">
      <div className="flex items-center space-x-2">
        <button
          className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          onClick={() => onChangePreviewMode("desktop")}
          title="Desktop view"
        >
          <Laptop className="h-4 w-4" />
        </button>
        <button
          className={`p-1.5 rounded ${previewMode === "tablet" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          onClick={() => onChangePreviewMode("tablet")}
          title="Tablet view"
        >
          <Tablet className="h-4 w-4" />
        </button>
        <button
          className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          onClick={() => onChangePreviewMode("mobile")}
          title="Mobile view"
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">{canvasWidth}px</span>
        <button
          className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80"
          onClick={() => {
            if (previewMode === "desktop") onCanvasWidthChange(1920)
            else if (previewMode === "tablet") onCanvasWidthChange(768)
            else onCanvasWidthChange(375)
          }}
          title="Reset to default width"
        >
          {previewMode === "desktop" ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
        </button>
      </div>

      {/* Resize handles */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 flex items-center justify-center cursor-ew-resize z-10"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-primary rounded-full"></div>
      </div>

      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-16 flex items-center justify-center cursor-ew-resize z-10"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-primary rounded-full"></div>
      </div>
    </div>
  )
}
