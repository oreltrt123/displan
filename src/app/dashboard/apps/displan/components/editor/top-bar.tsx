"use client"

import { Eye, EyeOff, Save, Crown, User } from 'lucide-react'
import { useSubscription } from "../../../../../../hooks/use-subscription"
import { ResponsiveControls } from "./responsive-controls"

interface TopBarProps {
  isPreviewMode?: boolean
  onTogglePreview?: () => void
  onSave?: () => void
  isSaving?: boolean
  previewMode?: "desktop" | "tablet" | "mobile"
  onChangePreviewMode?: (mode: "desktop" | "tablet" | "mobile") => void
  canvasWidth?: number
  canvasHeight?: number
  onCanvasWidthChange?: (width: number) => void
  onCanvasHeightChange?: (height: number) => void
}

export function TopBar({
  isPreviewMode = false,
  onTogglePreview,
  onSave,
  isSaving = false,
  previewMode = "desktop",
  onChangePreviewMode,
  canvasWidth = 1200,
  canvasHeight = 800,
  onCanvasWidthChange,
  onCanvasHeightChange,
}: TopBarProps) {
  const { isSubscribed, isLoading, debug } = useSubscription()

  console.log("🎯 TopBar render - isSubscribed:", isSubscribed, "isLoading:", isLoading)

  const renderPlanBadge = () => {
    if (isLoading) {
      console.log("⏳ Rendering loading badge")
      return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      )
    }

    if (isSubscribed) {
      console.log("👑 Rendering PRO badge")
      return (
        <div
          className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full cursor-pointer"
          onClick={debug}
          title="Click to debug subscription"
        >
          <Crown className="w-3 h-3 text-white" />
          <span className="text-xs font-medium text-white">PRO</span>
        </div>
      )
    }

    console.log("👤 Rendering FREE badge")
    return (
      <div
        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer"
        onClick={debug}
        title="Click to debug subscription"
      >
        <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">FREE</span>
      </div>
    )
  }

  if (isPreviewMode) {
    return (
      <div className="flex flex-col w-full">
        <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
          <div className="flex items-center">{/* {renderPlanBadge()} */}</div>
          <button onClick={onTogglePreview} className="button_edit_project_r222323A">
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
        {isPreviewMode && onChangePreviewMode && (
          <div className="w-full bg-background border-t border-gray-200 dark:border-gray-800">
            <ResponsiveControls
              previewMode={previewMode}
              onChangePreviewMode={onChangePreviewMode}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onCanvasWidthChange={onCanvasWidthChange || (() => {})}
              onCanvasHeightChange={onCanvasHeightChange || (() => {})}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
      <div className="flex items-center">{/* {renderPlanBadge()} */}</div>
      <div className="flex gap-2">
        <button onClick={onSave} disabled={isSaving} className="button_edit_project_r222323A">
          <Save className="w-4 h-4" />
        </button>
        <button onClick={onTogglePreview} className="button_edit_project_r222323A">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
