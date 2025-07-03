"use client"

import "../../../../../../../styles/button_elements_panel.css"

import { ArrowLeft } from "lucide-react"
import { getButtonComponent } from "../../../shared/button-elements-panel"

interface ButtonElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function ButtonElementsPanel({ onAddElement, onBack }: ButtonElementsPanelProps) {
  const handleAdd = (styleId: string) => {
    if (onAddElement) onAddElement(`button-${styleId}`, 400, 300)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">Button Elements</span>
      </div>

      {/* Individual Buttons */}
      <div className="space-y-5 overflow-y-auto flex-1 max-h-[700px] pr-2">
        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("primary")} className="cursor-pointer">
            {getButtonComponent("primary")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Main call-to-action</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-primary</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("secondary")} className="cursor-pointer">
            {getButtonComponent("secondary")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Alternative action</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-secondary</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("outline")} className="cursor-pointer">
            {getButtonComponent("outline")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Bordered style</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-outline</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("text")} className="cursor-pointer">
            {getButtonComponent("text")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">No background</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-text</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("rounded")} className="cursor-pointer">
            {getButtonComponent("rounded")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Fully rounded corners</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-rounded</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("icon")} className="cursor-pointer">
            {getButtonComponent("icon")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">With leading icon</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-icon</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("gradient")} className="cursor-pointer">
            {getButtonComponent("gradient")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Gradient background</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-gradient</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("large")} className="cursor-pointer">
            {getButtonComponent("large")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Bigger size</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-large</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("small")} className="cursor-pointer">
            {getButtonComponent("small")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Compact size</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-small</span>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div onClick={() => handleAdd("pill")} className="cursor-pointer">
            {getButtonComponent("pill")}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Pill-shaped</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Class: displan-button-pill</span>
        </div>
      </div>
    </div>
  )
}
