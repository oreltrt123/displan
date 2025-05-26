"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_edit"
import { MessageCircle, Plus, Share, User, Users } from "lucide-react"
import { CommentsPanel } from "./comments-panel"
import { CollaborationPanel } from "./collaboration-panel"
import { getUserRole } from "../../actions/collaboration-actions"

interface FloatingHeaderProps {
  selectedTool: string
  onToolChange: (tool: string) => void
  boardId: string
}

export function FloatingHeader({ selectedTool, onToolChange, boardId }: FloatingHeaderProps) {
  const [showComments, setShowComments] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const loadUserRole = async () => {
      const { role } = await getUserRole(boardId)
      setUserRole(role)
    }
    loadUserRole()
  }, [boardId])

  return (
    <>
      <div className="fixed top-6 right-6 z-40">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* Templates button */}
            <Button variant="ghost" size="sm" className="h-9 px-3 text-gray-700 hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Templates
            </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCollaboration(true)}
                className="h-9 px-3 text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-4 w-4 mr-2" />
                Collaborate
              </Button>

              <Button
                variant={selectedTool === "comment" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  onToolChange("comment")
                  setShowComments(true)
                }}
               className="h-9 px-3 text-gray-700 hover:bg-gray-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments
              </Button>
          </div>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && <CommentsPanel boardId={boardId} onClose={() => setShowComments(false)} />}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <CollaborationPanel boardId={boardId} userRole={userRole} onClose={() => setShowCollaboration(false)} />
      )}
    </>
  )
}
