"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToolSelection } from "./toolbar/tool-selection"
import { ColorPalette } from "./toolbar/color-palette"
import { ShapeTools } from "./toolbar/shape-tools"
import { TextTools } from "./toolbar/text-tools"
import { TemplatePanel } from "./toolbar/template-panel"

interface AdvancedToolbarProps {
  selectedTool: string
  onToolChange: (tool: string) => void
  onUndo: () => void
  canUndo: boolean
}

export function AdvancedToolbar({ selectedTool, onToolChange, onUndo, canUndo }: AdvancedToolbarProps) {
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Selection and Hand Tools */}
          <ToolSelection selectedTool={selectedTool} onToolChange={onToolChange} />

          <Separator orientation="vertical" className="h-8" />

          {/* Shape Tools */}
          <ShapeTools selectedTool={selectedTool} onToolChange={onToolChange} />

          <Separator orientation="vertical" className="h-8" />

          {/* Color Palette */}
          <ColorPalette />

          <Separator orientation="vertical" className="h-8" />

          {/* Text Tools */}
          <TextTools selectedTool={selectedTool} onToolChange={onToolChange} />

          <Separator orientation="vertical" className="h-8" />

          {/* Template Panel */}
          <TemplatePanel />

          <Separator orientation="vertical" className="h-8" />

          {/* Undo Button */}
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="h-10 w-10 p-0">
            <span className="text-lg">↶</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
