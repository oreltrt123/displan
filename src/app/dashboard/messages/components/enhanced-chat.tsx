"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageBubble } from "./message-bubble"
import { getMessages, sendMessage, getCurrentUserId, checkIfBlocked } from "../actions/messaging-actions"
import type { Message, User } from "../types/messaging"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface EnhancedChatProps {
  selectedUser: User
  onBack?: () => void
}

export function EnhancedChat({ selectedUser, onBack }: EnhancedChatProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [isBlocked, setIsBlocked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Update URL with user ID
    router.push(`/dashboard/messages/${selectedUser.id}`, { scroll: false })

    async function loadData() {
      try {
        const [msgs, userId, blocked] = await Promise.all([
          getMessages(selectedUser.id),
          getCurrentUserId(),
          checkIfBlocked(selectedUser.id),
        ])
        setMessages(msgs)
        setCurrentUserId(userId)
        setIsBlocked(blocked)
      } catch (error) {
        console.error("Error loading chat data:", error)
      }
    }
    loadData()

    // Refresh messages every 3 seconds for real-time effect
    const interval = setInterval(async () => {
      try {
        const [msgs, blocked] = await Promise.all([getMessages(selectedUser.id), checkIfBlocked(selectedUser.id)])
        setMessages(msgs)
        setIsBlocked(blocked)
      } catch (error) {
        console.error("Error refreshing messages:", error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedUser.id, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || isBlocked) return

    setIsLoading(true)
    try {
      const message = await sendMessage(selectedUser.id, newMessage)

      if (message) {
        setMessages((prev) => [...prev, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. You may be blocked by this user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const userName = selectedUser.name || selectedUser.email || "User"
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="border-b border-border p-4 flex items-center gap-3 bg-card">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">{userName}</h2>
          <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
        </div>
        <div className="text-xs text-muted-foreground">ID: {selectedUser.id.slice(0, 8)}...</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUserId}
              otherUserName={userName}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4 bg-card">
        {isBlocked ? (
          <div className="text-center text-muted-foreground py-4 bg-muted rounded-lg">
            <p className="font-medium text-destructive">This user has blocked you</p>
            <p className="text-sm">You cannot send messages to this user</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-background"
            />
            <Button type="submit" disabled={isLoading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
