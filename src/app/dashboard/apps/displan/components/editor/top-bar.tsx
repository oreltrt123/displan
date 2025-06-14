"use client"

import type React from "react"
import { Save, Crown, User, ArrowLeft, Search, Home, File, Settings, UserIcon, Download } from "lucide-react"
import { useSubscription } from "../../../../../../hooks/use-subscription"
import { ResponsiveControls } from "./responsive-controls"
import { CodeExportModal } from "./code-export-modal"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import "../../../website-builder/designer/styles/button.css"

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
  projectId?: string
  canvasElements?: any[] // Add canvas elements prop
}

interface CommandPaletteItem {
  id: string
  title: string
  icon: React.ReactNode
  action: () => void
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
  projectId,
  canvasElements = [],
}: TopBarProps) {
  const { isSubscribed, isLoading, debug } = useSubscription()
  const router = useRouter()
  const pathname = usePathname()
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [commandButtonRect, setCommandButtonRect] = useState<DOMRect | null>(null)

  // Extract project ID from URL if not provided as prop
  const getProjectId = (): string => {
    if (projectId) return projectId

    // Extract from pathname: /dashboard/apps/displan/editor/[id]/...
    const pathSegments = pathname.split("/")
    const editorIndex = pathSegments.findIndex((segment) => segment === "editor")

    if (editorIndex !== -1 && pathSegments[editorIndex + 1]) {
      return pathSegments[editorIndex + 1]
    }

    return "default" // fallback
  }

  const currentProjectId = getProjectId()

  console.log(
    "🎯 TopBar render - isSubscribed:",
    isSubscribed,
    "isLoading:",
    isLoading,
    "projectId:",
    currentProjectId,
    "elements:",
    canvasElements.length,
  )

  // Check if we're on a settings page
  const isOnSettingsPage = pathname.includes("/settings")

  // Command palette items
  const commandItems: CommandPaletteItem[] = [
    {
      id: "dashboard",
      title: "Return to Dashboard",
      icon: <Home className="w-4 h-4" />,
      action: () => {
        router.push("/dashboard/apps/displan")
        setIsCommandPaletteOpen(false)
      },
    },
    {
      id: "files",
      title: "Files",
      icon: <File className="w-4 h-4" />,
      action: () => {
        // Add your file action here
        console.log("Files clicked")
        setIsCommandPaletteOpen(false)
      },
    },
    {
      id: "project-settings",
      title: "Project Settings",
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        router.push(`/dashboard/apps/displan/editor/${currentProjectId}/settings`)
        setIsCommandPaletteOpen(false)
      },
    },
    {
      id: "account",
      title: "Account",
      icon: <UserIcon className="w-4 h-4" />,
      action: () => {
        router.push("/dashboard/settings/account")
        setIsCommandPaletteOpen(false)
      },
    },
  ]

  // Filter items based on search query
  const filteredItems = commandItems.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handle publish button click
  const handlePublish = () => {
    router.push(`/dashboard/apps/displan/editor/${currentProjectId}/settings/domains`)
  }

  // Handle back to editor click
  const handleBackToEditor = () => {
    router.push(`/dashboard/apps/displan/editor/${currentProjectId}`)
  }

  // Handle export button click
  const handleExport = () => {
    console.log("🚀 Export clicked - elements:", canvasElements.length)
    setIsExportModalOpen(true)
  }

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = e.currentTarget.getBoundingClientRect()
    setCommandButtonRect(buttonRect)
    setIsCommandPaletteOpen(true)
  }

  // Close command palette on escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false)
        setSearchQuery("")
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isCommandPaletteOpen) {
        const target = e.target as Element
        if (!target.closest("[data-command-palette]")) {
          setIsCommandPaletteOpen(false)
          setSearchQuery("")
        }
      }
    }

    if (isCommandPaletteOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isCommandPaletteOpen])

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
          <div className="flex items-center gap-3">
            {/* Logo/Site Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#8888881A] transition-colors asfasfawfasffw"
              title="Open command palette"
            >
              <img src="/components/editor/logo_editor.png" alt="" />
            </button>

            {/* Back to Editor button - only show on settings pages */}
            {isOnSettingsPage && (
              <button onClick={handleBackToEditor} className="button_edit_project_r222323A" title="Back to Editor">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={onSave} disabled={isSaving} className="button_edit_project_r222323A" title="Save">
              <Save className="w-4 h-4" />
            </button>

            <button onClick={handleExport} className="button_edit_project_r222323A" title="Export Code">
              <Download className="w-4 h-4" />
            </button>

            <button onClick={onTogglePreview} className="button_edit_project_r222323A" title="Exit Preview">
              <img src="/components/editor/focus_.png" alt="" />
            </button>

            {/* Publish button */}
            <button onClick={handlePublish} className="button_edit_project">
              Publish
            </button>
          </div>
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
    <>
      <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Logo/Site Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#8888881A] transition-colors asfasfawfasffw"
            title="Open command palette"
          >
            <img className="dark:hidden" src="/components/editor/logo_editor_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/logo_editor_dark.png" alt="" />
          </button>
        </div>

        <div className="flex gap-2">
          {/* Back to Editor button - only show on settings pages */}
          {isOnSettingsPage && (
            <button onClick={handleBackToEditor} className="button_edit_project_r222323A" title="Back to Editor">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button onClick={onSave} disabled={isSaving} className="button_edit_project_r222323A" title="Save">
            <Save className="w-4 h-4" />
          </button>

          {/* <button onClick={handleExport} className="button_edit_project_r222323A" title="Export Code">
            <Download className="w-4 h-4" />
          </button> */}

          <button onClick={onTogglePreview} className="button_edit_project_r222323A" title="Preview">
            <img src="/components/editor/focus.png" alt="" />
          </button>

          {/* Publish button */}
          <button onClick={handlePublish} className="button_edit_project">
            Publish
          </button>
        </div>
      </div>

      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <div
          data-command-palette
          className="fixed z-50 menu_container12212re2"
          style={{
            top: commandButtonRect ? `${commandButtonRect.bottom + 8}px` : "60px",
            left: commandButtonRect ? `${commandButtonRect.left}px` : "16px",
          }}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-[#8888881A]">
            <Search className="w-4 h-4 text-white mr-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white"
              autoFocus
            />
          </div>

          {/* Command Items */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button key={item.id} onClick={item.action} className="menu_itemmenu_container12212re2">
                  <span className="text-sm text-white sadawdsdawdsd112rrrr242">{item.title}</span>
                  <img className="dgsdgsdgsegeg" src="/components/editor/external-link.png" alt="" />
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-white">No results found</div>
            )}
          </div>
        </div>
      )}

      {/* Export Modal */}
      <CodeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        canvasElements={canvasElements}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        projectId={currentProjectId}
      />
    </>
  )
}
