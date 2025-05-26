"use client"

import { useState, useEffect } from "react"
import { EnhancedSidebar } from "../components/enhanced-sidebar"
import { EnhancedChat } from "../components/enhanced-chat"
import { getUserById } from "../actions/messaging-actions"
import type { User } from "../types/messaging"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const params = useParams()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (params.id) {
        const user = await getUserById(params.id as string)
        setSelectedUser(user)
      }
      setLoading(false)
    }
    loadUser()
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <EnhancedSidebar onUserSelect={setSelectedUser} selectedUserId={selectedUser?.id} />

      {/* Main Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <EnhancedChat selectedUser={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <p>The user you're looking for doesn't exist</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
