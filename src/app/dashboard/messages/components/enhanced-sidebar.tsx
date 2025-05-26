"use client"

import { useState, useEffect } from "react"
import { Search, Pin, BlocksIcon as Block, Trash2, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button_edit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  searchUsers,
  syncCurrentUser,
  getRecentConversations,
  togglePinConversation,
  toggleBlockUser,
  deleteConversation,
  getConversationSettings,
} from "../actions/messaging-actions"
import type { User } from "../types/messaging"
import "../../apps/website-builder/designer/styles/button.css"

interface EnhancedSidebarProps {
  onUserSelect: (user: User) => void
  selectedUserId?: string
}

export function EnhancedSidebar({ onUserSelect, selectedUserId }: EnhancedSidebarProps) {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [recentConversations, setRecentConversations] = useState<User[]>([])
  const [conversationSettings, setConversationSettings] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    loadRecentConversations()
  }, [])

  const loadRecentConversations = async () => {
    try {
      const conversations = await getRecentConversations()
      setRecentConversations(conversations)

      // Load settings for each conversation
      const settings: Record<string, any> = {}
      for (const user of conversations) {
        settings[user.id] = await getConversationSettings(user.id)
      }
      setConversationSettings(settings)
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setMessage("Please enter a search term")
      return
    }

    setIsLoading(true)
    setMessage("Searching...")

    try {
      const users = await searchUsers(query)
      setSearchResults(users)
      setMessage(users.length === 0 ? "No users found" : `Found ${users.length} user(s)`)
    } catch (error) {
      setMessage("Search failed. Please try again.")
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    const result = await syncCurrentUser()
    setMessage(result.message)
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
    })
    setIsLoading(false)
  }

  const handlePin = async (userId: string) => {
    try {
      const result = await togglePinConversation(userId)
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
      })
      if (result.success) {
        await loadRecentConversations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle pin",
      })
    }
    setOpenMenuId(null) // Close menu after action
  }

  const handleBlock = async (userId: string) => {
    try {
      const result = await toggleBlockUser(userId)
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
      })
      if (result.success) {
        await loadRecentConversations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle block",
      })
    }
    setOpenMenuId(null) // Close menu after action
  }

  const handleDelete = async (userId: string) => {
    try {
      const result = await deleteConversation(userId)
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
      })
      if (result.success) {
        await loadRecentConversations()
        // If the deleted user was selected, clear selection
        if (selectedUserId === userId) {
          onUserSelect(null as any)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
      })
    }
    setOpenMenuId(null) // Close menu after action
  }

  const toggleMenu = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId)
  }

  const renderUserItem = (user: User, isRecent = false) => {
    const userName = user.name || user.email || "User"
    const userInitial = userName.charAt(0).toUpperCase()
    const isSelected = selectedUserId === user.id
    const settings = conversationSettings[user.id] || {}
    const isMenuOpen = openMenuId === user.id

    return (
      <div key={user.id} className="flex items-center group">
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className="flex-1 justify-start p-3 h-auto"
          onClick={() => onUserSelect(user)}
        >
          <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{userInitial}</AvatarFallback>
          </Avatar>
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm truncate">{userName}</span>
              {settings.is_pinned && <Pin className="h-3 w-3 text-primary fill-current" />}
              {settings.is_blocked && <Block className="h-3 w-3 text-destructive" />}
            </div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </Button>

        {isRecent && (
          <div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                onClick={() => toggleMenu(user.id)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            {isMenuOpen && (
              <div className="menu_container">
                <button className="menu_item" onClick={() => handlePin(user.id)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {settings.is_pinned ? "Unpin" : "Pin"}
                </button>
                <button className="menu_item" onClick={() => handleBlock(user.id)}>
                  <Block className="h-4 w-4 mr-2" />
                  {settings.is_blocked ? "Unblock" : "Block"}
                </button>
                <button className="menu_item" onClick={() => handleDelete(user.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        {/* Search */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Conversations */}
        {recentConversations.length > 0 && (
          <div className="p-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Recent</h3>
            {recentConversations.map((user) => renderUserItem(user, true))}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="p-2 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Search Results</h3>
            {searchResults.map((user) => renderUserItem(user))}
          </div>
        )}

        {/* Empty States */}
        {recentConversations.length === 0 && searchResults.length === 0 && !query && (
          <div className="p-4 text-center text-sm text-muted-foreground">Search for users to start a conversation</div>
        )}

        {query && !isLoading && searchResults.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No users found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  )
}
