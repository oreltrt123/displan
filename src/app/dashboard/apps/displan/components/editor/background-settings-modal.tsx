"use client"

import { useState, useEffect } from "react"
import { X, Search, ImageIcon, Video, Palette, Wand2, Loader2, ExternalLink, Check } from "lucide-react"

interface BackgroundSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onBackgroundChange: (background: string, type: "color" | "gradient" | "image" | "video" | "gif") => void
  currentBackground: string
}

type MediaItem = {
  id: string
  thumbnail: string
  url: string
  title: string
  author?: string
  width?: number
  height?: number
}

type BackgroundType = "color" | "gradient" | "image" | "video" | "gif"

// API Configuration - Add your API keys here
const API_KEYS = {
  UNSPLASH: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY || "ZxP-CbP7mbiE_izS1Cmx2lNAAnOiZtsb-H9HG2kmxFc",
  PEXELS: process.env.NEXT_PUBLIC_PEXELS_API_KEY || "YaETCo73sqBa2it4gfyb9aCxCRQVDv0zTcfSsCeu8Z9GG84SMzMjxxhJ",
  GIPHY: process.env.NEXT_PUBLIC_GIPHY_API_KEY || "WJ4IKKsp2D6QmAmbXqvJ6vCQ9yrAJ2wm",
}

export default function BackgroundSettingsModal({
  isOpen,
  onClose,
  onBackgroundChange,
  currentBackground,
}: BackgroundSettingsModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [colorValue, setColorValue] = useState("#ffffff")
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [gradientDirection, setGradientDirection] = useState("to right")
  const [gradientColors, setGradientColors] = useState(["#4f46e5", "#10b981"])
  const [images, setImages] = useState<MediaItem[]>([])
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [gifs, setGifs] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [previewBackground, setPreviewBackground] = useState<{ type: BackgroundType; value: string }>({
    type: "color",
    value: currentBackground || "#ffffff",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Predefined gradients
  const predefinedGradients = [
    { name: "Blue to Purple", value: "linear-gradient(to right, #4f46e5, #7e22ce)" },
    { name: "Green to Blue", value: "linear-gradient(to right, #10b981, #3b82f6)" },
    { name: "Orange to Red", value: "linear-gradient(to right, #f97316, #ef4444)" },
    { name: "Pink to Purple", value: "linear-gradient(to right, #ec4899, #8b5cf6)" },
    { name: "Teal to Lime", value: "linear-gradient(to right, #14b8a6, #84cc16)" },
    { name: "Blue to Cyan", value: "linear-gradient(to right, #2563eb, #06b6d4)" },
    { name: "Sunset", value: "linear-gradient(to right, #f97316, #ec4899)" },
    { name: "Ocean", value: "linear-gradient(to right, #0ea5e9, #2dd4bf)" },
    { name: "Forest", value: "linear-gradient(to right, #16a34a, #84cc16)" },
    { name: "Midnight", value: "linear-gradient(to right, #312e81, #4f46e5)" },
    { name: "Radial Blue", value: "radial-gradient(circle, #3b82f6, #1e3a8a)" },
    { name: "Radial Green", value: "radial-gradient(circle, #10b981, #064e3b)" },
  ]

  // Predefined colors
  const predefinedColors = [
    { name: "White", value: "#ffffff" },
    { name: "Light Gray", value: "#f3f4f6" },
    { name: "Gray", value: "#9ca3af" },
    { name: "Dark Gray", value: "#4b5563" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Yellow", value: "#eab308" },
    { name: "Lime", value: "#84cc16" },
    { name: "Green", value: "#22c55e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Fuchsia", value: "#d946ef" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
  ]

  // Real API functions
  const fetchUnsplashImages = async (query: string, page = 1) => {
    if (!API_KEYS.UNSPLASH || API_KEYS.UNSPLASH === "YOUR_UNSPLASH_API_KEY_HERE") {
      console.error("Unsplash API key not configured")
      return
    }

    setIsLoading(true)
    try {
      const searchTerm = query || "background"
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&page=${page}&per_page=30&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${API_KEYS.UNSPLASH}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data = await response.json()
      const newImages: MediaItem[] = data.results.map((item: any) => ({
        id: item.id,
        thumbnail: item.urls.small,
        url: item.urls.regular,
        title: item.description || item.alt_description || "Unsplash Image",
        author: item.user.name,
        width: item.width,
        height: item.height,
      }))

      if (page === 1) {
        setImages(newImages)
      } else {
        setImages((prev) => [...prev, ...newImages])
      }

      setHasMore(data.total_pages > page)
    } catch (error) {
      console.error("Error fetching Unsplash images:", error)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPexelsVideos = async (query: string, page = 1) => {
    if (!API_KEYS.PEXELS || API_KEYS.PEXELS === "YOUR_PEXELS_API_KEY_HERE") {
      console.error("Pexels API key not configured")
      return
    }

    setIsLoading(true)
    try {
      const searchTerm = query || "abstract"
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchTerm)}&page=${page}&per_page=20&orientation=landscape`,
        {
          headers: {
            Authorization: API_KEYS.PEXELS,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      const data = await response.json()
      const newVideos: MediaItem[] = data.videos.map((video: any) => ({
        id: video.id.toString(),
        thumbnail: video.image,
        url:
          video.video_files.find((file: any) => file.quality === "hd" || file.quality === "sd")?.link ||
          video.video_files[0]?.link,
        title: video.url.split("/").pop()?.replace(/-/g, " ") || "Pexels Video",
        author: video.user?.name || "Pexels Creator",
        width: video.width,
        height: video.height,
      }))

      if (page === 1) {
        setVideos(newVideos)
      } else {
        setVideos((prev) => [...prev, ...newVideos])
      }

      setHasMore(data.total_results > page * 20)
    } catch (error) {
      console.error("Error fetching Pexels videos:", error)
      setVideos([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGiphyGifs = async (query: string, page = 1) => {
    if (!API_KEYS.GIPHY || API_KEYS.GIPHY === "YOUR_GIPHY_API_KEY_HERE") {
      console.error("GIPHY API key not configured")
      return
    }

    setIsLoading(true)
    try {
      const searchTerm = query || "abstract"
      const offset = (page - 1) * 25
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEYS.GIPHY}&q=${encodeURIComponent(searchTerm)}&limit=25&offset=${offset}&rating=g&lang=en`,
      )

      if (!response.ok) {
        throw new Error(`GIPHY API error: ${response.status}`)
      }

      const data = await response.json()
      const newGifs: MediaItem[] = data.data.map((gif: any) => ({
        id: gif.id,
        thumbnail: gif.images.fixed_width_small.url,
        url: gif.images.original.url,
        title: gif.title || "GIPHY Animation",
        author: gif.username || "GIPHY Artist",
        width: Number.parseInt(gif.images.original.width),
        height: Number.parseInt(gif.images.original.height),
      }))

      if (page === 1) {
        setGifs(newGifs)
      } else {
        setGifs((prev) => [...prev, ...newGifs])
      }

      setHasMore(data.pagination.total_count > offset + 25)
    } catch (error) {
      console.error("Error fetching GIPHY gifs:", error)
      setGifs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Initialize with current background
      if (currentBackground.startsWith("#")) {
        setColorValue(currentBackground)
        setActiveTab(0)
        setPreviewBackground({ type: "color", value: currentBackground })
      } else if (currentBackground.includes("gradient")) {
        setActiveTab(1)
        setPreviewBackground({ type: "gradient", value: currentBackground })
      } else if (currentBackground.startsWith("http")) {
        // Determine if it's an image, video, or gif based on extension
        if (currentBackground.match(/\.(jpeg|jpg|png|webp)$/i)) {
          setActiveTab(2)
          setPreviewBackground({ type: "image", value: currentBackground })
        } else if (currentBackground.match(/\.(mp4|webm|ogg)$/i)) {
          setActiveTab(3)
          setPreviewBackground({ type: "video", value: currentBackground })
        } else if (currentBackground.match(/\.(gif)$/i)) {
          setActiveTab(4)
          setPreviewBackground({ type: "gif", value: currentBackground })
        }
      }

      // Load initial media
      setCurrentPage(1)
      fetchUnsplashImages("background", 1)
      fetchPexelsVideos("abstract", 1)
      fetchGiphyGifs("abstract", 1)
    }
  }, [isOpen, currentBackground])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setCurrentPage(1)
    switch (activeTab) {
      case 2: // Images
        fetchUnsplashImages(searchQuery, 1)
        break
      case 3: // Videos
        fetchPexelsVideos(searchQuery, 1)
        break
      case 4: // GIFs
        fetchGiphyGifs(searchQuery, 1)
        break
    }
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    switch (activeTab) {
      case 2: // Images
        fetchUnsplashImages(searchQuery || "background", nextPage)
        break
      case 3: // Videos
        fetchPexelsVideos(searchQuery || "abstract", nextPage)
        break
      case 4: // GIFs
        fetchGiphyGifs(searchQuery || "abstract", nextPage)
        break
    }
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setSelectedItem(null)
    setCurrentPage(1)

    // Reset preview based on tab
    switch (index) {
      case 0: // Color
        setPreviewBackground({ type: "color", value: colorValue })
        break
      case 1: // Gradient
        const gradientValue =
          gradientType === "linear"
            ? `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
            : `radial-gradient(circle, ${gradientColors[0]}, ${gradientColors[1]})`
        setPreviewBackground({ type: "gradient", value: gradientValue })
        break
      case 2: // Images
        if (images.length === 0) {
          fetchUnsplashImages("background", 1)
        }
        break
      case 3: // Videos
        if (videos.length === 0) {
          fetchPexelsVideos("abstract", 1)
        }
        break
      case 4: // GIFs
        if (gifs.length === 0) {
          fetchGiphyGifs("abstract", 1)
        }
        break
    }
  }

  const handleColorChange = (color: string) => {
    setColorValue(color)
    setPreviewBackground({ type: "color", value: color })
  }

  const handleGradientChange = (gradient: string) => {
    setPreviewBackground({ type: "gradient", value: gradient })
  }

  const handleCustomGradientChange = () => {
    const gradientValue =
      gradientType === "linear"
        ? `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
        : `radial-gradient(circle, ${gradientColors[0]}, ${gradientColors[1]})`
    setPreviewBackground({ type: "gradient", value: gradientValue })
  }

  const handleMediaSelect = (item: MediaItem, type: "image" | "video" | "gif") => {
    setSelectedItem(item)
    setPreviewBackground({ type, value: item.url })
  }

  const handleApply = () => {
    onBackgroundChange(previewBackground.value, previewBackground.type)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg_13_fsdf max-w-6xl max-h-[90vh] w-full overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex mb-4 border-b border-[#8888881A]">
            <button
              onClick={() => handleTabChange(0)}
              className={`flex items-center px-4 py-2 text-sm ${
                activeTab === 0 ? "text-white border-b-2 border-[#8888881A]" : "text-gray-300 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4 mr-2" />
              Color
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`flex items-center px-4 py-2 text-sm ${
                activeTab === 1 ? "text-white border-b-2 border-[#8888881A]" : "text-gray-300 hover:text-white"
              }`}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Gradient
            </button>
            <button
              onClick={() => handleTabChange(2)}
              className={`flex items-center px-4 py-2 text-sm ${
                activeTab === 2 ? "text-white border-b-2 border-[#8888881A]" : "text-gray-300 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </button>
            <button
              onClick={() => handleTabChange(3)}
              className={`flex items-center px-4 py-2 text-sm ${
                activeTab === 3 ? "text-white border-b-2 border-[#8888881A]" : "text-gray-300 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </button>
            <button
              onClick={() => handleTabChange(4)}
              className={`flex items-center px-4 py-2 text-sm ${
                activeTab === 4 ? "text-white border-b-2 border-[#8888881A]" : "text-gray-300 hover:text-white"
              }`}
            >
              <span className="mr-2">GIF</span>
              Animations
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden asdawfwff">
            {/* Left panel - Options */}
            <div className="w-2/3 pr-4 overflow-y-auto">
              {/* Color Panel */}
              {activeTab === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Select Color</label>
                    <input
                      type="color"
                      value={colorValue}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full h-10 rounded-md cursor-pointer"
                    />
                    <div className="mt-2">
                      <input
                        type="text"
                        value={colorValue}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="input_field"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-300 mb-2">Predefined Colors</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleColorChange(color.value)}
                          className={`w-full aspect-square rounded-md border-2 flex items-center justify-center ${
                            colorValue === color.value ? "border-blue-500" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {colorValue === color.value && (
                            <Check
                              className={`w-4 h-4 ${
                                Number.parseInt(color.value.slice(1), 16) > 0x888888 ? "text-black" : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Gradient Panel */}
              {activeTab === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-300 mb-2">Predefined Gradients</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {predefinedGradients.map((gradient) => (
                        <button
                          key={gradient.value}
                          onClick={() => handleGradientChange(gradient.value)}
                          className={`h-20 rounded-md border-2 flex items-center justify-center text-xs font-medium ${
                            previewBackground.value === gradient.value ? "border-blue-500" : "border-transparent"
                          }`}
                          style={{ background: gradient.value }}
                          title={gradient.name}
                        >
                          {previewBackground.value === gradient.value && (
                            <Check className="w-5 h-5 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm text-gray-300 mb-2">Custom Gradient</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Type</label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setGradientType("linear")
                              setTimeout(handleCustomGradientChange, 0)
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              gradientType === "linear"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            Linear
                          </button>
                          <button
                            onClick={() => {
                              setGradientType("radial")
                              setTimeout(handleCustomGradientChange, 0)
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              gradientType === "radial"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            Radial
                          </button>
                        </div>
                      </div>

                      {gradientType === "linear" && (
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Direction</label>
                          <select
                            value={gradientDirection}
                            onChange={(e) => {
                              setGradientDirection(e.target.value)
                              setTimeout(handleCustomGradientChange, 0)
                            }}
                            className="input_field"
                          >
                            <option value="to right">Left to Right</option>
                            <option value="to left">Right to Left</option>
                            <option value="to bottom">Top to Bottom</option>
                            <option value="to top">Bottom to Top</option>
                            <option value="to bottom right">Top Left to Bottom Right</option>
                            <option value="to bottom left">Top Right to Bottom Left</option>
                            <option value="to top right">Bottom Left to Top Right</option>
                            <option value="to top left">Bottom Right to Top Left</option>
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Color 1</label>
                          <div className="flex">
                            <input
                              type="color"
                              value={gradientColors[0]}
                              onChange={(e) => {
                                setGradientColors([e.target.value, gradientColors[1]])
                                setTimeout(handleCustomGradientChange, 0)
                              }}
                              className="h-9 w-9 rounded-l-md cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={gradientColors[0]}
                              onChange={(e) => {
                                setGradientColors([e.target.value, gradientColors[1]])
                                setTimeout(handleCustomGradientChange, 0)
                              }}
                              className="input_field rounded-l-none"
                              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Color 2</label>
                          <div className="flex">
                            <input
                              type="color"
                              value={gradientColors[1]}
                              onChange={(e) => {
                                setGradientColors([gradientColors[0], e.target.value])
                                setTimeout(handleCustomGradientChange, 0)
                              }}
                              className="h-9 w-9 rounded-l-md cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={gradientColors[1]}
                              onChange={(e) => {
                                setGradientColors([gradientColors[0], e.target.value])
                                setTimeout(handleCustomGradientChange, 0)
                              }}
                              className="input_field rounded-l-none"
                              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Panel */}
              {activeTab === 2 && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for images..."
                        className="input_field"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <button onClick={handleSearch} className="button_edit_projectsfdafgfwf12_dfdd px-4">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm text-gray-300">Unsplash Images ({images.length} results)</h4>
                      <a
                        href="https://unsplash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <span>Powered by Unsplash</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    {isLoading && images.length === 0 ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                          {images.map((image) => (
                            <button
                              key={image.id}
                              onClick={() => handleMediaSelect(image, "image")}
                              className={`relative aspect-video rounded-md overflow-hidden border-2 ${
                                selectedItem?.id === image.id ? "border-blue-500" : "border-transparent"
                              }`}
                            >
                              <img
                                src={image.thumbnail || "/placeholder.svg"}
                                alt={image.title}
                                className="w-full h-full object-cover"
                              />
                              {selectedItem?.id === image.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <Check className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {hasMore && !isLoading && (
                          <button onClick={loadMore} className="w-full mt-4 button_edit_projectsfdafgfwf12_dfdd_none">
                            Load More Images
                          </button>
                        )}
                        {isLoading && images.length > 0 && (
                          <div className="flex justify-center mt-4">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Videos Panel */}
              {activeTab === 3 && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for videos..."
                        className="input_field"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <button onClick={handleSearch} className="button_edit_projectsfdafgfwf12_dfdd px-4">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm text-gray-300">Pexels Videos ({videos.length} results)</h4>
                      <a
                        href="https://www.pexels.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <span>Powered by Pexels</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    {isLoading && videos.length === 0 ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                          {videos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => handleMediaSelect(video, "video")}
                              className={`relative aspect-video rounded-md overflow-hidden border-2 ${
                                selectedItem?.id === video.id ? "border-blue-500" : "border-transparent"
                              }`}
                            >
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              {selectedItem?.id === video.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <Check className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {hasMore && !isLoading && (
                          <button onClick={loadMore} className="w-full mt-4 button_edit_projectsfdafgfwf12_dfdd_none">
                            Load More Videos
                          </button>
                        )}
                        {isLoading && videos.length > 0 && (
                          <div className="flex justify-center mt-4">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* GIFs Panel */}
              {activeTab === 4 && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for GIFs..."
                        className="input_field"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <button onClick={handleSearch} className="button_edit_projectsfdafgfwf12_dfdd px-4">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm text-gray-300">GIPHY Animations ({gifs.length} results)</h4>
                      <a
                        href="https://giphy.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <span>Powered by GIPHY</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    {isLoading && gifs.length === 0 ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                          {gifs.map((gif) => (
                            <button
                              key={gif.id}
                              onClick={() => handleMediaSelect(gif, "gif")}
                              className={`relative aspect-video rounded-md overflow-hidden border-2 ${
                                selectedItem?.id === gif.id ? "border-blue-500" : "border-transparent"
                              }`}
                            >
                              <img
                                src={gif.thumbnail || "/placeholder.svg"}
                                alt={gif.title}
                                className="w-full h-full object-cover"
                              />
                              {selectedItem?.id === gif.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <Check className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {hasMore && !isLoading && (
                          <button onClick={loadMore} className="w-full mt-4 button_edit_projectsfdafgfwf12_dfdd_none">
                            Load More GIFs
                          </button>
                        )}
                        {isLoading && gifs.length > 0 && (
                          <div className="flex justify-center mt-4">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right panel - Preview */}
            <div className="w-1/3 pl-4">
              <h4 className="text-sm text-gray-300 mb-2">Preview</h4>
              <div className="rounded-md overflow-hidden border border-gray-700 aspect-video">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      previewBackground.type === "color" || previewBackground.type === "gradient"
                        ? previewBackground.value
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {previewBackground.type === "image" && (
                    <img
                      src={previewBackground.value || "/placeholder.svg"}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {previewBackground.type === "video" && (
                    <video src={previewBackground.value} autoPlay loop muted className="w-full h-full object-cover" />
                  )}
                  {previewBackground.type === "gif" && (
                    <img
                      src={previewBackground.value || "/placeholder.svg"}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {selectedItem && (
                  <div className="text-xs text-gray-400">
                    <p>
                      <span className="font-medium">Title:</span> {selectedItem.title}
                    </p>
                    {selectedItem.author && (
                      <p>
                        <span className="font-medium">By:</span> {selectedItem.author}
                      </p>
                    )}
                    {selectedItem.width && selectedItem.height && (
                      <p>
                        <span className="font-medium">Size:</span> {selectedItem.width} x {selectedItem.height}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-sm text-gray-300 mb-4">API Configuration</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div>
                      <p className="font-medium">Unsplash API</p>
                      <p
                        className={
                          API_KEYS.UNSPLASH !== "YOUR_UNSPLASH_API_KEY_HERE" ? "text-green-400" : "text-red-400"
                        }
                      >
                        {API_KEYS.UNSPLASH !== "YOUR_UNSPLASH_API_KEY_HERE" ? "✓ Configured" : "✗ Not configured"}
                      </p>
                      <p>
                        Register at:{" "}
                        <a
                          href="https://unsplash.com/developers"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          unsplash.com/developers
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Pexels API</p>
                      <p className={API_KEYS.PEXELS !== "YOUR_PEXELS_API_KEY_HERE" ? "text-green-400" : "text-red-400"}>
                        {API_KEYS.PEXELS !== "YOUR_PEXELS_API_KEY_HERE" ? "✓ Configured" : "✗ Not configured"}
                      </p>
                      <p>
                        Register at:{" "}
                        <a
                          href="https://www.pexels.com/api/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          pexels.com/api
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">GIPHY API</p>
                      <p className={API_KEYS.GIPHY !== "YOUR_GIPHY_API_KEY_HERE" ? "text-green-400" : "text-red-400"}>
                        {API_KEYS.GIPHY !== "YOUR_GIPHY_API_KEY_HERE" ? "✓ Configured" : "✗ Not configured"}
                      </p>
                      <p>
                        Register at:{" "}
                        <a
                          href="https://developers.giphy.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          developers.giphy.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-[#8888881A] asdawfwff">
            <button onClick={onClose} className="button_edit_projectsfdafgfwf12_dfdd_none121414 mr-3">
              Cancel
            </button>
            <button onClick={handleApply} className="button_edit_projectsfdafgfwf12_dfdd">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
