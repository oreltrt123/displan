"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Upload, ImageIcon, Search, FolderOpen, CheckCircle } from "lucide-react"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onImageSelect: (imageUrl: string) => void
  projectId: string
}

interface UserImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
}

export function ImageUploadModal({ isOpen, onClose, onImageSelect, projectId }: ImageUploadModalProps) {
  const [userImages, setUserImages] = useState<UserImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState<"upload" | "library">("library")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user's image library
  useEffect(() => {
    if (isOpen) {
      loadUserImages()
    }
  }, [isOpen, projectId])

  const loadUserImages = async () => {
    try {
      console.log("Loading user images for project:", projectId)
      const response = await fetch(`/api/user-images?projectId=${encodeURIComponent(projectId)}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUserImages(result.images || [])
          console.log("Loaded", result.images?.length || 0, "images")
        } else {
          console.error("Failed to load images:", result.error)
        }
      } else {
        console.error("HTTP error loading images:", response.status)
      }
    } catch (error) {
      console.error("Error loading user images:", error)
    }
  }

  // Handle file upload with real server upload
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    console.log("Starting upload of", files.length, "files")
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("Preparing upload...")

    try {
      const uploadedImages: UserImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log("Processing file:", file.name, file.type, file.size)

        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping non-image file: ${file.name}`)
          continue
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`File too large: ${file.name}`)
          setUploadStatus(`Skipping ${file.name} (too large)`)
          continue
        }

        setUploadStatus(`Uploading ${file.name}...`)

        // Create FormData for upload
        const formData = new FormData()
        formData.append("image", file)
        formData.append("projectId", projectId)

        try {
          const response = await fetch("/api/user-images", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const result = await response.json()
            if (result.success && result.image) {
              uploadedImages.push(result.image)
              console.log("Successfully uploaded:", result.image.name)
            } else {
              console.error("Upload failed:", result.error)
              setUploadStatus(`Failed to upload ${file.name}`)
            }
          } else {
            console.error("HTTP error uploading:", response.status)
            setUploadStatus(`Failed to upload ${file.name}`)
          }
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError)
          setUploadStatus(`Error uploading ${file.name}`)
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      if (uploadedImages.length > 0) {
        setUploadStatus(`Successfully uploaded ${uploadedImages.length} image(s)!`)
        await loadUserImages() // Refresh the library
        setSelectedTab("library") // Switch to library tab

        // Clear status after 3 seconds
        setTimeout(() => {
          setUploadStatus("")
        }, 3000)
      } else {
        setUploadStatus("No images were uploaded")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      setUploadStatus("Upload failed")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  // Filter images based on search
  const filteredImages = userImages.filter((image) => image.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (!isOpen) return null

  return (
    <>
      {/* Fixed overlay that covers the entire viewport */}
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col max-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Image</h2>
              <p className="text-sm text-gray-500 mt-1">Choose from your library or upload new images</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setSelectedTab("library")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                selectedTab === "library"
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Your Library ({userImages.length})
            </button>
            <button
              onClick={() => setSelectedTab("upload")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                selectedTab === "upload"
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload New
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-white">
            {selectedTab === "library" && (
              <div className="h-full flex flex-col">
                {/* Search */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Image Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  {filteredImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        {userImages.length === 0 ? "No images yet" : "No images found"}
                      </p>
                      <p className="text-sm">
                        {userImages.length === 0 ? "Upload some images to get started" : "Try a different search term"}
                      </p>
                      {userImages.length === 0 && (
                        <button
                          onClick={() => setSelectedTab("upload")}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upload Images
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredImages.map((image) => (
                        <div
                          key={image.id}
                          className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
                          onClick={() => {
                            console.log("Selecting image:", image.url)
                            onImageSelect(image.url)
                          }}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-2">
                            <p className="text-white text-xs truncate font-medium">{image.name}</p>
                            <p className="text-white/70 text-xs">{(image.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "upload" && (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-lg">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isUploading
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${isUploading ? "text-blue-500" : "text-gray-400"}`} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isUploading ? "Uploading Images..." : "Upload Images"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {isUploading
                        ? uploadStatus || `Progress: ${uploadProgress}%`
                        : "Drag and drop your images here, or click to browse"}
                    </p>

                    {/* Progress Bar */}
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}

                    {/* Success Status */}
                    {uploadStatus && !isUploading && uploadStatus.includes("Successfully") && (
                      <div className="flex items-center justify-center mb-4 text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">{uploadStatus}</span>
                      </div>
                    )}

                    {/* Upload Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={handleBrowseClick}
                        disabled={isUploading}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        {isUploading ? "Uploading..." : "Browse Files"}
                      </button>

                      <p className="text-xs text-gray-400">
                        Supports: JPG, PNG, GIF, WebP • Max 10MB each • Multiple files allowed
                      </p>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {/* Upload Tips */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Upload Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Images are uploaded to secure cloud storage</li>
                      <li>• All uploads are automatically saved to your library</li>
                      <li>• Images persist across browser sessions</li>
                      <li>• You can upload multiple images at once</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
