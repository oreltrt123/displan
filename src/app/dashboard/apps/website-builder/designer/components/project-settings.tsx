"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

interface Project {
  id: string
  name: string
  description?: string
  type: string
  created_at: string
  [key: string]: any
}

interface ProjectSettingsProps {
  project: Project
}

export default function ProjectSettings({ project }: ProjectSettingsProps) {
  const [name, setName] = useState(project.name || "")
  const [description, setDescription] = useState(project.description || "")
  const [isPublic, setIsPublic] = useState(project.is_public || false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Here you would call your API to update the project
      // For example:
      // const { error } = await supabaseClient
      //   .from('website_projects')
      //   .update({ name, description, is_public: isPublic })
      //   .eq('id', project.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("Project settings saved successfully")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving project settings:", error)
      setSaveMessage("Error saving settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Enter project description"
          />
        </div>

        <div className="flex items-center">
          <input
            id="is-public"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is-public" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make project public
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
