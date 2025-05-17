
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, Trash2, Search, RefreshCw, PlayCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImagesPanelProps {
  onSelectImage: (mediaUrl: string) => void
  projectId: string
}

interface LocalImage {
  id: string
  url: string
  name: string
  date: string
}

interface PixabayImage {
  id: number
  previewURL: string
  largeImageURL: string
  user: string
}

interface PixabayVideo {
  id: number
  videos: {
    medium: {
      url: string
    }
    tiny: {
      url: string
    }
  }
  user: string
  picture_id: string
}

const PIXABAY_API_KEY = "50348326-3d4d1d6df60a1610115741956"

export function ImagesPanel({ onSelectImage, projectId }: ImagesPanelProps) {
  const [uploading, setUploading] = useState(false)
  const [localImages, setLocalImages] = useState<LocalImage[]>([])
  const [pixabayImages, setPixabayImages] = useState<PixabayImage[]>([])
  const [pixabayVideos, setPixabayVideos] = useState<PixabayVideo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedImages = localStorage.getItem(`project_images_${projectId}`)
    if (savedImages) {
      try {
        setLocalImages(JSON.parse(savedImages))
      } catch (e) {
        console.error("Error parsing saved images:", e)
      }
    }

    fetchPixabayMedia()
  }, [projectId])

  useEffect(() => {
    localStorage.setItem(`project_images_${projectId}`, JSON.stringify(localImages))
  }, [localImages, projectId])

  const fetchPixabayMedia = async (query: string = "nature") => {
    setIsSearching(true)
    setError(null)

    try {
      const imageRes = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo`
      )
      const videoRes = await fetch(
        `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}`
      )

      const imageData = await imageRes.json()
      const videoData = await videoRes.json()

      setPixabayImages(imageData.hits || [])
      setPixabayVideos(videoData.hits || [])
    } catch (err) {
      console.error("Pixabay fetch error:", err)
      setError("Failed to load media from Pixabay")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchPixabayMedia(searchQuery.trim())
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          const newImage: LocalImage = {
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: event.target.result,
            name: file.name,
            date: new Date().toISOString(),
          }

          setLocalImages((prev) => [...prev, newImage])
        }
      }

      reader.readAsDataURL(file)
    })

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteLocalImage = (id: string) => {
    setLocalImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-foreground mb-4">Media</h2>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search images/videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="input_field22323"
          />
          <button onClick={handleSearch} disabled={isSearching} className="input_field22">
            {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Tabs defaultValue="images" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="flex-1 overflow-y-auto p-4">
          {error && <div className="text-destructive text-sm mb-4 p-2 bg-destructive/10 rounded">{error}</div>}
          {isSearching ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {pixabayImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer rounded overflow-hidden"
                  onClick={() => onSelectImage(image.largeImageURL)}
                >
                  <img
                    src={image.previewURL}
                    alt={`Pixabay by ${image.user}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 text-xs text-center p-1">
                      {image.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="uploaded" className="flex-1 overflow-y-auto p-4">
          {localImages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No uploaded images yet</p>
        <button onClick={handleUploadClick} className="button_edit_project_r22E" disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
            </div>
          ) : (
                 <div>
                     <button onClick={handleUploadClick} className="button_edit_project_r22E" disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
            <div className="grid grid-cols-2 gap-2">
              {localImages.map((image) => (
                <div key={image.id} className="relative group cursor-pointer rounded overflow-hidden">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.name}
                    className="w-full h-24 object-cover"
                    onClick={() => onSelectImage(image.url)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteLocalImage(image.id)
                    }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
                 </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ImagesPanel