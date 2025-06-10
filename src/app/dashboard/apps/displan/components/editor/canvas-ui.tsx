"use client"

import type React from "react"
import { X, ArrowUp, MessageCircle, Palette, Trash2 } from "lucide-react"
import type { SelectionBox, ContextMenu } from "../../types/canvas-types"
import { DisplanProjectDesignerCssComment } from "../../lib/types/displan-editor-types"

interface CanvasUIProps {
  comments: DisplanProjectDesignerCssComment[]
  newCommentId: string
  showCommentInput: boolean
  commentPosition: { x: number; y: number }
  commentMessage: string
  selectionBox: SelectionBox | null
  contextMenu: ContextMenu
  isPreviewMode: boolean
  onCommentInputClick: (e: React.MouseEvent) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputKeyDown: (e: React.KeyboardEvent) => void
  onSubmitComment: (e: React.MouseEvent) => void
  onCloseComment: (e: React.MouseEvent) => void
  onContextMenuClick: (action: string, e: React.MouseEvent) => void
}

export function CanvasUI({
  comments,
  newCommentId,
  showCommentInput,
  commentPosition,
  commentMessage,
  selectionBox,
  contextMenu,
  isPreviewMode,
  onCommentInputClick,
  onInputChange,
  onInputKeyDown,
  onSubmitComment,
  onCloseComment,
  onContextMenuClick,
}: CanvasUIProps) {
  return (
    <>
      {/* Comments */}
      {!isPreviewMode &&
        comments.map((comment, index) => {
          const isNew = index === 0 && newCommentId
          return (
            <div
              key={comment.id}
              className={`absolute ${isNew ? "scale-125 bg-blue-500 rounded-full p-1" : "scale-100"}`}
              style={{ left: comment.x_position, top: comment.y_position }}
            >
              <MessageCircle
                className={`w-4 h-4 fill-current ${isNew ? "text-white" : "text-gray-900 dark:text-white"}`}
              />
            </div>
          )
        })}

      {/* Comment Input */}
      {showCommentInput && (
        <div
          className="absolute z-50"
          style={{
            left: commentPosition.x,
            top: commentPosition.y,
            transform: "translate(-50%,-50%)",
          }}
          onClick={onCommentInputClick}
        >
          <div className="relative flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={commentMessage}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              placeholder="Add comment..."
              className="w-48 text-sm bg-transparent outline-none text-gray-900 dark:text-white"
            />
            <button
              onClick={onSubmitComment}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={onCloseComment}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selection Box */}
      {selectionBox && (
        <div
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="context-menu-item" onClick={(e) => onContextMenuClick("background", e)}>
            <Palette />
            Change Background
          </button>
          <div className="context-menu-separator" />
          <button className="context-menu-item" onClick={(e) => onContextMenuClick("deleteAll", e)}>
            <Trash2 />
            Delete All Elements
          </button>
        </div>
      )}
    </>
  )
}
