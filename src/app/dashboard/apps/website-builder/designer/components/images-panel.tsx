"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, Trash2, Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImagesPanelProps {
  onSelectImage: (imageUrl: string) => void
  projectId: string
}

interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
  }
  alt_description: string
  user: {
    name: string
  }
}

interface LocalImage {
  id: string
  url: string
  name: string
  date: string
}

// Replace with your actual Unsplash API key
const UNSPLASH_API_KEY = "EBTWWPIV51JxhsJYOGbjH35O6oVyC-gzP-Qf08wlM-o"

export function ImagesPanel({ onSelectImage, projectId }: ImagesPanelProps) {
  const [uploading, setUploading] = useState(false)
  const [localImages, setLocalImages] = useState<LocalImage[]>([])
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load images from local storage when component mounts
  useEffect(() => {
    const savedImages = localStorage.getItem(`project_images_${projectId}`)
    if (savedImages) {
      try {
        setLocalImages(JSON.parse(savedImages))
      } catch (e) {
        console.error("Error parsing saved images:", e)
      }
    }

    // Load initial Unsplash images
    fetchUnsplashImages()
  }, [projectId])

  // Save images to local storage when they change
  useEffect(() => {
    localStorage.setItem(`project_images_${projectId}`, JSON.stringify(localImages))
  }, [localImages, projectId])

  const fetchUnsplashImages = async (query?: string) => {
    try {
      setIsSearching(true)
      setError(null)

      const endpoint = query
        ? `https://api.unsplash.com/search/photos?query=${query}&per_page=30`
        : "https://api.unsplash.com/photos/random?count=30"

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch images")
      }

      const data = await response.json()

      // Handle different response formats
      const images = query ? data.results : data

      setUnsplashImages(images)
      setIsSearching(false)
    } catch (error) {
      console.error("Error fetching Unsplash images:", error)
      setError("Failed to load stock images")
      setIsSearching(false)

      // Fallback to placeholder images for demo purposes
      const mockImages: UnsplashImage[] = Array.from({ length: 12 }).map((_, i) => ({
        id: `unsplash-${i}`,
        urls: {
          small: `/placeholder.svg?height=200&width=300&text=${query || "Photo " + (i + 1)}`,
          regular: `/placeholder.svg?height=800&width=1200&text=${query || "Photo " + (i + 1)}`,
        },
        alt_description: query ? `${query} image` : `Sample image ${i + 1}`,
        user: {
          name: "Photographer Name",
        },
      }))

      setUnsplashImages(mockImages)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchUnsplashImages(searchQuery.trim())
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
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

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDeleteLocalImage = (id: string) => {
    setLocalImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-foreground mb-4">Images</h2>

        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 mr-2"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm" variant="outline" disabled={isSearching}>
            {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <Button onClick={handleUploadClick} className="w-full flex items-center justify-center" disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      <Tabs defaultValue="stock" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="stock">Stock Images</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="flex-1 overflow-y-auto p-4">
          {error && <div className="text-destructive text-sm mb-4 p-2 bg-destructive/10 rounded">{error}</div>}

          {isSearching ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {unsplashImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer rounded overflow-hidden"
                  onClick={() => onSelectImage(image.urls.regular)}
                >
                  <img
                    src={image.urls.small || "/placeholder.svg"}
                    alt={image.alt_description || "Unsplash image"}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 text-xs text-center p-1">
                      {image.user.name}
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
            </div>
          ) : (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export as both default and named export to support both import styles
export default ImagesPanel
