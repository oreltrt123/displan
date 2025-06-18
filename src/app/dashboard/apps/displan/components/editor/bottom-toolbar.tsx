"use client"

import { useState, useEffect } from "react"
import { useRouter , usePathname } from "next/navigation"
import { Settings } from "lucide-react"
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
  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode)

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("displan-theme")
    if (savedTheme) {
      const isDark = savedTheme === "dark"
      setLocalDarkMode(isDark)
      // If the parent component's isDarkMode doesn't match localStorage, sync it
      if (isDark !== isDarkMode) {
        onToggleDarkMode()
      }
    } else {
      // If no saved theme, save the current state
      localStorage.setItem("displan-theme", isDarkMode ? "dark" : "light")
      setLocalDarkMode(isDarkMode)
    }
  }, [])

  // Update localStorage and local state when theme changes
  const handleToggleDarkMode = () => {
    const newDarkMode = !localDarkMode
    setLocalDarkMode(newDarkMode)
    localStorage.setItem("displan-theme", newDarkMode ? "dark" : "light")
    onToggleDarkMode()
  }
  const pathname = usePathname()
    const getProjectId = (): string => {
    if (projectId) return projectId
    
    // Extract from pathname: /dashboard/apps/displan/editor/[id]/...
    const pathSegments = pathname.split('/')
    const editorIndex = pathSegments.findIndex(segment => segment === 'editor')
    
    if (editorIndex !== -1 && pathSegments[editorIndex + 1]) {
      return pathSegments[editorIndex + 1]
    }
    
    return 'default' // fallback
  }

  const currentProjectId = getProjectId()

  // Sync with parent component's isDarkMode prop changes
  useEffect(() => {
    if (isDarkMode !== localDarkMode) {
      setLocalDarkMode(isDarkMode)
    }
  }, [isDarkMode])

  const handleZoomSubmit = () => {
    const newZoom = Math.min(1000, Math.max(10, Number.parseInt(zoomInputValue) || 100))
    onZoomChange(newZoom)
    setShowZoomInput(false)
  }

  const handleSettingsClick = () => {
    router.push(`/dashboard/apps/displan/editor/${currentProjectId}/settings`)
  }

  // Use localDarkMode for consistent theming
  const currentTheme = localDarkMode

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`rounded-full px-4 py-2 flex items-center space-x-4 ${currentTheme ? "bg-black" : "bg-white"} thumbnailContainerDarkNone`}
      >
        {/* Tool Buttons */}
        <button
          onClick={() => onToolChange("cursor")}
          className={`p-2 rounded-full ${
            currentTool === "cursor"
              ? currentTheme
                ? "bg-[#8888881A]"
                : "bg-[#8888881A]"
              : currentTheme
                ? "hover:bg-[#8888881A]"
                : "hover:bg-[#8888881A]"
          }`}
        >
            <img className="dark:hidden" width="20" height="20" src="/components/editor/cursor_light.png" alt="" />
            <img className="hidden dark:block" width="20" height="20" src="/components/editor/cursor_dark.png" alt="" />
        </button>

        <button
          onClick={() => onToolChange("hand")}
          className={`p-2 rounded-full ${
            currentTool === "hand"
              ? currentTheme
                ? "bg-[#8888881A]"
                : "bg-[#8888881A]"
              : currentTheme
                ? "hover:bg-[#8888881A]"
                : "hover:bg-[#8888881A]"
          }`}
        >
            <img className="dark:hidden" width="20" height="20" src="/components/editor/hand_light.png" alt="" />
            <img className="hidden dark:block" width="20" height="20" src="/components/editor/hand_dark.png" alt="" />
        </button>

        <button
          onClick={() => onToolChange("comment")}
          className={`p-2 rounded-full ${
            currentTool === "comment"
              ? currentTheme
                ? "bg-[#8888881A]"
                : "bg-[#8888881A]"
              : currentTheme
                ? "hover:bg-[#8888881A]"
                : "hover:bg-[#8888881A]"
          }`}
        >
            <img className="dark:hidden" width="20" height="20" src="/components/editor/comments_light.png" alt="" />
            <img className="hidden dark:block" width="20" height="20" src="/components/editor/comments_dark.png" alt="" />
        </button>

        {/* Divider */}
        <div className={`w-px h-6 ${currentTheme ? "bg-gray-600" : "bg-gray-400"}`} />

        {/* Dark Mode Toggle */}
        <button
          onClick={handleToggleDarkMode}
          className={`p-2 rounded-full ${currentTheme ? "hover:bg-[#8888881A]" : "hover:bg-[#8888881A]"}`}
          title={currentTheme ? "Switch to light mode" : "Switch to dark mode"}
        >
          {currentTheme ? (
          <img width="20" height="20" src="/components/editor/sun.png" alt="" />
          ) : (
          <img width="20" height="20" src="/components/editor/moon.png" alt="" />
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
                className={`w-16 px-2 py-1 text-sm rounded ${currentTheme ? "bg-[#8888881A] text-white" : "bg-[#8888881A] text-black"}`}
                min="10"
                max="1000"
                autoFocus
              />
              <span className={`text-sm ml-1 ${currentTheme ? "text-white" : "text-black"}`}>%</span>
            </div>
          ) : (
            <button
              onClick={() => setShowZoomInput(true)}
              className={`text-sm px-2 py-1 rounded ${currentTheme ? "text-white hover:bg-[#8888881A]" : "text-black hover:bg-[#8888881A]"}`}
            >
              {zoom}%
            </button>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={handleSettingsClick}
          className={`px-3 py-1 text-sm rounded flex items-center ${
            currentTheme
              ? "bg-[#8888881A] text-white hover:bg-[#8888881A]"
              : "bg-[#8888881A] text-black hover:bg-[#8888881A]"
          }`}
        >
          Settings
        </button>
      </div>
    </div>
  )
}
