"use client"
import { X } from "lucide-react"

interface AnimationPanelProps {
  onClose: () => void
  onApply: (animationType: string) => void
  position?: { top?: string; right?: string; bottom?: string; left?: string }
}

export function AnimationPanel({ onClose, onApply, position = { top: "0", right: "0" } }: AnimationPanelProps) {
  const animations = [
    { id: "none", name: "None", icon: "/animations/none.svg" },
    { id: "fade", name: "Fade", icon: "/animations/fade.svg" },
    { id: "shutters", name: "Shutters", icon: "/animations/shutters.svg" },
    { id: "fold", name: "Fold", icon: "/animations/fold.svg" },
    { id: "blur", name: "Blur", icon: "/animations/blur.svg" },
    { id: "turn", name: "Turn", icon: "/animations/turn.svg" },
    { id: "expand", name: "Expand", icon: "/animations/expand.svg" },
    { id: "shrink", name: "Shrink", icon: "/animations/shrink.svg" },
    { id: "tilt", name: "Tilt", icon: "/animations/tilt.svg" },
    { id: "reveal", name: "Reveal", icon: "/animations/reveal.svg" },
    { id: "shape", name: "Shape", icon: "/animations/shape.svg" },
    { id: "glide", name: "Glide", icon: "/animations/glide.svg" },
  ]

  const positionStyle = {
    position: "absolute" as const,
    ...position,
    zIndex: 50,
  }

  return (
    <div
      className="bg-white rounded-lg shadow-xl w-[300px] border border-gray-200"
      style={positionStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium">Add Animation</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {animations.map((animation) => (
            <div
              key={animation.id}
              className="flex flex-col items-center cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
              onClick={() => onApply(animation.id)}
            >
              <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center mb-1">
                {animation.id === "none" ? (
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 border-t-2 border-red-500 transform rotate-45"></div>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                    {animation.id === "fade" && <div className="w-8 h-8 bg-white opacity-50 rounded"></div>}
                    {animation.id === "shutters" && (
                      <div className="relative w-8 h-8">
                        <div className="absolute left-0 top-0 w-3 h-8 bg-white"></div>
                        <div className="absolute right-0 top-0 w-3 h-8 bg-white"></div>
                      </div>
                    )}
                    {animation.id === "fold" && <div className="w-8 h-8 bg-white rounded transform rotate-45"></div>}
                    {animation.id === "blur" && <div className="w-8 h-8 bg-white rounded filter blur-[2px]"></div>}
                    {animation.id === "turn" && <div className="w-8 h-8 bg-white rounded transform rotate-12"></div>}
                    {animation.id === "expand" && <div className="w-8 h-8 bg-white rounded transform scale-110"></div>}
                    {animation.id === "shrink" && <div className="w-8 h-8 bg-white rounded transform scale-75"></div>}
                    {animation.id === "tilt" && <div className="w-8 h-8 bg-white rounded transform skew-x-12"></div>}
                    {animation.id === "reveal" && (
                      <div className="w-8 h-8 bg-white rounded clip-path-[inset(0_0_50%_0)]"></div>
                    )}
                    {animation.id === "shape" && <div className="w-8 h-8 bg-white rounded-full"></div>}
                    {animation.id === "glide" && (
                      <div className="w-8 h-8 bg-white rounded transform translate-x-1"></div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-center">{animation.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => onApply("custom")}
        >
          Customize
        </button>
      </div>
    </div>
  )
}
