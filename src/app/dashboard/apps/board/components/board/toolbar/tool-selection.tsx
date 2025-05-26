"use client"

import { Button } from "@/components/ui/button"
import { MousePointer2, Hand } from "lucide-react"

interface ToolSelectionProps {
  selectedTool: string
  onToolChange: (tool: string) => void
}

export function ToolSelection({ selectedTool, onToolChange }: ToolSelectionProps) {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "hand", icon: Hand, label: "Hand" },
  ]

  return (
    <div className="flex items-center space-x-1">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onToolChange(tool.id)}
          className="h-10 w-10 p-0"
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}
