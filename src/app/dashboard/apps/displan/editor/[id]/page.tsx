"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { LeftSidebar } from "../../components/editor/left-sidebar"
import { RightSidebar } from "../../components/editor/right-sidebar"
import  Canvas  from "../../components/editor/canvas"
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
    </div>
  )
}
        

















// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useSearchParams } from "next/navigation"
// import { LeftSidebar } from "../../components/editor/left-sidebar"
// import { RightSidebar } from "../../components/editor/right-sidebar"
// import Canvas from "../../components/editor/canvas"
// import { TopBar } from "../../components/editor/top-bar"
// import { PropertiesPanel } from "../../components/editor/properties-panel"
// import {
//   displan_project_designer_css_fetch_comments,
//   displan_project_designer_css_create_comment,
//   displan_project_designer_css_delete_comment,
//   displan_project_designer_css_fetch_pages,
//   displan_project_designer_css_create_page,
// } from "../../lib/actions/displan-editor-actions"
// import {
//   displan_project_designer_css_fetch_elements_new,
//   displan_project_designer_css_add_element_new,
//   displan_project_designer_css_update_element_new,
//   displan_project_designer_css_save_canvas_new,
// } from "../../lib/actions/displan-canvas-actions-new"
// import type {
//   DisplanProjectDesignerCssComment,
//   DisplanProjectDesignerCssPage,
//   EditorTool,
// } from "../../lib/types/displan-editor-types"
// import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"

// export default function EditorPage() {
//   const params = useParams()
//   const searchParams = useSearchParams()
//   const projectId = params.id as string

//   const [currentTool, setCurrentTool] = useState<EditorTool>("cursor")
//   const [currentPage, setCurrentPage] = useState("home")
//   const [comments, setComments] = useState<DisplanProjectDesignerCssComment[]>([])
//   const [pages, setPages] = useState<DisplanProjectDesignerCssPage[]>([])
//   const [elements, setElements] = useState<DisplanCanvasElement[]>([])
//   const [selectedElement, setSelectedElement] = useState<DisplanCanvasElement | null>(null)
//   const [isDarkMode, setIsDarkMode] = useState(false)
//   const [zoom, setZoom] = useState(100)
//   const [isPreviewMode, setIsPreviewMode] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)
//   const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

//   // Responsive controls state
//   const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
//   const [canvasWidth, setCanvasWidth] = useState(1200)
//   const [canvasHeight, setCanvasHeight] = useState(800)

//   useEffect(() => {
//     // Reset any global zoom or scaling that might be applied
//     document.documentElement.style.zoom = "1"
//     document.documentElement.style.transform = "none"
//     document.body.style.zoom = "1"
//     document.body.style.transform = "none"

//     // Try to get user email from localStorage or session
//     const email = localStorage.getItem("user_email") || sessionStorage.getItem("user_email")
//     if (email) {
//       setUserEmail(email)
//     }

//     // Load saved responsive settings from localStorage
//     const savedSettings = localStorage.getItem("canvas-settings")
//     if (savedSettings) {
//       try {
//         const settings = JSON.parse(savedSettings)
//         setPreviewDevice(settings.previewDevice || "desktop")
//         setCanvasWidth(settings.canvasWidth || 1200)
//         setCanvasHeight(settings.canvasHeight || 800)
//         // Ensure zoom is within reasonable bounds
//         const savedZoom = settings.zoom || 100
//         setZoom(Math.min(Math.max(savedZoom, 25), 200))
//         setIsDarkMode(settings.isDarkMode || false)
//       } catch (error) {
//         console.error("Error loading saved settings:", error)
//       }
//     }

//     // Check if there's a page parameter in the URL
//     const pageParam = searchParams.get("page")
//     if (pageParam) {
//       setCurrentPage(pageParam)
//     }

//     loadComments()
//     loadPages()
//     loadElements()
//   }, [projectId, currentPage, searchParams])

//   // Save responsive settings to localStorage whenever they change
//   useEffect(() => {
//     const settings = {
//       previewDevice,
//       canvasWidth,
//       canvasHeight,
//       zoom: Math.min(Math.max(zoom, 25), 200), // Clamp zoom between 25% and 200%
//       isDarkMode,
//     }
//     localStorage.setItem("canvas-settings", JSON.stringify(settings))
//   }, [previewDevice, canvasWidth, canvasHeight, zoom, isDarkMode])

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDarkMode])

//   const loadComments = async () => {
//     const result = await displan_project_designer_css_fetch_comments(projectId, currentPage)
//     if (result.success) {
//       setComments(result.data)
//     }
//   }

//   const loadPages = async () => {
//     const result = await displan_project_designer_css_fetch_pages(projectId)
//     if (result.success) {
//       setPages(result.data)
//     }
//   }

//   const loadElements = async () => {
//     const result = await displan_project_designer_css_fetch_elements_new(projectId, currentPage)
//     if (result.success) {
//       setElements(result.data)
//     }
//   }

//   const handleCreateComment = async (x: number, y: number, message: string) => {
//     const result = await displan_project_designer_css_create_comment(projectId, currentPage, x, y, message)
//     if (result.success) {
//       await loadComments()
//     }
//   }

//   const handleCreatePage = async (name: string, isFolder: boolean) => {
//     const result = await displan_project_designer_css_create_page(projectId, name, isFolder)
//     if (result.success) {
//       loadPages()
//     }
//   }

//   const handleDeleteComment = async (commentId: string) => {
//     const result = await displan_project_designer_css_delete_comment(commentId)
//     if (result.success) {
//       loadComments()
//     }
//   }

//   const handleAddElement = async (elementType: string, x: number, y: number, properties?: any) => {
//     console.log("Adding element to canvas:", elementType, x, y, properties)
//     try {
//       const result = await displan_project_designer_css_add_element_new(
//         projectId,
//         currentPage,
//         elementType,
//         x,
//         y,
//         properties,
//       )
//       console.log("Add element result:", result)

//       if (result.success && result.data) {
//         console.log("Element added successfully, updating local state")

//         // Add to local state immediately for better UX
//         setElements((prevElements) => [...prevElements, result.data])
//         setSelectedElement(result.data)

//         // Also reload elements to ensure sync with server
//         setTimeout(() => {
//           loadElements()
//         }, 100)
//       } else {
//         console.error("Failed to add element:", result.error)
//         alert("Failed to add element: " + (result.error || "Unknown error"))
//       }
//     } catch (error) {
//       console.error("Error adding element:", error)
//       alert("Error adding element: " + error)
//     }
//   }

//   const handleUpdateElement = async (elementId: string, properties: any) => {
//     console.log("Updating element:", elementId, properties)
//     const result = await displan_project_designer_css_update_element_new(elementId, properties)
//     if (result.success) {
//       // Update local state immediately for better UX
//       setElements((prevElements) => prevElements.map((el) => (el.id === elementId ? { ...el, ...properties } : el)))

//       // Update selected element if it's the one being updated
//       if (selectedElement && selectedElement.id === elementId) {
//         setSelectedElement({ ...selectedElement, ...properties })
//       }

//       // Reload elements to get the latest data from server
//       setTimeout(() => {
//         loadElements()
//       }, 100)
//     } else {
//       console.error("Failed to update element:", result.error)
//     }
//   }

//   const handleSelectElement = (element: DisplanCanvasElement | null) => {
//     console.log("Selecting element:", element?.id)
//     setSelectedElement(element)
//   }

//   const handleMoveElement = async (elementId: string, x: number, y: number) => {
//     await handleUpdateElement(elementId, { x_position: x, y_position: y })
//   }

//   const handleSaveCanvas = async () => {
//     console.log("Saving canvas...")
//     setIsSaving(true)
//     try {
//       const result = await displan_project_designer_css_save_canvas_new(projectId, currentPage)
//       if (result.success) {
//         console.log("Canvas saved successfully")
//       } else {
//         console.error("Failed to save canvas:", result.error)
//       }
//     } catch (error) {
//       console.error("Save error:", error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleTogglePreviewMode = () => {
//     console.log("Toggling preview mode from", isPreviewMode, "to", !isPreviewMode)
//     setIsPreviewMode(!isPreviewMode)
//     if (!isPreviewMode) {
//       setSelectedElement(null)
//     }
//   }

//   // Handle responsive controls
//   const handleChangePreviewMode = (mode: "desktop" | "tablet" | "mobile") => {
//     console.log("Changing preview mode to:", mode)
//     setPreviewDevice(mode)

//     // Set default dimensions based on device
//     if (mode === "desktop") {
//       setCanvasWidth(1200)
//       setCanvasHeight(800)
//     } else if (mode === "tablet") {
//       setCanvasWidth(768)
//       setCanvasHeight(1024)
//     } else {
//       setCanvasWidth(375)
//       setCanvasHeight(667)
//     }
//   }

//   const handleCanvasWidthChange = (width: number) => {
//     console.log("Changing canvas width to:", width)
//     setCanvasWidth(Math.max(320, Math.min(width, 2560))) // Clamp between 320px and 2560px
//   }

//   const handleCanvasHeightChange = (height: number) => {
//     console.log("Changing canvas height to:", height)
//     setCanvasHeight(Math.max(240, Math.min(height, 1440))) // Clamp between 240px and 1440px
//   }

//   // Handle AI-generated element requests
//   const handleAIAddElement = (elementType: string, x?: number, y?: number, properties?: any) => {
//     // If no coordinates provided, place in center of canvas
//     const finalX = x !== undefined ? x : canvasWidth / 2
//     const finalY = y !== undefined ? y : canvasHeight / 2

//     console.log("AI adding element:", elementType, "at", finalX, finalY, properties)
//     handleAddElement(elementType, finalX, finalY, properties)
//   }

//   const handleDeleteElement = async (elementId: string) => {
//     console.log("Deleting element:", elementId)
//     try {
//       // Remove from local state immediately for better UX
//       setElements((prevElements) => prevElements.filter((el) => el.id !== elementId))

//       // Clear selection if the deleted element was selected
//       if (selectedElement && selectedElement.id === elementId) {
//         setSelectedElement(null)
//       }

//       // Reload elements to sync with server
//       setTimeout(() => {
//         loadElements()
//       }, 100)
//     } catch (error) {
//       console.error("Error deleting element:", error)
//       // Reload elements to restore state if deletion failed
//       loadElements()
//     }
//   }

//   // Handle zoom changes with proper bounds
//   const handleZoomChange = (newZoom: number) => {
//     const clampedZoom = Math.min(Math.max(newZoom, 25), 200)
//     setZoom(clampedZoom)
//   }

//   // Handle element visibility toggle for Navigator
//   const handleElementVisibilityToggle = (elementId: string, visible: boolean) => {
//     handleUpdateElement(elementId, { visible })
//   }

//   // Handle element selection from Navigator
//   const handleNavigatorElementSelect = (elementId: string) => {
//     const element = elements.find((el) => el.id === elementId)
//     if (element) {
//       setSelectedElement(element)
//     }
//   }

//   return (
//     <div
//       className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col overflow-hidden"
//       style={{
//         fontSize: "14px", // Reset base font size
//         zoom: 1, // Ensure no zoom is applied
//         transform: "none", // Ensure no transform is applied
//       }}
//     >
//       <TopBar
//         isPreviewMode={isPreviewMode}
//         onTogglePreview={handleTogglePreviewMode}
//         onSave={handleSaveCanvas}
//         isSaving={isSaving}
//         previewMode={previewDevice}
//         onChangePreviewMode={handleChangePreviewMode}
//         canvasWidth={canvasWidth}
//         canvasHeight={canvasHeight}
//         onCanvasWidthChange={handleCanvasWidthChange}
//         onCanvasHeightChange={handleCanvasHeightChange}
//       />

//       <div className="flex-1 flex overflow-hidden transition-all duration-300">
//         {!isPreviewMode && (
//           <div
//             className="transition-all duration-300"
//             style={{
//               minWidth: "280px",
//               maxWidth: "320px",
//               width: "300px",
//               fontSize: "14px",
//             }}
//           >
//             <LeftSidebar
//               pages={pages}
//               currentPage={currentPage}
//               onPageChange={setCurrentPage}
//               onCreatePage={handleCreatePage}
//               onAddElement={handleAIAddElement}
//               projectId={projectId}
//               userEmail={userEmail}
//               canvasElements={elements}
//               onElementVisibilityToggle={handleElementVisibilityToggle}
//               onElementSelect={handleNavigatorElementSelect}
//             />
//           </div>
//         )}

//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Canvas
//             currentTool={currentTool}
//             comments={comments}
//             elements={elements}
//             selectedElement={selectedElement}
//             onCreateComment={handleCreateComment}
//             onSelectElement={handleSelectElement}
//             onMoveElement={handleMoveElement}
//             onUpdateElement={handleUpdateElement}
//             onAddElement={handleAddElement}
//             zoom={zoom}
//             onToolChange={setCurrentTool}
//             isDarkMode={isDarkMode}
//             onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//             onZoomChange={handleZoomChange}
//             projectId={projectId}
//             isPreviewMode={isPreviewMode}
//             canvasWidth={canvasWidth}
//             canvasHeight={canvasHeight}
//             previewDevice={previewDevice}
//           />
//         </div>

//         {!isPreviewMode && (
//           <div
//             className="transition-all duration-300"
//             style={{
//               minWidth: "280px",
//               maxWidth: "320px",
//               width: "300px",
//               fontSize: "14px",
//             }}
//           >
//             {currentTool === "comment" ? (
//               <RightSidebar comments={comments} onDeleteComment={handleDeleteComment} showComments={true} />
//             ) : (
//               <PropertiesPanel
//                 selectedElement={selectedElement}
//                 pages={pages}
//                 onUpdateElement={handleUpdateElement}
//                 onDeleteElement={handleDeleteElement}
//                 projectId={projectId}
//                 pageSlug={currentPage}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
