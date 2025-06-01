"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { LeftSidebar } from "../../components/editor/left-sidebar"
import { RightSidebar } from "../../components/editor/right-sidebar"
import { Canvas } from "../../components/editor/canvas"
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

  useEffect(() => {
    // Try to get user email from localStorage or session
    const email = localStorage.getItem("user_email") || sessionStorage.getItem("user_email")
    if (email) {
      setUserEmail(email)
    }

    loadComments()
    loadPages()
    loadElements()
  }, [projectId, currentPage])

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

  // Handle AI-generated element requests
  const handleAIAddElement = (elementType: string, x: number, y: number, properties: any) => {
    handleAddElement(elementType, x, y, properties)
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col overflow-hidden">
      <TopBar
        isPreviewMode={isPreviewMode}
        onTogglePreview={handleTogglePreviewMode}
        onSave={handleSaveCanvas}
        isSaving={isSaving}
      />

      <div className={`flex-1 flex overflow-hidden transition-all duration-300`}>
        {!isPreviewMode && (
          <div className="transition-all duration-300">
            <LeftSidebar
              pages={pages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onCreatePage={handleCreatePage}
              onAddElement={handleAIAddElement}
              projectId={projectId}
              userEmail={userEmail}
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
          zoom={zoom}
          onToolChange={setCurrentTool}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onZoomChange={setZoom}
          projectId={projectId}
          isPreviewMode={isPreviewMode}
        />

        {!isPreviewMode && (
          <div className="transition-all duration-300">
            {currentTool === "comment" ? (
              <RightSidebar comments={comments} onDeleteComment={handleDeleteComment} showComments={true} />
            ) : (
              <PropertiesPanel selectedElement={selectedElement} pages={pages} onUpdateElement={handleUpdateElement} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
