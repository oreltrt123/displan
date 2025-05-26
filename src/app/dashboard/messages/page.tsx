"use client"

import { useState } from "react"
import { EnhancedSidebar } from "./components/enhanced-sidebar"
import { EnhancedChat } from "./components/enhanced-chat"
import type { User } from "./types/messaging"

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <EnhancedSidebar onUserSelect={setSelectedUser} selectedUserId={selectedUser?.id} />

      {/* Main Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <EnhancedChat selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
        ) : (
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
              <p>Search for a user in the sidebar to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
