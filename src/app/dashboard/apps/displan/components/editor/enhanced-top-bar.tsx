"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "../auth/user-menu"
import { AuthModal } from "../auth/auth-modal"
import { SupabaseConfigSidebar } from "./supabase-config-sidebar"
import { Play, Pause, Save, Monitor, Tablet, Smartphone, Settings } from "lucide-react"

interface EnhancedTopBarProps {
  isPreviewMode: boolean
  onTogglePreview: () => void
  onSave: () => void
  isSaving: boolean
  previewMode: "desktop" | "tablet" | "mobile"
  onChangePreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  canvasWidth: number
  canvasHeight: number
  onCanvasWidthChange: (width: number) => void
  onCanvasHeightChange: (height: number) => void
  selectedElement?: any
}

export function EnhancedTopBar({
  isPreviewMode,
  onTogglePreview,
  onSave,
  isSaving,
  previewMode,
  onChangePreviewMode,
  canvasWidth,
  canvasHeight,
  onCanvasWidthChange,
  onCanvasHeightChange,
  selectedElement,
}: EnhancedTopBarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem("user_email")
    setUserEmail(email)
  }, [])

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email)
  }

  const handleLogout = () => {
    setUserEmail(null)
  }

  const handleOpenSupabaseConfig = () => {
    setShowSupabaseConfig(true)
  }

  return (
    <>
      <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Website Builder</h1>

          {/* Preview Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => onChangePreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => onChangePreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => onChangePreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Save Button */}
          <Button onClick={onSave} disabled={isSaving} size="sm" variant="outline">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {/* Preview Toggle */}
          <Button onClick={onTogglePreview} size="sm" variant={isPreviewMode ? "default" : "outline"}>
            {isPreviewMode ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Exit Preview
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Preview
              </>
            )}
          </Button>

          {/* Supabase Config Button */}
          {userEmail && (
            <Button onClick={handleOpenSupabaseConfig} size="sm" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Database
            </Button>
          )}

          {/* User Menu */}
          <UserMenu
            userEmail={userEmail}
            onLogin={() => setShowAuthModal(true)}
            onLogout={handleLogout}
            onOpenSettings={handleOpenSupabaseConfig}
          />
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />

      {/* Supabase Config Sidebar */}
      <SupabaseConfigSidebar
        isOpen={showSupabaseConfig}
        onClose={() => setShowSupabaseConfig(false)}
        selectedElement={selectedElement}
      />
    </>
  )
}
