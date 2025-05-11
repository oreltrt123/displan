"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Sparkles, ImageIcon, Loader2, Lock, AlertCircle, Maximize2 } from 'lucide-react'
import { createClient } from "../../../../../../../supabase/client"

interface AIAssistantProps {
  isPremiumUser: boolean
  onUpgradeClick: () => void
  onAIGenerate: (elements: any[]) => void
  projectId: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
  elements?: any[]
}

// Daily conversation limit for free users
const FREE_DAILY_CONVERSATION_LIMIT = 5

export function AIDesignAssistant({ isPremiumUser, onUpgradeClick, onAIGenerate, projectId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [localIsPremium, setLocalIsPremium] = useState(isPremiumUser)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
  const [dailyConversationsRemaining, setDailyConversationsRemaining] = useState<number>(FREE_DAILY_CONVERSATION_LIMIT)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Load conversation history from localStorage and check daily limit
  useEffect(() => {
    // Check daily conversation limit
    const checkDailyLimit = () => {
      if (localIsPremium) {
        // Premium users have unlimited conversations
        setDailyConversationsRemaining(Number.POSITIVE_INFINITY)
        return
      }

      const today = new Date().toDateString()
      const conversationData = localStorage.getItem(`ai-conversation-limit-${projectId}`)

      if (conversationData) {
        try {
          const { date, count } = JSON.parse(conversationData)

          // If it's a new day, reset the counter
          if (date !== today) {
            localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
            setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
          } else {
            // Otherwise, set the remaining conversations
            setDailyConversationsRemaining(Math.max(0, FREE_DAILY_CONVERSATION_LIMIT - count))
          }
        } catch (e) {
          console.error("Failed to parse conversation limit data:", e)
          // Reset if there's an error
          localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
          setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
        }
      } else {
        // Initialize if no data exists
        localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
        setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
      }
    }

    // Load conversation history
    const savedMessages = localStorage.getItem(`ai-conversation-${projectId}`)
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

    // Check daily limit
    checkDailyLimit()
  }, [projectId, localIsPremium])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai-conversation-${projectId}`, JSON.stringify(messages))
    }
  }, [messages, projectId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check subscription status
  useEffect(() => {
    // Set initial state from props
    setLocalIsPremium(isPremiumUser)

    // Check cookies for premium status
    const checkCookies = () => {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const isPremiumCookie = cookies.find((cookie) => cookie.startsWith("isPremium="))
      if (isPremiumCookie && isPremiumCookie.split("=")[1] === "true") {
        setLocalIsPremium(true)
        return true
      }
      return false
    }

    // Check localStorage for premium status
    const checkLocalStorage = () => {
      const isPremiumFromStorage = localStorage.getItem("userPremiumStatus") === "true"
      if (isPremiumFromStorage) {
        setLocalIsPremium(true)
        return true
      }
      return false
    }

    // First check client-side storage
    const isPremiumFromClient = checkCookies() || checkLocalStorage()

    // Then verify with the server if needed
    if (!isPremiumFromClient) {
      verifySubscription()
    }

    // Function to verify subscription with the server
    async function verifySubscription() {
      setIsCheckingSubscription(true)
      try {
        const response = await fetch("/api/subscription/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Subscription check response:", data)

        if (data.isPremium) {
          setLocalIsPremium(true)

          // Update client-side storage
          localStorage.setItem("userPremiumStatus", "true")
          localStorage.setItem("premiumTimestamp", Date.now().toString())

          // Set cookie directly from client
          document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    // Set up interval to periodically check subscription status
    const intervalId = setInterval(verifySubscription, 60000) // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [isPremiumUser])

  // Update conversation count in localStorage
  const incrementConversationCount = () => {
    if (localIsPremium) return // Premium users don't need counting

    const today = new Date().toDateString()
    const conversationData = localStorage.getItem(`ai-conversation-limit-${projectId}`)

    if (conversationData) {
      try {
        const data = JSON.parse(conversationData)

        // If it's a new day, reset the counter
        if (data.date !== today) {
          localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 1 }))
          setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT - 1)
        } else {
          // Otherwise, increment the count
          const newCount = data.count + 1
          localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: newCount }))
          setDailyConversationsRemaining(Math.max(0, FREE_DAILY_CONVERSATION_LIMIT - newCount))
        }
      } catch (e) {
        console.error("Failed to update conversation count:", e)
      }
    } else {
      // Initialize if no data exists
      localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 1 }))
      setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile) return

    // Check if user has reached daily limit and is not premium
    if (!localIsPremium && dailyConversationsRemaining <= 0) {
      setError("You've reached your daily conversation limit. Upgrade to premium for unlimited conversations.")
      return
    }

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

    // Increment conversation count for free users
    incrementConversationCount()

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

  const openFullscreenChat = () => {
    // Open a new window with the chat
    window.open(`/dashboard/apps/website-builder/designer/edit/${projectId}/chat/${projectId}`, "_blank")
  }

  // Free tier UI with daily limit indicator
  if (!localIsPremium && dailyConversationsRemaining <= 0) {
    return (
      <div className="bg-background border-r border-border flex flex-col h-full w-[600px]">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-foreground flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              AI Design Assistant
            </h2>
            <button
              onClick={openFullscreenChat}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Open in fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
            <Bot className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Daily Limit Reached</h3>
          <p className="text-muted-foreground mb-6">
            You've used all {FREE_DAILY_CONVERSATION_LIMIT} of your free daily conversations with the AI assistant.
          </p>

          <div className="bg-secondary p-4 rounded-lg mb-6 text-left">
            <h4 className="font-medium text-foreground mb-2">Options:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                <span>Wait until tomorrow for {FREE_DAILY_CONVERSATION_LIMIT} more free conversations</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-0.5" />
                <span>Upgrade to premium for unlimited conversations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onUpgradeClick}
            className="w-full py-2 px-4 bg-purple-500 text-white rounded-md font-medium flex items-center justify-center hover:bg-purple-600 transition-colors"
          >
            <Lock className="h-4 w-4 mr-2" />
            Upgrade for $5/month
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border-r border-border flex flex-col h-full w-[600px]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-foreground flex items-center">
            <Bot className="h-4 w-4 mr-2 text-purple-500" />
            AI Design Assistant
          </h2>
          <button
            onClick={openFullscreenChat}
            className="p-1 text-muted-foreground hover:text-foreground"
            title="Open in fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Daily limit indicator for free users */}
        {!localIsPremium && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Daily conversations:</span>
            <span className="font-medium">
              {dailyConversationsRemaining} of {FREE_DAILY_CONVERSATION_LIMIT} remaining
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-secondary/50">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block rounded-lg p-3 max-w-[85%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card text-card-foreground border border-border rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.elements && message.elements.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                  {message.role === "assistant" && (
                    <button
                      onClick={() => onAIGenerate(message.elements!)}
                      className="text-purple-500 hover:text-purple-700 font-medium"
                    >
                      Apply these elements again
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 text-left">
            <div className="inline-block rounded-lg p-3 bg-card text-card-foreground border border-border rounded-tl-none">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Generating response...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <p>{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="p-2 border-t border-border bg-secondary/50 relative">
          <div className="relative w-full h-24 bg-background rounded border border-border">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full mx-auto object-contain" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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

      <form onSubmit={handleSubmit} className="p-2 border-t border-border">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleImageUploadClick}
            className="p-2 text-muted-foreground hover:text-foreground"
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
            className="flex-1 p-2 border border-input bg-background text-foreground rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 disabled:opacity-50"
            disabled={
              isLoading || (!input.trim() && !imageFile) || (!localIsPremium && dailyConversationsRemaining <= 0)
            }
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
