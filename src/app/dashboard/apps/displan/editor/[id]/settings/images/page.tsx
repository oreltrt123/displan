"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Upload } from "lucide-react"
import { ImageIcon } from "lucide-react"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
} from "../../../../lib/actions/displan-project-settings-actions"

export default function ImagesSettingsPage() {
  const params = useParams()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    social_preview_url: "",
    favicon_light_url: "",
    favicon_dark_url: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    social_preview_url: "",
    favicon_light_url: "",
    favicon_dark_url: "",
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
        social_preview_url: result.data.social_preview_url || "",
        favicon_light_url: result.data.favicon_light_url || "",
        favicon_dark_url: result.data.favicon_dark_url || "",
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
        setSaveMessage("Image settings saved successfully!")
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

  const handleFileUpload = async (field: string, file: File) => {
    // Simulate file upload - replace with actual upload logic
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Replace with your actual upload endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        handleInputChange(field, data.url)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings)

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading image settings...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="titl2_d2m1313 dark:text-white">
          Website Images
        </h2>
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

      <div className="space-y-6">
        {/* Social Preview */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Social Preview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Image shown when your site is shared on social media (1200x630px recommended)
          </p>

          <div className="space-y-4">
            <div className="border dark:border-[#8888881A] rounded-lg p-4">
              {settings.social_preview_url ? (
                <div className="space-y-3">
                  <img
                    src={settings.social_preview_url || "/placeholder.svg"}
                    alt="Social Preview"
                    className="w-full max-w-md h-auto rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={settings.social_preview_url}
                      onChange={(e) => handleInputChange("social_preview_url", e.target.value)}
                      className="input_field_re223 flex-1"
                      placeholder="https://example.com/social-preview.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload("social_preview_url", file)
                        }
                      }}
                      className="hidden"
                      id="social-preview-upload"
                    />
                    <label
                      htmlFor="social-preview-upload"
                      className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                    >
                      Change
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No social preview image uploaded</p>
                  <div className="flex items-center space-x-2 max-w-md mx-auto">
                    <input
                      type="url"
                      value={settings.social_preview_url}
                      onChange={(e) => handleInputChange("social_preview_url", e.target.value)}
                      className="input_field_re223 flex-1"
                      placeholder="https://example.com/social-preview.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload("social_preview_url", file)
                        }
                      }}
                      className="hidden"
                      id="social-preview-upload-empty"
                    />
                    <label
                      htmlFor="social-preview-upload-empty"
                      className="button_edit_project_r22232_Bu"
                    >
                      Upload
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
