"use client"
import { Grid, CloudOffIcon as GridOff, ZoomIn, ZoomOut } from "lucide-react"
import { useDragDrop } from "./drag-drop-context"

export function GridControls() {
  const { showGrid, setShowGrid, gridSize, setGridSize } = useDragDrop()

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 flex items-center space-x-2 z-50">
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`p-1.5 rounded-md ${showGrid ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
        title={showGrid ? "Hide Grid" : "Show Grid"}
      >
        {showGrid ? <GridOff className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
      </button>

      <div className="w-px h-5 bg-gray-200" />

      <button
        onClick={() => setGridSize(Math.max(4, gridSize - 4))}
        className="p-1.5 rounded-md hover:bg-gray-100"
        title="Decrease Grid Size"
        disabled={gridSize <= 4}
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <span className="text-xs font-medium">{gridSize}px</span>

      <button
        onClick={() => setGridSize(Math.min(32, gridSize + 4))}
        className="p-1.5 rounded-md hover:bg-gray-100"
        title="Increase Grid Size"
        disabled={gridSize >= 32}
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  )
}
