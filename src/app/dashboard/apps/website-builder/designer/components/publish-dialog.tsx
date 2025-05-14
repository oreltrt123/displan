"use client"

import { useState } from "react"
import { Globe, RefreshCw, X, ExternalLink, AlertCircle } from "lucide-react"
import { createClient } from "../../../../../../../supabase/client"
import type { Project } from "../types"

interface PublishDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function PublishDialog({ project, isOpen, onClose }: PublishDialogProps) {
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  if (!isOpen) return null

  const handlePublish = async () => {
    try {
      setPublishing(true)
      setError(null)

      // Get the project name for the subdomain
      const siteName = project.name.toLowerCase().replace(/\s+/g, "-")

      // Create the URL with the format: https://www.sitename.displan.design/
      const url = `https://www.${siteName}.displan.design`

      // Call your API to publish the site
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          siteName,
          content: project.content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to publish site")
      }

      setPublishedUrl(url)
    } catch (err) {
      console.error("Error publishing site:", err)
      setError(err instanceof Error ? err.message : "Failed to publish site")
    } finally {
      setPublishing(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      setError(null)

      // Call your API to update the published site
      const response = await fetch("/api/publish/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          content: project.content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update site")
      }
    } catch (err) {
      console.error("Error updating site:", err)
      setError(err instanceof Error ? err.message : "Failed to update site")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Publish Website</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <p className="text-foreground mb-2">
              {publishedUrl
                ? "Your website has been published! You can share this link with others:"
                : "Publish your website to make it available on the internet."}
            </p>

            {publishedUrl && (
              <div className="flex items-center mt-4 mb-4">
                <div className="flex-1 bg-secondary p-2 rounded-l-md border border-border text-sm truncate">
                  {publishedUrl}
                </div>
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground p-2 rounded-r-md border border-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            {!publishedUrl ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm flex items-center"
                >
                  {publishing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Publish Website
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm flex items-center"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Website
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
