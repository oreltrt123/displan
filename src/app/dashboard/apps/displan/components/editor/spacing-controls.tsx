"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface SpacingControlsProps {
  element: any
  onUpdateSpacing: (spacingData: any) => void
}

// Drag-to-edit input component
function DragInput({
  value,
  onChange,
  placeholder = "0",
  className = "",
}: {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartValue, setDragStartValue] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault()
      setIsDragging(true)
      setDragStartY(e.clientY)
      setDragStartValue(value || 0)
      document.body.style.cursor = "ns-resize"
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = dragStartY - e.clientY
      const newValue = Math.max(0, dragStartValue + Math.floor(deltaY / 2))
      onChange(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = "default"
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "default"
    }
  }, [isDragging, dragStartY, dragStartValue, onChange])

  return (
    <input
      ref={inputRef}
      type="number"
      className={`${className} ${isDragging ? "cursor-ns-resize" : "cursor-ns-resize hover:bg-blue-50"}`}
      value={value || 0}
      onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
      onMouseDown={handleMouseDown}
      placeholder={placeholder}
      title="Click and drag up/down to change value"
    />
  )
}

export function SpacingControls({ element, onUpdateSpacing }: SpacingControlsProps) {
  const currentStyles = element?.styles || {}

  const [spacing, setSpacing] = useState({
    marginTop: currentStyles.marginTop || 0,
    marginRight: currentStyles.marginRight || 0,
    marginBottom: currentStyles.marginBottom || 0,
    marginLeft: currentStyles.marginLeft || 0,
    paddingTop: currentStyles.paddingTop || 0,
    paddingRight: currentStyles.paddingRight || 0,
    paddingBottom: currentStyles.paddingBottom || 0,
    paddingLeft: currentStyles.paddingLeft || 0,
  })

  // Update local state when element changes
  useEffect(() => {
    setSpacing({
      marginTop: currentStyles.marginTop || 0,
      marginRight: currentStyles.marginRight || 0,
      marginBottom: currentStyles.marginBottom || 0,
      marginLeft: currentStyles.marginLeft || 0,
      paddingTop: currentStyles.paddingTop || 0,
      paddingRight: currentStyles.paddingRight || 0,
      paddingBottom: currentStyles.paddingBottom || 0,
      paddingLeft: currentStyles.paddingLeft || 0,
    })
  }, [element?.id])

  const handleSpacingChange = (property: string, value: number) => {
    console.log("🔥🔥🔥 SPACING CHANGE:", property, value)

    setSpacing((prev) => ({ ...prev, [property]: value }))

    // Send update immediately
    onUpdateSpacing({ [property]: value })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium">Space</h3>

      <div className="relative border-2 border-gray-300 rounded-lg p-8" style={{ minHeight: "200px" }}>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">MARGIN</div>

        {/* Top Margin */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <DragInput
            value={spacing.marginTop}
            onChange={(value) => handleSpacingChange("marginTop", value)}
            className="w-12 h-6 text-xs text-center border border-gray-300 rounded"
          />
        </div>

        {/* Right Margin */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <DragInput
            value={spacing.marginRight}
            onChange={(value) => handleSpacingChange("marginRight", value)}
            className="w-12 h-6 text-xs text-center border border-gray-300 rounded"
          />
        </div>

        {/* Bottom Margin */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <DragInput
            value={spacing.marginBottom}
            onChange={(value) => handleSpacingChange("marginBottom", value)}
            className="w-12 h-6 text-xs text-center border border-gray-300 rounded"
          />
        </div>

        {/* Left Margin */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <DragInput
            value={spacing.marginLeft}
            onChange={(value) => handleSpacingChange("marginLeft", value)}
            className="w-12 h-6 text-xs text-center border border-gray-300 rounded"
          />
        </div>

        {/* Padding Box */}
        <div className="relative border-2 border-blue-300 rounded-lg p-6 mx-8 my-8 bg-blue-50">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-blue-600">PADDING</div>

          {/* Top Padding */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <DragInput
              value={spacing.paddingTop}
              onChange={(value) => handleSpacingChange("paddingTop", value)}
              className="w-12 h-6 text-xs text-center border border-blue-300 rounded bg-white"
            />
          </div>

          {/* Right Padding */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <DragInput
              value={spacing.paddingRight}
              onChange={(value) => handleSpacingChange("paddingRight", value)}
              className="w-12 h-6 text-xs text-center border border-blue-300 rounded bg-white"
            />
          </div>

          {/* Bottom Padding */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <DragInput
              value={spacing.paddingBottom}
              onChange={(value) => handleSpacingChange("paddingBottom", value)}
              className="w-12 h-6 text-xs text-center border border-blue-300 rounded bg-white"
            />
          </div>

          {/* Left Padding */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <DragInput
              value={spacing.paddingLeft}
              onChange={(value) => handleSpacingChange("paddingLeft", value)}
              className="w-12 h-6 text-xs text-center border border-blue-300 rounded bg-white"
            />
          </div>

          {/* Element Preview */}
          <div className="flex items-center justify-center h-16 bg-gray-200 rounded text-xs text-gray-600">Element</div>
        </div>
      </div>
    </div>
  )
}
