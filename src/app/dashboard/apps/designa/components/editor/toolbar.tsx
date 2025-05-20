"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Save, ArrowLeft, Undo, Redo, Share, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useCallback } from "react"

interface ToolbarSectionProps {
  title: string
  onSave: () => void
  onUndo?: () => void
  onRedo?: () => void
  onBack: () => void
  isSaving: boolean
  canUndo?: boolean
  canRedo?: boolean
}

export function ToolbarSection({
  title,
  onSave,
  onUndo,
  onRedo,
  onBack,
  isSaving,
  canUndo = false,
  canRedo = false,
}: ToolbarSectionProps) {
  // Ensure we're using the provided onSave callback correctly
  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault() // Prevent default button behavior
      e.stopPropagation() // Stop event propagation
      console.log("Save button clicked in toolbar") // Debug
      onSave() // Call the provided save function
    },
    [onSave],
  )

  return (
    <TooltipProvider>
      <div className="h-16 border-b bg-white flex items-center justify-between px-4 shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to dashboard</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-baseline">
            <h1 className="text-lg font-medium mr-2">{title}</h1>
            <span className="text-xs text-muted-foreground">Last edit: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2.5 rounded-none"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2.5 rounded-none"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share design</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export design</TooltipContent>
            </Tooltip>

            <Button size="sm" className="h-9" onClick={handleSave} disabled={isSaving} type="button">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
