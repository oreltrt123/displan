"use client"

import { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { useToast } from "../ui/use-toast"
import type {
  CanvasData,
  CanvasElement,
  ElementTemplate,
  TextElement,
  ImageElement,
  ShapeElement,
} from "../../types/canvas"
import { ToolbarSection } from "../editor/toolbar"
import { ElementsSidebar } from "../editor/sidebar"
import { CanvasComponent } from "../editor/canvas"
import { PropertiesPanel } from "../editor/PropertiesPanel"
import { TooltipProvider } from "@/components/ui/tooltip"

const CanvasEditor = ({ design }: { design: any }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  // Initialize with design data from props
  const [canvasData, setCanvasData] = useState<CanvasData>(() => {
    if (design) {
      return {
        id: design.id || uuidv4(),
        name: design.name || "Untitled Canvas",
        elements: design.elements || [],
        width: design.width || 800,
        height: design.height || 600,
        background: design.background || "#ffffff",
      }
    }

    return {
      id: uuidv4(),
      name: "Untitled Canvas",
      elements: [],
      width: 800,
      height: 600,
      background: "#ffffff",
    }
  })

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [zoom, setZoom] = useState(1)

  // History for undo/redo
  const [history, setHistory] = useState<CanvasData[]>([canvasData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [shouldRecord, setShouldRecord] = useState(true)

  // Get the currently selected element
  const selectedElement = canvasData.elements.find((el) => el.id === selectedElementId) || null

  // Function to add a new history state
  const addToHistory = useCallback(
    (newState: CanvasData) => {
      if (!shouldRecord) return

      setHistory((prev) => {
        // Remove any future history states if we're not at the latest point
        const newHistory = prev.slice(0, historyIndex + 1)
        return [...newHistory, newState]
      })

      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex, shouldRecord],
  )

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setShouldRecord(false)
      setHistoryIndex((prev) => prev - 1)
      setCanvasData(history[historyIndex - 1])
      // Clear selection when undoing
      setSelectedElementId(null)

      setTimeout(() => {
        setShouldRecord(true)
      }, 100)
    }
  }, [history, historyIndex])

  // Handle redo action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setShouldRecord(false)
      setHistoryIndex((prev) => prev + 1)
      setCanvasData(history[historyIndex + 1])
      // Clear selection when redoing
      setSelectedElementId(null)

      setTimeout(() => {
        setShouldRecord(true)
      }, 100)
    }
  }, [history, historyIndex])

  // Function to add a new element to the canvas
  const handleAddElement = (template: ElementTemplate) => {
    let newElement: CanvasElement
    const baseElement = {
      id: uuidv4(),
      x: canvasData.width / 2 - 100,
      y: canvasData.height / 2 - 50,
      width: 200,
      height: 100,
      rotation: 0,
      opacity: 1,
      zIndex: canvasData.elements.length + 1,
      comments: [],
    }

    switch (template.type) {
      case "text": {
        const textElement: TextElement = {
          ...baseElement,
          type: "text",
          content: template.content || "Text",
          fontSize: template.name === "Heading" ? 32 : template.name === "Subheading" ? 24 : 16,
          fontFamily: "Arial",
          fontColor: "#000000",
          fontWeight: template.name === "Heading" || template.name === "Subheading" ? "bold" : "normal",
          textAlign: "left",
        }
        newElement = textElement
        break
      }

      case "image": {
        const imageElement: ImageElement = {
          ...baseElement,
          type: "image",
          src: template.src || "",
          alt: template.name || "Image",
          width: 300,
          height: 200,
        }
        newElement = imageElement
        break
      }

      case "shape": {
        const shapeElement: ShapeElement = {
          ...baseElement,
          type: "shape",
          shapeType: template.shapeType || "rectangle",
          backgroundColor:
            template.shapeType === "rectangle" ? "#3b82f6" : template.shapeType === "circle" ? "#22c55e" : "#8b5cf6",
          borderColor: "transparent",
          borderWidth: 0,
        }
        newElement = shapeElement
        break
      }

      default:
        return // Invalid element type
    }

    const updatedCanvasData: CanvasData = {
      ...canvasData,
      elements: [...canvasData.elements, newElement],
    }

    setCanvasData(updatedCanvasData)
    setSelectedElementId(newElement.id)
    addToHistory(updatedCanvasData)
  }

  // Function to update an element
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    const updatedElements = canvasData.elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el,
    ) as CanvasElement[]

    const updatedCanvasData = {
      ...canvasData,
      elements: updatedElements,
    }

    setCanvasData(updatedCanvasData)

    // Only add to history on mouse up or major changes to avoid filling history with small movements
    if (!updates.x && !updates.y) {
      addToHistory(updatedCanvasData)
    }
  }

  // Final position update - add to history after dragging stops
  const handleFinalPositionUpdate = () => {
    addToHistory(canvasData)
  }

  // Function to delete an element
  const handleDeleteElement = (id: string) => {
    const updatedElements = canvasData.elements.filter((el) => el.id !== id)

    const updatedCanvasData = {
      ...canvasData,
      elements: updatedElements,
    }

    setCanvasData(updatedCanvasData)
    setSelectedElementId(null)
    addToHistory(updatedCanvasData)
  }

  // Function to update canvas properties
  const handleUpdateCanvasData = (updates: Partial<CanvasData>) => {
    const updatedCanvasData = {
      ...canvasData,
      ...updates,
    }

    setCanvasData(updatedCanvasData)
    addToHistory(updatedCanvasData)
  }

  // Function to save the canvas data using the API route
  const handleSave = async () => {
    console.log("Save button clicked")
    setIsSaving(true)

    try {
      // Prepare the data to save
      const designData = {
        id: canvasData.id,
        name: canvasData.name,
        elements: canvasData.elements,
        width: canvasData.width,
        height: canvasData.height,
        background: canvasData.background,
      }

      console.log("Saving design data:", designData.id)

      // Use the API route to save the design
      const response = await fetch("/api/designs/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
        credentials: "include", // Important: include cookies with the request
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save design")
      }

      toast({
        title: "Design saved",
        description: "Your design has been saved successfully.",
      })

      console.log("Save successful:", result)
    } catch (error) {
      console.error("Error saving design:", error)

      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "There was an error saving your design.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (["input", "textarea"].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }

      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }

      // Zoom in: Ctrl++ or Cmd++
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault()
        setZoom((prev) => Math.min(prev + 0.1, 2))
      }

      // Zoom out: Ctrl+- or Cmd+-
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault()
        setZoom((prev) => Math.max(prev - 0.1, 0.5))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleUndo, handleRedo])

  // Use useEffect to handle client-side only rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return null on first render to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen">
        <ToolbarSection
          title={canvasData.name}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onBack={() => router.push("/dashboard/apps")}
          isSaving={isSaving}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        <div className="flex flex-1 overflow-hidden">
          <ElementsSidebar onAddElement={handleAddElement} />
          <CanvasComponent
            canvasData={canvasData}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onUpdateCanvasData={handleUpdateCanvasData}
            onFinalPositionUpdate={handleFinalPositionUpdate}
            zoom={zoom}
          />
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={(updates) => {
              if (selectedElementId) {
                handleUpdateElement(selectedElementId, updates)
              }
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

export default CanvasEditor
