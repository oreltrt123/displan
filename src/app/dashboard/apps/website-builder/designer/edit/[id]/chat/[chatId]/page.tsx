"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, ImageIcon, Loader2, Settings } from 'lucide-react'
import { createClient } from "../../../../../../../../../../supabase/client"
import { ChatSidebar } from "../components/sidebar"
import { ChatSettingsSidebar } from "../components/settings-sidebar"
import { ChatTopbar } from "../components/topbar"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
  elements?: any[]
}

export default function ChatPage({ params }: { params: { id: string; chatId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string>("")
  const [showSettings, setShowSettings] = useState(false)
  const [chatName, setChatName] = useState("New Chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Set project ID from params
    setProjectId(params.id)

    // Load chat name
    const loadChatName = async () => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('name')
          .eq('id', params.chatId)
          .single()
        
        if (error) throw error
        if (data) setChatName(data.name)
      } catch (err) {
        console.error("Error loading chat name:", err)
      }
    }

    loadChatName()

    // Load conversation history from localStorage or database
    const loadMessages = async () => {
      try {
        // First try to load from database
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', params.chatId)
          .order('timestamp', { ascending: true })
        
        if (error) throw error
        
        if (data && data.length > 0) {
          setMessages(data)
        } else {
          // If no messages in database, try localStorage
          const savedMessages = localStorage.getItem(`ai-conversation-${params.chatId}`)
          if (savedMessages) {
            try {
              setMessages(JSON.parse(savedMessages))
            } catch (e) {
              console.error("Failed to parse saved messages:", e)
            }
          } else {
            // Add welcome message if no history
            setMessages([
              {
                role: "assistant",
                content:
                  "👋 Hi! I'm your AI design assistant. I can help you create website elements, suggest design improvements, or answer questions about web design. What would you like to create today?",
                timestamp: Date.now(),
              },
            ])
          }
        }
      } catch (err) {
        console.error("Error loading messages:", err)
        
        // Fallback to localStorage if database fails
        const savedMessages = localStorage.getItem(`ai-conversation-${params.chatId}`)
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages))
          } catch (e) {
            console.error("Failed to parse saved messages:", e)
          }
        }
      }
    }

    loadMessages()
  }, [params.id, params.chatId, supabase])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && params.chatId) {
      localStorage.setItem(`ai-conversation-${params.chatId}`, JSON.stringify(messages))
      
      // Also save to database
      const saveMessages = async () => {
        try {
          // First delete existing messages for this chat
          await supabase
            .from('messages')
            .delete()
            .eq('chat_id', params.chatId)
          
          // Then insert all current messages
          const messagesToSave = messages.map(msg => ({
            ...msg,
            chat_id: params.chatId
          }))
          
          await supabase
            .from('messages')
            .insert(messagesToSave)
        } catch (err) {
          console.error("Error saving messages to database:", err)
        }
      }
      
      saveMessages()
    }
  }, [messages, params.chatId, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile) return

    setError(null)
    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    // Show loading state
    setIsLoading(true)

    try {
      // Upload image if present
      let imageUrl = null
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("design-images")
          .upload(`${projectId}/${Date.now()}-${imageFile.name}`, imageFile)

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = await supabase.storage.from("design-images").getPublicUrl(uploadData.path)
        imageUrl = urlData.publicUrl
        setImageFile(null)
        setImagePreview(null)
      }

      // Gemini API integration
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA" // Your API Key

      // Request to fetch available models
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      const modelsData = await modelsRes.json()
      console.log("Available models:", modelsData)

      // Use a model that supports generateContent
      const modelName = "gemini-2.0" // Replace with an actual model name from the response

      // Prepare the request body with image if available
      const requestBody: any = {
        contents: [{ parts: [{ text: userMessage }] }],
      }

      // Add image to request if available
      if (imageUrl) {
        requestBody.contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: imageUrl,
          },
        })
      }

      // Request to generate content
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      const data = await res.json()
      console.log("API raw response:", data)

      // Get real reply from Gemini
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (reply) {
        // Add AI response to chat
        const newAIMessage: Message = {
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, newAIMessage])
      } else if (data.error) {
        // Show error message from API
        const errorMessage: Message = {
          role: "assistant",
          content: `API Error: ${data.error.message}`,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } else {
        const errorMessage: Message = {
          role: "assistant",
          content: "Gemini gave empty reply. (Check API key or quota)",
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (err) {
      console.error("Error generating response:", err)

      // Add a more helpful error message to the chat
      const errorMessage: Message = {
        role: "assistant",
        content:
          err instanceof Error
            ? `I'm sorry, I encountered an issue: ${err.message}. Please try a different request or try again later.`
            : "I'm having trouble processing your request right now. Please try again with a different question.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setError(null) // Clear the error state since we're showing it in the chat
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setImageFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat Navigation */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Navigation Bar */}
        <ChatTopbar 
          chatName={chatName} 
          toggleSettings={toggleSettings} 
          projectId={projectId}
        />

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-secondary/50">
          {messages.map((message, index) => (
            <div key={index} className={`mb-6 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block rounded-lg p-4 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card text-card-foreground border border-border rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-6 text-left">
              <div className="inline-block rounded-lg p-4 bg-card text-card-foreground border border-border rounded-tl-none">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Generating response...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              <p>{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="p-3 border-t border-border bg-secondary/50 relative">
            <div className="relative w-full h-32 bg-background rounded border border-border">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full mx-auto object-contain" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
          <div className="flex items-center max-w-4xl mx-auto">
            <button
              type="button"
              onClick={handleImageUploadClick}
              className="p-3 text-muted-foreground hover:text-foreground"
              title="Upload image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-3 border border-input bg-background text-foreground rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading || (!input.trim() && !imageFile)}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Sidebar - Settings */}
      {showSettings && (
        <ChatSettingsSidebar 
          chatId={params.chatId} 
          projectId={projectId}
          chatName={chatName}
          setChatName={setChatName}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
