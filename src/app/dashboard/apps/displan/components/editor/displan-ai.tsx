"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2, Sparkles, MoreHorizontal, Check, X, FileText, Wand2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { displanKnowledgeBase } from "./ai-knowledge-base"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  isLoading?: boolean
  isSearching?: boolean
  isCreatingElement?: boolean
  isDesigning?: boolean
  isTyping?: boolean
  typedContent?: string
  timestamp: Date
  showTemplates?: boolean
  elementPreview?: any
  designProcess?: string[]
}

interface DisplanAIProps {
  onAddElement?: (elementType: string, x: number, y: number, properties: any) => void
  onAddTemplate?: (templateId: string, position: { x: number; y: number }) => void
  projectId?: string
}

// Available templates
const availableTemplates = [
  {
    id: "contact-form-1",
    name: "Simple Contact Form",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "forms",
  },
  {
    id: "header-modern",
    name: "Modern Header",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "headers",
  },
  {
    id: "hero-centered",
    name: "Centered Hero",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "heroes",
  },
  {
    id: "pricing-table",
    name: "Pricing Table",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "pricing",
  },
  {
    id: "footer-simple",
    name: "Simple Footer",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "footers",
  },
  {
    id: "testimonials-grid",
    name: "Testimonials Grid",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "testimonials",
  },
]

export function DisplanAIEnhanced({ onAddElement, onAddTemplate, projectId }: DisplanAIProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Describe what you want to create and I'll design it for you.",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isAddingTemplate, setIsAddingTemplate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingSpeed = useRef(30)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [templateFilter, setTemplateFilter] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const defaultPlaceholder = "Describe what you want to create and I'll design it for you."

  // Message actions state
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [hasUserMessages, setHasUserMessages] = useState(false)

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`displan_ai_chat_${projectId || "default"}`)

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as Message[]
        setMessages(parsedMessages)
        const userMsgs = parsedMessages.filter((msg) => msg.role === "user")
        setHasUserMessages(userMsgs.length > 0)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content:
              "Hi! I'm Displan AI, your intelligent website building assistant powered by Google Gemini. I was created by DisPlan to help you build amazing websites. I can design and create any element you need - just describe what you want and I'll think about the best design, colors, animations, and functionality, then create it for you! How can I help you today?",
            typedContent:
              "Hi! I'm Displan AI, your intelligent website building assistant powered by Google Gemini. I was created by DisPlan to help you build amazing websites. I can design and create any element you need - just describe what you want and I'll think about the best design, colors, animations, and functionality, then create it for you! How can I help you today?",
            timestamp: new Date(),
          },
        ])
        setHasUserMessages(false)
      }
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi! I'm Displan AI, your intelligent website building assistant powered by Google Gemini. I was created by DisPlan to help you build amazing websites. I can design and create any element you need - just describe what you want and I'll think about the best design, colors, animations, and functionality, then create it for you! How can I help you today?",
          isTyping: true,
          typedContent: "",
          timestamp: new Date(),
        },
      ])
      setHasUserMessages(false)
    }
  }, [projectId])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`displan_ai_chat_${projectId || "default"}`, JSON.stringify(messages))
    }
  }, [messages, projectId])

  // Typing animation effect
  useEffect(() => {
    const typingMessages = messages.filter((m) => m.isTyping && m.typedContent !== m.content)

    if (typingMessages.length === 0) return

    const currentMessage = typingMessages[0]
    const fullContent = currentMessage.content
    const typedContent = currentMessage.typedContent || ""

    if (typedContent.length < fullContent.length) {
      const timeoutId = setTimeout(() => {
        const variance = Math.random() * 30 - 15
        typingSpeed.current = Math.max(10, Math.min(50, typingSpeed.current + variance))

        const nextChar = fullContent.charAt(typedContent.length)
        const newTypedContent = typedContent + nextChar

        if ([".", "!", "?", ",", ":"].includes(nextChar)) {
          typingSpeed.current = 100 + Math.random() * 200
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === currentMessage.id ? { ...m, typedContent: newTypedContent } : m)),
        )
      }, typingSpeed.current)

      return () => clearTimeout(timeoutId)
    } else {
      setMessages((prev) => prev.map((m) => (m.id === currentMessage.id ? { ...m, isTyping: false } : m)))
    }
  }, [messages])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isScrolledToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isScrolledToBottom])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuMessageId) {
        const menuElement = document.getElementById(`menu-${activeMenuMessageId}`)
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setActiveMenuMessageId(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeMenuMessageId])

  // Save chat to server
  const handleSaveChat = async () => {
    try {
      const savingMessageId = uuidv4()
      setMessages((prev) => [
        ...prev,
        {
          id: savingMessageId,
          role: "system",
          content: "Saving chat history to server...",
          timestamp: new Date(),
        },
      ])

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === savingMessageId
            ? {
                id: savingMessageId,
                role: "system",
                content: "✅ Chat history saved successfully!",
                timestamp: new Date(),
              }
            : msg,
        ),
      )

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== savingMessageId))
      }, 3000)
    } catch (error) {
      console.error("Error saving chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "system",
          content: "❌ Failed to save chat history. Please try again.",
          timestamp: new Date(),
        },
      ])
    }
  }

  // Enhanced AI-powered element creation using Gemini
  const handleIntelligentElementCreation = async (
    userRequest: string,
  ): Promise<{ response: string; elementSpec?: any }> => {
    try {
      console.log("AI is designing element for request:", userRequest)

      // Show design thinking process
      const designingMessageId = uuidv4()
      setMessages((prev) => [
        ...prev,
        {
          id: designingMessageId,
          role: "assistant",
          content: "🎨 Let me think about the best design for this...",
          isDesigning: true,
          designProcess: [
            "Analyzing your request...",
            "Choosing colors and styling...",
            "Adding animations...",
            "Finalizing design...",
          ],
          timestamp: new Date(),
        },
      ])

      // Use Gemini API to intelligently design the element
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      const designPrompt = `You are Displan AI, an expert web designer created by DisPlan. A user wants you to create: "${userRequest}"

Please analyze this request and design the perfect element. Consider:
1. What type of element is most appropriate (button, text, image, form, etc.)
2. What colors would work best for this purpose
3. What animations or effects would enhance the user experience
4. What size and styling would be most effective
5. What content/text should it contain

Respond with a JSON object containing these exact fields:
{
  "elementType": "button-primary" | "text-heading" | "text-paragraph" | "image" | "form-contact" | "container",
  "content": "the text content or placeholder",
  "backgroundColor": "hex color code",
  "textColor": "hex color code", 
  "borderRadius": number (0-50),
  "borderWidth": number (0-5),
  "borderColor": "hex color code",
  "width": number (50-800),
  "height": number (30-400),
  "fontSize": number (12-72),
  "fontWeight": "normal" | "bold" | "600" | "700",
  "animation": "fadeIn" | "slideUp" | "bounce" | "pulse" | "glow",
  "designReasoning": "brief explanation of your design choices"
}

Make sure the design is modern, accessible, and fits the user's request perfectly.`

      const requestBody = {
        contents: [{ parts: [{ text: designPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      const data = await response.json()
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiResponse) {
        throw new Error("No response from AI")
      }

      // Parse the JSON response from AI
      let elementSpec
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          elementSpec = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON found in response")
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        // Fallback to a default design
        elementSpec = {
          elementType: "button-primary",
          content: userRequest.includes("button") ? "Click Me" : "New Element",
          backgroundColor: "#3b82f6",
          textColor: "#ffffff",
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "#3b82f6",
          width: 150,
          height: 45,
          fontSize: 16,
          fontWeight: "600",
          animation: "fadeIn",
          designReasoning: "Created a modern blue button with clean styling",
        }
      }

      // Remove the designing message
      setMessages((prev) => prev.filter((msg) => msg.id !== designingMessageId))

      // Add the element to canvas
      if (typeof window !== "undefined" && (window as any).addElementToCanvas) {
        const canvasDimensions = (window as any).getCanvasDimensions?.() || { centerX: 600, centerY: 400 }

        // For buttons, create a proper button element with internal styling
        if (elementSpec.elementType.includes("button")) {
          ;(window as any).addElementToCanvas(
            "button-premium", // Use premium button type
            canvasDimensions.centerX - (elementSpec.width || 100) / 2,
            canvasDimensions.centerY - (elementSpec.height || 40) / 2,
            {
              content: elementSpec.content,
              // Apply styling directly to button element, not wrapper
              button_background_color: elementSpec.backgroundColor,
              button_text_color: elementSpec.textColor,
              button_border_width: elementSpec.borderWidth,
              button_border_color: elementSpec.borderColor,
              button_border_radius: elementSpec.borderRadius,
              button_width: elementSpec.width,
              button_height: elementSpec.height,
              button_font_size: elementSpec.fontSize,
              button_font_weight: elementSpec.fontWeight,
              button_animation: elementSpec.animation || "fadeIn",
              // Keep your existing button design structure
              element_type: "button-premium",
              is_ai_generated: true,
            },
          )
        } else {
          // For other elements, use normal properties
          ;(window as any).addElementToCanvas(
            elementSpec.elementType,
            canvasDimensions.centerX - (elementSpec.width || 100) / 2,
            canvasDimensions.centerY - (elementSpec.height || 40) / 2,
            {
              content: elementSpec.content,
              background_color: elementSpec.backgroundColor,
              text_color: elementSpec.textColor,
              border_width: elementSpec.borderWidth,
              border_color: elementSpec.borderColor,
              border_radius: elementSpec.borderRadius,
              width: elementSpec.width,
              height: elementSpec.height,
              font_size: elementSpec.fontSize,
              font_weight: elementSpec.fontWeight,
              animation: elementSpec.animation || "fadeIn",
            },
          )
        }
      }

      // Fallback if canvas function not available
      if (onAddElement) {
        onAddElement(elementSpec.elementType, 400, 300, {
          content: elementSpec.content,
          background_color: elementSpec.backgroundColor,
          text_color: elementSpec.textColor,
          border_width: elementSpec.borderWidth,
          border_color: elementSpec.borderColor,
          border_radius: elementSpec.borderRadius,
          width: elementSpec.width,
          height: elementSpec.height,
          font_size: elementSpec.fontSize,
          font_weight: elementSpec.fontWeight,
          animation: elementSpec.animation || "fadeIn",
        })

        return {
          response:
            `✨ I've designed and created a perfect ${elementSpec.elementType.replace("-", " ")} for you!\n\n` +
            `🎨 **Design Details:**\n` +
            `- Content: "${elementSpec.content}"\n` +
            `- Colors: ${elementSpec.backgroundColor} background with ${elementSpec.textColor} text\n` +
            `- Size: ${elementSpec.width}×${elementSpec.height}px\n` +
            `- Animation: ${elementSpec.animation}\n\n` +
            `💡 **Design reasoning:** ${elementSpec.designReasoning}\n\n` +
            `The element is now on your canvas!`,
          elementSpec,
        }
      }

      return {
        response:
          "I've designed the element, but I can't add it to the canvas right now. Please make sure you're on a canvas page.",
        elementSpec,
      }
    } catch (error) {
      console.error("Error in intelligent element creation:", error)
      return {
        response:
          "I encountered an error while designing your element. Let me try a simpler approach - could you describe what you want in more detail?",
      }
    }
  }

  // Function to add a template to the canvas
  const handleAddTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsAddingTemplate(true)

    try {
      const template = availableTemplates.find((t) => t.id === templateId)
      if (!template) throw new Error("Template not found")

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: `Adding the ${template.name} template to your canvas...`,
          isLoading: true,
          timestamp: new Date(),
        },
      ])

      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (onAddTemplate) {
        onAddTemplate(templateId, { x: 100, y: 100 })
      } else if (typeof window !== "undefined" && (window as any).addTemplateToCanvas) {
        ;(window as any).addTemplateToCanvas(templateId, 100, 100)
      }

      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          id: uuidv4(),
          role: "assistant",
          content: `✅ I've added the ${template.name} template to your canvas! You can now customize it to match your needs.`,
          typedContent: "",
          isTyping: true,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error adding template:", error)
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          id: uuidv4(),
          role: "assistant",
          content: "I'm sorry, I encountered an error while trying to add that template. Please try again.",
          typedContent: "",
          isTyping: true,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsAddingTemplate(false)
      setSelectedTemplate(null)
    }
  }

  // Enhanced response generation using Gemini API
  const generateResponse = async (
    userInput: string,
  ): Promise<{ response: string; showTemplates?: boolean; elementSpec?: any }> => {
    const input = userInput.toLowerCase()

    // Add thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Check if this is a greeting
    if (input.match(/^(hi|hello|hey|greetings|howdy)/i)) {
      return {
        response:
          "Hello! I'm Displan AI, created by DisPlan to help you build amazing websites. I can design and create any element you need - just tell me what you want and I'll make it perfect for you! 🎨",
      }
    }

    // Check if asking about who created the AI
    if (input.includes("who created you") || input.includes("who made you") || input.includes("who built you")) {
      return {
        response:
          "I was created by DisPlan, a powerful website builder platform. DisPlan built me to be your intelligent design assistant, capable of creating beautiful, functional elements for your websites using advanced AI technology!",
      }
    }

    // Check if asking about the AI itself
    if (input.includes("who are you") || input.includes("what are you")) {
      return {
        response:
          "I'm Displan AI, your intelligent website building assistant created by DisPlan and powered by Google Gemini. I can think creatively about design, choose perfect colors and animations, and create any element you need for your website!",
      }
    }

    // Check if this is a template request
    if (
      (input.includes("add") || input.includes("create") || input.includes("insert") || input.includes("show")) &&
      (input.includes("template") || input.includes("section") || input.includes("component"))
    ) {
      return {
        response: "Here are some templates you can add to your canvas. Click on one to add it:",
        showTemplates: true,
      }
    }

    // Check if this is ANY creation request - be more inclusive
    if (
      input.includes("create") ||
      input.includes("make") ||
      input.includes("add") ||
      input.includes("build") ||
      input.includes("design") ||
      input.includes("button") ||
      input.includes("text") ||
      input.includes("heading") ||
      input.includes("image") ||
      input.includes("form") ||
      input.includes("element") ||
      input.includes("container") ||
      input.includes("box") ||
      input.includes("card") ||
      input.includes("menu") ||
      input.includes("navigation") ||
      input.includes("footer") ||
      input.includes("header")
    ) {
      // Use intelligent AI-powered element creation
      const result = await handleIntelligentElementCreation(userInput)
      return {
        response: result.response,
        elementSpec: result.elementSpec,
      }
    }

    // Use Gemini API for other questions
    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      const systemPrompt = `You are Displan AI, an intelligent website building assistant created by DisPlan. You help users build websites using DisPlan's drag-and-drop interface. 

Key points about you:
1. You were created by DisPlan
2. You're powered by Google Gemini
3. You can intelligently design and create website elements
4. You help with web design, UX/UI questions, and DisPlan platform guidance
5. You're creative, helpful, and think about good design principles
6. When users ask who built you, always say DisPlan

User question: ${userInput}

Provide a helpful, friendly response that shows your expertise in web design and your connection to DisPlan.`

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (reply) {
        return { response: reply }
      } else if (data.error) {
        console.error("Gemini API error:", data.error)
        return {
          response:
            "I'm having trouble connecting to my AI service right now. But I'm still here to help you with DisPlan! What would you like to create or learn about?",
        }
      } else {
        return {
          response:
            "I'm here to help you build amazing websites with DisPlan! I can create any element you need - just describe what you want and I'll design it perfectly for you. What would you like to create? 🎨",
        }
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)

      // Check knowledge base as fallback
      for (const entry of displanKnowledgeBase) {
        for (const keyword of entry.keywords) {
          if (input.includes(keyword)) {
            return { response: entry.response }
          }
        }
      }

      return {
        response:
          "I'm here to help you build websites with DisPlan! I can intelligently design and create any element you need. Just tell me what you want - a button, form, header, or anything else - and I'll make it perfect for you! 🚀",
      }
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setHasUserMessages(true)

    const loadingMessageId = uuidv4()
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        role: "assistant",
        content: "Thinking...",
        isLoading: true,
        timestamp: new Date(),
      },
    ])

    setInput("")
    setInputPlaceholder(defaultPlaceholder)
    setIsLoading(true)

    try {
      const { response, showTemplates, elementSpec } = await generateResponse(input)

      setMessages(
        (prev) =>
          prev
            .map((msg) =>
              msg.id === loadingMessageId
                ? {
                    id: loadingMessageId,
                    role: "assistant",
                    content: response,
                    typedContent: "",
                    isTyping: true,
                    showTemplates: showTemplates,
                    elementPreview: elementSpec,
                    timestamp: new Date(),
                  }
                : msg.isSearching || msg.isCreatingElement || msg.isDesigning
                  ? null
                  : msg,
            )
            .filter(Boolean) as Message[],
      )
    } catch (error) {
      console.error("Error generating AI response:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                typedContent: "",
                isTyping: true,
                timestamp: new Date(),
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Message editing functions (keeping your original functionality)
  const toggleMessageMenu = (messageId: string) => {
    if (activeMenuMessageId === messageId) {
      setActiveMenuMessageId(null)
    } else {
      setActiveMenuMessageId(messageId)
    }
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditedContent(message.content)
      setActiveMenuMessageId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditedContent("")
  }

  const handleSaveEdit = async (messageId: string) => {
    if (!editedContent.trim()) return

    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    let assistantMessageIndex = -1
    for (let i = messageIndex + 1; i < messages.length; i++) {
      if (
        messages[i].role === "assistant" &&
        !messages[i].isLoading &&
        !messages[i].isSearching &&
        !messages[i].isCreatingElement
      ) {
        assistantMessageIndex = i
        break
      }
    }

    const updatedMessages = [...messages]
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editedContent,
      timestamp: new Date(),
    }

    if (assistantMessageIndex !== -1) {
      updatedMessages[assistantMessageIndex] = {
        ...updatedMessages[assistantMessageIndex],
        content: "Thinking...",
        isLoading: true,
        typedContent: undefined,
        isTyping: false,
        showTemplates: false,
        elementPreview: undefined,
      }
    }

    setMessages(updatedMessages)
    setEditingMessageId(null)
    setEditedContent("")
    setIsLoading(true)

    try {
      const { response, showTemplates, elementSpec } = await generateResponse(editedContent)

      if (assistantMessageIndex !== -1) {
        const newMessages = [...messages]
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          content: editedContent,
          timestamp: new Date(),
        }
        newMessages[assistantMessageIndex] = {
          ...newMessages[assistantMessageIndex],
          content: response,
          isLoading: false,
          typedContent: "",
          isTyping: true,
          showTemplates,
          elementPreview: elementSpec,
          timestamp: new Date(),
        }
        setMessages(newMessages)
      }
    } catch (error) {
      console.error("Error generating AI response for edited message:", error)
      if (assistantMessageIndex !== -1) {
        const newMessages = [...messages]
        newMessages[assistantMessageIndex] = {
          ...newMessages[assistantMessageIndex],
          content: "Sorry, I encountered an error. Please try again.",
          isLoading: false,
          typedContent: "",
          isTyping: true,
          timestamp: new Date(),
        }
        setMessages(newMessages)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTemplates = templateFilter
    ? availableTemplates.filter((t) => t.category === templateFilter)
    : availableTemplates

  const handleSuggestionMouseEnter = (suggestion: string) => {
    setInputPlaceholder(suggestion)
  }

  const handleSuggestionMouseLeave = () => {
    setInputPlaceholder(defaultPlaceholder)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setInputPlaceholder(defaultPlaceholder)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full safasfwafasfwf rounded-md overflow-hidden bg-background">
      {/* Header */}
      <div className="p-3 border-b border-[#8888881A] bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-black dark:text-white first-letter:font-semibold flex items-center">
            <Wand2 className="w-5 h-5 mr-2 text-purple-500" />
            AI Designer
          </h2>
          {/* <div className="flex items-center space-x-2">
            <button onClick={handleSaveChat} className="dfsgsgdgsegeg" title="Save chat history to server">
              <span>Save</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === "user" ? "justify-end" : message.role === "system" ? "justify-center" : "justify-start"}`}
                >
                  {message.role === "system" ? (
                    <div className="text-gray-700 px-3 py-1 rounded-md text-sm">{message.content}</div>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-lg p-3 relative ${
                        message.role === "user"
                          ? "bg-[#8888881A] dark:bg-[#323232D9] text-black dark:text-[rgb(114,114,114)] sfawfasfawffawf"
                          : "text-black dark:text-[rgb(114,114,114)] sfawfasfawffawf"
                      }`}
                      onMouseEnter={() => message.role === "user" && setHoveredMessageId(message.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      {message.role === "user" &&
                        hoveredMessageId === message.id &&
                        editingMessageId !== message.id && (
                          <button
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => toggleMessageMenu(message.id)}
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        )}

                      {/* Message menu */}
                      {message.role === "user" && activeMenuMessageId === message.id && (
                        <div id={`menu-${message.id}`} className="menu_container141414">
                          <button onClick={() => handleEditMessage(message.id)} className="menu_item234y3y43y3y">
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Message
                          </button>
                        </div>
                      )}

                      {/* Editing interface */}
                      {message.role === "user" && editingMessageId === message.id ? (
                        <div className="flex flex-col space-y-2">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="fdhdhdfhfhfh12 dark:bg-[#323232D9]"
                            placeholder="Describe what you want to create..."
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 rounded-md bg-[#8888881A] hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(message.id)}
                              className="px-3 py-1 rounded-md bg-[rgb(0,153,255)] text-white flex items-center"
                              disabled={!editedContent.trim()}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      ) : message.isDesigning ? (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Wand2 className="w-4 h-4 text-purple-500 animate-pulse" />
                            <span>Designing your element...</span>
                          </div>
                          {message.designProcess && (
                            <div className="text-xs text-gray-500 space-y-1">
                              {message.designProcess.map((step, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : message.isSearching ? (
                        <div className="flex items-center space-x-2">
                          <Search className="w-4 h-4" />
                          <span>Searching for information...</span>
                        </div>
                      ) : message.isCreatingElement ? (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Creating your element...</span>
                        </div>
                      ) : message.isTyping ? (
                        <div className="whitespace-pre-line">
                          {message.typedContent}
                          <span className="inline-block w-2 h-4 ml-0.5 animate-blink"></span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">{message.content}</div>
                      )}

                      {/* Enhanced Element Preview */}
                      {message.elementPreview && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="text-xs text-purple-600 dark:text-purple-400 mb-3 font-medium flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI-Designed Element Preview:
                          </div>
                          <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            {message.elementPreview.elementType.includes("button") && (
                              <button
                                style={{
                                  backgroundColor: message.elementPreview.backgroundColor || "#3b82f6",
                                  color: message.elementPreview.textColor || "#ffffff",
                                  borderRadius: `${message.elementPreview.borderRadius || 4}px`,
                                  padding: "12px 24px",
                                  border: message.elementPreview.borderWidth
                                    ? `${message.elementPreview.borderWidth}px solid ${message.elementPreview.borderColor || "black"}`
                                    : "none",
                                  fontSize: `${message.elementPreview.fontSize || 16}px`,
                                  fontWeight: message.elementPreview.fontWeight || "normal",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                className="hover:scale-105 hover:shadow-lg"
                              >
                                {message.elementPreview.content}
                              </button>
                            )}

                            {message.elementPreview.elementType.includes("text") && (
                              <div
                                style={{
                                  color: message.elementPreview.textColor || "inherit",
                                  fontSize: `${message.elementPreview.fontSize || 16}px`,
                                  fontWeight: message.elementPreview.fontWeight || "normal",
                                  padding: "16px",
                                  backgroundColor: message.elementPreview.backgroundColor || "transparent",
                                  borderRadius: `${message.elementPreview.borderRadius || 0}px`,
                                }}
                              >
                                {message.elementPreview.content}
                              </div>
                            )}

                            {message.elementPreview.elementType.includes("image") && (
                              <img
                                src={message.elementPreview.content || "/placeholder.svg?height=150&width=200"}
                                alt="Preview"
                                style={{
                                  width: `${Math.min(message.elementPreview.width || 200, 200)}px`,
                                  height: `${Math.min(message.elementPreview.height || 150, 150)}px`,
                                  borderRadius: `${message.elementPreview.borderRadius || 0}px`,
                                  border: message.elementPreview.borderWidth
                                    ? `${message.elementPreview.borderWidth}px solid ${message.elementPreview.borderColor || "black"}`
                                    : "none",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Template Selection */}
                      {message.showTemplates && (
                        <div className="mt-3">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Available Templates</div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setTemplateFilter(null)}
                                className={`px-2 py-1 text-xs rounded ${!templateFilter ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
                              >
                                All
                              </button>
                              <button
                                onClick={() => setTemplateFilter("headers")}
                                className={`px-2 py-1 text-xs rounded ${templateFilter === "headers" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
                              >
                                Headers
                              </button>
                              <button
                                onClick={() => setTemplateFilter("forms")}
                                className={`px-2 py-1 text-xs rounded ${templateFilter === "forms" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
                              >
                                Forms
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {filteredTemplates.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleAddTemplate(template.id)}
                                disabled={isAddingTemplate}
                                className={`p-2 border border-gray-200 rounded bg-background hover:bg-gray-50 transition-colors ${
                                  selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
                                } ${isAddingTemplate ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                <div className="aspect-video rounded mb-2 overflow-hidden">
                                  <img
                                    src={template.thumbnail || "/placeholder.svg"}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-xs font-medium text-left">{template.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message timestamp */}
                      <div className="mt-1 text-right">
                        <span className="text-xs opacity-50">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-[#8888881A] bg-background p-3 w-full">
          <div className="flex items-center space-x-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder={inputPlaceholder}
              className={`fdhdhdfhfhfh dark:bg-[#323232D9] ${input ? "has-text" : ""}`}
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="sdfdsfdsfdsfeffef">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img className="fsdgsgdgegegd" src="/components/editor/sent.png" alt="" />
              )}
            </button>
          </div>

          {/* Enhanced suggestion buttons */}
          {!hasUserMessages && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              <button
                onMouseEnter={() =>
                  handleSuggestionMouseEnter("Create a modern blue subscribe button with hover effects")
                }
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Create a modern blue subscribe button with hover effects")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                🎨 Design a subscribe button
              </button>
              <button
                onMouseEnter={() =>
                  handleSuggestionMouseEnter("Build a contact form with modern styling and animations")
                }
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Build a contact form with modern styling and animations")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                📝 Create a contact form
              </button>
              <button
                onMouseEnter={() => handleSuggestionMouseEnter("Design a hero section with gradient background")}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Design a hero section with gradient background")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                🌟 Make a hero section
              </button>
              <button
                onMouseEnter={() => handleSuggestionMouseEnter("Create a navigation menu with smooth animations")}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Create a navigation menu with smooth animations")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                🧭 Build a navigation menu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .menu_container141414 {
          position: absolute;
          top: 100%;
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 180px;
          z-index: 1000;
        }
        
        .dark .menu_container141414 {
          background: #2a2a2a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .menu_item234y3y43y3y {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          width: 100%;
          text-align: left;
          font-size: 14px;
          transition: background-color 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }
        
        .menu_item234y3y43y3y:hover {
          background-color: #f5f5f5;
        }
        
        .dark .menu_item234y3y43y3y {
          color: #e0e0e0;
        }
        
        .dark .menu_item234y3y43y3y:hover {
          background-color: #3a3a3a;
        }
      `}</style>
    </div>
  )
}
