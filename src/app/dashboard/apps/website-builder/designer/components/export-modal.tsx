"use client"

import { useState } from "react"
import { Download, Upload, X, Check, AlertCircle } from "lucide-react"
import type { ExportFormat } from "./export-service"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ExportFormat, isRepository: boolean) => void
  projectName: string
}

export function ExportModal({ isOpen, onClose, onExport, projectName }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("typescript")
  const [isRepository, setIsRepository] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)
      setSuccess(null)

      // Call the export function
      await onExport(selectedFormat, isRepository)

      // Show success message
      setSuccess(
        isRepository
          ? `Project successfully uploaded as a repository project`
          : `Project successfully exported as ${selectedFormat}`,
      )

      // Close modal after a delay if successful
      if (!isRepository) {
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export project")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Export Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Export <span className="font-medium">{projectName}</span> as code in your preferred format.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="typescript"
                    checked={selectedFormat === "typescript"}
                    onChange={() => setSelectedFormat("typescript")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">TypeScript (.tsx)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="javascript"
                    checked={selectedFormat === "javascript"}
                    onChange={() => setSelectedFormat("javascript")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">JavaScript (.jsx)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="html"
                    checked={selectedFormat === "html"}
                    onChange={() => setSelectedFormat("html")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">HTML/CSS (.html)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRepository}
                  onChange={() => setIsRepository(!isRepository)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Upload as repository project instead of downloading</span>
              </label>
              {isRepository && (
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  This will create a new project in your account with all the necessary files.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center ${
              isExporting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isRepository ? "Uploading..." : "Exporting..."}
              </>
            ) : (
              <>
                {isRepository ? (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload to Repository
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Code
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
