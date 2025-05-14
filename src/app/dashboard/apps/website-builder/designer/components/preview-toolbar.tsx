"use client"
import { Monitor, Smartphone, Tablet } from "lucide-react"

interface PreviewToolbarProps {
  previewMode: "desktop" | "tablet" | "mobile"
  onChangePreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
}

export function PreviewToolbar({ previewMode, onChangePreviewMode }: PreviewToolbarProps) {
  return (
    <div className="bg-background border-b p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChangePreviewMode("desktop")}
          className={`p-1 rounded ${previewMode === "desktop" ? "bg-gray-200 text-black" : ""}`}
          title="Desktop View"
        >
          <Monitor className="h-5 w-5" />
        </button>
        <button
          onClick={() => onChangePreviewMode("tablet")}
          className={`p-1 rounded ${previewMode === "tablet" ? "bg-gray-200 text-black" : ""}`}
          title="Tablet View"
        >
          <Tablet className="h-5 w-5" />
        </button>
        <button
          onClick={() => onChangePreviewMode("mobile")}
          className={`p-1 rounded ${previewMode === "mobile" ? "bg-gray-200 text-black" : ""}`}
          title="Mobile View"
        >
          <Smartphone className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
