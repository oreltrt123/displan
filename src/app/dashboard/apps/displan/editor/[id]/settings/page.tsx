"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Upload, Edit, Eye, EyeOff, Lock, Code } from "lucide-react"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
} from "../../../lib/actions/displan-project-settings-actions"
import "../../../../website-builder/designer/styles/button.css"
import { TopBar } from "../../../components/editor/top-bar"
import type { DisplanCanvasElement } from "../../../lib/types/displan-canvas-types"
import { displan_project_designer_css_save_canvas } from "../../../lib/actions/displan-canvas-actions"
import { DeploymentSection } from "@/components/deployment-section"

export default function ProjectSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    favicon_light_url: "",
    favicon_dark_url: "",
    social_preview_url: "",
    password_protection: "",
    custom_code: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    favicon_light_url: "",
    favicon_dark_url: "",
    social_preview_url: "",
    password_protection: "",
    custom_code: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

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
        favicon_light_url: result.data.favicon_light_url || "",
        favicon_dark_url: result.data.favicon_dark_url || "",
        social_preview_url: result.data.social_preview_url || "",
        password_protection: result.data.password_protection || "",
        custom_code: result.data.custom_code || "",
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
          {/* Website Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Settings</h1>
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

          {/* Website Images */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Website Images</h2>
            <div className="space-y-6">
              {/* Favicon Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Favicon Icons</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload favicon icons for light and dark modes (64x64px recommended)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Light Mode Favicon */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">64x64</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        {settings.favicon_light_url ? (
                          <img
                            src={settings.favicon_light_url || "/placeholder.svg"}
                            alt="Light favicon"
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload("favicon_light_url", file)
                            }
                          }}
                          className="hidden"
                          id="favicon-light-upload"
                        />
                        <label
                          htmlFor="favicon-light-upload"
                          className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Favicon */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">64x64</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-900 dark:bg-gray-100">
                        {settings.favicon_dark_url ? (
                          <img
                            src={settings.favicon_dark_url || "/placeholder.svg"}
                            alt="Dark favicon"
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload("favicon_dark_url", file)
                            }
                          }}
                          className="hidden"
                          id="favicon-dark-upload"
                        />
                        <label
                          htmlFor="favicon-dark-upload"
                          className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Preview */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Social Preview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Image shown when your site is shared on social media (1200x630px recommended)
                </p>

                <div className="space-y-4">
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                            <Upload className="w-4 h-4 mr-2" />
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
                            className="button_edit_project_r22232_Bu cursor-pointer inline-flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
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

          {/* Password Protection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Password Protection
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Secure your project with a password. Visitors will need to enter this password to view your site.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={settings.password_protection}
                    onChange={(e) => handleInputChange("password_protection", e.target.value)}
                    disabled={!isEditingPassword}
                    className={`input_field_re223 pr-10 ${!isEditingPassword ? "bg-gray-50 dark:bg-gray-700" : ""}`}
                    placeholder={isEditingPassword ? "Enter password" : "No password set"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (isEditingPassword) {
                      // Save the password
                      setIsEditingPassword(false)
                    } else {
                      // Enable editing
                      setIsEditingPassword(true)
                    }
                  }}
                  className="button_edit_project_r22232_Bu inline-flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingPassword ? "Save" : "Edit"}
                </button>
              </div>

              {settings.password_protection && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Password protection is enabled for this project
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Code */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Custom Code
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add custom HTML, CSS, or JavaScript code that will be injected into your website. This code will be added
              to the canvas.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Code</label>
                <textarea
                  value={settings.custom_code}
                  onChange={(e) => handleInputChange("custom_code", e.target.value)}
                  className="simple_box_Description_site_r233 w-full font-mono text-sm"
                  rows={8}
                  placeholder={`<!-- Add your custom HTML, CSS, or JavaScript here -->
<style>
  .custom-element {
    color: #333;
    font-size: 16px;
  }
</style>

<script>
  console.log('Custom code loaded');
</script>`}
                />
              </div>

              {settings.custom_code && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ✓ Custom code will be injected into your website canvas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Deployment */}
          <DeploymentSection
            projectId={projectId}
            currentSubdomain={settings.subdomain}
            isPublished={originalSettings.is_published}
          />
        </div>
      </div>
    </div>
  )
}
