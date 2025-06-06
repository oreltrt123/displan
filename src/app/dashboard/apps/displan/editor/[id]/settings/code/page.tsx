"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Code } from "lucide-react"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
} from "../../../../lib/actions/displan-project-settings-actions"
import "../../../../../../../../styles/sidebar_settings_editor.css"

export default function CodeSettingsPage() {
  const params = useParams()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    custom_code: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    custom_code: "",
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
        setSaveMessage("Code settings saved successfully!")
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

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings)

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading code settings...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="titl2_d2m1313 dark:text-white">
          Custom Code
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
      <p className="text-sm sadawdsdawdsd">
        Add custom HTML, CSS, or JavaScript code that will be injected into your website. This code will be added to the
        canvas.
      </p>

      <div className="space-y-4">
        <div>
          <label className="settings_nav_section_title12">Custom Code</label>
          <textarea
            value={settings.custom_code}
            onChange={(e) => handleInputChange("custom_code", e.target.value)}
            className="simple_box_Description_site_r233123 w-full font-mono text-sm"
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
  )
}
