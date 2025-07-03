"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponsiveControlsProps {
  previewMode: "desktop" | "tablet" | "mobile"
  onChangePreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  canvasWidth: number
  canvasHeight: number
  onCanvasWidthChange: (width: number) => void
  onCanvasHeightChange: (height: number) => void
}

export function ResponsiveControls({
  previewMode,
  onChangePreviewMode,
  canvasWidth,
  canvasHeight,
  onCanvasWidthChange,
  onCanvasHeightChange,
}: ResponsiveControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [widthInput, setWidthInput] = useState(canvasWidth.toString())
  const [heightInput, setHeightInput] = useState(canvasHeight.toString())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update input values when canvas dimensions change
  useEffect(() => {
    setWidthInput(canvasWidth.toString())
    setHeightInput(canvasHeight.toString())
  }, [canvasWidth, canvasHeight])

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidthInput(e.target.value)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInput(e.target.value)
  }

  const handleWidthBlur = () => {
    const width = Number.parseInt(widthInput)
    console.log("ResponsiveControls: Width blur, parsed value:", width)
    if (!isNaN(width) && width > 0) {
      console.log("ResponsiveControls: Calling onCanvasWidthChange with:", width)
      onCanvasWidthChange(width)
    } else {
      console.log("ResponsiveControls: Invalid width, resetting to:", canvasWidth)
      setWidthInput(canvasWidth.toString())
    }
  }

  const handleHeightBlur = () => {
    const height = Number.parseInt(heightInput)
    console.log("ResponsiveControls: Height blur, parsed value:", height)
    if (!isNaN(height) && height > 0) {
      console.log("ResponsiveControls: Calling onCanvasHeightChange with:", height)
      onCanvasHeightChange(height)
    } else {
      console.log("ResponsiveControls: Invalid height, resetting to:", canvasHeight)
      setHeightInput(canvasHeight.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, type: "width" | "height") => {
    if (e.key === "Enter") {
      if (type === "width") {
        handleWidthBlur()
      } else {
        handleHeightBlur()
      }
    }
  }

  const selectDevice = (device: "desktop" | "tablet" | "mobile") => {
    console.log("ResponsiveControls: Selecting device:", device)
    onChangePreviewMode(device)
    setIsOpen(false)

    // Set default dimensions based on device
    if (device === "desktop") {
      console.log("Setting desktop dimensions: 1200x800")
      onCanvasWidthChange(1200)
      onCanvasHeightChange(800)
    } else if (device === "tablet") {
      console.log("Setting tablet dimensions: 768x1024")
      onCanvasWidthChange(768)
      onCanvasHeightChange(1024)
    } else {
      console.log("Setting mobile dimensions: 375x667")
      onCanvasWidthChange(375)
      onCanvasHeightChange(667)
    }
  }

  return (
    <div className="">
      <div className="relative" ref={dropdownRef}>

        {isOpen && (
          <div className="menu_container">
            <div className="py-1">
              <button className="menu_item" onClick={() => selectDevice("desktop")}>
                <span>Desktop</span>
                {previewMode === "desktop" && <Check className="h-4 w-4 mr-2" />}
              </button>
              <button className="menu_item" onClick={() => selectDevice("tablet")}>
                <span>Tablet</span>
                {previewMode === "tablet" && <Check className="h-4 w-4 mr-2" />}
              </button>
              <button className="menu_item" onClick={() => selectDevice("mobile")}>
                <span>Phone</span>
                {previewMode === "mobile" && <Check className="h-4 w-4 mr-2" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
                <button className="button_edit_project_r224" onClick={() => setIsOpen(!isOpen)}>
          <span className="capitalize">{previewMode}</span>
          <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
        <div className="flex items-center">
          
          <input
            type="text"
            value={widthInput}
            onChange={handleWidthChange}
            onBlur={handleWidthBlur}
            onKeyDown={(e) => handleKeyDown(e, "width")}
            className="input_field2"
          />
          <span className="input_field22 text-white">W</span>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={heightInput}
            onChange={handleHeightChange}
            onBlur={handleHeightBlur}
            onKeyDown={(e) => handleKeyDown(e, "height")}
            className="input_field2"
          />
          <span className="input_field22 text-white">H</span>
        </div>
      </div>
    </div>
  )
}
