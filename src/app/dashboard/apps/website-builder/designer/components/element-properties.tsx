"use client"

import type React from "react"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Upload,
  LinkIcon,
  Youtube,
  Facebook,
  Twitter,
  Video,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Layout,
  Palette,
  MousePointer,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
} from "lucide-react"
import type { ElementType } from "../types"

interface ElementPropertiesProps {
  element: ElementType
  onPropertyChange: (property: string, value: any) => void
  onAddTransition?: (elementId: string, transition: any) => void
  onRemoveTransition?: (elementId: string, transitionId: string) => void
  onMoveElement?: (direction: "up" | "down" | "left" | "right", amount: number) => void
}

export function ElementProperties({
  element,
  onPropertyChange,
  onAddTransition,
  onRemoveTransition,
  onMoveElement,
}: ElementPropertiesProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "layout" | "advanced">("content")
  const [videoSource, setVideoSource] = useState<"upload" | "youtube" | "tiktok" | "facebook" | "twitter">("youtube")
  const [fileUploadKey, setFileUploadKey] = useState(Date.now())

  // Create a merged object of content and style for easier access
  const properties = {
    ...element.content,
    ...element.style,
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        if (type === "image") {
          onPropertyChange("src", event.target.result as string)
        } else if (type === "video") {
          onPropertyChange("videoUrl", event.target.result as string)
        }
      }
    }
    reader.readAsDataURL(file)

    // Reset the input to allow uploading the same file again
    setFileUploadKey(Date.now())
  }

  // Handle video embed
  const handleVideoEmbed = (url: string) => {
    let embedUrl = url

    // Process YouTube URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtube.com/watch?v=")
        ? url.split("v=")[1]?.split("&")[0]
        : url.includes("youtu.be/")
          ? url.split("youtu.be/")[1]?.split("?")[0]
          : ""

      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }
    }
    // Process TikTok URLs
    else if (url.includes("tiktok.com")) {
      // TikTok requires a more complex embed, but we'll use a simplified version
      const videoId = url.split("/video/")[1]?.split("?")[0]
      if (videoId) {
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`
      }
    }
    // Process Facebook URLs
    else if (url.includes("facebook.com")) {
      // Facebook videos need the FB SDK, but we'll use a simplified approach
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`
    }
    // Process Twitter/X URLs
    else if (url.includes("twitter.com") || url.includes("x.com")) {
      // Twitter/X embeds need the Twitter widget JS, but we'll use a simplified approach
      embedUrl = url
    }

    onPropertyChange("videoUrl", embedUrl)
    onPropertyChange("videoSource", videoSource)
  }

  // Handle position change
  const handlePositionChange = (direction: "up" | "down" | "left" | "right", amount = 10) => {
    if (onMoveElement) {
      onMoveElement(direction, amount)
    } else {
      // Fallback if onMoveElement is not provided
      const directionMap: Record<string, string> = {
        up: "top",
        down: "top",
        left: "left",
        right: "left",
      }

      const currentValue = properties[directionMap[direction]] || "0px"
      const numericValue = Number.parseInt(currentValue) || 0

      const newValue = direction === "up" || direction === "left" ? numericValue - amount : numericValue + amount

      onPropertyChange(directionMap[direction], `${newValue}px`)
    }
  }

  // Add a new transition
  const handleAddTransition = () => {
    if (!onAddTransition) return

    const newTransition = {
      id: `transition-${Date.now()}`,
      property: "opacity",
      duration: 300,
      timingFunction: "ease",
      delay: 0,
    }

    onAddTransition(element.id, newTransition)
  }

  // Remove a transition
  const handleRemoveTransition = (transitionId: string) => {
    if (!onRemoveTransition) return
    onRemoveTransition(element.id, transitionId)
  }

  // Define shadow presets with proper typing
  const shadowPresets: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    custom: properties.boxShadow || "none",
  }

  // Render the content panel based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "content":
        return (
          <div className="p-4">
            <Accordion type="single" collapsible defaultValue="text">
              {/* Text Content */}
              {properties.text !== undefined && (
                <AccordionItem value="text">
                  <AccordionTrigger>Text Content</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Text</Label>
                        <Textarea
                          value={properties.text || ""}
                          onChange={(e) => onPropertyChange("text", e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      {properties.level !== undefined && (
                        <div>
                          <Label>Heading Level</Label>
                          <Select
                            value={properties.level || "h2"}
                            onValueChange={(value) => onPropertyChange("level", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select heading level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="h1">H1</SelectItem>
                              <SelectItem value="h2">H2</SelectItem>
                              <SelectItem value="h3">H3</SelectItem>
                              <SelectItem value="h4">H4</SelectItem>
                              <SelectItem value="h5">H5</SelectItem>
                              <SelectItem value="h6">H6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Image Content */}
              {properties.src !== undefined && (
                <AccordionItem value="image">
                  <AccordionTrigger>Image</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center bg-gray-100 rounded-md p-2 mb-2">
                        <img
                          src={properties.src || "/placeholder.svg?height=100&width=200"}
                          alt={properties.alt || ""}
                          className="max-h-32 object-contain"
                        />
                      </div>

                      <div>
                        <Label>Image URL</Label>
                        <div className="flex mt-1">
                          <Input
                            type="text"
                            value={properties.src || ""}
                            onChange={(e) => onPropertyChange("src", e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="ml-2"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            key={`image-${fileUploadKey}`}
                            onChange={(e) => handleFileUpload(e, "image")}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Alt Text</Label>
                        <Input
                          type="text"
                          value={properties.alt || ""}
                          onChange={(e) => onPropertyChange("alt", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Button Content */}
              {properties.buttonText !== undefined && (
                <AccordionItem value="button">
                  <AccordionTrigger>Button</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          type="text"
                          value={properties.buttonText || ""}
                          onChange={(e) => onPropertyChange("buttonText", e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Link URL</Label>
                        <div className="flex mt-1">
                          <Input
                            type="text"
                            value={properties.href || ""}
                            onChange={(e) => onPropertyChange("href", e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="outline" size="icon" className="ml-2">
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Button Style</Label>
                        <Select
                          value={properties.buttonStyle || "default"}
                          onValueChange={(value) => onPropertyChange("buttonStyle", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="ghost">Ghost</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Button Size</Label>
                        <Select
                          value={properties.buttonSize || "default"}
                          onValueChange={(value) => onPropertyChange("buttonSize", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="icon">Icon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="open-new-tab"
                          checked={properties.targetBlank || false}
                          onCheckedChange={(checked) => onPropertyChange("targetBlank", checked)}
                        />
                        <Label htmlFor="open-new-tab">Open in new tab</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Video Content */}
              {element.type === "video" && (
                <AccordionItem value="video">
                  <AccordionTrigger>Video</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {properties.videoUrl && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-md p-2 mb-2">
                          <div className="aspect-video w-full">
                            {properties.videoSource === "upload" ? (
                              <video src={properties.videoUrl} controls className="w-full h-full" />
                            ) : (
                              <iframe src={properties.videoUrl} className="w-full h-full" allowFullScreen />
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Video Source</Label>
                        <Select value={videoSource} onValueChange={(value: any) => setVideoSource(value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upload">
                              <div className="flex items-center">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </div>
                            </SelectItem>
                            <SelectItem value="youtube">
                              <div className="flex items-center">
                                <Youtube className="h-4 w-4 mr-2" />
                                YouTube
                              </div>
                            </SelectItem>
                            <SelectItem value="tiktok">
                              <div className="flex items-center">
                                <Video className="h-4 w-4 mr-2" />
                                TikTok
                              </div>
                            </SelectItem>
                            <SelectItem value="facebook">
                              <div className="flex items-center">
                                <Facebook className="h-4 w-4 mr-2" />
                                Facebook
                              </div>
                            </SelectItem>
                            <SelectItem value="twitter">
                              <div className="flex items-center">
                                <Twitter className="h-4 w-4 mr-2" />
                                Twitter/X
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {videoSource === "upload" ? (
                        <div>
                          <Label>Upload Video</Label>
                          <div className="mt-1">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => document.getElementById("video-upload")?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Select Video File
                            </Button>
                            <input
                              id="video-upload"
                              type="file"
                              accept="video/*"
                              className="hidden"
                              key={`video-${fileUploadKey}`}
                              onChange={(e) => handleFileUpload(e, "video")}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label>Video URL</Label>
                          <div className="flex mt-1">
                            <Input
                              type="text"
                              placeholder={`Enter ${videoSource} video URL`}
                              value={properties.videoUrl || ""}
                              onChange={(e) => onPropertyChange("videoUrl", e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleVideoEmbed(properties.videoUrl || "")}
                            >
                              <CornerDownRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Video Title</Label>
                        <Input
                          type="text"
                          value={properties.title || ""}
                          onChange={(e) => onPropertyChange("title", e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoplay"
                          checked={properties.autoplay || false}
                          onCheckedChange={(checked) => onPropertyChange("autoplay", checked)}
                        />
                        <Label htmlFor="autoplay">Autoplay</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="loop"
                          checked={properties.loop || false}
                          onCheckedChange={(checked) => onPropertyChange("loop", checked)}
                        />
                        <Label htmlFor="loop">Loop</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="controls"
                          checked={properties.controls !== false}
                          onCheckedChange={(checked) => onPropertyChange("controls", checked)}
                        />
                        <Label htmlFor="controls">Show Controls</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Map/Location Content */}
              {element.type === "map" && (
                <AccordionItem value="map">
                  <AccordionTrigger>Location</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Address</Label>
                        <Textarea
                          value={properties.address || ""}
                          onChange={(e) => onPropertyChange("address", e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Latitude</Label>
                          <Input
                            type="text"
                            value={properties.latitude || ""}
                            onChange={(e) => onPropertyChange("latitude", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Longitude</Label>
                          <Input
                            type="text"
                            value={properties.longitude || ""}
                            onChange={(e) => onPropertyChange("longitude", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Zoom Level</Label>
                        <div className="flex items-center mt-1">
                          <Slider
                            value={[properties.zoom || 10]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={(value) => onPropertyChange("zoom", value[0])}
                            className="flex-1 mr-2"
                          />
                          <span className="w-8 text-center">{properties.zoom || 10}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-marker"
                          checked={properties.showMarker !== false}
                          onCheckedChange={(checked) => onPropertyChange("showMarker", checked)}
                        />
                        <Label htmlFor="show-marker">Show Marker</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )

      case "style":
        return (
          <div className="p-4">
            <Accordion type="single" collapsible defaultValue="typography">
              {/* Typography */}
              <AccordionItem value="typography">
                <AccordionTrigger>Typography</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {properties.color !== undefined && (
                      <div>
                        <Label>Text Color</Label>
                        <div className="flex items-center mt-1">
                          <input
                            type="color"
                            value={properties.color || "#000000"}
                            onChange={(e) => onPropertyChange("color", e.target.value)}
                            className="w-10 h-10 p-0 border border-gray-300 rounded mr-2"
                          />
                          <Input
                            type="text"
                            value={properties.color || "#000000"}
                            onChange={(e) => onPropertyChange("color", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}

                    {properties.fontSize !== undefined && (
                      <div>
                        <Label>Font Size</Label>
                        <div className="flex items-center mt-1">
                          <Input
                            type="text"
                            value={properties.fontSize || "16px"}
                            onChange={(e) => onPropertyChange("fontSize", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}

                    {properties.fontWeight !== undefined && (
                      <div>
                        <Label>Font Weight</Label>
                        <Select
                          value={properties.fontWeight || "normal"}
                          onValueChange={(value) => onPropertyChange("fontWeight", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="lighter">Lighter</SelectItem>
                            <SelectItem value="bolder">Bolder</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                            <SelectItem value="700">700</SelectItem>
                            <SelectItem value="800">800</SelectItem>
                            <SelectItem value="900">900</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {properties.textAlign !== undefined && (
                      <div>
                        <Label>Text Alignment</Label>
                        <div className="flex mt-1 space-x-1">
                          <Button
                            variant={properties.textAlign === "left" ? "default" : "outline"}
                            size="icon"
                            className="flex-1"
                            onClick={() => onPropertyChange("textAlign", "left")}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={properties.textAlign === "center" ? "default" : "outline"}
                            size="icon"
                            className="flex-1"
                            onClick={() => onPropertyChange("textAlign", "center")}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={properties.textAlign === "right" ? "default" : "outline"}
                            size="icon"
                            className="flex-1"
                            onClick={() => onPropertyChange("textAlign", "right")}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={properties.textAlign === "justify" ? "default" : "outline"}
                            size="icon"
                            className="flex-1"
                            onClick={() => onPropertyChange("textAlign", "justify")}
                          >
                            <AlignJustify className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {properties.lineHeight !== undefined && (
                      <div>
                        <Label>Line Height</Label>
                        <Input
                          type="text"
                          value={properties.lineHeight || "1.5"}
                          onChange={(e) => onPropertyChange("lineHeight", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}

                    {properties.letterSpacing !== undefined && (
                      <div>
                        <Label>Letter Spacing</Label>
                        <Input
                          type="text"
                          value={properties.letterSpacing || "normal"}
                          onChange={(e) => onPropertyChange("letterSpacing", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Background */}
              <AccordionItem value="background">
                <AccordionTrigger>Background</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {properties.backgroundColor !== undefined && (
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex items-center mt-1">
                          <input
                            type="color"
                            value={properties.backgroundColor || "#ffffff"}
                            onChange={(e) => onPropertyChange("backgroundColor", e.target.value)}
                            className="w-10 h-10 p-0 border border-gray-300 rounded mr-2"
                          />
                          <Input
                            type="text"
                            value={properties.backgroundColor || "#ffffff"}
                            onChange={(e) => onPropertyChange("backgroundColor", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Background Type</Label>
                      <Select
                        value={properties.backgroundType || "color"}
                        onValueChange={(value) => onPropertyChange("backgroundType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="color">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.backgroundType === "gradient" && (
                      <div>
                        <Label>Gradient</Label>
                        <Textarea
                          value={properties.backgroundGradient || "linear-gradient(to right, #4f46e5, #06b6d4)"}
                          onChange={(e) => onPropertyChange("backgroundGradient", e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    )}

                    {properties.backgroundType === "image" && (
                      <div>
                        <Label>Background Image</Label>
                        <div className="flex mt-1">
                          <Input
                            type="text"
                            value={properties.backgroundImage?.replace(/url$$['"](.+)['"]$$/, "$1") || ""}
                            onChange={(e) => onPropertyChange("backgroundImage", `url('${e.target.value}')`)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="ml-2"
                            onClick={() => document.getElementById("bg-image-upload")?.click()}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <input
                            id="bg-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            key={`bg-image-${fileUploadKey}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return

                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  onPropertyChange("backgroundImage", `url('${event.target.result}')`)
                                }
                              }
                              reader.readAsDataURL(file)
                              setFileUploadKey(Date.now())
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {properties.backgroundType === "image" && (
                      <div>
                        <Label>Background Size</Label>
                        <Select
                          value={properties.backgroundSize || "cover"}
                          onValueChange={(value) => onPropertyChange("backgroundSize", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="100% 100%">Stretch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Border */}
              <AccordionItem value="border">
                <AccordionTrigger>Border</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Border Style</Label>
                      <Select
                        value={properties.borderStyle || "none"}
                        onValueChange={(value) => onPropertyChange("borderStyle", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.borderStyle && properties.borderStyle !== "none" && (
                      <>
                        <div>
                          <Label>Border Width</Label>
                          <Input
                            type="text"
                            value={properties.borderWidth || "1px"}
                            onChange={(e) => onPropertyChange("borderWidth", e.target.value)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Border Color</Label>
                          <div className="flex items-center mt-1">
                            <input
                              type="color"
                              value={properties.borderColor || "#000000"}
                              onChange={(e) => onPropertyChange("borderColor", e.target.value)}
                              className="w-10 h-10 p-0 border border-gray-300 rounded mr-2"
                            />
                            <Input
                              type="text"
                              value={properties.borderColor || "#000000"}
                              onChange={(e) => onPropertyChange("borderColor", e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label>Border Radius</Label>
                      <Input
                        type="text"
                        value={properties.borderRadius || "0px"}
                        onChange={(e) => onPropertyChange("borderRadius", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Shadow */}
              <AccordionItem value="shadow">
                <AccordionTrigger>Shadow</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Box Shadow</Label>
                      <Select
                        value={properties.boxShadowPreset || "none"}
                        onValueChange={(value) => {
                          onPropertyChange("boxShadowPreset", value)

                          // Apply preset shadow values
                          if (value !== "custom" && shadowPresets[value]) {
                            onPropertyChange("boxShadow", shadowPresets[value])
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select shadow" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                          <SelectItem value="2xl">2XL</SelectItem>
                          <SelectItem value="inner">Inner</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.boxShadowPreset === "custom" && (
                      <div>
                        <Label>Custom Shadow</Label>
                        <Textarea
                          value={properties.boxShadow || ""}
                          onChange={(e) => onPropertyChange("boxShadow", e.target.value)}
                          className="mt-1"
                          rows={2}
                          placeholder="e.g. 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "layout":
        return (
          <div className="p-4">
            <Accordion type="single" collapsible defaultValue="position">
              {/* Position */}
              <AccordionItem value="position">
                <AccordionTrigger>Position</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Position Type</Label>
                      <Select
                        value={properties.position || "static"}
                        onValueChange={(value) => onPropertyChange("position", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="static">Static</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="absolute">Absolute</SelectItem>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="sticky">Sticky</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.position && properties.position !== "static" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Top</Label>
                          <Input
                            type="text"
                            value={properties.top || ""}
                            onChange={(e) => onPropertyChange("top", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Right</Label>
                          <Input
                            type="text"
                            value={properties.right || ""}
                            onChange={(e) => onPropertyChange("right", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Bottom</Label>
                          <Input
                            type="text"
                            value={properties.bottom || ""}
                            onChange={(e) => onPropertyChange("bottom", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Left</Label>
                          <Input
                            type="text"
                            value={properties.left || ""}
                            onChange={(e) => onPropertyChange("left", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Z-Index</Label>
                      <Input
                        type="number"
                        value={properties.zIndex || ""}
                        onChange={(e) => onPropertyChange("zIndex", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Move Element</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <div className="col-start-2">
                          <Button variant="outline" size="icon" onClick={() => handlePositionChange("up")}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="col-start-1 row-start-2">
                          <Button variant="outline" size="icon" onClick={() => handlePositionChange("left")}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="col-start-2 row-start-2">
                          <Button variant="outline" size="icon" onClick={() => {}}>
                            <MousePointer className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="col-start-3 row-start-2">
                          <Button variant="outline" size="icon" onClick={() => handlePositionChange("right")}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="col-start-2 row-start-3">
                          <Button variant="outline" size="icon" onClick={() => handlePositionChange("down")}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size">
                <AccordionTrigger>Size</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Width</Label>
                      <Input
                        type="text"
                        value={properties.width || ""}
                        onChange={(e) => onPropertyChange("width", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Height</Label>
                      <Input
                        type="text"
                        value={properties.height || ""}
                        onChange={(e) => onPropertyChange("height", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Min Width</Label>
                      <Input
                        type="text"
                        value={properties.minWidth || ""}
                        onChange={(e) => onPropertyChange("minWidth", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Min Height</Label>
                      <Input
                        type="text"
                        value={properties.minHeight || ""}
                        onChange={(e) => onPropertyChange("minHeight", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Max Width</Label>
                      <Input
                        type="text"
                        value={properties.maxWidth || ""}
                        onChange={(e) => onPropertyChange("maxWidth", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Max Height</Label>
                      <Input
                        type="text"
                        value={properties.maxHeight || ""}
                        onChange={(e) => onPropertyChange("maxHeight", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Spacing */}
              <AccordionItem value="spacing">
                <AccordionTrigger>Spacing</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Margin</Label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        <Input
                          type="text"
                          value={properties.marginTop || ""}
                          onChange={(e) => onPropertyChange("marginTop", e.target.value)}
                          placeholder="Top"
                        />
                        <Input
                          type="text"
                          value={properties.marginRight || ""}
                          onChange={(e) => onPropertyChange("marginRight", e.target.value)}
                          placeholder="Right"
                        />
                        <Input
                          type="text"
                          value={properties.marginBottom || ""}
                          onChange={(e) => onPropertyChange("marginBottom", e.target.value)}
                          placeholder="Bottom"
                        />
                        <Input
                          type="text"
                          value={properties.marginLeft || ""}
                          onChange={(e) => onPropertyChange("marginLeft", e.target.value)}
                          placeholder="Left"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Padding</Label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        <Input
                          type="text"
                          value={properties.paddingTop || ""}
                          onChange={(e) => onPropertyChange("paddingTop", e.target.value)}
                          placeholder="Top"
                        />
                        <Input
                          type="text"
                          value={properties.paddingRight || ""}
                          onChange={(e) => onPropertyChange("paddingRight", e.target.value)}
                          placeholder="Right"
                        />
                        <Input
                          type="text"
                          value={properties.paddingBottom || ""}
                          onChange={(e) => onPropertyChange("paddingBottom", e.target.value)}
                          placeholder="Bottom"
                        />
                        <Input
                          type="text"
                          value={properties.paddingLeft || ""}
                          onChange={(e) => onPropertyChange("paddingLeft", e.target.value)}
                          placeholder="Left"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Display */}
              <AccordionItem value="display">
                <AccordionTrigger>Display</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Display</Label>
                      <Select
                        value={properties.display || "block"}
                        onValueChange={(value) => onPropertyChange("display", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select display" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="block">Block</SelectItem>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="inline-block">Inline Block</SelectItem>
                          <SelectItem value="flex">Flex</SelectItem>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.display === "flex" && (
                      <>
                        <div>
                          <Label>Flex Direction</Label>
                          <Select
                            value={properties.flexDirection || "row"}
                            onValueChange={(value) => onPropertyChange("flexDirection", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="row">Row</SelectItem>
                              <SelectItem value="row-reverse">Row Reverse</SelectItem>
                              <SelectItem value="column">Column</SelectItem>
                              <SelectItem value="column-reverse">Column Reverse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Justify Content</Label>
                          <Select
                            value={properties.justifyContent || "flex-start"}
                            onValueChange={(value) => onPropertyChange("justifyContent", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select justify" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flex-start">Start</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="flex-end">End</SelectItem>
                              <SelectItem value="space-between">Space Between</SelectItem>
                              <SelectItem value="space-around">Space Around</SelectItem>
                              <SelectItem value="space-evenly">Space Evenly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Align Items</Label>
                          <Select
                            value={properties.alignItems || "stretch"}
                            onValueChange={(value) => onPropertyChange("alignItems", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flex-start">Start</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="flex-end">End</SelectItem>
                              <SelectItem value="stretch">Stretch</SelectItem>
                              <SelectItem value="baseline">Baseline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {properties.display === "grid" && (
                      <>
                        <div>
                          <Label>Grid Template Columns</Label>
                          <Input
                            type="text"
                            value={properties.gridTemplateColumns || ""}
                            onChange={(e) => onPropertyChange("gridTemplateColumns", e.target.value)}
                            className="mt-1"
                            placeholder="e.g. 1fr 1fr 1fr"
                          />
                        </div>

                        <div>
                          <Label>Grid Template Rows</Label>
                          <Input
                            type="text"
                            value={properties.gridTemplateRows || ""}
                            onChange={(e) => onPropertyChange("gridTemplateRows", e.target.value)}
                            className="mt-1"
                            placeholder="e.g. auto auto"
                          />
                        </div>

                        <div>
                          <Label>Grid Gap</Label>
                          <Input
                            type="text"
                            value={properties.gridGap || ""}
                            onChange={(e) => onPropertyChange("gridGap", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "advanced":
        return (
          <div className="p-4">
            <Accordion type="single" collapsible defaultValue="transitions">
              {/* Transitions */}
              <AccordionItem value="transitions">
                <AccordionTrigger>Transitions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {element.transitions && element.transitions.length > 0 ? (
                      <div className="space-y-4">
                        {element.transitions.map((transition, index) => (
                          <div key={transition.id} className="border border-gray-200 rounded-md p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium">Transition {index + 1}</h4>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveTransition(transition.id)}>
                                &times;
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Label>Property</Label>
                                <Select
                                  value={transition.property}
                                  onValueChange={(value) => {
                                    const updatedTransitions = [...element.transitions!]
                                    updatedTransitions[index].property = value
                                    onPropertyChange("transitions", updatedTransitions)
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select property" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="opacity">Opacity</SelectItem>
                                    <SelectItem value="transform">Transform</SelectItem>
                                    <SelectItem value="background-color">Background Color</SelectItem>
                                    <SelectItem value="color">Text Color</SelectItem>
                                    <SelectItem value="width">Width</SelectItem>
                                    <SelectItem value="height">Height</SelectItem>
                                    <SelectItem value="border-color">Border Color</SelectItem>
                                    <SelectItem value="box-shadow">Box Shadow</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Duration (ms)</Label>
                                <div className="flex items-center mt-1">
                                  <Slider
                                    value={[transition.duration]}
                                    min={0}
                                    max={2000}
                                    step={50}
                                    onValueChange={(value) => {
                                      const updatedTransitions = [...element.transitions!]
                                      updatedTransitions[index].duration = value[0]
                                      onPropertyChange("transitions", updatedTransitions)
                                    }}
                                    className="flex-1 mr-2"
                                  />
                                  <span className="w-12 text-center">{transition.duration}</span>
                                </div>
                              </div>

                              <div>
                                <Label>Timing Function</Label>
                                <Select
                                  value={transition.timingFunction}
                                  onValueChange={(value) => {
                                    const updatedTransitions = [...element.transitions!]
                                    updatedTransitions[index].timingFunction = value
                                    onPropertyChange("transitions", updatedTransitions)
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select timing" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ease">Ease</SelectItem>
                                    <SelectItem value="linear">Linear</SelectItem>
                                    <SelectItem value="ease-in">Ease In</SelectItem>
                                    <SelectItem value="ease-out">Ease Out</SelectItem>
                                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Delay (ms)</Label>
                                <div className="flex items-center mt-1">
                                  <Slider
                                    value={[transition.delay]}
                                    min={0}
                                    max={1000}
                                    step={50}
                                    onValueChange={(value) => {
                                      const updatedTransitions = [...element.transitions!]
                                      updatedTransitions[index].delay = value[0]
                                      onPropertyChange("transitions", updatedTransitions)
                                    }}
                                    className="flex-1 mr-2"
                                  />
                                  <span className="w-12 text-center">{transition.delay}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">No transitions added yet</div>
                    )}

                    <Button onClick={handleAddTransition} className="w-full">
                      Add Transition
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Animations */}
              <AccordionItem value="animations">
                <AccordionTrigger>Animations</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Animation</Label>
                      <Select
                        value={properties.animation || "none"}
                        onValueChange={(value) => onPropertyChange("animation", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="fade-in">Fade In</SelectItem>
                          <SelectItem value="slide-up">Slide Up</SelectItem>
                          <SelectItem value="slide-down">Slide Down</SelectItem>
                          <SelectItem value="slide-left">Slide Left</SelectItem>
                          <SelectItem value="slide-right">Slide Right</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="pulse">Pulse</SelectItem>
                          <SelectItem value="spin">Spin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {properties.animation && properties.animation !== "none" && (
                      <>
                        <div>
                          <Label>Duration (ms)</Label>
                          <div className="flex items-center mt-1">
                            <Slider
                              value={[properties.animationDuration || 1000]}
                              min={100}
                              max={5000}
                              step={100}
                              onValueChange={(value) => onPropertyChange("animationDuration", value[0])}
                              className="flex-1 mr-2"
                            />
                            <span className="w-12 text-center">{properties.animationDuration || 1000}</span>
                          </div>
                        </div>

                        <div>
                          <Label>Delay (ms)</Label>
                          <div className="flex items-center mt-1">
                            <Slider
                              value={[properties.animationDelay || 0]}
                              min={0}
                              max={3000}
                              step={100}
                              onValueChange={(value) => onPropertyChange("animationDelay", value[0])}
                              className="flex-1 mr-2"
                            />
                            <span className="w-12 text-center">{properties.animationDelay || 0}</span>
                          </div>
                        </div>

                        <div>
                          <Label>Iteration Count</Label>
                          <Select
                            value={properties.animationIterationCount || "1"}
                            onValueChange={(value) => onPropertyChange("animationIterationCount", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select count" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="infinite">Infinite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Responsive */}
              <AccordionItem value="responsive">
                <AccordionTrigger>Responsive</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-on-mobile"
                        checked={properties.hideOnMobile || false}
                        onCheckedChange={(checked) => onPropertyChange("hideOnMobile", checked)}
                      />
                      <Label htmlFor="hide-on-mobile">Hide on Mobile</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-on-tablet"
                        checked={properties.hideOnTablet || false}
                        onCheckedChange={(checked) => onPropertyChange("hideOnTablet", checked)}
                      />
                      <Label htmlFor="hide-on-tablet">Hide on Tablet</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-on-desktop"
                        checked={properties.hideOnDesktop || false}
                        onCheckedChange={(checked) => onPropertyChange("hideOnDesktop", checked)}
                      />
                      <Label htmlFor="hide-on-desktop">Hide on Desktop</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Custom CSS */}
              <AccordionItem value="custom-css">
                <AccordionTrigger>Custom CSS</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Custom CSS</Label>
                      <Textarea
                        value={properties.customCSS || ""}
                        onChange={(e) => onPropertyChange("customCSS", e.target.value)}
                        className="mt-1 font-mono text-sm"
                        rows={6}
                        placeholder="Enter custom CSS properties..."
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-full">
      {/* Vertical Tab Navigation */}
      <div className="w-14 bg-background border-r flex flex-col items-center py-4 space-y-6">
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md ${activeTab === "content" ? "bg-background shadow-md" : "text-gray-500"}`}
          onClick={() => setActiveTab("content")}
          title="Content"
        >
          <Type className="h-5 w-5" />
        </button>
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md ${activeTab === "style" ? "bg-background shadow-md" : "text-gray-500"}`}
          onClick={() => setActiveTab("style")}
          title="Style"
        >
          <Palette className="h-5 w-5" />
        </button>
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md ${activeTab === "layout" ? "bg-background shadow-md" : "text-gray-500"}`}
          onClick={() => setActiveTab("layout")}
          title="Layout"
        >
          <Layout className="h-5 w-5" />
        </button>
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md ${activeTab === "advanced" ? "bg-background shadow-md" : "text-gray-500"}`}
          onClick={() => setActiveTab("advanced")}
          title="Advanced"
        >
          <Layers className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  )
}
