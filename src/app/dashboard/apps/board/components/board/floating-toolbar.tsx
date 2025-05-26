"use client"

import { Button } from "@/components/ui/button_edit"
import { Separator } from "@/components/ui/separator"
import { MousePointer2, Hand, Square, Circle, Type, Pen, RotateCcw } from "lucide-react"

interface FloatingToolbarProps {
  selectedTool: string
  selectedColor: string
  onToolChange: (tool: string) => void
  onColorChange: (color: string) => void
  onUndo: () => void
  canUndo: boolean
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

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "hand", icon: Hand, label: "Hand" },
  { id: "pen", icon: Pen, label: "Draw" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "text", icon: Type, label: "Text" },
]

export function FloatingToolbar({
  selectedTool,
  selectedColor,
  onToolChange,
  onColorChange,
  onUndo,
  canUndo,
}: FloatingToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/98 backdrop-blur-sm border border-gray-200/80 rounded-2xl px-6 py-4">
        <div className="flex items-center space-x-6">
          {/* Tools */}
          <div className="flex items-center space-x-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className={`h-12 w-12 p-0 rounded-xl transition-all duration-200 ${
                  selectedTool === tool.id
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "text-gray-700"
                }`}
                title={tool.label}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-10 bg-gray-300" />

          {/* Colors */}
          <div className="flex items-center space-x-2">
            {colors.map((color) => (
              <Button
                key={color}
                className="h-10 w-10 p-0 rounded-full border-2 hover:scale-110 transition-all duration-200 shadow-sm"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? "#3b82f6" : color === "#ffffff" ? "#e5e7eb" : "transparent",
                  boxShadow:
                    selectedColor === color ? "0 0 0 2px #3b82f6" : color === "#ffffff" ? "0 0 0 1px #e5e7eb" : "none",
                }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>

          <Separator orientation="vertical" className="h-10 bg-gray-300" />

          {/* Undo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-12 w-12 p-0 rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-gray-700"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
