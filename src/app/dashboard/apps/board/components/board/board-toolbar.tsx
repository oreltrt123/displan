"use client"

import { Button } from "@/components/ui/button"
import { MousePointer2, Square, Circle, Type, ImageIcon, Folder, Download, Upload } from "lucide-react"

interface BoardToolbarProps {
  selectedTool: string
  onToolChange: (tool: string) => void
}

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "text", icon: Type, label: "Text" },
  { id: "image", icon: ImageIcon, label: "Image" },
  { id: "folder", icon: Folder, label: "Folder" },
]

export function BoardToolbar({ selectedTool, onToolChange }: BoardToolbarProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center space-x-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex flex-col items-center p-3 h-auto"
          >
            <tool.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{tool.label}</span>
          </Button>
        ))}

        <div className="mx-4 h-8 w-px bg-gray-300" />

        <Button variant="ghost" size="sm" className="flex flex-col items-center p-3 h-auto">
          <Upload className="h-5 w-5 mb-1" />
          <span className="text-xs">Import</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col items-center p-3 h-auto">
          <Download className="h-5 w-5 mb-1" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
    </div>
  )
}
