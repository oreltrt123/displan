"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Folder } from "lucide-react"
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"

interface PropertiesPanelProps {
  selectedElement: DisplanCanvasElement | null
  pages: any[]
  onUpdateElement: (elementId: string, properties: any) => void
}

export function PropertiesPanel({ selectedElement, pages, onUpdateElement }: PropertiesPanelProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when the panel opens
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedElement])

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white dark:bg-black dark:border-gray-900 h-full overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Select an element to edit properties</p>
          </div>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateElement(selectedElement.id, { [property]: value })
  }

  const handlePageSelect = (page: any) => {
    handlePropertyChange("link_page", page.slug)
    handlePropertyChange("link_url", `/dashboard/apps/displan/editor/${selectedElement.project_id}?page=${page.slug}`)
    setShowLinkMenu(false)
  }

  return (
    <div className="w-80 bg-white dark:bg-black dark:border-gray-900 h-full overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {selectedElement.element_type.includes("text") ? "Text Properties" : "Button Properties"}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <input
              ref={inputRef}
              type="text"
              value={selectedElement.content}
              onChange={(e) => handlePropertyChange("content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter content..."
            />
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Width</label>
            <input
              type="number"
              value={selectedElement.width}
              onChange={(e) => handlePropertyChange("width", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Width in pixels"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Height</label>
            <input
              type="number"
              value={selectedElement.height}
              onChange={(e) => handlePropertyChange("height", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Height in pixels"
            />
          </div>

          {/* Link (for buttons and text) */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Link</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter URL or select page"
                value={selectedElement.link_url || ""}
                onChange={(e) => handlePropertyChange("link_url", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setShowLinkMenu(!showLinkMenu)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Pages
              </button>
            </div>

            {showLinkMenu && (
              <div className="menu_container12123_d mt-1">
                {pages.map((page) => (
                  <button key={page.id} onClick={() => handlePageSelect(page)} className="menu_item">
                    {page.is_folder ? <Folder className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                    {page.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
