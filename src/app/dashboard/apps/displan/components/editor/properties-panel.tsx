"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card_properties"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Save, Check, AlertCircle, Trash2, Loader2 } from "lucide-react"
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"
import { Button, Flex, InputField, theme } from "@webstudio-is/design-system";
import "@/styles/tabs_ui.css"
import "@/styles/bg_00000__f.css"

interface PropertiesPanelProps {
  selectedElement?: DisplanCanvasElement | null
  selectedTemplateElement?: string | null
  projectId: string
  pageSlug: string
  onUpdateElement?: (elementId: string, properties: any) => void
  onUpdateTemplateElement?: (elementId: string, elementType: string, properties: any) => void
  onDeleteElement?: (elementId: string) => void
}

const HTML_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "div",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "main",
  "aside",
  "address",
  "figure",
]

export function PropertiesPanel({
  selectedElement,
  selectedTemplateElement,
  projectId,
  pageSlug,
  onUpdateElement,
  onUpdateTemplateElement,
  onDeleteElement,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("settings")
  const [elementData, setElementData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [customStyles, setCustomStyles] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Auto-save timer
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const lastSaveData = useRef<string>("")

  // Form state
  const [formData, setFormData] = useState({
    elementName: "",
    visible: true,
    content: "",
    htmlTag: "div",
    customId: "",
    customClass: "",
    linkUrl: "",
    linkPage: "",
    linkTarget: "_self",
    prefetch: false,
    download: false,
  })

  // 🔥🔥🔥 LOAD ELEMENT DATA AND SYNC UI
  useEffect(() => {
    console.log("🔥🔥🔥 SELECTION CHANGED:", { selectedElement: selectedElement?.id })

    if (selectedElement) {
      loadElementData(selectedElement)
    } else {
      setElementData(null)
      resetForm()
    }
  }, [selectedElement])

  const loadElementData = async (element: DisplanCanvasElement) => {
    console.log("🔥🔥🔥 LOADING ELEMENT DATA:", element)

    // Always fetch fresh data from database to ensure sync
    try {
      const response = await fetch(`/api/elements/${element.id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.element) {
          element = result.element // Use fresh data from database
          console.log("✅✅✅ LOADED FRESH DATA FROM DATABASE:", element)
        }
      }
    } catch (error) {
      console.log("⚠️ Could not fetch fresh data, using provided element")
    }

    setElementData(element)

    // Extract data from styles if available
    const styles = element.styles || {}
    console.log("🔥🔥🔥 ELEMENT STYLES:", styles)

    const newFormData = {
      elementName: styles.elementName || element.content || `Element ${element.id.slice(-4)}`,
      visible: element.visible !== false,
      content: element.content || "",
      htmlTag: styles.htmlTag || getElementTag(element.element_type),
      customId: styles.customId || "",
      customClass: styles.customClass || "",
      linkUrl: styles.linkUrl || element.link_url || "",
      linkPage: styles.linkPage || element.link_page || "",
      linkTarget: styles.linkTarget || "_self",
      prefetch: styles.prefetch || false,
      download: styles.download || false,
    }

    setFormData(newFormData)
    setCustomStyles(styles.customStyles || "")
    setSaveError(null)
    setHasChanges(false)

    // Update last save reference
    lastSaveData.current = JSON.stringify({ ...newFormData, customStyles: styles.customStyles || "" })

    // Apply styles immediately to DOM
    setTimeout(() => {
      applyStylesToDOM(element.id, newFormData.customClass, newFormData.customId, styles.customStyles || "")
    }, 100)
  }

  const resetForm = () => {
    setFormData({
      elementName: "",
      visible: true,
      content: "",
      htmlTag: "div",
      customId: "",
      customClass: "",
      linkUrl: "",
      linkPage: "",
      linkTarget: "_self",
      prefetch: false,
      download: false,
    })
    setCustomStyles("")
    setSaveError(null)
    setHasChanges(false)
    lastSaveData.current = ""
  }

  const getElementTag = (elementType: string): string => {
    if (elementType?.startsWith("text-h")) return elementType.replace("text-", "")
    if (elementType?.startsWith("text-")) return "p"
    return "div"
  }

  const isButtonElement = () => {
    return elementData?.element_type?.includes("button")
  }

  const isTextElement = () => {
    return elementData?.element_type?.startsWith("text") || !isButtonElement()
  }

  // 🔥🔥🔥 REAL-TIME SAVE FUNCTION
  const saveElement = useCallback(
    async (data?: typeof formData, styles?: string) => {
      if (!selectedElement) {
        console.error("❌❌❌ NO ELEMENT SELECTED")
        setSaveError("No element selected")
        return false
      }

      const dataToSave = data || formData
      const stylesToSave = styles !== undefined ? styles : customStyles

      // Check if data actually changed
      const currentDataString = JSON.stringify({ ...dataToSave, customStyles: stylesToSave })
      if (currentDataString === lastSaveData.current) {
        console.log("🔥🔥🔥 NO CHANGES TO SAVE")
        return true
      }

      setIsSaving(true)
      setSaveError(null)

      try {
        const saveData = {
          elementName: dataToSave.elementName,
          content: dataToSave.content,
          visible: dataToSave.visible,
          customId: dataToSave.customId,
          customClass: dataToSave.customClass,
          htmlTag: dataToSave.htmlTag,
          linkUrl: dataToSave.linkUrl,
          linkPage: dataToSave.linkPage,
          linkTarget: dataToSave.linkTarget,
          prefetch: dataToSave.prefetch,
          download: dataToSave.download,
          customStyles: stylesToSave,
        }

        console.log("🔥🔥🔥 SAVING ELEMENT:", selectedElement.id)
        console.log("🔥🔥🔥 SAVE DATA:", saveData)

        const response = await fetch(`/api/elements/${selectedElement.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveData),
        })

        console.log("🔥🔥🔥 RESPONSE STATUS:", response.status)

        const responseText = await response.text()
        console.log("🔥🔥🔥 RESPONSE TEXT:", responseText)

        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          throw new Error(`Invalid response: ${responseText}`)
        }

        if (!response.ok) {
          throw new Error(result.error || `HTTP ${response.status}`)
        }

        console.log("✅✅✅ SAVE SUCCESS:", result)

        // 🔥🔥🔥 UPDATE ELEMENT DATA IMMEDIATELY
        if (result.element) {
          setElementData(result.element)
          console.log("✅✅✅ UPDATED ELEMENT DATA IN UI")
        }

        // 🔥🔥🔥 UPDATE CANVAS IMMEDIATELY
        if (onUpdateElement) {
          const updateData = {
            ...saveData,
            element_type: isButtonElement() ? "button" : `text-${dataToSave.htmlTag}`,
            styles: {
              elementName: dataToSave.elementName,
              customId: dataToSave.customId,
              customClass: dataToSave.customClass,
              htmlTag: dataToSave.htmlTag,
              linkUrl: dataToSave.linkUrl,
              linkPage: dataToSave.linkPage,
              linkTarget: dataToSave.linkTarget,
              prefetch: dataToSave.prefetch,
              download: dataToSave.download,
              customStyles: stylesToSave,
            },
          }

          onUpdateElement(selectedElement.id, updateData)
          console.log("✅✅✅ UPDATED CANVAS")
        }

        // 🔥🔥🔥 APPLY STYLES TO DOM IMMEDIATELY
        applyStylesToDOM(selectedElement.id, dataToSave.customClass, dataToSave.customId, stylesToSave)

        // Update save state
        lastSaveData.current = currentDataString
        setLastSaved(new Date())
        setSaveError(null)
        setHasChanges(false)

        console.log("✅✅✅ ELEMENT SAVED SUCCESSFULLY!")
        return true
      } catch (error) {
        console.error("❌❌❌ SAVE ERROR:", error)
        const errorMessage = error instanceof Error ? error.message : "Save failed"
        setSaveError(errorMessage)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [selectedElement, formData, customStyles, onUpdateElement],
  )

  // 🔥🔥🔥 AUTO-SAVE WITH DEBOUNCING
  const triggerAutoSave = useCallback(
    (data: typeof formData, styles?: string) => {
      // Clear existing timer
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }

      // Set new timer
      autoSaveTimer.current = setTimeout(() => {
        console.log("🔥🔥🔥 AUTO-SAVE TRIGGERED")
        saveElement(data, styles)
      }, 1500) // Auto-save after 1.5 seconds of inactivity
    },
    [saveElement],
  )

  // Apply styles to DOM immediately for visual feedback
  const applyStylesToDOM = (elementId: string, customClass?: string, customId?: string, customStyles?: string) => {
    console.log("🔥🔥🔥 APPLYING STYLES TO DOM:", { elementId, customClass, customId, customStyles })

    const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement
    if (!element) {
      console.log("❌❌❌ ELEMENT NOT FOUND IN DOM:", elementId)
      return
    }

    // Apply class
    if (customClass) {
      // Remove old custom classes
      element.className = element.className
        .split(" ")
        .filter((cls) => !cls.startsWith("custom-"))
        .join(" ")
      element.classList.add(customClass)
      console.log("✅✅✅ APPLIED CLASS:", customClass)
    }

    // Apply ID
    if (customId) {
      element.id = customId
      console.log("✅✅✅ APPLIED ID:", customId)
    }

    // Apply custom styles
    if (customStyles) {
      const styleId = `element-styles-${elementId}`
      let styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      styleElement.textContent = customStyles
      console.log("✅✅✅ APPLIED CUSTOM STYLES:", customStyles)
    }
  }

  // Handle form changes with real-time updates
  const handleFormChange = (field: string, value: any) => {
    console.log("🔥🔥🔥 FORM CHANGE:", field, value)

    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      setHasChanges(true)

      // Apply visual changes immediately
      if ((field === "customClass" || field === "customId") && selectedElement) {
        applyStylesToDOM(
          selectedElement.id,
          field === "customClass" ? value : newData.customClass,
          field === "customId" ? value : newData.customId,
          customStyles,
        )
      }

      // Trigger auto-save
      triggerAutoSave(newData)

      return newData
    })
  }

  // Handle immediate save for critical fields
  const handleImmediateSave = (field: string, value: any) => {
    console.log("🔥🔥🔥 IMMEDIATE SAVE:", field, value)

    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      setHasChanges(true)

      // Save immediately
      saveElement(newData)

      return newData
    })
  }

  // Handle custom styles change
  const handleStylesChange = (newStyles: string) => {
    setCustomStyles(newStyles)
    setHasChanges(true)

    // Apply immediately for visual feedback
    if (selectedElement) {
      applyStylesToDOM(selectedElement.id, formData.customClass, formData.customId, newStyles)
    }

    // Trigger auto-save
    triggerAutoSave(formData, newStyles)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedElement) return

    if (confirm("Are you sure you want to delete this element?")) {
      try {
        console.log("🔥🔥🔥 DELETING ELEMENT:", selectedElement.id)

        const response = await fetch(`/api/elements/${selectedElement.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete element")
        }

        console.log("✅✅✅ ELEMENT DELETED SUCCESSFULLY")

        if (onDeleteElement) {
          onDeleteElement(selectedElement.id)
        }

        resetForm()
      } catch (error) {
        console.error("❌❌❌ ERROR DELETING ELEMENT:", error)
        setSaveError("Failed to delete element")
      }
    }
  }

  const openStyleEditor = () => {
    setShowStyleEditor(true)
  }

  const handleStyleSave = async () => {
    console.log("🔥🔥🔥 SAVING CUSTOM STYLES:", customStyles)

    // Save to database
    const success = await saveElement(formData, customStyles)
    if (success) {
      setShowStyleEditor(false)
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [])

  if (!elementData) {
    return (
      <div className="w-80 bg-white dark:bg-black h-full overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="text-center py-8 border border-[#8888881A] rounded-[10px]">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Select an instance on the canvas</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-black h-full overflow-y-auto border-l border-gray-200 dark:border-gray-800">
      <div className="">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-4">
            <TabsTrigger value="style" className="sfsfwfsfwfwfwf">Style</TabsTrigger>
            <TabsTrigger value="settings" className="sfsfwfsfwfwfwf2">Settings</TabsTrigger>
          </TabsList>
            <Separator className="sfsfwfsfwfwfwf3"/>
        {/* Save status and button */}
        {/* <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                <span className="text-xs text-blue-500">Saving...</span>
              </>
            ) : saveError ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">Save failed</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : hasChanges ? (
              <>
                <AlertCircle className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-500">Auto-saving...</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">Ready</span>
            )}
          </div>

          <Button onClick={() => saveElement()} disabled={isSaving} size="sm" className="h-7">
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
            Save Now
          </Button>
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{saveError}</p>
            <button onClick={() => setSaveError(null)} className="text-xs text-red-500 underline mt-1">
              Dismiss
            </button>
          </div>
        )} */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4">
              <Badge variant="secondary" className="text-xs">
                {isButtonElement() ? "Button" : isTextElement() ? "Text" : "Element"}
              </Badge>
              <button  onClick={openStyleEditor} className="bg_00000__f">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Name Field */}
            <div className="space-y-4 p-4">
              <div className="space-y-2">
              <Label htmlFor="element-name">Name</Label>
              <input
                id="element-name"
                className="flex h-9 w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                value={formData.elementName}
                onChange={(e) => handleFormChange("elementName", e.target.value)}
                placeholder="Element name"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="element-visible">Show</Label>
              <Switch
                id="element-visible"
                checked={formData.visible}
                onCheckedChange={(checked) => handleImmediateSave("visible", checked)}
              />
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <Label htmlFor="element-content">Text Content</Label>
              <textarea
                id="element-content"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                value={formData.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                placeholder="Enter text content"
                rows={3}
              />
            </div>
            </div>

            <Separator />

            {/* Properties & Attributes */}
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Properties & Attributes</h3>
              </div>

              {/* Tag Selection (only for text elements) */}
              {isTextElement() && (
                <div className="space-y-2">
                  <Label htmlFor="element-tag">Tag</Label>
                  <Select value={formData.htmlTag} onValueChange={(value) => handleImmediateSave("htmlTag", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HTML_TAGS.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* ID Field */}
              <div className="space-y-2">
                <Label htmlFor="element-id">ID</Label>
                <input
                  id="element-id"
                  value={formData.customId}
                  onChange={(e) => handleFormChange("customId", e.target.value)}
                  placeholder="element-id"
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>

              {/* Class Field */}
              <div className="space-y-2">
                <Label htmlFor="element-class">Class</Label>
                <input
                  id="element-class"
                  value={formData.customClass}
                  onChange={(e) => handleFormChange("customClass", e.target.value)}
                  placeholder="css-class"
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>

              {/* Button-specific fields */}
              {isButtonElement() && (
                <>
                  <div className="space-y-2">
                    <Label>Href</Label>
                    <Input
                      value={formData.linkUrl}
                      onChange={(e) => handleFormChange("linkUrl", e.target.value)}
                      placeholder="https://www.url.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link-target">Target</Label>
                    <Select
                      value={formData.linkTarget}
                      onValueChange={(value) => handleImmediateSave("linkTarget", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">Same Window</SelectItem>
                        <SelectItem value="_blank">New Window</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prefetch">Prefetch</Label>
                    <Select
                      value={formData.prefetch ? "true" : "false"}
                      onValueChange={(value) => handleImmediateSave("prefetch", value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="download">Download</Label>
                    <Switch
                      id="download"
                      checked={formData.download}
                      onCheckedChange={(checked) => handleImmediateSave("download", checked)}
                    />
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <button onClick={() => saveElement()} disabled={isSaving} className="bg_00000__f w_reee23">
                {/* {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} */}
                Save All Changes
              </button>

              {selectedElement && (
                <button onClick={handleDelete} className="bg_00000__f w_reee23">
                  {/* <Trash2 className="h-4 w-4 mr-2" /> */}
                  Delete Element
                </button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="text-center">
                <Button variant="outline" onClick={openStyleEditor} className="w-full">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Open Style Editor
                </Button>
              </div>

              {/* Quick style preview */}
              {customStyles && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Label className="text-xs font-medium">Current Custom Styles:</Label>
                  <pre className="text-xs mt-2 overflow-auto max-h-32">{customStyles}</pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Style Editor Modal */}
      {showStyleEditor && (
        <div className="fixed inset-0 border-[#888888A1] flex items-center justify-center z-50">
          <Card className="w-[600px] h-[500px] m-4">
            <CardHeader>
              <div className="flex gap-2">
                <button onClick={handleStyleSave} className="bg_00000__f2" disabled={isSaving}>
                  {/* {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} */}
                  Save Styles
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 mb-4">
                <textarea
                  id="custom-styles"
                  className="h-[98%] mt-2 font-mono overflow-hidden flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  value={customStyles}
                  onChange={(e) => handleStylesChange(e.target.value)}
                  placeholder={`/* Example CSS for this element */
.${formData.customClass || "my-element"} {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
}

/* Hover effects */
.${formData.customClass || "my-element"}:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

/* Custom ID styles */
#${formData.customId || "my-element"} {
  border: 3px solid #007bff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
