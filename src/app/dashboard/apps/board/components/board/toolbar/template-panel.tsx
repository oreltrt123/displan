"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus } from "lucide-react"

export function TemplatePanel() {
  const templates = [
    { id: "wireframe", name: "Wireframe", preview: "/placeholder.svg?height=60&width=80&query=wireframe" },
    { id: "mockup", name: "Mockup", preview: "/placeholder.svg?height=60&width=80&query=app mockup" },
    { id: "flowchart", name: "Flowchart", preview: "/placeholder.svg?height=60&width=80&query=flowchart" },
    { id: "diagram", name: "Diagram", preview: "/placeholder.svg?height=60&width=80&query=diagram" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Templates</h4>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <Button key={template.id} variant="ghost" className="h-auto p-2 flex flex-col space-y-2">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-12 object-cover rounded border"
                />
                <span className="text-xs">{template.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
