"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Save, Trash, Download, Share, ChevronDown, Code, FileType, Upload } from "lucide-react"

interface SettingsPanelProps {
  onSave: () => void
  onExport: () => void
  projectName: string
  onProjectNameChange: (name: string) => void
  saving: boolean
}

export function SettingsPanel({ onSave, onExport, projectName, onProjectNameChange, saving }: SettingsPanelProps) {
  const [localProjectName, setLocalProjectName] = useState(projectName)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const exportOptionsRef = useRef<HTMLDivElement>(null)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalProjectName(e.target.value)
  }

  const handleNameBlur = () => {
    if (localProjectName.trim() !== projectName) {
      onProjectNameChange(localProjectName.trim())
    }
  }

  // Handle click outside to close export options
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target as Node)) {
        setShowExportOptions(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-foreground">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Project Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-foreground mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="project-name"
                value={localProjectName}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Project"}
            </button>

            {/* Export button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md font-medium flex items-center justify-center hover:bg-secondary/80"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>

              {showExportOptions && (
                <div
                  ref={exportOptionsRef}
                  className="absolute right-0 mt-2 w-64 bg-popover rounded-md shadow-lg z-10 border border-border"
                >
                  <div className="p-2 border-b border-border">
                    <h4 className="text-xs font-medium text-muted-foreground">DOWNLOAD CODE</h4>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "typescript", type: "download" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <Code className="h-4 w-4 mr-2 text-blue-500" />
                      TypeScript
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "javascript", type: "download" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <Code className="h-4 w-4 mr-2 text-yellow-500" />
                      JavaScript
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "html", type: "download" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <FileType className="h-4 w-4 mr-2 text-orange-500" />
                      HTML
                    </button>
                  </div>

                  <div className="p-2 border-t border-b border-border">
                    <h4 className="text-xs font-medium text-muted-foreground">UPLOAD AS REPOSITORY</h4>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "typescript", type: "repository" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2 text-blue-500" />
                      TypeScript Project
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "javascript", type: "repository" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2 text-yellow-500" />
                      JavaScript Project
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("export-project", { detail: { format: "html", type: "repository" } }),
                        )
                        setShowExportOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2 text-orange-500" />
                      HTML Project
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md font-medium flex items-center justify-center hover:bg-secondary/80">
              <Share className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-destructive mb-3">Danger Zone</h3>
          <button className="w-full py-2 px-4 bg-destructive/10 text-destructive rounded-md font-medium flex items-center justify-center hover:bg-destructive/20">
            <Trash className="h-4 w-4 mr-2" />
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )
}
