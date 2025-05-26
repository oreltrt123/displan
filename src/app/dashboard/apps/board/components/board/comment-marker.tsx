"use client"

import { MessageCircle } from "lucide-react"
import type { Comment } from "../../actions/comment-actions"

interface CommentMarkerProps {
  comment: Comment
  viewport: { x: number; y: number; zoom: number }
}

export function CommentMarker({ comment, viewport }: CommentMarkerProps) {
  return (
    <div
      className="absolute z-30 cursor-pointer"
      style={{
        left: comment.x,
        top: comment.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <MessageCircle className="h-3 w-3 text-white" />
      </div>
    </div>
  )
}
