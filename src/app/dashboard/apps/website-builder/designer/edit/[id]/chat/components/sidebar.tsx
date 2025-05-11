"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "../../../../../../../../../../supabase/client"
import { Plus, MessageSquare, Loader2 } from 'lucide-react'
import Link from "next/link"

interface Chat {
  id: string
  name: string
  created_at: string
}

export function ChatSidebar() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const chatId = params.chatId as string
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setChats(data || [])
      } catch (err) {
        console.error("Error fetching chats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()

    // Set up real-time subscription for chat updates
    const subscription = supabase
      .channel('chats_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'chats',
          filter: `project_id=eq.${projectId}`
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [projectId, supabase])

  const createNewChat = async () => {
    setIsCreating(true)
    try {
      const newChatName = `Chat ${chats.length + 1}`
      
      const { data, error } = await supabase
        .from('chats')
        .insert([
          { 
            project_id: projectId,
            name: newChatName
          }
        ])
        .select()
      
      if (error) throw error
      
      if (data && data[0]) {
        router.push(`/project/${projectId}/chat/${data[0].id}`)
      }
    } catch (err) {
      console.error("Error creating new chat:", err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <button
          onClick={createNewChat}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No chats yet. Create your first chat!
          </div>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <Link
                  href={`/project/${projectId}/chat/${chat.id}`}
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors ${
                    chat.id === chatId ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{chat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Link
          href={`/project/${projectId}`}
          className="block w-full text-center p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Project
        </Link>
      </div>
    </div>
  )
}
