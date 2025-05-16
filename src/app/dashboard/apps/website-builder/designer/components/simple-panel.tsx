"use client"

import { useState } from "react"
import { Layout, Palette } from "lucide-react"

interface SimplePanelProps {
  onAddElement: (type: string) => void
  onApplyTheme?: (theme: string) => void
}

export function SimplePanel({ onAddElement, onApplyTheme }: SimplePanelProps) {
  const [activeTab, setActiveTab] = useState<"elements" | "themes">("themes")

  const colorThemes = [
    { name: "Blue Theme", value: "blue", colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"] },
    { name: "Green Theme", value: "green", colors: ["#22c55e", "#4ade80", "#86efac", "#dcfce7"] },
    { name: "Red Theme", value: "red", colors: ["#ef4444", "#f87171", "#fca5a5", "#fee2e2"] },
    { name: "Purple Theme", value: "purple", colors: ["#a855f7", "#c084fc", "#d8b4fe", "#f3e8ff"] },
    { name: "Orange Theme", value: "orange", colors: ["#f97316", "#fb923c", "#fdba74", "#ffedd5"] },
    { name: "Teal Theme", value: "teal", colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#d1faf4"] },
    { name: "Pink Theme", value: "pink", colors: ["#ec4899", "#f472b6", "#f9a8d4", "#fce7f3"] },
    { name: "Gray Theme", value: "gray", colors: ["#4b5563", "#9ca3af", "#d1d5db", "#f3f4f6"] },
  ]

  // Simple design elements organized by category
  const designElements = {
    buttons: [
      { id: "sb-1", name: "Flat Blue", type: "simple-button:sb-1" },
      { id: "sb-2", name: "Flat Green", type: "simple-button:sb-2" },
      { id: "sb-3", name: "Flat Red", type: "simple-button:sb-3" },
      { id: "sb-4", name: "Flat Purple", type: "simple-button:sb-4" },
      { id: "sb-5", name: "Outline Blue", type: "simple-button:sb-5" },
      { id: "sb-6", name: "Outline Green", type: "simple-button:sb-6" },
      { id: "sb-7", name: "Outline Red", type: "simple-button:sb-7" },
      { id: "sb-8", name: "Outline Purple", type: "simple-button:sb-8" },
      { id: "sb-9", name: "Soft Blue", type: "simple-button:sb-9" },
      { id: "sb-10", name: "Soft Green", type: "simple-button:sb-10" },
    ],
    cards: [
      { id: "sc-1", name: "White Card with Shadow", type: "simple-card:sc-1" },
      { id: "sc-2", name: "Blue Accent", type: "simple-card:sc-2" },
      { id: "sc-3", name: "Green Accent", type: "simple-card:sc-3" },
      { id: "sc-4", name: "Red Accent", type: "simple-card:sc-4" },
      { id: "sc-5", name: "Purple Accent", type: "simple-card:sc-5" },
      { id: "sc-6", name: "Soft Blue Background", type: "simple-card:sc-6" },
      { id: "sc-7", name: "Soft Green Background", type: "simple-card:sc-7" },
      { id: "sc-8", name: "Soft Red Background", type: "simple-card:sc-8" },
      { id: "sc-9", name: "Soft Purple Background", type: "simple-card:sc-9" },
      { id: "sc-10", name: "Dark Card", type: "simple-card:sc-10" },
    ],
    headers: [
      { id: "sh-1", name: "Blue Header", type: "simple-header:sh-1" },
      { id: "sh-2", name: "Green Header", type: "simple-header:sh-2" },
      { id: "sh-3", name: "Red Header", type: "simple-header:sh-3" },
      { id: "sh-4", name: "Purple Header", type: "simple-header:sh-4" },
      { id: "sh-5", name: "Gray Header", type: "simple-header:sh-5" },
      { id: "sh-6", name: "White Header with Blue Border", type: "simple-header:sh-6" },
      { id: "sh-7", name: "White Header with Green Border", type: "simple-header:sh-7" },
      { id: "sh-8", name: "White Header with Red Border", type: "simple-header:sh-8" },
      { id: "sh-9", name: "White Header with Purple Border", type: "simple-header:sh-9" },
      { id: "sh-10", name: "Gradient Header", type: "simple-header:sh-10" },
    ],
  }

  const handleApplyTheme = (theme: string) => {
    console.log("Applying theme:", theme)
    if (onApplyTheme) {
      onApplyTheme(theme)
    }
  }

  // Get the preview for an element
  const getElementPreview = (element: { id: string; name: string; type: string }) => {
    const [baseType, designId] = element.type.split(":")

    if (baseType === "simple-button") {
      switch (designId) {
        case "sb-1": // Flat Blue
          return (
            <div className="w-full h-10 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-2": // Flat Green
          return (
            <div className="w-full h-10 bg-green-500 text-white rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-3": // Flat Red
          return (
            <div className="w-full h-10 bg-red-500 text-white rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-4": // Flat Purple
          return (
            <div className="w-full h-10 bg-purple-500 text-white rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-5": // Outline Blue
          return (
            <div className="w-full h-10 border-2 border-blue-500 text-blue-500 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-6": // Outline Green
          return (
            <div className="w-full h-10 border-2 border-green-500 text-green-500 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-7": // Outline Red
          return (
            <div className="w-full h-10 border-2 border-red-500 text-red-500 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-8": // Outline Purple
          return (
            <div className="w-full h-10 border-2 border-purple-500 text-purple-500 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-9": // Soft Blue
          return (
            <div className="w-full h-10 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        case "sb-10": // Soft Green
          return (
            <div className="w-full h-10 bg-green-100 text-green-700 rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
        default:
          return (
            <div className="w-full h-10 bg-gray-800 text-white rounded-md flex items-center justify-center text-xs">
              Button
            </div>
          )
      }
    } else if (baseType === "simple-card") {
      switch (designId) {
        case "sc-1": // White Card with Shadow
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
        case "sc-2": // Blue Accent
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md border-t-4 border-blue-500 p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
        case "sc-3": // Green Accent
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md border-t-4 border-green-500 p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
        case "sc-4": // Red Accent
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md border-t-4 border-red-500 p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
        case "sc-5": // Purple Accent
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md border-t-4 border-purple-500 p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
        case "sc-6": // Soft Blue Background
          return (
            <div className="w-full h-16 bg-blue-50 rounded-lg border border-blue-100 p-2">
              <div className="w-1/2 h-2 bg-blue-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-blue-200 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-blue-200 rounded"></div>
            </div>
          )
        case "sc-7": // Soft Green Background
          return (
            <div className="w-full h-16 bg-green-50 rounded-lg border border-green-100 p-2">
              <div className="w-1/2 h-2 bg-green-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-green-200 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-green-200 rounded"></div>
            </div>
          )
        case "sc-8": // Soft Red Background
          return (
            <div className="w-full h-16 bg-red-50 rounded-lg border border-red-100 p-2">
              <div className="w-1/2 h-2 bg-red-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-red-200 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-red-200 rounded"></div>
            </div>
          )
        case "sc-9": // Soft Purple Background
          return (
            <div className="w-full h-16 bg-purple-50 rounded-lg border border-purple-100 p-2">
              <div className="w-1/2 h-2 bg-purple-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-purple-200 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-purple-200 rounded"></div>
            </div>
          )
        case "sc-10": // Dark Card
          return (
            <div className="w-full h-16 bg-gray-800 rounded-lg shadow-md p-2">
              <div className="w-1/2 h-2 bg-white rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-600 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
            </div>
          )
        default:
          return (
            <div className="w-full h-16 bg-white rounded-lg shadow-md p-2">
              <div className="w-1/2 h-2 bg-gray-800 rounded mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </div>
          )
      }
    } else if (baseType === "simple-header") {
      switch (designId) {
        case "sh-1": // Blue Header
          return <div className="w-full h-10 bg-blue-600 rounded-t-lg"></div>
        case "sh-2": // Green Header
          return <div className="w-full h-10 bg-green-600 rounded-t-lg"></div>
        case "sh-3": // Red Header
          return <div className="w-full h-10 bg-red-600 rounded-t-lg"></div>
        case "sh-4": // Purple Header
          return <div className="w-full h-10 bg-purple-600 rounded-t-lg"></div>
        case "sh-5": // Gray Header
          return <div className="w-full h-10 bg-gray-800 rounded-t-lg"></div>
        case "sh-6": // White Header with Blue Border
          return <div className="w-full h-10 bg-white border-b-2 border-blue-500 rounded-t-lg"></div>
        case "sh-7": // White Header with Green Border
          return <div className="w-full h-10 bg-white border-b-2 border-green-500 rounded-t-lg"></div>
        case "sh-8": // White Header with Red Border
          return <div className="w-full h-10 bg-white border-b-2 border-red-500 rounded-t-lg"></div>
        case "sh-9": // White Header with Purple Border
          return <div className="w-full h-10 bg-white border-b-2 border-purple-500 rounded-t-lg"></div>
        case "sh-10": // Gradient Header
          return <div className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
        default:
          return <div className="w-full h-10 bg-white border-b border-gray-200 rounded-t-lg"></div>
      }
    }

    return <div className="w-full h-10 bg-gray-200 rounded-md"></div>
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Simple Designs</h2>
        <p className="text-xs text-muted-foreground mt-1">Clean, modern design elements</p>
      </div>
{/* 
      <div className="flex border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("themes")}
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "themes"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="h-4 w-4 mr-1.5" />
          <span>Themes</span>
        </button>
        <button
          onClick={() => setActiveTab("elements")}
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "elements"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layout className="h-4 w-4 mr-1.5" />
          <span>Elements</span>
        </button>
      </div> */}

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "themes" ? (
          <div className="space-y-4">
            {/* <p className="text-sm text-muted-foreground mb-4">
              Apply a color theme to change the look of your entire website
            </p> */}
            <div className="grid grid-cols-1 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleApplyTheme(theme.value)}
                  className="p-3 bg-card hover:bg-secondary rounded-md border border-border flex flex-col items-start"
                >
                  <span className="text-sm font-medium mb-2">{theme.name}</span>
                  <div className="flex space-x-1 w-full">
                    {theme.colors.map((color, index) => (
                      <div key={index} className="h-6 rounded-sm flex-1" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {Object.entries(designElements).map(([category, elements]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium capitalize mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {elements.map((element) => (
                    <div key={element.id} onClick={() => onAddElement(element.type)} className="cursor-pointer group">
                      <div className="border border-border rounded-lg p-2 overflow-hidden transition-all duration-200 group-hover:border-primary group-hover:shadow-sm">
                        {getElementPreview(element)}
                      </div>
                      <p className="mt-1 text-xs text-center text-muted-foreground group-hover:text-foreground truncate">
                        {element.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
