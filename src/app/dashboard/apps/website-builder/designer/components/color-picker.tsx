"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"

interface ColorPickerProps {
  onClose: () => void
  onApplyTextColor: (color: string) => void
  onApplyBackgroundColor: (color: string) => void
  position: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}

export function ColorPicker({ onClose, onApplyTextColor, onApplyBackgroundColor, position }: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<"text" | "background">("text")
  const [selectedColor, setSelectedColor] = useState<string>("")

  // Predefined color palettes
  const colors = [
    // Reds
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
    // Oranges
    "#f97316",
    "#ea580c",
    "#c2410c",
    "#9a3412",
    "#7c2d12",
    // Yellows
    "#eab308",
    "#ca8a04",
    "#a16207",
    "#854d0e",
    "#713f12",
    // Greens
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#166534",
    "#14532d",
    // Blues
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
    "#1e3a8a",
    // Purples
    "#a855f7",
    "#9333ea",
    "#7e22ce",
    "#6b21a8",
    "#581c87",
    // Pinks
    "#ec4899",
    "#db2777",
    "#be185d",
    "#9d174d",
    "#831843",
    // Grays
    "#f9fafb",
    "#f3f4f6",
    "#e5e7eb",
    "#d1d5db",
    "#9ca3af",
    "#6b7280",
    "#4b5563",
    "#374151",
    "#1f2937",
    "#111827",
    "#030712",
  ]

  const handleApply = () => {
    if (!selectedColor) return

    if (activeTab === "text") {
      onApplyTextColor(selectedColor)
    } else {
      onApplyBackgroundColor(selectedColor)
    }
  }

  return (
    <div
      className="absolute bg-white rounded-md shadow-lg z-50 w-72 border border-gray-200"
      style={{
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        left: position.left,
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium text-sm">Color Picker</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "text" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("text")}
        >
          Text Color
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "background" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("background")}
        >
          Background
        </button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-8 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${
                selectedColor === color ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            >
              {selectedColor === color && <Check className="h-4 w-4 text-white mx-auto" />}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Color</label>
          <div className="flex">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="h-8 w-8 p-0 border-0"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              placeholder="#000000"
              className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleApply}
          disabled={!selectedColor}
          className={`
            px-4 py-2 rounded text-sm font-medium
            ${
              selectedColor
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }
            transition-colors duration-150
          `}
        >
          Apply Color
        </button>
      </div>
    </div>
  )
}
