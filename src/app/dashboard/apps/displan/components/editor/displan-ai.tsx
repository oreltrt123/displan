"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2, Sparkles, Settings, MoreHorizontal, Check, X, FileText } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { displanKnowledgeBase } from "./ai-knowledge-base"
import { parseElementRequest, createElementFromRequest } from "./element-creator"
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
  isTyping?: boolean
  typedContent?: string
  timestamp: Date
  showTemplates?: boolean
  elementPreview?: any
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

export function DisplanAI({ onAddElement, onAddTemplate, projectId }: DisplanAIProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [inputPlaceholder, setInputPlaceholder] = useState("Describe your website idea or the feature you need.")
  const [isLoading, setIsLoading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isAddingTemplate, setIsAddingTemplate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingSpeed = useRef(30) // Base typing speed in ms
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [templateFilter, setTemplateFilter] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const defaultPlaceholder = "Describe your website idea or the feature you need."

  // New state for message actions
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

        // Check if there are any user messages
        const userMsgs = parsedMessages.filter((msg) => msg.role === "user")
        setHasUserMessages(userMsgs.length > 0)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
        // If there's an error, start with the welcome message
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content:
              "Hi! I'm Displan AI, your website building assistant. I can help you create elements, answer questions about web design, or assist with any other website building tasks. How can I help you today?",
            typedContent:
              "Hi! I'm Displan AI, your website building assistant. I can help you create elements, answer questions about web design, or assist with any other website building tasks. How can I help you today?",
            timestamp: new Date(),
          },
        ])
        setHasUserMessages(false)
      }
    } else {
      // If no saved messages, start with the welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi! I'm Displan AI, your website building assistant. I can help you create elements, answer questions about web design, or assist with any other website building tasks. How can I help you today?",
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
        // Vary typing speed slightly for more natural effect
        const variance = Math.random() * 30 - 15 // -15 to +15ms variance
        typingSpeed.current = Math.max(10, Math.min(50, typingSpeed.current + variance))

        // Type next character
        const nextChar = fullContent.charAt(typedContent.length)
        const newTypedContent = typedContent + nextChar

        // Add slight pause after punctuation
        if ([".", "!", "?", ",", ":"].includes(nextChar)) {
          typingSpeed.current = 100 + Math.random() * 200
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === currentMessage.id ? { ...m, typedContent: newTypedContent } : m)),
        )
      }, typingSpeed.current)

      return () => clearTimeout(timeoutId)
    } else {
      // Finished typing this message
      setMessages((prev) => prev.map((m) => (m.id === currentMessage.id ? { ...m, isTyping: false } : m)))
    }
  }, [messages])

  // Scroll to bottom when new messages are added or when typing
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

  // Navigate to AI settings page
  const handleOpenSettings = () => {
    router.push("/dashboard/apps/displan/settings/ai")
  }

  // Save chat to server
  const handleSaveChat = async () => {
    try {
      // Show saving message
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

      // Simulate API call to save chat
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update with success message
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

      // Remove success message after a few seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== savingMessageId))
      }, 3000)
    } catch (error) {
      console.error("Error saving chat:", error)

      // Show error message
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

  // Function to search the web for information
  const searchWeb = async (query: string): Promise<string> => {
    // This is a simulated web search function that doesn't use external APIs
    // In a real implementation, you might use a server-side API or a proxy

    console.log("Searching web for:", query)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For website building related queries, return relevant information
    if (query.includes("responsive design") || query.includes("mobile friendly")) {
      return "Responsive design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes. Key principles include flexible grids and layouts, images that adjust within their containing elements, and media queries in CSS. In Displan, you can create responsive designs by using relative units, flexible layouts, and testing your site at different viewport sizes."
    }

    if (query.includes("seo") || query.includes("search engine optimization")) {
      return "Search Engine Optimization (SEO) involves optimizing your website to rank higher in search engine results. Key practices include using semantic HTML, adding proper meta tags, creating quality content, optimizing images with alt text, ensuring fast loading times, and building a mobile-friendly site. In Displan, you can improve SEO by using proper heading structures, adding meta descriptions, and optimizing your content."
    }

    if (query.includes("color scheme") || query.includes("color palette")) {
      return "Effective color schemes are crucial for website design. Popular approaches include monochromatic (variations of one color), analogous (colors adjacent on the color wheel), complementary (opposite colors on the wheel), and triadic (three evenly spaced colors). When choosing colors, consider your brand identity, target audience, and accessibility (contrast for readability). Tools like Adobe Color, Coolors, and Colormind can help generate harmonious palettes."
    }

    if (query.includes("typography") || query.includes("fonts")) {
      return "Web typography best practices include: 1) Limit font families to 2-3 per site, 2) Ensure readability with proper sizing (16px minimum for body text), 3) Maintain sufficient line height (1.5-2x font size), 4) Create clear hierarchy with different sizes and weights, 5) Ensure contrast between text and background, 6) Use web-safe fonts or properly implemented web fonts, 7) Consider responsive adjustments for different screen sizes."
    }

    // Generic response for other queries
    return (
      "Based on the latest web information, " +
      query +
      " is an important consideration in modern web development. Best practices include focusing on user experience, ensuring accessibility, optimizing for performance, and following industry standards. For specific implementation details, you might want to consult the latest documentation or tutorials from reputable web development resources."
    )
  }

  // Function to handle element creation requests
  const handleElementCreation = async (request: string): Promise<{ response: string; elementSpec?: any }> => {
    try {
      console.log("Processing element creation request:", request)

      // Parse the natural language request
      const elementRequest = parseElementRequest(request)
      console.log("Parsed element request:", elementRequest)

      if (!elementRequest) {
        return {
          response:
            "I'm sorry, I couldn't understand what kind of element you want to create. Could you provide more details about the element type, style, and content?",
        }
      }

      // Create the element specification
      const elementSpec = createElementFromRequest(elementRequest)
      console.log("Created element specification:", elementSpec)

      // Try to add element using the canvas function if available
      if (typeof window !== "undefined" && (window as any).addElementToCanvas) {
        const canvasDimensions = (window as any).getCanvasDimensions?.() || { centerX: 600, centerY: 400 }

        // Add the element to the canvas using the global function
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

        return {
          response:
            `✅ I've created a ${elementSpec.elementType.replace("button-", "").replace("text-", "")} element for you with the following properties:\n\n` +
            `- Content: "${elementSpec.content}"\n` +
            `- Background: ${elementSpec.backgroundColor || "transparent"}\n` +
            `- Text color: ${elementSpec.textColor || "default"}\n` +
            `${elementSpec.borderWidth ? `- Border: ${elementSpec.borderWidth}px ${elementSpec.borderColor || "black"}\n` : ""}` +
            `${elementSpec.borderRadius ? `- Border radius: ${elementSpec.borderRadius}px\n` : ""}` +
            `${elementSpec.width ? `- Width: ${elementSpec.width}px\n` : ""}` +
            `${elementSpec.height ? `- Height: ${elementSpec.height}px\n` : ""}` +
            `\nYou can now see it on your canvas and modify its properties as needed.`,
          elementSpec,
        }
      }

      // Fallback to the onAddElement prop if canvas function is not available
      if (onAddElement) {
        // Default position in the center of the canvas
        const x = 400
        const y = 300

        // Add the element to the canvas
        onAddElement(elementSpec.elementType, x, y, {
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
            `✅ I've created a ${elementSpec.elementType.replace("button-", "").replace("text-", "")} element for you with the following properties:\n\n` +
            `- Content: "${elementSpec.content}"\n` +
            `- Background: ${elementSpec.backgroundColor || "transparent"}\n` +
            `- Text color: ${elementSpec.textColor || "default"}\n` +
            `${elementSpec.borderWidth ? `- Border: ${elementSpec.borderWidth}px ${elementSpec.borderColor || "black"}\n` : ""}` +
            `${elementSpec.borderRadius ? `- Border radius: ${elementSpec.borderRadius}px\n` : ""}` +
            `${elementSpec.width ? `- Width: ${elementSpec.width}px\n` : ""}` +
            `${elementSpec.height ? `- Height: ${elementSpec.height}px\n` : ""}` +
            `\nYou can now see it on your canvas and modify its properties as needed.`,
          elementSpec,
        }
      }

      return {
        response:
          "I've created the element specification, but I can't add it to the canvas because the canvas connection is not available. Please make sure you're on a canvas page.",
        elementSpec,
      }
    } catch (error) {
      console.error("Error creating element:", error)
      return {
        response:
          "I'm sorry, I encountered an error while trying to create that element. Could you try again with a simpler description?",
      }
    }
  }

  // Function to handle template requests
  const handleTemplateRequest = async (request: string): Promise<string> => {
    // Add a message showing available templates
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        role: "assistant",
        content: "Here are some templates you can add to your canvas. Click on one to add it:",
        showTemplates: true,
        typedContent: "",
        isTyping: true,
        timestamp: new Date(),
      },
    ])

    return "I've shown you some templates you can add to your canvas. Click on one to add it."
  }

  // Function to add a template to the canvas
  const handleAddTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsAddingTemplate(true)

    try {
      // Find the template
      const template = availableTemplates.find((t) => t.id === templateId)

      if (!template) {
        throw new Error("Template not found")
      }

      // Add loading message
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

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add template to canvas
      if (onAddTemplate) {
        onAddTemplate(templateId, { x: 100, y: 100 })
      } else if (typeof window !== "undefined" && (window as any).addTemplateToCanvas) {
        ;(window as any).addTemplateToCanvas(templateId, 100, 100)
      }

      // Add success message
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

      // Add error message
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

  // Function to generate response based on user input
  const generateResponse = async (
    userInput: string,
  ): Promise<{ response: string; showTemplates?: boolean; elementSpec?: any }> => {
    const input = userInput.toLowerCase()

    // Add 1-2 second thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Check if this is a greeting
    if (input.match(/^(hi|hello|hey|greetings|howdy)/i)) {
      return { response: "Hello! I'm Displan AI, your website building assistant. How can I help you today?" }
    }

    // Check if asking about who created the AI
    if (input.includes("who created you") || input.includes("who made you") || input.includes("who built you")) {
      return {
        response:
          "I was created by Displan, a powerful website builder platform that helps users create professional websites with an intuitive drag-and-drop interface.",
      }
    }

    // Check if asking about the AI itself
    if (input.includes("who are you") || input.includes("what are you")) {
      return {
        response:
          "I'm Displan AI, the custom AI assistant for the Displan website builder. I'm designed to help you create amazing websites by answering your questions and providing guidance on using our platform.",
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

    // Check if this is an element creation request
    if (
      (input.includes("add") || input.includes("create") || input.includes("insert") || input.includes("make")) &&
      (input.includes("button") ||
        input.includes("text") ||
        input.includes("heading") ||
        input.includes("image") ||
        input.includes("element") ||
        input.includes("container") ||
        input.includes("contact") ||
        input.includes("form") ||
        input.includes("input"))
    ) {
      // Add a message indicating we're creating an element
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "Creating your element...",
          isCreatingElement: true,
          timestamp: new Date(),
        },
      ])

      const result = await handleElementCreation(userInput)
      return {
        response: result.response,
        elementSpec: result.elementSpec,
      }
    }

    // Check if this is a complex question that might need web search
    const isComplexQuestion =
      (input.includes("how") ||
        input.includes("what") ||
        input.includes("why") ||
        input.includes("when") ||
        input.includes("where")) &&
      !input.includes("displan") &&
      input.length > 15

    if (isComplexQuestion) {
      // Add a message indicating we're searching
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "Searching for information...",
          isSearching: true,
          timestamp: new Date(),
        },
      ])

      const searchResult = await searchWeb(userInput)
      return { response: searchResult }
    }

    // Check knowledge base for relevant information
    for (const entry of displanKnowledgeBase) {
      for (const keyword of entry.keywords) {
        if (input.includes(keyword)) {
          return { response: entry.response }
        }
      }
    }

    // Default response
    return {
      response:
        "I'm here to help you build websites with Displan. You can ask me questions about web design, request me to create elements for your canvas, or get help with specific features. What would you like to know or create?",
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Set hasUserMessages to true since we now have at least one user message
    setHasUserMessages(true)

    // Add loading message
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
      // Generate response
      const { response, showTemplates, elementSpec } = await generateResponse(input)

      // Replace loading message with actual response
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
                : msg.isSearching || msg.isCreatingElement
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

  // Handle message menu toggle
  const toggleMessageMenu = (messageId: string) => {
    if (activeMenuMessageId === messageId) {
      setActiveMenuMessageId(null)
    } else {
      setActiveMenuMessageId(messageId)
    }
  }

  // Handle edit message
  const handleEditMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditedContent(message.content)
      setActiveMenuMessageId(null)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditedContent("")
  }

  // Handle save edit
  const handleSaveEdit = async (messageId: string) => {
    if (!editedContent.trim()) return

    // Find the message and its index
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    // Find the next assistant message (if any)
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

    // Update the user message
    const updatedMessages = [...messages]
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editedContent,
      timestamp: new Date(),
    }

    // If there's an assistant message after this one, mark it for replacement
    if (assistantMessageIndex !== -1) {
      // Add loading message in place of the assistant message
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

    // Update messages
    setMessages(updatedMessages)
    setEditingMessageId(null)
    setEditedContent("")
    setIsLoading(true)

    try {
      // Generate new response based on edited message
      const { response, showTemplates, elementSpec } = await generateResponse(editedContent)

      // Replace the assistant message with the new response
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

      // Update with error message
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

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Filter templates
  const filteredTemplates = templateFilter
    ? availableTemplates.filter((t) => t.category === templateFilter)
    : availableTemplates

  // Handle suggestion button hover
  const handleSuggestionMouseEnter = (suggestion: string) => {
    setInputPlaceholder(suggestion)
  }

  // Handle suggestion button mouse leave
  const handleSuggestionMouseLeave = () => {
    setInputPlaceholder(defaultPlaceholder)
  }

  // Handle suggestion button click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setInputPlaceholder(defaultPlaceholder)
    // Focus the input field
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full safasfwafasfwf rounded-md overflow-hidden bg-background">
      {/* Header */}
      <div className="p-3 border-b border-[#8888881A] bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-black dark:text-white first-letter:font-semibold">AI Assistant</h2>
          {/* <h2 className="text-lg text-white dark:text-black first-letter:font-semibold">none</h2>
            <img className="sfasfawfasfawfrw42e22 dark:hidden" src="/components/editor/ai_logo.png" alt="" />
            <img className="sfasfawfasfawfrw42e22 hidden dark:block" src="/components/editor/ai_logo_dark.png" alt="" /> */}
          <div className="flex items-center space-x-2">
            <button onClick={handleSaveChat} className="dfsgsgdgsegeg" title="Save chat history to server">
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Messages Area with ScrollArea for proper scrolling */}
        {!isCollapsed && (
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
                              placeholder="No worries—just add your final update."
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

                        {/* Element Preview */}
                        {message.elementPreview && (
                          <div className="mt-3 p-3 bg-background rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-2">Element Preview:</div>
                            <div className="flex items-center justify-center p-4 rounded">
                              {message.elementPreview.elementType.includes("button") && (
                                <button
                                  style={{
                                    backgroundColor: message.elementPreview.backgroundColor || "#3b82f6",
                                    color: message.elementPreview.textColor || "#ffffff",
                                    borderRadius: `${message.elementPreview.borderRadius || 4}px`,
                                    padding: "8px 16px",
                                    border: message.elementPreview.borderWidth
                                      ? `${message.elementPreview.borderWidth}px solid ${message.elementPreview.borderColor || "black"}`
                                      : "none",
                                    fontSize: `${message.elementPreview.fontSize || 16}px`,
                                    fontWeight: message.elementPreview.fontWeight || "normal",
                                  }}
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
                                  }}
                                >
                                  {message.elementPreview.content}
                                </div>
                              )}

                              {message.elementPreview.elementType.includes("image") && (
                                <img
                                  src={message.elementPreview.content || "/placeholder.svg?height=100&width=100"}
                                  alt="Preview"
                                  style={{
                                    width: `${message.elementPreview.width || 100}px`,
                                    height: `${message.elementPreview.height || 100}px`,
                                    borderRadius: `${message.elementPreview.borderRadius || 0}px`,
                                    border: message.elementPreview.borderWidth
                                      ? `${message.elementPreview.borderWidth}px solid ${message.elementPreview.borderColor || "black"}`
                                      : "none",
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
        )}

        {/* Input Area - Fixed at bottom */}
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

          {/* Only show suggestion buttons if there are no user messages yet */}
          {!hasUserMessages && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              <button
                onMouseEnter={() => handleSuggestionMouseEnter("Add a red button that says Subscribe")}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Add a red button that says Subscribe")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                Add a red button
              </button>
              <button
                onMouseEnter={() => handleSuggestionMouseEnter("Create a contact form")}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Create a contact form")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                Create a contact form
              </button>
              <button
                onMouseEnter={() => handleSuggestionMouseEnter("Place a large image at the top of the canvas")}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick("Place a large image at the top of the canvas")}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                Place a large image at the top of the canvas
              </button>
              <button
                onMouseEnter={() => handleSuggestionMouseEnter('Create a new text box that says "Welcome"')}
                onMouseLeave={handleSuggestionMouseLeave}
                onClick={() => handleSuggestionClick('Create a new text box that says "Welcome"')}
                className="asfafafwfsafwf dark:bg-[#323232D9]"
              >
                Create a new text box that says "Welcome"
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for blinking cursor */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        /* Menu styles */
        .menu_container12123_d {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 180px;
        }
        
        .dark .menu_container12123_d {
          background: #2a2a2a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .menu_item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          width: 100%;
          text-align: left;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .menu_item:hover {
          background-color: #f5f5f5;
        }
        
        .dark .menu_item {
          color: #e0e0e0;
        }
        
        .dark .menu_item:hover {
          background-color: #3a3a3a;
        }
      `}</style>
    </div>
  )
}
