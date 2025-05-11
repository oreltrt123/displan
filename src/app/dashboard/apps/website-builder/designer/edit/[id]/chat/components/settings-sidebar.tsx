"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../../../../../../../supabase/client"
import { X, Trash2, Edit, Download, Share2, Bell, BellOff, Loader2 } from 'lucide-react'

interface ChatSettingsSidebarProps {
  chatId: string
  projectId: string
  chatName: string
  setChatName: (name: string) => void
  onClose: () => void
}

export function ChatSettingsSidebar({ 
  chatId, 
  projectId, 
  chatName, 
  setChatName, 
  onClose 
}: ChatSettingsSidebarProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(chatName)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const supabase = createClient()

  const handleRenameChat = async () => {
    if (!editedName.trim() || editedName === chatName) {
      setIsEditing(false)
      setEditedName(chatName)
      return
    }

    setIsRenaming(true)
    try {
      const { error } = await supabase
        .from('chats')
        .update({ name: editedName })
        .eq('id', chatId)
      
      if (error) throw error
      
      setChatName(editedName)
      setIsEditing(false)
    } catch (err) {
      console.error("Error renaming chat:", err)
      setEditedName(chatName)
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDeleteChat = async () => {
    setIsDeleting(true)
    try {
      // First delete all messages for this chat
      await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId)
      
      // Then delete the chat itself
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
      
      if (error) throw error
      
      // Navigate back to project page
      router.push(`/project/${projectId}`)
    } catch (err) {
      console.error("Error deleting chat:", err)
      setIsDeleting(false)
    }
  }

  const handleExportChat = async () => {
    setIsExporting(true)
    try {
      // Get all messages for this chat
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('timestamp', { ascending: true })
      
      if (error) throw error
      
      // Format the chat data
      const chatData = {
        chatName,
        chatId,
        projectId,
        exportDate: new Date().toISOString(),
        messages: data || []
      }
      
      // Create a downloadable file
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${chatName.replace(/\s+/g, '-').toLowerCase()}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error exporting chat:", err)
    } finally {
      setIsExporting(false)
    }
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
  }

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Chat Settings</h2>
        <button
          onClick={onClose}
          className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Chat Name Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Chat Name</h3>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 p-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter chat name"
                  autoFocus
                />
                <button
                  onClick={handleRenameChat}
                  disabled={isRenaming}
                  className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isRenaming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedName(chatName)
                  }}
                  className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-background rounded-md">
                <span className="text-foreground truncate">{chatName}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Chat Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleExportChat}
                disabled={isExporting}
                className="w-full flex items-center justify-between p-3 bg-background rounded-md hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>Export Chat</span>
                </div>
                {isExporting && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
              
              <button
                onClick={toggleNotifications}
                className="w-full flex items-center justify-between p-3 bg-background rounded-md hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  {notifications ? (
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <BellOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{notifications ? "Disable Notifications" : "Enable Notifications"}</span>
                </div>
              </button>
              
              <button
                onClick={handleDeleteChat}
                disabled={isDeleting}
                className="w-full flex items-center justify-between p-3 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Chat</span>
                </div>
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
            </div>
          </div>

          {/* Chat Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">Chat ID:</span>
                <span className="text-foreground font-mono">{chatId.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">Project:</span>
                <span className="text-foreground">{projectId.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
