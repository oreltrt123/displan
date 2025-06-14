"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface ResizableImageElementProps {
  elementId: string
  elementKey: string
  templateId: string
  src: string
  alt: string
  className?: string
  isSelected: boolean
  isPreviewMode: boolean
  projectId: string
  pageSlug: string
  onImageClick: (e: React.MouseEvent) => void
  onImageDoubleClick: (e: React.MouseEvent) => void
  onImageChange: (newSrc: string) => void
}

interface ImageDimensions {
  width: number
  height: number
}

export function ResizableImageElement({
  elementId,
  elementKey,
  templateId,
  src,
  alt,
  className = "",
  isSelected,
  isPreviewMode,
  projectId,
  pageSlug,
  onImageClick,
  onImageDoubleClick,
  onImageChange,
}: ResizableImageElementProps) {
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load saved dimensions on mount and when src changes
  useEffect(() => {
    const loadDimensions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/image-dimensions?projectId=${encodeURIComponent(projectId)}&pageSlug=${encodeURIComponent(pageSlug)}&templateId=${encodeURIComponent(templateId)}&elementKey=${encodeURIComponent(elementKey)}`,
        )

        if (response.ok) {
          const result = await response.json()
          console.log("Loaded dimensions for", elementKey, ":", result)

          if (result.success && result.dimensions) {
            setDimensions(result.dimensions)
          } else {
            // If no saved dimensions, wait for image to load to get natural size
            setDimensions({ width: 0, height: 0 })
          }
        }
      } catch (error) {
        console.error("Error loading image dimensions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId && pageSlug && templateId && elementKey) {
      loadDimensions()
    }
  }, [projectId, pageSlug, templateId, elementKey, src])

  // Save dimensions to server
  const saveDimensions = async (newDimensions: ImageDimensions) => {
    try {
      console.log("Saving dimensions for", elementKey, ":", newDimensions)

      const response = await fetch("/api/image-dimensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          pageSlug,
          templateId,
          elementKey,
          dimensions: newDimensions,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Dimensions saved successfully:", result)
      } else {
        console.error("Failed to save dimensions:", await response.text())
      }
    } catch (error) {
      console.error("Error saving dimensions:", error)
    }
  }

  // Handle image load to set initial dimensions if none are saved
  const handleImageLoad = () => {
    if (imageRef.current && dimensions.width === 0 && dimensions.height === 0 && !isLoading) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight

      // Get the current computed size from CSS classes
      const computedStyle = window.getComputedStyle(imageRef.current)
      const currentWidth = Number.parseInt(computedStyle.width) || naturalWidth
      const currentHeight = Number.parseInt(computedStyle.height) || naturalHeight

      // Use the CSS-defined size as the initial size, not natural size
      let width = currentWidth
      let height = currentHeight

      // Only scale if the image is unreasonably large
      const maxWidth = 800
      const maxHeight = 600

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Ensure minimum size
      width = Math.max(30, width)
      height = Math.max(30, height)

      const newDimensions = { width, height }
      console.log("Setting initial dimensions for", elementKey, ":", newDimensions)
      setDimensions(newDimensions)
      saveDimensions(newDimensions)
    }
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (isPreviewMode) return

    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width
    const startHeight = dimensions.height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      switch (handle) {
        case "nw": // Top-left
          newWidth = startWidth - deltaX
          newHeight = startHeight - deltaY
          break
        case "ne": // Top-right
          newWidth = startWidth + deltaX
          newHeight = startHeight - deltaY
          break
        case "sw": // Bottom-left
          newWidth = startWidth - deltaX
          newHeight = startHeight + deltaY
          break
        case "se": // Bottom-right
          newWidth = startWidth + deltaX
          newHeight = startHeight + deltaY
          break
      }

      // Maintain aspect ratio
      const aspectRatio = startWidth / startHeight
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio
      } else {
        newWidth = newHeight * aspectRatio
      }

      // Minimum and maximum size constraints
      newWidth = Math.max(30, Math.min(800, newWidth))
      newHeight = Math.max(30, Math.min(800, newHeight))

      setDimensions({ width: Math.round(newWidth), height: Math.round(newHeight) })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle("")
      // Save dimensions when resize is complete
      saveDimensions(dimensions)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const imageStyle: React.CSSProperties = {
    width: dimensions.width > 0 ? `${dimensions.width}px` : undefined,
    height: dimensions.height > 0 ? `${dimensions.height}px` : undefined,
    maxWidth: "100%",
    display: "block",
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      style={{
        width: dimensions.width > 0 ? `${dimensions.width}px` : "auto",
        height: dimensions.height > 0 ? `${dimensions.height}px` : "auto",
      }}
    >
      <img
        ref={imageRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${isResizing ? "pointer-events-none" : ""}`}
        style={imageStyle}
        onLoad={handleImageLoad}
        onClick={onImageClick}
        onDoubleClick={onImageDoubleClick}
        draggable={false}
      />

      {/* Resize Handles - Always show when selected and not in preview mode */}
      {isSelected && !isPreviewMode && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize hover:bg-blue-600 shadow-md z-10"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            style={{ pointerEvents: "auto" }}
          />
          <div
            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize hover:bg-blue-600 shadow-md z-10"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            style={{ pointerEvents: "auto" }}
          />
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize hover:bg-blue-600 shadow-md z-10"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            style={{ pointerEvents: "auto" }}
          />
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize hover:bg-blue-600 shadow-md z-10"
            onMouseDown={(e) => handleResizeStart(e, "se")}
            style={{ pointerEvents: "auto" }}
          />

          {/* Selection indicator with dimensions */}
          <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none z-10">
            {dimensions.width > 0 ? `${Math.round(dimensions.width)} × ${Math.round(dimensions.height)}` : "Resizable"}
          </div>
        </>
      )}

      {/* Double-click hint */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -bottom-10 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none opacity-75 z-10">
          Double-click to change image
        </div>
      )}
    </div>
  )
}
