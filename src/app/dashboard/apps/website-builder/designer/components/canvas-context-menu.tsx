"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy, Trash, Palette, Grid3X3, Download, Lock, Unlock } from "lucide-react"
import { HexColorPicker } from "react-colorful"

interface CanvasContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onChangeBackground: (color: string) => void
  onDuplicateCanvas: () => void
  onClearCanvas: () => void
  onToggleGrid: () => void
  onExportCanvas: () => void
  onToggleLock: () => void
  isLocked: boolean
  currentBackground: string
  showGrid: boolean
}

export function CanvasContextMenu({
  x,
  y,
  onClose,
  onChangeBackground,
  onDuplicateCanvas,
  onClearCanvas,
  onToggleGrid,
  onExportCanvas,
  onToggleLock,
  isLocked,
  currentBackground,
  showGrid,
}: CanvasContextMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState(currentBackground || "#ffffff")
  const menuRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, window.innerWidth - 220)
  const adjustedY = Math.min(y, window.innerHeight - 300)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const applyColorChange = () => {
    onChangeBackground(selectedColor)
    setShowColorPicker(false)
  }

  return (
    <>
      <div ref={menuRef} className="menu_container" style={{ left: adjustedX, top: adjustedY }}>
        <div className="py-1">
          <button className="menu_item" onClick={() => setShowColorPicker(!showColorPicker)}>
            <Palette className="h-4 w-4 mr-2" />
            Change Background
          </button>
          <button className="menu_item" onClick={onDuplicateCanvas}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Canvas
          </button>
          <button className="menu_item" onClick={onToggleGrid}>
            <Grid3X3 className="h-4 w-4 mr-2" />
            {showGrid ? "Hide Grid" : "Show Grid"}
          </button>
          <button className="menu_item" onClick={onToggleLock}>
            {isLocked ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Canvas
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Lock Canvas
              </>
            )}
          </button>
          <button className="menu_item" onClick={onExportCanvas}>
            <Download className="h-4 w-4 mr-2" />
            Export Canvas
          </button>
          <div className="border-t border-border my-1"></div>
          <button className="menu_item" onClick={onClearCanvas}>
            <Trash className="h-4 w-4 mr-2" />
            Clear Canvas
          </button>
        </div>
      </div>

      {showColorPicker && (
        <div
          ref={colorPickerRef}
          className="absolute bg-background border border-border rounded-md shadow-md z-50 p-3"
          style={{ left: adjustedX + 220, top: adjustedY }}
        >
          <HexColorPicker color={selectedColor} onChange={handleColorChange} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded border border-border mr-2"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <span className="text-xs">{selectedColor}</span>
            </div>
            <button
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center"
              onClick={applyColorChange}
            >
              <Check className="h-3 w-3 mr-1" />
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  )
}
