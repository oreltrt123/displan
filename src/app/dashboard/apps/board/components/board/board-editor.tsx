"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { FullScreenCanvas } from "./full-screen-canvas"
import { FloatingToolbar } from "./floating-toolbar"
import { FloatingHeader } from "./floating-header"
import { saveCanvasData } from "../../actions/board-actions"

interface BoardEditorProps {
  board: any
}

export function BoardEditor({ board }: BoardEditorProps) {
  const [canvasData, setCanvasData] = useState(
    board.canvas_data || {
      elements: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  )
  const [selectedTool, setSelectedTool] = useState("select")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [history, setHistory] = useState([canvasData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Hide scrollbars on mount
  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [])

  const handleCanvasUpdate = useCallback(
    async (newCanvasData: any) => {
      console.log("🎨 Canvas update in editor:", newCanvasData)
      setCanvasData(newCanvasData)

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newCanvasData)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      // Save to server immediately
      const result = await saveCanvasData(board.id, newCanvasData)
      if (result.error) {
        console.error("❌ Save error:", result.error)
      } else {
        console.log("✅ Canvas saved to server successfully")
      }
    },
    [board.id, history, historyIndex],
  )

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCanvasData(history[newIndex])
      saveCanvasData(board.id, history[newIndex])
    }
  }, [historyIndex, history, board.id])

  return (
    <div className="w-screen h-screen fixed inset-0 overflow-hidden bg-white">
      {/* Floating header */}
      <FloatingHeader selectedTool={selectedTool} onToolChange={setSelectedTool} boardId={board.id} />

      {/* Full-screen canvas */}
      <FullScreenCanvas
        ref={canvasRef}
        canvasData={canvasData}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        selectedElements={selectedElements}
        onCanvasUpdate={handleCanvasUpdate}
        onElementsSelect={setSelectedElements}
        boardId={board.id}
      />

      {/* Floating toolbar */}
      <FloatingToolbar
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        onToolChange={setSelectedTool}
        onColorChange={setSelectedColor}
        onUndo={handleUndo}
        canUndo={historyIndex > 0}
      />
    </div>
  )
}
