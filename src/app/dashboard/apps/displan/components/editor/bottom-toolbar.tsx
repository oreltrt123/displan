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
      <div className="bg-gray-900 dark:bg-white rounded-full px-4 py-2 flex items-center space-x-4 shadow-lg">
        <button
          onClick={() => onToolChange("cursor")}
          className={`p-2 rounded ${
            currentTool === "cursor" ? "bg-gray-700 dark:bg-gray-300" : "hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          <MousePointer className="w-4 h-4 text-white dark:text-gray-900" />
        </button>
        <button
          onClick={() => onToolChange("hand")}
          className={`p-2 rounded ${
            currentTool === "hand" ? "bg-gray-700 dark:bg-gray-300" : "hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          <Hand className="w-4 h-4 text-white dark:text-gray-900" />
        </button>
        <button
          onClick={() => onToolChange("comment")}
          className={`p-2 rounded ${
            currentTool === "comment" ? "bg-gray-700 dark:bg-gray-300" : "hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          <MessageCircle className="w-4 h-4 text-white dark:text-gray-900" />
        </button>
        <div className="w-px h-6 bg-gray-600 dark:bg-gray-400"></div>
        <button onClick={onToggleDarkMode} className="p-2 hover:bg-gray-800 dark:hover:bg-gray-200 rounded">
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-white dark:text-gray-900" />
          ) : (
            <Moon className="w-4 h-4 text-white dark:text-gray-900" />
          )}
        </button>
        <button className="p-2 hover:bg-gray-800 dark:hover:bg-gray-200 rounded">
          <Grid3X3 className="w-4 h-4 text-white dark:text-gray-900" />
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
                className="w-16 px-2 py-1 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded"
                min="10"
                max="1000"
                autoFocus
              />
              <span className="text-sm text-white dark:text-gray-900 ml-1">%</span>
            </div>
          ) : (
            <button
              onClick={() => setShowZoomInput(true)}
              className="text-sm text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 px-2 py-1 rounded"
            >
              {zoom}%
            </button>
          )}
        </div>

        <button
          onClick={handleSettingsClick}
          className="px-3 py-1 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-400 flex items-center"
        >
          <Settings className="w-3 h-3 mr-1" />
          Settings
        </button>
      </div>
    </div>
  )
}
