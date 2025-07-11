"use client"

import { useState } from "react"
import { Type, Square, List, Layers } from "lucide-react"
import { TextElementsPanel } from "./elements/text-elements-panel"
import { ButtonElementsPanel } from "./elements/button-elements-panel"
import { MenuElementsPanel } from "./elements/menu-elements-panel"
import { MenuTemplatesPanel } from "./elements/menu-templates-panel"
import "@/styles/Button_eeree24de2Eeree2.css"

interface ElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
}

export function ElementsPanel({ onAddElement }: ElementsPanelProps) {
  const [currentView, setCurrentView] = useState<"main" | "text" | "button" | "menu" | "template" >("main")

  const goBack = () => {
    setCurrentView("main")
  }

  // Main elements view
  if (currentView === "main") {
    return (
      <div className="space-y-2 h-full sfsfsfsfsfsfwerertwr2421">
        <div className="space-y">
          <button
            onClick={() => setCurrentView("text")}
            className="Button_eeree24de2Eeree2"
          >
            <img className="w-5 h-5 mr-2 dark:hidden" src="/components/editor/element/text_light.png" alt="" />
             <img className="w-5 h-5 mr-2 hidden dark:block" src="/components/editor/element/text_dark.png" alt="" />
            <span className="text-sm">Text</span>
          </button>

          <button
            onClick={() => setCurrentView("template")}
            className="Button_eeree24de2Eeree2"
          >
            <img className="w-5 h-5 mr-2 dark:hidden" src="/components/editor/element/template_light.png" alt="" />
            <img className="w-5 h-5 mr-2 hidden dark:block" src="/components/editor/element/template_dark.png" alt="" />
            <span className="text-sm">Template</span>
          </button>

          <button
            onClick={() => setCurrentView("button")}
            className="Button_eeree24de2Eeree2"
          >
            <img className="w-5 h-5 mr-2 dark:hidden" src="/components/editor/element/button_light.png" alt="" />
            <img className="w-5 h-5 mr-2 hidden dark:block" src="/components/editor/element/button_dark.png" alt="" />
            <span className="text-sm">Button</span>
          </button>

          <button
            onClick={() => setCurrentView("menu")}
            className="Button_eeree24de2Eeree2"
          >
            <img className="w-5 h-5 mr-2 dark:hidden" src="/components/editor/element/menu_light.png" alt="" />
            <img className="w-5 h-5 mr-2 hidden dark:block" src="/components/editor/element/menu_dark.png" alt="" />
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
  if (currentView === "template") {
    return <MenuTemplatesPanel onAddElement={onAddElement} onBack={goBack} />
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
