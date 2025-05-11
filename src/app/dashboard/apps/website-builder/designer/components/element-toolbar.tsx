"use client"
import { ArrowUp, ArrowDown, Copy, Trash, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface ElementToolbarProps {
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
  onAlignChange: (align: "left" | "center" | "right") => void
}

export function ElementToolbar({ onMoveUp, onMoveDown, onDuplicate, onDelete, onAlignChange }: ElementToolbarProps) {
  return (
    <div className="absolute -top-10 left-0 bg-white shadow-md rounded-md flex items-center p-1 z-30">
      <button onClick={onMoveUp} className="p-1 hover:bg-gray-100 rounded" title="Move Up">
        <ArrowUp className="h-4 w-4" />
      </button>

      <button onClick={onMoveDown} className="p-1 hover:bg-gray-100 rounded" title="Move Down">
        <ArrowDown className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <button onClick={() => onAlignChange("left")} className="p-1 hover:bg-gray-100 rounded" title="Align Left">
        <AlignLeft className="h-4 w-4" />
      </button>

      <button onClick={() => onAlignChange("center")} className="p-1 hover:bg-gray-100 rounded" title="Align Center">
        <AlignCenter className="h-4 w-4" />
      </button>

      <button onClick={() => onAlignChange("right")} className="p-1 hover:bg-gray-100 rounded" title="Align Right">
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <button onClick={onDuplicate} className="p-1 hover:bg-gray-100 rounded" title="Duplicate">
        <Copy className="h-4 w-4" />
      </button>

      <button onClick={onDelete} className="p-1 hover:bg-gray-100 rounded text-red-500" title="Delete">
        <Trash className="h-4 w-4" />
      </button>
    </div>
  )
}
