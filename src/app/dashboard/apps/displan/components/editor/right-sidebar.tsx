"use client"

import { useState } from "react"
import { ExternalLink, MoreHorizontal, Trash2, Copy } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { DisplanProjectDesignerCssComment } from "../../lib/types/displan-editor-types"
import "../../../website-builder/designer/styles/button.css"

interface RightSidebarProps {
  comments: DisplanProjectDesignerCssComment[]
  onDeleteComment?: (commentId: string) => void
  showComments: boolean // NEW: Only show comments when comment tool is active
}

export function RightSidebar({ comments, onDeleteComment, showComments }: RightSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleMenuToggle = (commentId: string) => {
    setOpenMenuId(openMenuId === commentId ? null : commentId)
  }

  const handleDeleteComment = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(commentId)
    }
    setOpenMenuId(null)
  }

  const handleCopyComment = (message: string) => {
    navigator.clipboard.writeText(message)
    setOpenMenuId(null)
  }

  // If showComments is false, render empty sidebar
  if (!showComments) {
    return (
      <div className="w-80 bg-white dark:bg-black-900 dark:border-gray-900 h-full overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Empty sidebar - no content when comment tool is not active */}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-black dark:border-gray-900 h-full overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-sm font-bold text-white dark:text-gray-900 flex-shrink-0">
                    {comment.author_avatar ? (
                      <img src={comment.author_avatar || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      comment.author_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {comment.author_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words">{comment.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="relative">
                        <button
                          onClick={() => handleMenuToggle(comment.id)}
                          className="hover:text-gray-900 dark:hover:text-white"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                        {openMenuId === comment.id && (
                          <div className="menu_container">
                            <button onClick={() => handleCopyComment(comment.message)} className="menu_item">
                              <Copy className="w-3 h-3 mr-2" />
                              Copy
                            </button>
                            <button onClick={() => handleDeleteComment(comment.id)} className="menu_item">
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
