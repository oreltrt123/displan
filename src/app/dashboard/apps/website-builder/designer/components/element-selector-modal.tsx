"\"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { DesignSelectorModal } from "./design-selector-modal"

interface ElementSelectorModalProps {
  category: string
  onSelectElement: (type: string, designId: string) => void
  onClose: () => void
}

export function ElementSelectorModal({ category, onSelectElement, onClose }: ElementSelectorModalProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showDesignSelector, setShowDesignSelector] = useState(false)

  // Get elements based on category
  const getElements = () => {
    if (category === "cyber") {
      return [
        { id: "cyber-button", name: "Cyber Button", icon: "CB", color: "text-purple-600" },
        { id: "cyber-card", name: "Cyber Card", icon: "CC", color: "text-cyan-600" },
        { id: "cyber-header", name: "Cyber Header", icon: "CH", color: "text-green-600" },
        { id: "cyber-grid", name: "Cyber Grid", icon: "CG", color: "text-blue-600" },
      ]
    }
    return []
  }

  const elements = getElements()

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId)
    setShowDesignSelector(true)
  }

  const handleDesignSelect = (designId: string) => {
    if (selectedElement) {
      onSelectElement(selectedElement, designId)
    }
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-[90vw]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">{category.charAt(0).toUpperCase() + category.slice(1)} Elements</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {elements.map((element) => (
                <div
                  key={element.id}
                  onClick={() => handleElementClick(element.id)}
                  className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <span className={`text-lg font-bold ${element.color}`}>{element.icon}</span>
                  </div>
                  <span className="font-medium">{element.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDesignSelector && selectedElement && (
        <DesignSelectorModal
          elementType={selectedElement}
          onSelect={handleDesignSelect}
          onClose={() => setShowDesignSelector(false)}
        />
      )}
    </>
  )
}
