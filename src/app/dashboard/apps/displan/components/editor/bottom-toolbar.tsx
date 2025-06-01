"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MousePointer, Hand, MessageCircle, Sun, Moon, Grid3X3, Settings } from 'lucide-react'
import type { EditorTool } from "../../lib/types/displan-editor-types"

interface BottomToolbarProps {
  currentTool: EditorTool
  onToolChange: (tool: EditorTool) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  zoom: number
  onZoomChange: (zoom: number) => void
  projectId: string
}

export function BottomToolbar({
  currentTool,
  onToolChange,
  isDarkMode,
  onToggleDarkMode,
  zoom,
  onZoomChange,
  projectId,
}: BottomToolbarProps) {
  const router = useRouter()
  const [showZoomInput, setShowZoomInput] = useState(false)
  const [zoomInputValue, setZoomInputValue] = useState(zoom.toString())

  const handleZoomSubmit = () => {
    const newZoom = Math.min(1000, Math.max(10, Number.parseInt(zoomInputValue) || 100))
    onZoomChange(newZoom)
    setShowZoomInput(false)
  }

  const handleSettingsClick = () => {
    router.push(`/dashboard/apps/displan/editor/${projectId}/settings`)
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`rounded-full px-4 py-2 flex items-center space-x-4 ${isDarkMode ? 'bg-black' : 'bg-white'} thumbnailContainerDarkNone`}>
        {/* Tool Buttons */}
        <button
          onClick={() => onToolChange("cursor")}
          className={`p-2 rounded ${currentTool === "cursor"
            ? (isDarkMode ? "bg-[#8888881A]" : "bg-[#8888881A]")
            : (isDarkMode ? "hover:bg-[#8888881A]" : "hover:bg-[#8888881A]")}`}
        >
          <svg className={`w-4 h-4 ${isDarkMode ? "text-white" : "text-black"}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M 4.346 2.449 C 3.173 2.058 2.058 3.173 2.449 4.346 L 6.232 15.697 C 6.585 16.755 7.928 17.072 8.716 16.284 L 16.284 8.716 C 17.072 7.928 16.755 6.585 15.697 6.232 Z" fill="currentColor"></path><path d="M 12 12 L 16.5 16.5" fill="transparent" stroke-width="2" stroke="currentColor" stroke-linecap="round"></path></svg>
        </button>

        <button
          onClick={() => onToolChange("hand")}
          className={`p-2 rounded ${currentTool === "hand"
            ? (isDarkMode ? "bg-[#8888881A]" : "bg-[#8888881A]")
            : (isDarkMode ? "hover:bg-[#8888881A]" : "hover:bg-[#8888881A]")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"><path d="M 9.077 18.462 C 12.63 19.251 16 16.548 16 12.908 L 16 5 C 16 4.448 15.552 4 15 4 L 15 4 C 14.448 4 14 4.448 14 5 L 14 8 L 14 8.5 C 14 8.776 13.776 9 13.5 9 L 13.5 9 C 13.224 9 13 8.776 13 8.5 L 13 3 C 13 2.448 12.552 2 12 2 L 12 2 C 11.448 2 11 2.448 11 3 L 11 8.5 C 11 8.776 10.776 9 10.5 9 L 10.5 9 C 10.224 9 10 8.776 10 8.5 L 10 2 C 10 1.448 9.552 1 9 1 L 9 1 C 8.448 1 8 1.448 8 2 L 8 8.5 C 8 8.776 7.776 9 7.5 9 L 7.5 9 C 7.224 9 7 8.776 7 8.5 L 7 4 C 7 3.448 6.552 3 6 3 L 6 3 C 5.448 3 5 3.448 5 4 L 5 10 L 5 10.463 C 5 10.991 4.343 11.234 4 10.833 L 2.813 9.449 C 2.356 8.915 1.563 8.828 1 9.25 L 1 9.25 C 0.46 9.655 0.379 10.433 0.823 10.941 L 5.705 16.52 C 6.546 17.482 7.672 18.149 8.919 18.426 Z" fill="currentColor"></path></svg>
        </button>

        <button
          onClick={() => onToolChange("comment")}
          className={`p-2 rounded ${currentTool === "comment"
            ? (isDarkMode ? "bg-[#8888881A]" : "bg-[#8888881A]")
            : (isDarkMode ? "hover:bg-[#8888881A]" : "hover:bg-[#8888881A]")}`}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" role="presentation"><path d="M10 2a8 8 0 0 1 0 16H4a2 2 0 0 1-2-2v-6a8 8 0 0 1 8-8Z " fill="currentColor"></path></svg>
        </button>

        {/* Divider */}
        <div className={`w-px h-6 ${isDarkMode ? "bg-gray-600" : "bg-gray-400"}`} />

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded ${isDarkMode ? "hover:bg-[#8888881A]" : "hover:bg-[#8888881A]"}`}
        >
          {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g><g transform="translate(9 0)"><path d="M 0 1 C 0 0.448 0.448 0 1 0 L 1 0 C 1.552 0 2 0.448 2 1 L 2 3 C 2 3.552 1.552 4 1 4 L 1 4 C 0.448 4 0 3.552 0 3 Z" fill="currentColor"></path><path d="M 0 17 C 0 16.448 0.448 16 1 16 L 1 16 C 1.552 16 2 16.448 2 17 L 2 19 C 2 19.552 1.552 20 1 20 L 1 20 C 0.448 20 0 19.552 0 19 Z" fill="currentColor"></path></g><g transform="translate(9 0) rotate(-90 1 10)"><path d="M 0 1 C 0 0.448 0.448 0 1 0 L 1 0 C 1.552 0 2 0.448 2 1 L 2 3 C 2 3.552 1.552 4 1 4 L 1 4 C 0.448 4 0 3.552 0 3 Z" fill="currentColor"></path><path d="M 0 17 C 0 16.448 0.448 16 1 16 L 1 16 C 1.552 16 2 16.448 2 17 L 2 19 C 2 19.552 1.552 20 1 20 L 1 20 C 0.448 20 0 19.552 0 19 Z" fill="currentColor"></path></g></g><g transform="rotate(45 10 10)"><g transform="translate(9 0)"><path d="M 0 1 C 0 0.448 0.448 0 1 0 L 1 0 C 1.552 0 2 0.448 2 1 L 2 3 C 2 3.552 1.552 4 1 4 L 1 4 C 0.448 4 0 3.552 0 3 Z" fill="currentColor"></path><path d="M 0 17 C 0 16.448 0.448 16 1 16 L 1 16 C 1.552 16 2 16.448 2 17 L 2 19 C 2 19.552 1.552 20 1 20 L 1 20 C 0.448 20 0 19.552 0 19 Z" fill="currentColor"></path></g><g transform="translate(9 0) rotate(-90 1 10)"><path d="M 0 1 C 0 0.448 0.448 0 1 0 L 1 0 C 1.552 0 2 0.448 2 1 L 2 3 C 2 3.552 1.552 4 1 4 L 1 4 C 0.448 4 0 3.552 0 3 Z" fill="currentColor"></path><path d="M 0 17 C 0 16.448 0.448 16 1 16 L 1 16 C 1.552 16 2 16.448 2 17 L 2 19 C 2 19.552 1.552 20 1 20 L 1 20 C 0.448 20 0 19.552 0 19 Z" fill="currentColor"></path></g></g><path d="M 10 6 C 12.209 6 14 7.791 14 10 C 14 12.209 12.209 14 10 14 C 7.791 14 6 12.209 6 10 C 6 7.791 7.791 6 10 6 Z" fill="currentColor"></path></svg>          ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M 17.969 11.679 C 17.883 11.402 17.625 11.213 17.335 11.216 L 17.156 11.248 C 14.784 11.903 12.243 11.232 10.504 9.491 C 8.765 7.75 8.096 5.208 8.753 2.836 C 8.769 2.789 8.777 2.74 8.777 2.69 C 8.793 2.477 8.702 2.27 8.534 2.138 C 8.366 2.005 8.143 1.965 7.939 2.031 C 4.16 3.09 1.676 6.698 2.034 10.607 C 2.392 14.516 5.49 17.611 9.399 17.966 C 13.308 18.321 16.913 15.834 17.969 12.054 C 18.01 11.932 18.01 11.801 17.969 11.679 Z" fill="currentColor"></path></svg>
          )}
        </button>

        {/* Zoom Control */}
        <div className="relative">
          {showZoomInput ? (
            <div className="flex items-center">
              <input
                type="number"
                value={zoomInputValue}
                onChange={(e) => setZoomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleZoomSubmit()
                  } else if (e.key === "Escape") {
                    setShowZoomInput(false)
                    setZoomInputValue(zoom.toString())
                  }
                }}
                onBlur={handleZoomSubmit}
                className={`w-16 px-2 py-1 text-sm rounded ${isDarkMode ? "bg-bg-[#8888881A] text-white" : "bg-[#8888881A] text-black"}`}
                min="10"
                max="1000"
                autoFocus
              />
              <span className={`text-sm ml-1 ${isDarkMode ? "text-white" : "text-black"}`}>%</span>
            </div>
          ) : (
            <button
              onClick={() => setShowZoomInput(true)}
              className={`text-sm px-2 py-1 rounded ${isDarkMode ? "text-white hover:bg-[#8888881A]" : "text-black hover:bg-[#8888881A]"}`}
            >
              {zoom}%
            </button>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={handleSettingsClick}
          className={`px-3 py-1 text-sm rounded flex items-center ${isDarkMode
            ? "bg-[#8888881A] text-white hover:bg-[#8888881A]"
            : "bg-[#8888881A] text-black hover:bg-[#8888881A]"}`}
        >
          <Settings className="w-3 h-3 mr-1" />
          Settings
        </button>
      </div>
    </div>
  )
}
