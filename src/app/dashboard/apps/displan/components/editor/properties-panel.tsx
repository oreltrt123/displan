"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FileText, Folder, ChevronDown, ChevronRight, Upload, Eye, EyeOff, Monitor, Smartphone, Tablet, X, Palette, Type, Layout, Sparkles, Settings, Loader2, Check, AlertCircle, Trash2 } from 'lucide-react'
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"
import {
  displan_project_designer_css_update_element_new,
  displan_project_designer_css_update_template_element,
  displan_project_designer_css_delete_element,
  displan_project_designer_css_delete_template_element,
} from "../../lib/actions/displan-canvas-actions-new"

interface PropertiesPanelProps {
  selectedElement: DisplanCanvasElement | null
  pages: any[]
  onUpdateElement: (elementId: string, properties: any) => void
  onDeleteElement: (elementId: string) => void
  projectId: string
  pageSlug: string
}

export function PropertiesPanel({
  selectedElement,
  pages,
  onUpdateElement,
  onDeleteElement,
  projectId,
  pageSlug,
}: PropertiesPanelProps) {
  const [localElement, setLocalElement] = useState<DisplanCanvasElement | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [showEffectsMenu, setShowEffectsMenu] = useState(false)
  const [showCursorMenu, setShowCursorMenu] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    typography: false,
    layout: false,
    appearance: false,
    effects: false,
    behavior: false,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // Enhanced check for template elements
  const isTemplateElement = (elementId: string): boolean => {
    return (
      elementId.includes("_template-") ||
      elementId.includes("_empty-") ||
      elementId.startsWith("user_") ||
      elementId.includes("_heading") ||
      elementId.includes("_text") ||
      elementId.includes("_image") ||
      elementId.includes("_button") ||
      elementId.includes("_link") ||
      elementId.includes("_component") ||
      elementId.startsWith("template-") ||
      elementId.startsWith("empty-")
    )
  }

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setLocalElement({ ...selectedElement })
      setUpdateError(null)
      setUpdateSuccess(false)
      setShowDeleteConfirm(false)
    } else {
      setLocalElement(null)
    }
  }, [selectedElement])

  // Focus input when element is selected
  useEffect(() => {
    if (inputRef.current && localElement) {
      inputRef.current.focus()
    }
  }, [localElement])

  // Debounced server update function
  const debouncedServerUpdate = useCallback(
    async (elementId: string, properties: any) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      updateTimeoutRef.current = setTimeout(async () => {
        setIsUpdating(true)
        setUpdateError(null)

        try {
          let result

          if (isTemplateElement(elementId)) {
            // Handle template element update
            console.log("Updating template element:", elementId, "with properties:", properties)

            result = await displan_project_designer_css_update_template_element(
              projectId,
              pageSlug,
              elementId,
              localElement?.element_type || "text",
              properties,
            )
          } else {
            // Handle regular element update
            console.log("Updating regular element:", elementId, "with properties:", properties)

            result = await displan_project_designer_css_update_element_new(elementId, properties)
          }

          console.log("Update result:", result)

          if (result.success) {
            setUpdateSuccess(true)
            onUpdateElement(elementId, properties)

            // Hide success indicator after 2 seconds
            setTimeout(() => setUpdateSuccess(false), 2000)
          } else {
            setUpdateError(result.error || "Failed to update element")
          }
        } catch (error) {
          console.error("Update error:", error)
          setUpdateError("Network error occurred")
        } finally {
          setIsUpdating(false)
        }
      }, 300) // 300ms debounce
    },
    [localElement, onUpdateElement, projectId, pageSlug],
  )

  // Handle element deletion
  const handleDeleteElement = useCallback(async () => {
    if (!localElement) return

    setIsDeleting(true)
    setUpdateError(null)

    try {
      let result

      if (isTemplateElement(localElement.id)) {
        // Handle template element deletion
        console.log("Deleting template element:", localElement.id)
        result = await displan_project_designer_css_delete_template_element(
          projectId,
          pageSlug,
          localElement.id
        )
      } else {
        // Handle regular element deletion
        console.log("Deleting regular element:", localElement.id)
        result = await displan_project_designer_css_delete_element(localElement.id)
      }

      console.log("Delete result:", result)

      if (result.success) {
        // Call the parent callback to remove element from canvas
        onDeleteElement(localElement.id)
        setShowDeleteConfirm(false)
        
        // Show success message briefly
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 2000)
      } else {
        setUpdateError(result.error || "Failed to delete element")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setUpdateError("Network error occurred during deletion")
    } finally {
      setIsDeleting(false)
    }
  }, [localElement, onDeleteElement, projectId, pageSlug])

  const handlePropertyChange = useCallback(
    (property: string, value: any) => {
      if (!localElement) return

      // Update local state immediately for responsive UI
      const updatedElement = { ...localElement, [property]: value }
      setLocalElement(updatedElement)

      // Debounce server update
      debouncedServerUpdate(localElement.id, { [property]: value })
    },
    [localElement, debouncedServerUpdate],
  )

  const handleMultiplePropertyChange = useCallback(
    (properties: Record<string, any>) => {
      if (!localElement) return

      // Update local state immediately
      const updatedElement = { ...localElement, ...properties }
      setLocalElement(updatedElement)

      // Debounce server update
      debouncedServerUpdate(localElement.id, properties)
    },
    [localElement, debouncedServerUpdate],
  )

  const handlePageSelect = (page: any) => {
    handleMultiplePropertyChange({
      link_page: page.slug,
      link_url: `/dashboard/apps/displan/editor/${projectId}?page=${page.slug}`,
    })
    setShowLinkMenu(false)
  }

  const handleImageUpload = async (file: File) => {
    // Prevent image upload for template elements
    if (localElement && isTemplateElement(localElement.id)) {
      setUpdateError("Image upload not supported for template elements")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setIsUpdating(true)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        handlePropertyChange("content", data.url)
      } else {
        setUpdateError("Failed to upload image")
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setUpdateError("Upload failed")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Configuration arrays
  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Playfair Display", value: "Playfair Display, serif" },
    { name: "Merriweather", value: "Merriweather, serif" },
    { name: "Fira Code", value: "Fira Code, monospace" },
  ]

  const fontWeights = [
    { name: "Thin", value: "100" },
    { name: "Light", value: "300" },
    { name: "Normal", value: "400" },
    { name: "Medium", value: "500" },
    { name: "Semibold", value: "600" },
    { name: "Bold", value: "700" },
    { name: "Black", value: "900" },
  ]

  const textAlignments = [
    { name: "Left", value: "left" },
    { name: "Center", value: "center" },
    { name: "Right", value: "right" },
    { name: "Justify", value: "justify" },
  ]

  const cursorTypes = [
    { name: "default", icon: "↖", value: "default" },
    { name: "pointer", icon: "👆", value: "pointer" },
    { name: "crosshair", icon: "✚", value: "crosshair" },
    { name: "text", icon: "I", value: "text" },
    { name: "move", icon: "✋", value: "move" },
    { name: "wait", icon: "⏳", value: "wait" },
    { name: "help", icon: "❓", value: "help" },
    { name: "not-allowed", icon: "🚫", value: "not-allowed" },
    { name: "grab", icon: "✊", value: "grab" },
    { name: "grabbing", icon: "👊", value: "grabbing" },
    { name: "zoom-in", icon: "🔍", value: "zoom-in" },
    { name: "zoom-out", icon: "🔍", value: "zoom-out" },
  ]

  const animations = [
    { name: "None", value: "none" },
    { name: "Fade In", value: "fadeIn" },
    { name: "Slide In Left", value: "slideInLeft" },
    { name: "Slide In Right", value: "slideInRight" },
    { name: "Slide In Up", value: "slideInUp" },
    { name: "Slide In Down", value: "slideInDown" },
    { name: "Bounce In", value: "bounceIn" },
    { name: "Zoom In", value: "zoomIn" },
    { name: "Rotate In", value: "rotateIn" },
    { name: "Flip In X", value: "flipInX" },
    { name: "Flip In Y", value: "flipInY" },
    { name: "Pulse", value: "pulse" },
  ]

  const sizeOptions = [
    { name: "Fixed", value: "fixed" },
    { name: "Relative", value: "relative" },
    { name: "Fill", value: "fill" },
    { name: "Fit Content", value: "fit-content" },
  ]

  const commonColors = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#6b7280",
    "#1f2937",
    "#374151",
  ]

  if (!localElement) {
    return (
      <div className="w-80 bg-white dark:bg-black h-full overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="text-center py-8">
            <Layout className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Select an element to edit properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-black h-full overflow-y-auto">
      <div className="p-3">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {localElement.element_type.includes("text")
                ? "Text Element"
                : localElement.element_type.includes("image")
                  ? "Image Element"
                  : localElement.element_type.includes("button")
                    ? "Button Element"
                    : "Element"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTemplateElement(localElement.id)
                ? `Template Element ID: ${localElement.id.slice(0, 12)}...`
                : `ID: ${localElement.id.slice(0, 8)}...`}
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-1">
            {(isUpdating || isDeleting) && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
            {updateSuccess && <Check className="w-4 h-4 text-green-500" />}
            {updateError && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>

        {/* Error Message */}
        {updateError && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
            {updateError}
          </div>
        )}

        <div className="space-y-3">
          {/* Content Section */}
          <div className="">
            <button
              onClick={() => toggleSection("content")}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-[#8888881A]"
            >
              <div className="flex items-center">
                <Type className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Content</span>
              </div>
              {expandedSections.content ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.content && (
              <div className="p-3 space-y-3">
                {localElement.element_type.includes("image") ? (
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Image</label>
                    <div className="space-y-2">
                      {localElement.content && (
                        <img
                          src={localElement.content || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded border"
                        />
                      )}
                      {!isTemplateElement(localElement.id) && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file)
                            }}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Upload className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Upload Image</span>
                          </label>
                        </>
                      )}
                      {isTemplateElement(localElement.id) && (
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-400">
                          Template images cannot be uploaded. Use URL field instead.
                        </div>
                      )}
                      <div>
                        <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={localElement.content || ""}
                          onChange={(e) => handlePropertyChange("content", e.target.value)}
                          className="input_field23232425AS"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Text</label>
                    <textarea
                      ref={inputRef}
                      value={localElement.content || ""}
                      onChange={(e) => handlePropertyChange("content", e.target.value)}
                      className="input_field23232425AS_b"
                      placeholder="Enter content..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Link */}
                <div className="relative">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Link</label>
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={localElement.link_url || ""}
                      onChange={(e) => handlePropertyChange("link_url", e.target.value)}
                      className="input_field23232425AS"
                    />
                    <button
                      onClick={() => setShowLinkMenu(!showLinkMenu)}
                      className="px-2 py-1.5 menu_container_Cursor_12_f text-gray-900 dark:text-white rounded text-xs"
                    >
                      Pages
                    </button>
                  </div>

                  {showLinkMenu && (
                    <div className="menu_container12212">
                      {pages.map((page) => (
                        <button key={page.id} onClick={() => handlePageSelect(page)} className="menu_item">
                          {page.is_folder ? <Folder className="w-3 h-3 mr-2" /> : <FileText className="w-3 h-3 mr-2" />}
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Typography Section */}
          {!localElement.element_type.includes("image") && (
            <div className="">
              <button
                onClick={() => toggleSection("typography")}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-[#8888881A]"
              >
                <div className="flex items-center">
                  <Type className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Typography</span>
                </div>
                {expandedSections.typography ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {expandedSections.typography && (
                <div className="p-3 space-y-3">
                  {/* Font Family */}
                  <div className="relative">
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Font Family</label>
                    <button onClick={() => setShowFontMenu(!showFontMenu)} className="input_field23232425AS">
                      {fontFamilies.find((f) => f.value === localElement.font_family)?.name || "Inter"}
                    </button>

                    {showFontMenu && (
                      <div className="absolute top-full left-0 right-0 bg-black shadow-lg z-50 max-h-40 overflow-y-auto">
                        {fontFamilies.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => {
                              handlePropertyChange("font_family", font.value)
                              setShowFontMenu(false)
                            }}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-[#8888881A] text-gray-900 dark:text-white"
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Size and Weight */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Size</label>
                      <input
                        type="number"
                        value={localElement.font_size || 16}
                        onChange={(e) => handlePropertyChange("font_size", Number(e.target.value))}
                        className="input_field23232425AS"
                        min="8"
                        max="72"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Weight</label>
                      <select
                        value={localElement.font_weight || "400"}
                        onChange={(e) => handlePropertyChange("font_weight", e.target.value)}
                        className="input_field23232425AS"
                      >
                        {fontWeights.map((weight) => (
                          <option key={weight.value} value={weight.value}>
                            {weight.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="relative">
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Text Color</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: localElement.text_color || "#000000" }}
                      />
                      <input
                        type="text"
                        value={localElement.text_color || "#000000"}
                        onChange={(e) => handlePropertyChange("text_color", e.target.value)}
                        className="input_field23232425AS"
                        placeholder="#000000"
                      />
                    </div>

                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-3">
                        <div className="grid grid-cols-6 gap-1 mb-2">
                          {commonColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                handlePropertyChange("text_color", color)
                                setShowColorPicker(false)
                              }}
                              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={localElement.text_color || "#000000"}
                          onChange={(e) => handlePropertyChange("text_color", e.target.value)}
                          className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Alignment</label>
                    <div className="grid grid-cols-4 gap-1">
                      {textAlignments.map((alignment) => (
                        <button
                          key={alignment.value}
                          onClick={() => handlePropertyChange("text_align", alignment.value)}
                          className={`px-2 py-1.5 text-xs rounded ${
                            localElement.text_align === alignment.value
                              ? "menu_container_Cursor_12_f"
                              : "menu_container_Cursor_12"
                          }`}
                        >
                          {alignment.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appearance Section */}
          <div className="">
            <button
              onClick={() => toggleSection("appearance")}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-[#8888881A]"
            >
              <div className="flex items-center">
                <Palette className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Appearance</span>
              </div>
              {expandedSections.appearance ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.appearance && (
              <div className="p-3 space-y-3">
                {/* Background Color */}
                <div className="relative">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: localElement.background_color || "transparent" }}
                    />
                    <input
                      type="text"
                      value={localElement.background_color || ""}
                      onChange={(e) => handlePropertyChange("background_color", e.target.value)}
                      className="input_field23232425AS"
                      placeholder="transparent"
                    />
                  </div>

                  {showBgColorPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-3">
                      <div className="grid grid-cols-6 gap-1 mb-2">
                        {commonColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              handlePropertyChange("background_color", color)
                              setShowBgColorPicker(false)
                            }}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={localElement.background_color || "#ffffff"}
                        onChange={(e) => handlePropertyChange("background_color", e.target.value)}
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* Border */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Border Width</label>
                    <input
                      type="number"
                      value={localElement.border_width || 0}
                      onChange={(e) => handlePropertyChange("border_width", Number(e.target.value))}
                      className="input_field23232425AS"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Border Radius</label>
                    <input
                      type="number"
                      value={localElement.border_radius || 0}
                      onChange={(e) => handlePropertyChange("border_radius", Number(e.target.value))}
                      className="input_field23232425AS"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Border Color</label>
                  <input
                    type="text"
                    value={localElement.border_color || ""}
                    onChange={(e) => handlePropertyChange("border_color", e.target.value)}
                    className="input_field23232425AS"
                    placeholder="#000000"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localElement.opacity || 1}
                    onChange={(e) => handlePropertyChange("opacity", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round((localElement.opacity || 1) * 100)}%
                  </div>
                </div>

                {/* Visibility */}
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-700 dark:text-gray-300">Visible</label>
                  <button
                    onClick={() => handlePropertyChange("visible", !localElement.visible)}
                    className={`flex items-center px-2 py-1 rounded text-xs ${
                      localElement.visible !== false
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {localElement.visible !== false ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Effects Section */}
          <div className="">
            <button
              onClick={() => toggleSection("effects")}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-[#8888881A]"
            >
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Effects</span>
              </div>
              {expandedSections.effects ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.effects && (
              <div className="p-3 space-y-3">
                <div className="relative">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Animation</label>
                  <button onClick={() => setShowEffectsMenu(!showEffectsMenu)} className="input_field23232425AS">
                    {animations.find((a) => a.value === localElement.animation)?.name || "None"}
                  </button>

                  {showEffectsMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      <div className="p-2">
                        <div className="grid grid-cols-2 gap-1">
                          {animations.map((animation) => (
                            <button
                              key={animation.value}
                              onClick={() => {
                                handlePropertyChange("animation", animation.value)
                                setShowEffectsMenu(false)
                              }}
                              className="p-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            >
                              {animation.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transform */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Rotate</label>
                    <input
                      type="number"
                      value={localElement.transform_rotate || 0}
                      onChange={(e) => handlePropertyChange("transform_rotate", Number(e.target.value))}
                      className="input_field23232425AS"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Scale X</label>
                    <input
                      type="number"
                      step="0.1"
                      value={localElement.transform_scale_x || 1}
                      onChange={(e) => handlePropertyChange("transform_scale_x", Number(e.target.value))}
                      className="input_field23232425AS"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Scale Y</label>
                    <input
                      type="number"
                      step="0.1"
                      value={localElement.transform_scale_y || 1}
                      onChange={(e) => handlePropertyChange("transform_scale_y", Number(e.target.value))}
                      className="input_field23232425AS"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Behavior Section */}
          <div className="">
            <button
              onClick={() => toggleSection("behavior")}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-[#8888881A]"
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Behavior</span>
              </div>
              {expandedSections.behavior ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.behavior && (
              <div className="p-3 space-y-3">
                {/* Cursor */}
                <div className="relative">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Cursor</label>
                  <button onClick={() => setShowCursorMenu(!showCursorMenu)} className="input_field23232425AS">
                    {localElement.cursor || "default"}
                  </button>

                  {showCursorMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 menu_container_Cursor">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white">Cursor</span>
                        <button onClick={() => setShowCursorMenu(false)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {cursorTypes.map((cursor) => (
                          <button
                            key={cursor.value}
                            onClick={() => {
                              handlePropertyChange("cursor", cursor.value)
                              setShowCursorMenu(false)
                            }}
                            className={`menu_container_Cursor_1 ${
                              localElement.cursor === cursor.value ? "bg-gray-800" : "menu_container_Cursor_12"
                            }`}
                          >
                            <div className="text-lg mb-1">{cursor.icon}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Device Type */}
                {!isTemplateElement(localElement.id) && (
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Device Target</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => handlePropertyChange("device_type", "desktop")}
                        className={`flex flex-col items-center p-2 rounded border text-xs ${
                          localElement.device_type === "desktop" || !localElement.device_type
                            ? "menu_container_Cursor_12_f"
                            : "menu_container_Cursor_12 border-none"
                        }`}
                      >
                        <Monitor className="w-4 h-4 mb-1" />
                        Desktop
                      </button>
                      <button
                        onClick={() => handlePropertyChange("device_type", "tablet")}
                        className={`flex flex-col items-center p-2 rounded border text-xs ${
                          localElement.device_type === "tablet"
                            ? "menu_container_Cursor_12_f"
                            : "menu_container_Cursor_12 border-none"
                        }`}
                      >
                        <Tablet className="w-4 h-4 mb-1" />
                        Tablet
                      </button>
                      <button
                        onClick={() => handlePropertyChange("device_type", "mobile")}
                        className={`flex flex-col items-center p-2 rounded border text-xs ${
                          localElement.device_type === "mobile"
                            ? "menu_container_Cursor_12_f"
                            : "menu_container_Cursor_12 border-none"
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mb-1" />
                        Mobile
                      </button>
                    </div>
                  </div>
                )}

                {/* Z-Index */}
                {!isTemplateElement(localElement.id) && (
                  <div>
                    <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Z-Index</label>
                    <input
                      type="number"
                      value={localElement.z_index || 0}
                      onChange={(e) => handlePropertyChange("z_index", Number(e.target.value))}
                      className="input_field23232425AS"
                    />
                  </div>
                )}

                {/* Delete Element Button */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">Element Actions</label>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete Element
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
                        Are you sure you want to delete this element? This action cannot be undone.
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDeleteElement}
                          disabled={isDeleting}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-2" />
                              Confirm Delete
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
