"use client"

import { Play, Save, X } from "lucide-react"

interface TopBarProps {
  isPreviewMode?: boolean
  onTogglePreview?: () => void
  onSave?: () => void
  isSaving?: boolean
}

export function TopBar({ isPreviewMode = false, onTogglePreview, onSave, isSaving = false }: TopBarProps) {
  if (isPreviewMode) {
    return (
      <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-4">
        <button
          onClick={onTogglePreview}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-sm hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
          <span>Stop Preview</span>
        </button>
      </div>
    )
  }

  return (
    <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onTogglePreview}
          className="flex items-center space-x-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded"
        >
          <Play className="w-4 h-4 fill-current" />
          <span className="text-sm">Preview</span>
        </button>
        <span className="text-sm text-gray-900 dark:text-white">Desktop</span>
        <span className="text-gray-500 dark:text-gray-400">1200</span>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center space-x-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{isSaving ? "Saving..." : "Save"}</span>
      </button>
    </div>
  )
}
