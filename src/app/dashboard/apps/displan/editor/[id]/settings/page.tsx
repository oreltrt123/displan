"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
} from "../../../lib/actions/displan-project-settings-actions"
import "../../../../website-builder/designer/styles/button.css"
import { TopBar } from "../../../components/editor/top-bar"
import type { DisplanCanvasElement } from "../../../lib/types/displan-canvas-types"
import {
  displan_project_designer_css_save_canvas,
} from "../../../lib/actions/displan-canvas-actions"

export default function ProjectSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    favicon_url: "",
    social_preview_url: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    favicon_url: "",
    social_preview_url: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    loadSettings()
  }, [projectId])

  const loadSettings = async () => {
    setIsLoading(true)
    const result = await displan_project_designer_css_get_project_settings(projectId)
    if (result.success && result.data) {
      const projectData = {
        name: result.data.name || "",
        description: result.data.description || "",
        custom_url: result.data.custom_url || "",
        favicon_url: result.data.favicon_url || "",
        social_preview_url: result.data.social_preview_url || "",
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
      const result = await displan_project_designer_css_update_project_settings(projectId, settings)

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

  const handleTogglePreviewMode = () => {
    console.log("Toggling preview mode from", isPreviewMode, "to", !isPreviewMode)
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      setSelectedElement(null)
    }
  }
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<DisplanCanvasElement | null>(null)

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings)
  const handleSaveCanvas = async () => {
    console.log("Saving canvas...")
    setIsSaving(true)
    try {
      const result = await displan_project_designer_css_save_canvas(projectId, currentPage)
      if (result.success) {
        console.log("Canvas saved successfully")
      } else {
        console.error("Failed to save canvas:", result.error)
      }
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }
  const [currentPage, setCurrentPage] = useState("home")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading project settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#8888881A] dark:bg-gray-900">
            <TopBar
              isPreviewMode={isPreviewMode}
              onTogglePreview={handleTogglePreviewMode}
              onSave={handleSaveCanvas}
              isSaving={isSaving}
            />
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="button_edit_project_r22232_Bu"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="input_field_re223"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom URL</label>
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

          {/* Branding */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={settings.favicon_url}
                    onChange={(e) => handleInputChange("favicon_url", e.target.value)}
                    className="input_field_re223"
                    placeholder="https://example.com/favicon.ico"
                  />
                  {settings.favicon_url && (
                    <img src={settings.favicon_url || "/placeholder.svg"} alt="Favicon" className="w-8 h-8" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The small icon that appears in browser tabs
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Preview Image URL
                </label>
                <div className="space-y-2">
                  <input
                  type="url"
                  value={settings.social_preview_url}
                  onChange={(e) => handleInputChange("social_preview_url", e.target.value)}
                  className="input_field_re223"
                  placeholder="https://example.com/social-preview.jpg"
                  />
                  {settings.social_preview_url && (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2">
                      <img
                        src={settings.social_preview_url || "/placeholder.svg"}
                        alt="Social Preview"
                        className="w-full max-w-md h-auto rounded"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Image shown when your site is shared on social media (1200x630px recommended)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
