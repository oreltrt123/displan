"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Square, Circle, Triangle, Minus } from "lucide-react"

interface ShapeToolsProps {
  selectedTool: string
  onToolChange: (tool: string) => void
}

export function ShapeTools({ selectedTool, onToolChange }: ShapeToolsProps) {
  const shapes = [
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "line", icon: Minus, label: "Line" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={["rectangle", "circle", "triangle", "line"].includes(selectedTool) ? "default" : "ghost"}
          size="sm"
          className="h-10 w-10 p-0"
        >
          <Square className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((shape) => (
            <Button
              key={shape.id}
              variant={selectedTool === shape.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(shape.id)}
              className="flex items-center space-x-2"
            >
              <shape.icon className="h-4 w-4" />
              <span className="text-sm">{shape.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
