"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface TextToolsProps {
  selectedTool: string
  onToolChange: (tool: string) => void
}

export function TextTools({ selectedTool, onToolChange }: TextToolsProps) {
  const textTools = [
    { id: "text", icon: Type, label: "Text" },
    { id: "align-left", icon: AlignLeft, label: "Align Left" },
    { id: "align-center", icon: AlignCenter, label: "Align Center" },
    { id: "align-right", icon: AlignRight, label: "Align Right" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={selectedTool === "text" ? "default" : "ghost"} size="sm" className="h-10 w-10 p-0">
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          {textTools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className="w-full flex items-center space-x-2 justify-start"
            >
              <tool.icon className="h-4 w-4" />
              <span className="text-sm">{tool.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
