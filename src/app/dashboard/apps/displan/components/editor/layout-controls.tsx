"use client"

import { useState } from "react"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from "lucide-react"

interface LayoutControlsProps {
  element: any
  onUpdateLayout: (layoutData: any) => void
}

const DISPLAY_OPTIONS = [
  { value: "block", label: "block" },
  { value: "flex", label: "flex" },
  { value: "inline-block", label: "inline-block" },
  { value: "inline-flex", label: "inline-flex" },
  { value: "inline", label: "inline" },
  { value: "none", label: "none" },
]

const JUSTIFY_CONTENT_OPTIONS = [
  { value: "flex-start", icon: AlignLeft, label: "Start" },
  { value: "center", icon: AlignCenter, label: "Center" },
  { value: "flex-end", icon: AlignRight, label: "End" },
  { value: "space-between", icon: AlignJustify, label: "Space Between" },
]

const ALIGN_ITEMS_OPTIONS = [
  { value: "flex-start", icon: AlignStartVertical, label: "Start" },
  { value: "center", icon: AlignCenterVertical, label: "Center" },
  { value: "flex-end", icon: AlignEndVertical, label: "End" },
]

export function LayoutControls({ element, onUpdateLayout }: LayoutControlsProps) {
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false)

  const currentStyles = element?.styles || {}
  const display = currentStyles.display || "block"
  const justifyContent = currentStyles.justifyContent || "flex-start"
  const alignItems = currentStyles.alignItems || "flex-start"

  const handleDisplayChange = (newDisplay: string) => {
    console.log("🔥🔥🔥 DISPLAY CHANGE:", newDisplay)
    onUpdateLayout({ display: newDisplay })
    setShowDisplayDropdown(false)
  }

  const handleJustifyContentChange = (value: string) => {
    console.log("🔥🔥🔥 JUSTIFY CONTENT CHANGE:", value)
    onUpdateLayout({ justifyContent: value })
  }

  const handleAlignItemsChange = (value: string) => {
    console.log("🔥🔥🔥 ALIGN ITEMS CHANGE:", value)
    onUpdateLayout({ alignItems: value })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium">Layout</h3>

      {/* Display Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Display</label>
          <div className="relative">
            <button
              className="flex items-center justify-between w-32 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
            >
              <span>{DISPLAY_OPTIONS.find((opt) => opt.value === display)?.label || "block"}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDisplayDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {DISPLAY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => handleDisplayChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flex Controls - Only show when display is flex or inline-flex */}
        {(display === "flex" || display === "inline-flex") && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Align</label>
              <div className="flex gap-1">
                {JUSTIFY_CONTENT_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    className={`p-2 rounded border ${
                      justifyContent === value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleJustifyContentChange(value)}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sizing</label>
              <div className="flex gap-1">
                {ALIGN_ITEMS_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    className={`p-2 rounded border ${
                      alignItems === value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleAlignItemsChange(value)}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
