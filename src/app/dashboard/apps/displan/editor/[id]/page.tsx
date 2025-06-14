"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { LeftSidebar } from "../../components/editor/left-sidebar"
import { RightSidebar } from "../../components/editor/right-sidebar"
import Canvas from "../../components/editor/canvas"
import { TopBar } from "../../components/editor/top-bar"
import { PropertiesPanel } from "../../components/editor/properties-panel"
import {
  displan_project_designer_css_fetch_comments,
  displan_project_designer_css_create_comment,
  displan_project_designer_css_delete_comment,
  displan_project_designer_css_fetch_pages,
  displan_project_designer_css_create_page,
} from "../../lib/actions/displan-editor-actions"
import {
  displan_project_designer_css_fetch_elements_new,
  displan_project_designer_css_add_element_new,
  displan_project_designer_css_update_element_new,
  displan_project_designer_css_save_canvas_new,
} from "../../lib/actions/displan-canvas-actions-new"
import type {
  DisplanProjectDesignerCssComment,
  DisplanProjectDesignerCssPage,
  EditorTool,
} from "../../lib/types/displan-editor-types"
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"

export default function EditorPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.id as string

  const [currentTool, setCurrentTool] = useState<EditorTool>("cursor")
  const [currentPage, setCurrentPage] = useState("home")
  const [comments, setComments] = useState<DisplanProjectDesignerCssComment[]>([])
  const [pages, setPages] = useState<DisplanProjectDesignerCssPage[]>([])
  const [elements, setElements] = useState<DisplanCanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<DisplanCanvasElement | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

  // Responsive controls state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [canvasWidth, setCanvasWidth] = useState(1200)
  const [canvasHeight, setCanvasHeight] = useState(800)

  // Add CMS state management
  const [isCmsMode, setIsCmsMode] = useState(false)
  const [currentCmsEntry, setCurrentCmsEntry] = useState<any>(null)
  const [cmsLoading, setCmsLoading] = useState(false)

  useEffect(() => {
    // Try to get user email from localStorage or session
    const email = localStorage.getItem("user_email") || sessionStorage.getItem("user_email")
    if (email) {
      setUserEmail(email)
    }

    // Load saved responsive settings from localStorage
    const savedSettings = localStorage.getItem("canvas-settings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setPreviewDevice(settings.previewDevice || "desktop")
        setCanvasWidth(settings.canvasWidth || 1200)
        setCanvasHeight(settings.canvasHeight || 800)
        setZoom(settings.zoom || 100)
        setIsDarkMode(settings.isDarkMode || false)
      } catch (error) {
        console.error("Error loading saved settings:", error)
      }
    }

    // Check if there's a page parameter in the URL
    const pageParam = searchParams.get("page")
    if (pageParam) {
      setCurrentPage(pageParam)
    }

    loadComments()
    loadPages()
    loadElements()
  }, [projectId, currentPage, searchParams])

  // Save responsive settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      previewDevice,
      canvasWidth,
      canvasHeight,
      zoom,
      isDarkMode,
    }
    localStorage.setItem("canvas-settings", JSON.stringify(settings))
  }, [previewDevice, canvasWidth, canvasHeight, zoom, isDarkMode])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const loadComments = async () => {
    const result = await displan_project_designer_css_fetch_comments(projectId, currentPage)
    if (result.success) {
      setComments(result.data)
    }
  }

  const loadPages = async () => {
    const result = await displan_project_designer_css_fetch_pages(projectId)
    if (result.success) {
      setPages(result.data)
    }
  }

  const loadElements = async () => {
    const result = await displan_project_designer_css_fetch_elements_new(projectId, currentPage)
    if (result.success) {
      setElements(result.data)
    }
  }

  const handleCreateComment = async (x: number, y: number, message: string) => {
    const result = await displan_project_designer_css_create_comment(projectId, currentPage, x, y, message)
    if (result.success) {
      await loadComments()
    }
  }

  const handleCreatePage = async (name: string, isFolder: boolean) => {
    const result = await displan_project_designer_css_create_page(projectId, name, isFolder)
    if (result.success) {
      loadPages()
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    const result = await displan_project_designer_css_delete_comment(commentId)
    if (result.success) {
      loadComments()
    }
  }

  const handleAddElement = async (elementType: string, x: number, y: number, properties?: any) => {
    console.log("Adding element to canvas:", elementType, x, y, properties)
    try {
      const result = await displan_project_designer_css_add_element_new(
        projectId,
        currentPage,
        elementType,
        x,
        y,
        properties,
      )
      console.log("Add element result:", result)

      if (result.success) {
        console.log("Element added successfully, reloading elements")
        await loadElements()
        setSelectedElement(result.data)
      } else {
        console.error("Failed to add element:", result.error)
      }
    } catch (error) {
      console.error("Error adding element:", error)
    }
  }

  const handleUpdateElement = async (elementId: string, properties: any) => {
    console.log("Updating element:", elementId, properties)
    const result = await displan_project_designer_css_update_element_new(elementId, properties)
    if (result.success) {
      // Update local state immediately for better UX
      setElements((prevElements) => prevElements.map((el) => (el.id === elementId ? { ...el, ...properties } : el)))

      // Update selected element if it's the one being updated
      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement({ ...selectedElement, ...properties })
      }

      // Reload elements to get the latest data from server
      setTimeout(() => {
        loadElements()
      }, 100)
    } else {
      console.error("Failed to update element:", result.error)
    }
  }

  const handleSelectElement = (element: DisplanCanvasElement | null) => {
    console.log("Selecting element:", element?.id)
    setSelectedElement(element)
  }

  const handleMoveElement = async (elementId: string, x: number, y: number) => {
    await handleUpdateElement(elementId, { x_position: x, y_position: y })
  }

  const handleSaveCanvas = async () => {
    console.log("Saving canvas...")
    setIsSaving(true)
    try {
      const result = await displan_project_designer_css_save_canvas_new(projectId, currentPage)
      if (result.success) {
        console.log("Canvas saved successfully")
      } else {
        console.error("Failed to save canvas:", result.error)
      }
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePreviewMode = () => {
    console.log("Toggling preview mode from", isPreviewMode, "to", !isPreviewMode)
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      setSelectedElement(null)
    }
  }

  // Handle responsive controls
  const handleChangePreviewMode = (mode: "desktop" | "tablet" | "mobile") => {
    console.log("Changing preview mode to:", mode)
    setPreviewDevice(mode)

    // Set default dimensions based on device
    if (mode === "desktop") {
      setCanvasWidth(1200)
      setCanvasHeight(800)
    } else if (mode === "tablet") {
      setCanvasWidth(768)
      setCanvasHeight(1024)
    } else {
      setCanvasWidth(375)
      setCanvasHeight(667)
    }
  }

  const handleCanvasWidthChange = (width: number) => {
    console.log("Changing canvas width to:", width)
    setCanvasWidth(width)
  }

  const handleCanvasHeightChange = (height: number) => {
    console.log("Changing canvas height to:", height)
    setCanvasHeight(height)
  }

  // Handle AI-generated element requests
  const handleAIAddElement = (elementType: string, x: number, y: number, properties: any) => {
    handleAddElement(elementType, x, y, properties)
  }

  const handleDeleteElement = async (elementId: string) => {
    console.log("Deleting element:", elementId)
    try {
      // Remove from local state immediately for better UX
      setElements((prevElements) => prevElements.filter((el) => el.id !== elementId))

      // Clear selection if the deleted element was selected
      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement(null)
      }

      // Reload elements to sync with server
      setTimeout(() => {
        loadElements()
      }, 100)
    } catch (error) {
      console.error("Error deleting element:", error)
      // Reload elements to restore state if deletion failed
      loadElements()
    }
  }

  // Replace the existing handleCreatePage function with this enhanced version that includes CMS detection
  const handlePageChange = async (pageId: string) => {
    console.log("Page changed to:", pageId)
    setCurrentPage(pageId)

    // Check if this is a CMS entry
    if (pageId.startsWith("cms-")) {
      const parts = pageId.split("-")
      if (parts.length >= 3) {
        const collectionId = parts[1]
        const entrySlug = parts.slice(2).join("-")

        setIsCmsMode(true)
        setCmsLoading(true)

        try {
          // Load the CMS entry
          const response = await fetch(`/api/cms/collections/${collectionId}/entries`)
          if (response.ok) {
            const entries = await response.json()
            const foundEntry = entries.find((e: any) => e.slug === entrySlug)

            if (foundEntry) {
              setCurrentCmsEntry(foundEntry)

              // Clear existing elements first
              setElements([])
              setSelectedElement(null)

              // Wait a bit then add CMS elements
              setTimeout(() => {
                addCmsElementsToCanvas(foundEntry)
              }, 200)
            }
          }
        } catch (error) {
          console.error("Failed to load CMS entry:", error)
        } finally {
          setCmsLoading(false)
        }
      }
    } else {
      // Regular page
      setIsCmsMode(false)
      setCurrentCmsEntry(null)
      setCmsLoading(false)
    }
  }

  // Add function to convert CMS content to canvas elements
  const addCmsElementsToCanvas = (entry: any) => {
    console.log("Adding CMS elements to canvas:", entry)

    // Add title
    handleAddElement("text", canvasWidth / 2 - 200, 100, {
      text: entry.title,
      fontSize: 32,
      fontWeight: "bold",
      color: "#000000",
      textAlign: "center",
      width: 400,
      height: 50,
    })

    // Add date
    const formattedDate = new Date(entry.date).toLocaleDateString()
    handleAddElement("text", canvasWidth / 2 - 100, 170, {
      text: formattedDate,
      fontSize: 14,
      color: "#666666",
      textAlign: "center",
      width: 200,
      height: 25,
    })

    // Add status
    handleAddElement("text", canvasWidth / 2 - 50, 210, {
      text: entry.status.toUpperCase(),
      fontSize: 12,
      fontWeight: "bold",
      color: entry.status === "published" ? "#10B981" : "#F59E0B",
      textAlign: "center",
      width: 100,
      height: 25,
    })

    // Add content paragraphs
    const paragraphs = entry.content.split("\n").filter((p: string) => p.trim())
    let yPosition = 280

    paragraphs.forEach((paragraph: string) => {
      if (paragraph.trim()) {
        handleAddElement("text", 100, yPosition, {
          text: paragraph.trim(),
          fontSize: 16,
          color: "#333333",
          lineHeight: 1.6,
          width: canvasWidth - 200,
          height: Math.max(60, Math.ceil(paragraph.length / 80) * 25),
        })
        yPosition += Math.max(80, Math.ceil(paragraph.length / 80) * 30)
      }
    })
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col overflow-hidden">
      <TopBar
        isPreviewMode={isPreviewMode}
        onTogglePreview={handleTogglePreviewMode}
        onSave={handleSaveCanvas}
        isSaving={isSaving}
        previewMode={previewDevice}
        onChangePreviewMode={handleChangePreviewMode}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onCanvasWidthChange={handleCanvasWidthChange}
        onCanvasHeightChange={handleCanvasHeightChange}
      />

      <div className={`flex-1 flex overflow-hidden transition-all duration-300`}>
        {!isPreviewMode && (
          <div className="transition-all duration-300">
            <LeftSidebar
              pages={pages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onCreatePage={handleCreatePage}
              projectId={projectId}
            />
          </div>
        )}

        <Canvas
          currentTool={currentTool}
          comments={comments}
          elements={elements}
          selectedElement={selectedElement}
          onCreateComment={handleCreateComment}
          onSelectElement={handleSelectElement}
          onMoveElement={handleMoveElement}
          onUpdateElement={handleUpdateElement}
          onAddElement={handleAddElement}
          zoom={zoom}
          onToolChange={setCurrentTool}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onZoomChange={setZoom}
          projectId={projectId}
          isPreviewMode={isPreviewMode}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          previewDevice={previewDevice}
        />

        {!isPreviewMode && (
          <div className="transition-all duration-300">
            {currentTool === "comment" ? (
              <RightSidebar comments={comments} onDeleteComment={handleDeleteComment} showComments={true} />
            ) : (
              <PropertiesPanel
                selectedElement={selectedElement}
                pages={pages}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                projectId={projectId}
                pageSlug={currentPage}
              />
            )}
          </div>
        )}
      </div>
      {/* CMS Mode Indicator */}
      {isCmsMode && currentCmsEntry && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium">CMS Mode</div>
          <div className="text-xs opacity-90">{currentCmsEntry.title}</div>
        </div>
      )}

      {/* CMS Loading Indicator */}
      {cmsLoading && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading CMS entry...</span>
          </div>
        </div>
      )}
    </div>
  )
}
