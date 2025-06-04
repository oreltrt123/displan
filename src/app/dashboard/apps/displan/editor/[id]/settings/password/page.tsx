"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Lock, Eye, EyeOff, Edit } from "lucide-react"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
} from "../../../../lib/actions/displan-project-settings-actions"
import "../../../../../../../../styles/sidebar_settings_editor.css"

export default function PasswordSettingsPage() {
  const params = useParams()
  const projectId = params.id as string

  const [settings, setSettings] = useState({
    password_protection: "",
  })
  const [originalSettings, setOriginalSettings] = useState({
    password_protection: "",
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
        password_protection: result.data.password_protection || "",
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
        setSaveMessage("Password settings saved successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
        setIsEditingPassword(false)
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
        <div className="text-gray-600 dark:text-gray-400">Loading password settings...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg p-6">
      <h2 className="titl2_d2m1313">
        Password Protection
      </h2>
      <p className="sadawdsdawdsd112">
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
              className={`input_field_re223 pr-10 ${!isEditingPassword ? "input_field_re223" : ""}`}
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
                handleSave()
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
  )
}
