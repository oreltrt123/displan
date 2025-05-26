"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_edit"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, MoreHorizontal, User, MessageCircle } from "lucide-react"
import { getAllComments, type WorkingComment } from "../../actions/comment-actions"

interface CommentsPanelProps {
  boardId: string
  onClose: () => void
}

export function CommentsPanel({ boardId, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<WorkingComment[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadComments = async () => {
      console.log("💬 Loading comments for panel:", boardId)
      const { data } = await getAllComments(boardId)
      if (data) {
        console.log("✅ Comments loaded in panel:", data)
        setComments(data)
      }
    }

    // Load comments initially
    loadComments()

    // Refresh comments every 2 seconds to show new ones
    const interval = setInterval(loadComments, 2000)

    return () => clearInterval(interval)
  }, [boardId])

  const filteredComments = comments.filter((comment) =>
    comment.comment_text.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="fixed top-20 right-6 z-50 w-80 h-96">
      <div className="bg-white backdrop-blur-sm border border-gray-200/80 rounded-xl h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Comments ({filteredComments.length})</h3>
            <Button variant="ghost" size="sm" onClick={onClose}                 className="h-9 px-3 text-gray-700 hover:bg-gray-100"
>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{comment.user_email || "Anonymous User"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">#{comment.id.slice(0, 8)}</div>
                <div className="text-sm text-gray-900 mb-2">{comment.comment_text}</div>
                <div className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Position: ({Math.round(comment.position_x)}, {Math.round(comment.position_y)})
                </div>
              </div>
            ))}
            {filteredComments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{searchQuery ? "No comments match your search" : "No comments yet"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {!searchQuery && "Click the comment tool and then click on the canvas to add a comment"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
