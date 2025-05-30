"use client"

import { useState } from "react"
import { Type, Square, List } from "lucide-react"
import { TextElementsPanel } from "./elements/text-elements-panel"
import { ButtonElementsPanel } from "./elements/button-elements-panel"
import { MenuElementsPanel } from "./elements/menu-elements-panel"

interface ElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
}

export function ElementsPanel({ onAddElement }: ElementsPanelProps) {
  const [currentView, setCurrentView] = useState<"main" | "text" | "button" | "menu">("main")

  const goBack = () => {
    setCurrentView("main")
  }

  // Main elements view
  if (currentView === "main") {
    return (
      <div className="space-y-2 h-full">
        <span className="text-sm font-medium text-gray-900 dark:text-white mb-4 block">Elements</span>

        <div className="space-y-2">
          <button
            onClick={() => setCurrentView("text")}
            className="w-full flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            <Type className="w-4 h-4 mr-2" />
            <span className="text-sm">Text</span>
          </button>

          <button
            onClick={() => setCurrentView("button")}
            className="w-full flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            <Square className="w-4 h-4 mr-2" />
            <span className="text-sm">Button</span>
          </button>

          <button
            onClick={() => setCurrentView("menu")}
            className="w-full flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            <List className="w-4 h-4 mr-2" />
            <span className="text-sm">Menu</span>
          </button>
        </div>
      </div>
    )
  }

  // Text elements view
  if (currentView === "text") {
    return <TextElementsPanel onAddElement={onAddElement} onBack={goBack} />
  }

  // Button elements view
  if (currentView === "button") {
    return <ButtonElementsPanel onAddElement={onAddElement} onBack={goBack} />
  }

  if (currentView === "menu") {
    return <MenuElementsPanel onAddElement={onAddElement} onBack={goBack} />
  }

  return null
}
