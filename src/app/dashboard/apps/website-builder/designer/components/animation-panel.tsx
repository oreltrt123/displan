"use client"
import { useState } from "react"
import { X, Play } from 'lucide-react'

interface AnimationPanelProps {
  onClose: () => void
  onApply: (animationType: string) => void
  position?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}

export function AnimationPanel({ onClose, onApply, position = { top: "0", right: "0" } }: AnimationPanelProps) {
  const [previewAnimation, setPreviewAnimation] = useState<string | null>(null)

  const animations = [
    { name: "Fade In", value: "fade-in" },
    { name: "Slide Up", value: "slide-up" },
    { name: "Slide Down", value: "slide-down" },
    { name: "Slide Left", value: "slide-left" },
    { name: "Slide Right", value: "slide-right" },
    { name: "Zoom In", value: "zoom-in" },
    { name: "Zoom Out", value: "zoom-out" },
    { name: "Bounce", value: "bounce" },
    { name: "Pulse", value: "pulse" },
    { name: "Flip", value: "flip" },
    { name: "Shake", value: "shake" },
    { name: "Rotate", value: "rotate" },
  ]

  const getAnimationClass = (animationType: string): string => {
    switch (animationType) {
      case "fade-in":
        return "animate-fade-in"
      case "slide-up":
        return "animate-slide-up"
      case "slide-down":
        return "animate-slide-down"
      case "slide-left":
        return "animate-slide-left"
      case "slide-right":
        return "animate-slide-right"
      case "zoom-in":
        return "animate-zoom-in"
      case "zoom-out":
        return "animate-zoom-out"
      case "bounce":
        return "animate-bounce"
      case "pulse":
        return "animate-pulse"
      case "flip":
        return "animate-flip"
      case "shake":
        return "animate-shake"
      case "rotate":
        return "animate-rotate"
      default:
        return ""
    }
  }

  const handlePreview = (animation: string) => {
    setPreviewAnimation(animation)
    setTimeout(() => setPreviewAnimation(null), 1500)
  }

  return (
    <div
      className="absolute bg-white rounded-md shadow-lg z-50 w-64 border border-gray-200"
      style={{
        top: position?.top,
        right: position?.right,
        bottom: position?.bottom,
        left: position?.left,
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium text-sm">Select Animation</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-2 max-h-60 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {animations.map((animation) => (
            <div key={animation.value} className="flex items-center justify-between">
              <button
                onClick={() => onApply(animation.value)}
                className={`
                  flex-1 p-2 text-xs rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200
                  transition-all duration-200 text-left
                `}
              >
                {animation.name}
              </button>
              <button
                onClick={() => handlePreview(animation.value)}
                className="ml-2 p-1 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50"
                title="Preview animation"
              >
                <Play className="h-4 w-4" />
              </button>

              {previewAnimation === animation.value && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                  <div className={`bg-white p-8 rounded-lg shadow-lg ${getAnimationClass(animation.value)}`}>
                    <p className="text-lg font-medium">{animation.name} Animation</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}