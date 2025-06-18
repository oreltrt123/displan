"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, Search, Settings, Trash2, ImageIcon, X } from "lucide-react"
import {
  displan_project_designer_css_projects_rtete353sr_upload_asset,
  displan_project_designer_css_projects_rtete353sr_fetch_assets,
  displan_project_designer_css_projects_rtete353sr_delete_asset,
} from "../../lib/actions/displan-assets-actions"

interface Asset {
  id: string
  filename: string
  original_filename: string
  file_size: number
  file_type: string
  url: string
  width?: number
  height?: number
  created_at: string
}

interface AssetsPanelProps {
  projectId: string
  currentPage: string
}

export function AssetsPanel({ projectId, currentPage }: AssetsPanelProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showAssetDetails, setShowAssetDetails] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadAssets()
  }, [projectId, currentPage])

  const loadAssets = async () => {
    setLoading(true)
    try {
      const result = await displan_project_designer_css_projects_rtete353sr_fetch_assets(projectId, currentPage)
      if (result.success) {
        setAssets(result.data || [])
        console.log("Assets loaded:", result.data?.length || 0)
      } else {
        console.error("Failed to load assets:", result.error)
      }
    } catch (error) {
      console.error("Error loading assets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log("Uploading file:", file.name, file.size, file.type)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("projectId", projectId)
        formData.append("pageSlug", currentPage)

        setUploadProgress(((i + 0.5) / files.length) * 100)

        const result = await displan_project_designer_css_projects_rtete353sr_upload_asset(formData)

        if (result.success) {
          console.log("File uploaded successfully:", result.data)
          setAssets((prev) => [result.data, ...prev])
        } else {
          console.error("Failed to upload asset:", result.error)
          alert(`Failed to upload ${file.name}: ${result.error}`)
        }

        setUploadProgress(((i + 1) / files.length) * 100)
      }
    } catch (error) {
      console.error("Error uploading assets:", error)
      alert("Error uploading files: " + error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return

    try {
      const result = await displan_project_designer_css_projects_rtete353sr_delete_asset(assetId)
      if (result.success) {
        setAssets((prev) => prev.filter((asset) => asset.id !== assetId))
        if (selectedAsset?.id === assetId) {
          setSelectedAsset(null)
          setShowAssetDetails(false)
        }
        console.log("Asset deleted successfully")
      } else {
        console.error("Failed to delete asset:", result.error)
        alert("Failed to delete asset: " + result.error)
      }
    } catch (error) {
      console.error("Error deleting asset:", error)
      alert("Error deleting asset: " + error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredAssets = assets.filter((asset) =>
    asset.original_filename.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset)
  }

  const handleAssetSettings = (asset: Asset, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedAsset(asset)
    setShowAssetDetails(true)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Upload Button */}
      <div className="p-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors relative overflow-hidden"
        >
          <Upload className="w-5 h-5 mr-2" />
          {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload"}
          {uploading && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-300 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="relative group cursor-pointer" onClick={() => handleAssetClick(asset)}>
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {asset.file_type.startsWith("image/") ? (
                    <img
                      src={asset.url || "/placeholder.svg"}
                      alt={asset.original_filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Settings Button */}
                <button
                  onClick={(e) => handleAssetSettings(asset, e)}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Settings className="w-3 h-3" />
                </button>

                {/* Filename */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">{asset.original_filename}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No assets found</p>
            {searchTerm && <p className="text-xs mt-1">Try a different search term</p>}
          </div>
        )}
      </div>

      {/* Asset Details Modal */}
      {showAssetDetails && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Details</h3>
              <button
                onClick={() => setShowAssetDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filename</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedAsset.original_filename}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Size</label>
                <p className="text-sm text-gray-900 dark:text-white">{formatFileSize(selectedAsset.file_size)}</p>
              </div>

              {selectedAsset.width && selectedAsset.height && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dimensions</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAsset.width} × {selectedAsset.height} px
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedAsset.file_type}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAssetDetails(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteAsset(selectedAsset.id)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
