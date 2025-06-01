"use client"

import type React from "react"

import type { DisplanProjectDesignerCssProject } from "../lib/types/displan-types"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, Crown, User } from "lucide-react"
import { useState, useEffect } from "react"

interface DisplanProjectCardProps {
  project: DisplanProjectDesignerCssProject
  viewMode: "grid" | "list"
  onOpenProject: (projectId: string) => void
}

export function DisplanProjectCard({ project, viewMode, onOpenProject }: DisplanProjectCardProps) {
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
          console.log("ProjectCard: Found subscription data:", parsedData)

          if (parsedData.active && parsedData.userId === userId && new Date(parsedData.expiresAt) > new Date()) {
            console.log("ProjectCard: User has active subscription")
            setUserPlan("pro")
            return
          }
        } catch (e) {
          console.error("Error parsing subscription data:", e)
        }
      }

      // Default to free if no valid subscription found
      console.log("ProjectCard: No valid subscription found, setting to free")
      setUserPlan("free")
    } catch (error) {
      console.error("ProjectCard: Failed to check user plan:", error)
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

  const handleOpenProject = () => {
    onOpenProject(project.id)
  }

  const handleOpenLivesite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.published_url) {
      window.open(project.published_url, "_blank")
    }
  }

  // Render plan badge
  const renderPlanBadge = () => {
    if (userPlan === "loading") {
      return (
        <div className="badge_b1arctdq clickable_csx2rjz plans_p10t7dc2 loadingSite">
          <span className="badge_b1arctdq_loading_span_text">Loading...</span>
        </div>
      )
    }

    if (userPlan === "pro") {
      return (
        <div className="badge_b1arctdq clickable_csx2rjz plans_p10t7dc2 proSite">
          <Crown className="w-3 h-3 mr-1 text-white" />
          <span className="badge_b1arctdq_pro_span_text">Pro</span>
        </div>
      )
    }

    return (
      <div className="badge_b1arctdq clickable_csx2rjz plans_p10t7dc2 freeSite">
        <span className="badge_b1arctdq_free_span_text">Free</span>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
            preview
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">
              Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </p>
            {project.published_url && (
              <button
                onClick={handleOpenLivesite}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {project.published_url}
              </button>
            )}
          </div>
        </div>
        {renderPlanBadge()}
        <button
          onClick={handleOpenProject}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Open project
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-background p-4 hover:shadow-md transition-shadow" onClick={handleOpenProject}>
      {project.social_preview_url ? (
        <img
          src={project.social_preview_url || "/placeholder.svg"}
          alt="Project preview"
          className="thumbnailContainerDark"
        />
      ) : (
        <div className="thumbnailContainerDark"></div>
      )}
      <div className="space-y-2 _dddddd1_project">
        {renderPlanBadge()}
        <h3 className="text-sm Text_css_project_simple">{project.name}</h3>
        <p className="Text_css_project_simple_p">
          Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
        </p>
        {project.published_url && (
          <button onClick={handleOpenLivesite} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            {project.published_url}
          </button>
        )}
      </div>
    </div>
  )
}