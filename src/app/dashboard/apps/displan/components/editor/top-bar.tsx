"use client"

import { Eye, EyeOff, Save, Crown, User } from "lucide-react"
import { useState, useEffect } from "react"
import "../../../website-builder/designer/styles/button.css"

interface TopBarProps {
  isPreviewMode?: boolean
  onTogglePreview?: () => void
  onSave?: () => void
  isSaving?: boolean
}

export function TopBar({ isPreviewMode = false, onTogglePreview, onSave, isSaving = false }: TopBarProps) {
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "loading">("loading")

  useEffect(() => {
    checkUserPlan()

    // Listen for subscription changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "displan_ai_subscription") {
        checkUserPlan()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Check user plan
  const checkUserPlan = () => {
    try {
      // Get current user ID
      const userId = getCurrentUserId()

      if (!userId) {
        setUserPlan("free")
        return
      }

      // Check localStorage for subscription
      const subscriptionData = localStorage.getItem("displan_ai_subscription")
      if (subscriptionData) {
        try {
          const parsedData = JSON.parse(subscriptionData)
          console.log("TopBar: Found subscription data:", parsedData)

          if (parsedData.active && parsedData.userId === userId && new Date(parsedData.expiresAt) > new Date()) {
            console.log("TopBar: User has active subscription")
            setUserPlan("pro")
            return
          }
        } catch (e) {
          console.error("Error parsing subscription data:", e)
        }
      }

      // Default to free if no valid subscription found
      console.log("TopBar: No valid subscription found, setting to free")
      setUserPlan("free")
    } catch (error) {
      console.error("TopBar: Failed to check user plan:", error)
      setUserPlan("free")
    }
  }

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    let userId = localStorage.getItem("displan_user_id")
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("displan_user_id", userId)
    }
    return userId
  }

  if (isPreviewMode) {
    return (
    <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
        <div className="flex items-center">
          {userPlan === "loading" ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          ) : userPlan === "pro" ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-xs font-medium text-white">PRO</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">FREE</span>
            </div>
          )}
        </div>
        <button onClick={onTogglePreview} className="button_edit_project_r222323A">
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="h-12 bg-white dark:bg-black flex items-center justify-between px-4">
      <div className="flex items-center">
        {userPlan === "loading" ? (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : userPlan === "pro" ? (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Crown className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">PRO</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-[#8383832b] rounded-full">
            <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">FREE</span>
          </div>
        )}
      </div>
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
