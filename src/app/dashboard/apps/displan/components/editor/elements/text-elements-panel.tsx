"use client"

import { ArrowLeft } from "lucide-react"
import "@/styles/text_panel.css"

interface TextElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function TextElementsPanel({ onAddElement, onBack }: TextElementsPanelProps) {
  const textStyles = [
    { id: "heading", name: "Heading Text", className: "displan-text-heading", description: "Large heading for titles" },
    {
      id: "subheading",
      name: "Subheading Text",
      className: "displan-text-subheading",
      description: "Secondary heading",
    },
    { id: "paragraph", name: "Paragraph Text", className: "displan-text-paragraph", description: "Regular body text" },
    { id: "small", name: "Small Text", className: "displan-text-small", description: "Fine print text" },
    { id: "bold", name: "Bold Text", className: "displan-text-bold", description: "Emphasized text" },
    { id: "italic", name: "Italic Text", className: "displan-text-italic", description: "Stylized text" },
    { id: "link", name: "Link Text", className: "displan-text-link", description: "Clickable link" },
    { id: "quote", name: "Quote Text", className: "displan-text-quote", description: "Blockquote style" },
    { id: "code", name: "Code Text", className: "displan-text-code", description: "Monospace code" },
    { id: "caption", name: "Caption Text", className: "displan-text-caption", description: "Image caption" },
  ]

  const handleAddText = (styleId: string, className: string) => {
    if (onAddElement) {
      onAddElement(`text-${styleId}`, 400, 300)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">Text Elements</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[700px] pr-2">
        {textStyles.map((style) => (
          <div
            key={style.id}
            onClick={() => handleAddText(style.id, style.className)}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer relative"
          >
            <div className="flex flex-col">
              <div className="mb-2">
                {style.id === "bold" ? (
                  <div className="video-text-container relative">
                    <video
                      className="video-bg"
                      autoPlay
                      loop
                      muted
                      playsInline
                      src="/public/Text_scrolling_video.mp4"
                    />
                    <span className={`${style.className}`}>{style.name}</span>
                  </div>
                ) : (
                  <span className={`${style.className}`}>{style.name}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{style.description}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Class: {style.className}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}