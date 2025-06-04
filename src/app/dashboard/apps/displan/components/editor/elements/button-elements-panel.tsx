"use client"

import "../../../../../../../styles/button_elements_panel.css"
import { ArrowLeft } from "lucide-react"

interface ButtonElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function ButtonElementsPanel({ onAddElement, onBack }: ButtonElementsPanelProps) {
  const buttonStyles = [
    { id: "primary", name: "Primary Button", className: "displan-button-primary", description: "Main call-to-action" },
    {
      id: "secondary",
      name: "Secondary Button",
      className: "displan-button-secondary",
      description: "Alternative action",
    },
    { id: "outline", name: "Outline Button", className: "displan-button-outline", description: "Bordered style" },
    { id: "text", name: "Text Button", className: "displan-button-text", description: "No background" },
    {
      id: "rounded",
      name: "Glitch",
      className: "displan-button-rounded",
      description: "Fully rounded corners",
    },
    { id: "icon", name: "Icon Button", className: "displan-button-icon", description: "With leading icon" },
    {
      id: "gradient",
      name: "Gradient Button",
      className: "displan-button-gradient",
      description: "Gradient background",
    },
    { id: "large", name: "Large Button", className: "displan-button-large", description: "Bigger size" },
    { id: "small", name: "Small Button", className: "displan-button-small", description: "Compact size" },
    { id: "pill", name: "Pill Button", className: "displan-button-pill", description: "Pill-shaped" },
  ]

  const handleAddButton = (styleId: string, className: string) => {
    if (onAddElement) {
      onAddElement(`button-${styleId}`, 400, 300)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">Button Elements</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[700px] pr-2">
        {buttonStyles.map((style) => (
          <div
            key={style.id}
            onClick={() => handleAddButton(style.id, style.className)}
            className="p-3 hover:bg-[#8888881A] cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="mb-2">
                <button className={`px-4 py-2 rounded ${style.className}`}>{style.name}</button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{style.description}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Class: {style.className}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
