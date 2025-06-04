"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Upload, FileText, Code } from "lucide-react"
import {
  displan_project_designer_css_get_page_settings,
  displan_project_designer_css_update_page_settings,
} from "../../../../../lib/actions/displan-project-pages-actions"
import "../../../../../../../../../styles/sidebar_settings_editor.css"

export default function PageSettingsPage() {
  const params = useParams()
  const projectId = params.id as string
  const pageId = params.pageId as string

  const [settings, setSettings] = useState({
    name: "",
    slug: "",
    description: "",
    custom_url: "",
    preview_url: "",
    social_preview_url: "",
    custom_code: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    name: "",
    slug: "",
    description: "",
    custom_url: "",
    preview_url: "",
    social_preview_url: "",
    custom_code: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    loadPageSettings()
  }, [pageId])

  const loadPageSettings = async () => {
    setIsLoading(true)
    const result = await displan_project_designer_css_get_page_settings(pageId)
    if (result.success && result.data) {
      const pageData = {
        name: result.data.name || "",
        slug: result.data.slug || "",
        description: result.data.description || "",
        custom_url: result.data.custom_url || "",
        preview_url: result.data.preview_url || "",
        social_preview_url: result.data.social_preview_url || "",
        custom_code: result.data.custom_code || "",
      }
      setSettings(pageData)
      setOriginalSettings(pageData)
    } else {
      console.error("Failed to load page settings:", result.error)
      setSaveMessage("Failed to load page settings")
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      const result = await displan_project_designer_css_update_page_settings(pageId, settings)

      if (result.success) {
        setOriginalSettings(settings)
        setSaveMessage("Page settings saved successfully!")
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
    const formData = new FormData()
    formData.append("file", file)

    try {
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
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading page settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Settings */}
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Settings</h1>
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="settings_nav_section_title12">Page Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="input_field_re223"
                placeholder="Enter page name"
              />
            </div>
            <div>
              <label className="settings_nav_section_title12">Page Slug</label>
              <input
                type="text"
                value={settings.slug}
                onChange={(e) => handleInputChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="input_field_re223"
                placeholder="page-slug"
              />
            </div>
          </div>

          <div>
            <label className="settings_nav_section_title12">Description</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="simple_box_Description_site_r233 w-full"
              placeholder="Describe this page"
            />
          </div>

          <div>
            <label className="settings_nav_section_title12">Custom URL</label>
            <input
              type="url"
              value={settings.custom_url}
              onChange={(e) => handleInputChange("custom_url", e.target.value)}
              className="input_field_re223"
              placeholder="https://your-domain.com/page"
            />
          </div>
        </div>
      </div>

      {/* Page Preview Image */}
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Preview Image</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Main preview image for this page</p>

        <div className="p-4">
          {settings.preview_url ? (
            <div className="space-y-3">
              <img
                src={settings.preview_url || "/placeholder.svg"}
                alt="Page Preview"
                className="w-full max-w-md h-auto rounded border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={settings.preview_url}
                  onChange={(e) => handleInputChange("preview_url", e.target.value)}
                  className="input_field_re223 flex-1"
                  placeholder="https://example.com/page-preview.jpg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload("preview_url", file)
                    }
                  }}
                  className="hidden"
                  id="page-preview-upload"
                />
                <label
                  htmlFor="page-preview-upload"
                  className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                >
                  <span className="dgsgdgegdggeg">Change</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No preview image uploaded</p>
              <div className="flex items-center space-x-2 max-w-md mx-auto">
                <input
                  type="url"
                  value={settings.preview_url}
                  onChange={(e) => handleInputChange("preview_url", e.target.value)}
                  className="input_field_re223 flex-1"
                  placeholder="https://example.com/page-preview.jpg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload("preview_url", file)
                    }
                  }}
                  className="hidden"
                  id="page-preview-upload-empty"
                />
                <label
                  htmlFor="page-preview-upload-empty"
                  className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                >
                  <span className="dgsgdgegdggeg">Upload</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Preview Image */}
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Preview Image</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Image shown when this page is shared on social media (1200x630px recommended)
        </p>

        <div className="rounded-lg p-4">
          {settings.social_preview_url ? (
            <div className="space-y-3">
              <img
                src={settings.social_preview_url || "/placeholder.svg"}
                alt="Social Preview"
                className="w-full max-w-md h-auto rounded border border-gray-200 dark:border-gray-700"
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
                  <span className="dgsgdgegdggeg">Change</span>
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
                  className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                >
                  <span className="dgsgdgegdggeg">Upload</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Code */}
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Custom Code
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Add custom HTML, CSS, or JavaScript code specific to this page.
        </p>

        <div>
          <label className="settings_nav_section_title12">Custom Code</label>
          <textarea
            value={settings.custom_code}
            onChange={(e) => handleInputChange("custom_code", e.target.value)}
            className="simple_box_Description_site_r233123 w-full font-mono text-sm"
            rows={8}
            placeholder={`<!-- Add your custom HTML, CSS, or JavaScript here -->
<style>
  .page-specific-style {
    color: #333;
    font-size: 16px;
  }
</style>

<script>
  console.log('Page-specific code loaded');
</script>`}
          />
        </div>

        {settings.custom_code && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ✓ Custom code will be injected into this page only
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
