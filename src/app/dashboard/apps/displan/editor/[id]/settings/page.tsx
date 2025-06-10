"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
  displan_project_designer_css_delete_project,
} from "../../../lib/actions/displan-project-settings-actions"
import { Loader2, CheckCircle, Trash2, ExternalLink } from "lucide-react"
import "../../../../../../../styles/sidebar_settings_editor.css"
import "../../../../website-builder/designer/styles/button.css"

export default function GeneralSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    published_url: "",
    is_published: false,
  })
  const [originalSettings, setOriginalSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    published_url: "",
    is_published: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSettings()

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [projectId])

  const loadSettings = async () => {
    setIsLoading(true)
    const result = await displan_project_designer_css_get_project_settings(projectId)
    if (result.success && result.data) {
      const projectData = {
        name: result.data.name || "",
        description: result.data.description || "",
        custom_url: result.data.custom_url || "",
        published_url: result.data.published_url || "",
        is_published: result.data.is_published || false,
      }
      setSettings(projectData)
      setOriginalSettings(projectData)
    } else {
      console.error("Failed to load settings:", result.error)
      setSaveMessage("Failed to load project settings")
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      const result = await displan_project_designer_css_update_project_settings(projectId, {
        name: settings.name,
        description: settings.description,
        custom_url: settings.custom_url,
      })

      if (result.success) {
        setOriginalSettings(settings)
        setSaveMessage("Settings saved successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        console.error("Save failed:", result.error)
        setSaveMessage(`Failed to save: ${result.error}`)
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveMessage("An error occurred while saving")
    }

    setIsSaving(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)

    try {
      console.log("Attempting to delete project:", projectId)

      const result = await displan_project_designer_css_delete_project(projectId)

      if (result.success) {
        console.log("Project deleted successfully")

        // Close modal after a brief delay to show loading state
        setTimeout(() => {
          setShowDeleteModal(false)
          setIsDeleting(false)

          // Show success notification
          setShowNotification(true)

          // Navigate to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard/apps/displan")
          }, 1000)

          // Auto-dismiss notification after 5 seconds
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        }, 1000)
      } else {
        console.error("Delete failed:", result.error)
        alert(`Failed to delete project: ${result.error}`)
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Unexpected error deleting project:", error)
      alert(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsDeleting(false)
    }
  }

  const handleOpenLivesite = () => {
    if (settings.published_url) {
      window.open(settings.published_url, "_blank")
    }
  }

  const hasChanges =
    JSON.stringify({
      name: settings.name,
      description: settings.description,
      custom_url: settings.custom_url,
    }) !==
    JSON.stringify({
      name: originalSettings.name,
      description: originalSettings.description,
      custom_url: originalSettings.custom_url,
    })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading project settings...</div>
      </div>
    )
  }

  // Delete confirmation modal
  const renderDeleteModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isDeleting ? closeDeleteModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10">
          <div className="">
            <h3 className="settings_nav_section_title122323">Delete Project</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isDeleting ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Deleting project...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  This action is permanent and cannot be undone. The project and all its contents, including files and
                  data, will be permanently deleted.
                </span>
                <div className="flex space-x-3">
                  <button onClick={closeDeleteModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Cancel
                  </button>
                  <button onClick={handleDeleteProject} className="button_edit_projectsfdafgfwf12_dfdd_delete">
                    Delete Project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Success notification
  const renderNotification = () => {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-up">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-white dark:text-black">Project successfully deleted</span>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="titl2_d2m1313 dark:text-white">Website Settings</h1>
            {settings.is_published && settings.published_url && (
              <button
                onClick={handleOpenLivesite}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{settings.published_url}</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
            <button onClick={handleSave} disabled={isSaving || !hasChanges} className="button_edit_project_r22232_Bu">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="settings_nav_section_title12">Project Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="input_field_re223"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="settings_nav_section_title12">Description</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={settings.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="simple_box_Description_site_r233 w-full"
              placeholder="Describe your project"
            />
          </div>
          <div>
            <label className="settings_nav_section_title12">Custom URL</label>
            <input
              type="url"
              value={settings.custom_url}
              onChange={(e) => handleInputChange("custom_url", e.target.value)}
              className="input_field_re223"
              placeholder="https://your-domain.com"
            />
          </div>
        </div>
      </div>

      {/* Delete Website Section */}
      <div className="bg-white dark:bg-black rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="titl2_d2m1313 dark:text-white">Delete Website</h1>
          </div>
        </div>
        <div className="space-y-4">
          <p className="safasfawfasf">
           By clicking delete, you confirm the permanent removal of your project, including all its content and its URL. This action is irreversible.
          </p>
          <button onClick={openDeleteModal} className="button_edit_project_r22232_Bu_delete">
            Delete Project
          </button>
        </div>
      </div>

      {showDeleteModal && renderDeleteModal()}
      {showNotification && renderNotification()}
    </>
  )
}
