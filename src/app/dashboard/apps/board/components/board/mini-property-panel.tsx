"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CanvasElement } from "@/lib/supabase"

interface MiniPropertyPanelProps {
  element: CanvasElement
  viewport: { x: number; y: number; zoom: number }
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void
}

const colors = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff"]

export function MiniPropertyPanel({ element, viewport, onUpdateElement }: MiniPropertyPanelProps) {
  const [showColors, setShowColors] = useState(false)

  // Calculate panel position above the element
  const panelX = (element.x + element.width / 2) * viewport.zoom + viewport.x
  const panelY = element.y * viewport.zoom + viewport.y - 15

  const handleColorChange = (color: string) => {
    if (element.type === "text") {
      onUpdateElement(element.id, { fill: color })
    } else {
      onUpdateElement(element.id, { fill: color, stroke: color })
    }
    setShowColors(false)
  }

  return (
    <div className="absolute z-50 transform -translate-x-1/2 -translate-y-full" style={{ left: panelX, top: panelY }}>
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-lg shadow-xl px-3 py-2">
        <div className="flex items-center space-x-2">
          {/* Color indicator */}
          <Button
            className="h-6 w-6 p-0 rounded-full border border-gray-300"
            style={{ backgroundColor: element.fill }}
            onClick={() => setShowColors(!showColors)}
          />

          {/* Quick actions based on element type */}
          {element.type === "text" && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              Edit
            </Button>
          )}

          {(element.type === "rectangle" || element.type === "circle") && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              Resize
            </Button>
          )}
        </div>

        {/* Color palette */}
        {showColors && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-1 max-w-[120px]">
              {colors.map((color) => (
                <Button
                  key={color}
                  className="h-5 w-5 p-0 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
