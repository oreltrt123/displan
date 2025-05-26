"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { CanvasElement } from "@/lib/supabase"

interface ElementPropertyPanelProps {
  element: CanvasElement
  viewport: { x: number; y: number; zoom: number }
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void
}

const colors = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
  "#6b7280",
]

export function ElementPropertyPanel({ element, viewport, onUpdateElement }: ElementPropertyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Calculate panel position above the element
  const panelX = (element.x + element.width / 2) * viewport.zoom + viewport.x
  const panelY = element.y * viewport.zoom + viewport.y - 10

  const handleColorChange = (color: string) => {
    if (element.type === "text") {
      onUpdateElement(element.id, { fill: color })
    } else {
      onUpdateElement(element.id, { fill: color, stroke: color })
    }
  }

  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    onUpdateElement(element.id, { [dimension]: Math.max(10, value) })
  }

  const handleTextChange = (text: string) => {
    onUpdateElement(element.id, { text })
  }

  if (!isExpanded) {
    return (
      <div className="absolute z-50 transform -translate-x-1/2 -translate-y-full" style={{ left: panelX, top: panelY }}>
        <Button
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-white"
        >
          ⚙️
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute z-50 transform -translate-x-1/2 -translate-y-full" style={{ left: panelX, top: panelY }}>
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 capitalize">{element.type} Properties</h3>
          <Button size="sm" variant="ghost" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          {/* Color Picker */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Color</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  className="h-8 w-8 p-0 rounded-full border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: color,
                    borderColor: element.fill === color ? "#3b82f6" : color === "#ffffff" ? "#e5e7eb" : "transparent",
                  }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Controls for Shapes */}
          {(element.type === "rectangle" || element.type === "circle") && (
            <>
              <div>
                <Label className="text-sm font-medium text-gray-700">Width</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={[element.width]}
                    onValueChange={([value]) => handleSizeChange("width", value)}
                    max={500}
                    min={10}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.width}
                    onChange={(e) => handleSizeChange("width", Number.parseInt(e.target.value) || 10)}
                    className="w-16 h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Height</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={[element.height]}
                    onValueChange={([value]) => handleSizeChange("height", value)}
                    max={500}
                    min={10}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.height}
                    onChange={(e) => handleSizeChange("height", Number.parseInt(e.target.value) || 10)}
                    className="w-16 h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Border Width</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={[element.strokeWidth]}
                    onValueChange={([value]) => onUpdateElement(element.id, { strokeWidth: value })}
                    max={20}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.strokeWidth}
                    onChange={(e) => onUpdateElement(element.id, { strokeWidth: Number.parseInt(e.target.value) || 0 })}
                    className="w-16 h-8"
                  />
                </div>
              </div>
            </>
          )}

          {/* Text Controls */}
          {element.type === "text" && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Text Content</Label>
              <Input
                type="text"
                value={(element as any).text || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text..."
                className="mt-1"
              />
            </div>
          )}

          {/* Position Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">X Position</Label>
              <Input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => onUpdateElement(element.id, { x: Number.parseInt(e.target.value) || 0 })}
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Y Position</Label>
              <Input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => onUpdateElement(element.id, { y: Number.parseInt(e.target.value) || 0 })}
                className="mt-1 h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
