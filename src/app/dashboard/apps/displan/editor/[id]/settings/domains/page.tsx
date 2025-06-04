"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DeploymentSection } from "@/components/deployment-section"
import { displan_project_designer_css_get_project_settings } from "../../../../lib/actions/displan-project-settings-actions"
import "../../../../../../../../styles/sidebar_settings_editor.css"

export default function DomainsSettingsPage() {
  const params = useParams()
  const projectId = params.id as string

  const [projectData, setProjectData] = useState({
    currentSubdomain: "",
    isPublished: false,
    publishedUrl: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  const loadProjectData = async () => {
    setIsLoading(true)
    try {
      const result = await displan_project_designer_css_get_project_settings(projectId)
      if (result.success && result.data) {
        // Extract subdomain from published_url if it exists
        let currentSubdomain = ""
        if (result.data.published_url) {
          const match = result.data.published_url.match(/https:\/\/(.+)\.displan\.design/)
          if (match) {
            currentSubdomain = match[1]
          }
        }

        setProjectData({
          currentSubdomain: currentSubdomain,
          isPublished: result.data.is_published || false,
          publishedUrl: result.data.published_url || "",
        })
      }
    } catch (error) {
      console.error("Failed to load project data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading deployment settings...</div>
      </div>
    )
  }

  return (
    <DeploymentSection
      projectId={projectId}
      currentSubdomain={projectData.currentSubdomain}
      isPublished={projectData.isPublished}
      onDeploymentSuccess={loadProjectData} // Refresh data after successful deployment
    />
  )
}
