"use client"

import { useState } from "react"
import { Bold, Italic, Quote, Code, List, ListOrdered, ImageIcon, Video, Link, Table } from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  language: string
}

export function RichTextEditor({ content, onChange, language }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  const insertText = (before: string, after = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    const newContent = content.substring(0, start) + before + (selectedText || "text") + after + content.substring(end)

    onChange(newContent)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + (selectedText || "text").length)
    }, 0)
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      insertText(`[${linkText}](${linkUrl})`)
      setLinkUrl("")
      setLinkText("")
      setShowLinkModal(false)
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), title: "Italic" },
    { icon: Quote, action: () => insertText("> "), title: "Quote" },
    { icon: Code, action: () => insertText("`", "`"), title: "Code" },
    { icon: List, action: () => insertText("- "), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. "), title: "Numbered List" },
    { icon: Link, action: () => setShowLinkModal(true), title: "Link" },
    { icon: ImageIcon, action: () => insertText("![alt text](image-url)"), title: "Image" },
    { icon: Video, action: () => insertText("[video](video-url)"), title: "Video" },
    {
      icon: Table,
      action: () => insertText("| Header | Header |\n|--------|--------|\n| Cell   | Cell   |"),
      title: "Table",
    },
  ]

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center p-2 bg-gray-800 border-b border-gray-700 flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          id="content-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-96 p-4 bg-gray-900 text-white resize-none focus:outline-none font-mono text-sm"
          placeholder="Start writing your content..."
        />
      </div>

      {/* Preview Section */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Editing Content</h4>
        <p className="text-xs text-gray-400">
          You can choose to set up different types of input fields depending on your content. For instance, a blog might
          have a title, a slug, and a long-form field for formatted content. These may be different for a product
          directory or a photo blog, where you might want to have more custom fields.
        </p>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-white mb-4">Add Link</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
