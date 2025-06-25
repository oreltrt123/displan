"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  FileText,
  Layout,
  Navigation,
  Square,
  Type,
  ImageIcon,
  Container,
  Layers,
  Box,
  Menu,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CanvasElement {
  id: string
  element_id: string
  element_type: string
  element_name: string
  content?: string
  parent_id?: string | null
  sort_order: number
  is_container: boolean
  is_section: boolean
  visible: boolean
  expanded: boolean
  locked?: boolean
  template_id?: string
  children?: CanvasElement[]
  x_position?: number
  y_position?: number
  width?: number
  height?: number
}

interface NavigatorPanelProps {
  elements: CanvasElement[]
  currentPage: string
  projectId?: string
  onElementVisibilityToggle?: (elementId: string, visible: boolean) => void
  onElementSelect?: (elementId: string) => void
}

export function NavigatorPanelHierarchical({
  elements = [],
  currentPage,
  projectId,
  onElementVisibilityToggle,
  onElementSelect,
}: NavigatorPanelProps) {
  const [hierarchicalElements, setHierarchicalElements] = useState<CanvasElement[]>([])
  const [expandedElements, setExpandedElements] = useState<{ [key: string]: boolean }>({})
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load hierarchical canvas elements from server
  const loadHierarchicalElements = useCallback(async () => {
    if (!currentPage) return

    setIsLoading(true)
    try {
      // First, ensure page structure exists
      await fetch("/api/canvas/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId || "default",
          pageId: currentPage,
          pageName: currentPage,
        }),
      })

      // Then load the hierarchical structure
      const response = await fetch(`/api/canvas/hierarchy?projectId=${projectId || "default"}&pageId=${currentPage}`)

      if (response.ok) {
        const data = await response.json()
        const hierarchical = buildHierarchy(data.elements || [])
        setHierarchicalElements(hierarchical)

        // Initialize expanded state
        const initialExpanded: { [key: string]: boolean } = {}
        data.elements?.forEach((element: CanvasElement) => {
          initialExpanded[element.element_id] = element.expanded
        })
        setExpandedElements(initialExpanded)
      }
    } catch (error) {
      console.error("Error loading hierarchical elements:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, projectId])

  // Build hierarchy from flat array
  const buildHierarchy = (flatElements: CanvasElement[]): CanvasElement[] => {
    const elementMap = new Map<string, CanvasElement>()
    const rootElements: CanvasElement[] = []

    // First pass: create map
    flatElements.forEach((element) => {
      elementMap.set(element.element_id, { ...element, children: [] })
    })

    // Second pass: build hierarchy
    flatElements.forEach((element) => {
      const elementWithChildren = elementMap.get(element.element_id)!
      if (element.parent_id && elementMap.has(element.parent_id)) {
        const parent = elementMap.get(element.parent_id)!
        parent.children = parent.children || []
        parent.children.push(elementWithChildren)
      } else {
        rootElements.push(elementWithChildren)
      }
    })

    // Sort by sort_order
    const sortElements = (elements: CanvasElement[]) => {
      elements.sort((a, b) => a.sort_order - b.sort_order)
      elements.forEach((element) => {
        if (element.children && element.children.length > 0) {
          sortElements(element.children)
        }
      })
    }

    sortElements(rootElements)
    return rootElements
  }

  // Load elements when component mounts or page changes
  useEffect(() => {
    loadHierarchicalElements()
  }, [loadHierarchicalElements])

  // Get appropriate icon for element type
  const getElementIcon = (element: CanvasElement) => {
    const iconClass = "w-4 h-4"

    if (element.element_type === "container-root") return <Globe className={`${iconClass} text-blue-500`} />
    if (element.element_type === "container-body") return <Box className={`${iconClass} text-gray-600`} />
    if (element.element_type === "container-wrapper") return <Container className={`${iconClass} text-gray-500`} />
    if (element.element_type === "section-nav") return <Navigation className={`${iconClass} text-purple-500`} />
    if (element.element_type === "section-main") return <Layout className={`${iconClass} text-green-500`} />
    if (element.element_type === "section-footer") return <Menu className={`${iconClass} text-orange-500`} />
    if (element.element_type.startsWith("section-")) return <Layers className={`${iconClass} text-indigo-500`} />
    if (element.element_type.startsWith("text-")) return <Type className={`${iconClass} text-blue-400`} />
    if (element.element_type.startsWith("button-")) return <Square className={`${iconClass} text-green-400`} />
    if (element.element_type.startsWith("image-")) return <ImageIcon className={`${iconClass} text-purple-400`} />

    return <FileText className={`${iconClass} text-gray-400`} />
  }

  // Handle expand/collapse
  const handleExpandToggle = async (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const newExpanded = !expandedElements[elementId]

    setExpandedElements((prev) => ({
      ...prev,
      [elementId]: newExpanded,
    }))

    // Update server
    try {
      await fetch("/api/canvas/hierarchy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elementId,
          expanded: newExpanded,
        }),
      })
    } catch (error) {
      console.error("Error updating expand state:", error)
    }
  }

  // Handle visibility toggle
  const handleVisibilityToggle = async (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const element = findElementById(hierarchicalElements, elementId)
    if (!element) return

    const newVisible = !element.visible

    // Update local state
    setHierarchicalElements((prev) => updateElementInHierarchy(prev, elementId, { visible: newVisible }))

    // Update server
    try {
      await fetch("/api/canvas/hierarchy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elementId,
          visible: newVisible,
        }),
      })
    } catch (error) {
      console.error("Error updating visibility:", error)
    }

    onElementVisibilityToggle?.(elementId, newVisible)
  }

  // Handle element selection
  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId)
    onElementSelect?.(elementId)
  }

  // Helper functions
  const findElementById = (elements: CanvasElement[], id: string): CanvasElement | null => {
    for (const element of elements) {
      if (element.element_id === id) return element
      if (element.children) {
        const found = findElementById(element.children, id)
        if (found) return found
      }
    }
    return null
  }

  const updateElementInHierarchy = (
    elements: CanvasElement[],
    id: string,
    updates: Partial<CanvasElement>,
  ): CanvasElement[] => {
    return elements.map((element) => {
      if (element.element_id === id) {
        return { ...element, ...updates }
      }
      if (element.children) {
        return {
          ...element,
          children: updateElementInHierarchy(element.children, id, updates),
        }
      }
      return element
    })
  }

  // Render element tree
  const renderElement = (element: CanvasElement, level = 0) => {
    const hasChildren = element.children && element.children.length > 0
    const isExpanded = expandedElements[element.element_id]
    const isSelected = selectedElement === element.element_id
    const isVisible = element.visible

    return (
      <div key={element.element_id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 rounded cursor-pointer transition-all group ${
            isSelected
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
          } ${!isVisible ? "opacity-50" : ""}`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => handleElementClick(element.element_id)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => handleExpandToggle(element.element_id, e)}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mr-1"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}

          {/* Element Icon */}
          {getElementIcon(element)}

          {/* Element Name */}
          <span className="ml-2 text-sm flex-1 truncate font-medium">{element.element_name}</span>

          {/* Visibility Toggle */}
          <button
            onClick={(e) => handleVisibilityToggle(element.element_id, e)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title={isVisible ? "Hide element" : "Show element"}
          >
            {isVisible ? (
              <Eye className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            ) : (
              <EyeOff className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && <div>{element.children!.map((child) => renderElement(child, level + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center">
          <Layers className="w-4 h-4 mr-2 text-blue-500" />
          Navigator
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {hierarchicalElements.length > 0 ? `Page: ${currentPage}` : "No elements"}
        </p>
      </div>

      {/* Elements Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading structure...</span>
            </div>
          ) : hierarchicalElements.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No page structure found</p>
              <p className="text-xs text-muted-foreground mt-1">Structure will be created automatically</p>
            </div>
          ) : (
            <div className="space-y-0.5">{hierarchicalElements.map((element) => renderElement(element))}</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
