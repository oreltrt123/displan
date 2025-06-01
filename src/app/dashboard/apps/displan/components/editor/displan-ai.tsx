"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Search, Loader2, Code, Sparkles, Zap } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { displanKnowledgeBase } from "./ai-knowledge-base"
import { parseElementRequest, createElementFromRequest } from "./element-creator"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  isLoading?: boolean
  isSearching?: boolean
  isCreatingElement?: boolean
}

interface DisplanAIProps {
  onAddElement?: (elementType: string, x: number, y: number, properties: any) => void
  projectId?: string
}

export function DisplanAI({ onAddElement, projectId }: DisplanAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Displan AI, your website building assistant. I can help you create elements, answer questions about web design, or assist with any other website building tasks. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
  const handleElementCreation = async (request: string): Promise<string> => {
    try {
      console.log("Processing element creation request:", request)

      // Parse the natural language request
      const elementRequest = parseElementRequest(request)
      console.log("Parsed element request:", elementRequest)

      if (!elementRequest) {
        return "I'm sorry, I couldn't understand what kind of element you want to create. Could you provide more details about the element type, style, and content?"
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

        return (
          `I've created a ${elementSpec.elementType.replace("button-", "").replace("text-", "")} element for you with the following properties:\n\n` +
          `- Content: "${elementSpec.content}"\n` +
          `- Background: ${elementSpec.backgroundColor || "transparent"}\n` +
          `- Text color: ${elementSpec.textColor || "default"}\n` +
          `${elementSpec.borderWidth ? `- Border: ${elementSpec.borderWidth}px ${elementSpec.borderColor || "black"}\n` : ""}` +
          `${elementSpec.borderRadius ? `- Border radius: ${elementSpec.borderRadius}px\n` : ""}` +
          `${elementSpec.width ? `- Width: ${elementSpec.width}px\n` : ""}` +
          `${elementSpec.height ? `- Height: ${elementSpec.height}px\n` : ""}` +
          `\nYou can now see it on your canvas and modify its properties as needed.`
        )
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

        return (
          `I've created a ${elementSpec.elementType.replace("button-", "").replace("text-", "")} element for you with the following properties:\n\n` +
          `- Content: "${elementSpec.content}"\n` +
          `- Background: ${elementSpec.backgroundColor || "transparent"}\n` +
          `- Text color: ${elementSpec.textColor || "default"}\n` +
          `${elementSpec.borderWidth ? `- Border: ${elementSpec.borderWidth}px ${elementSpec.borderColor || "black"}\n` : ""}` +
          `${elementSpec.borderRadius ? `- Border radius: ${elementSpec.borderRadius}px\n` : ""}` +
          `${elementSpec.width ? `- Width: ${elementSpec.width}px\n` : ""}` +
          `${elementSpec.height ? `- Height: ${elementSpec.height}px\n` : ""}` +
          `\nYou can now see it on your canvas and modify its properties as needed.`
        )
      }

      return "I've created the element specification, but I can't add it to the canvas because the canvas connection is not available. Please make sure you're on a canvas page."
    } catch (error) {
      console.error("Error creating element:", error)
      return "I'm sorry, I encountered an error while trying to create that element. Could you try again with a simpler description?"
    }
  }

  // Function to generate response based on user input
  const generateResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase()

    // Check if this is a greeting
    if (input.match(/^(hi|hello|hey|greetings|howdy)/i)) {
      return "Hello! I'm Displan AI, your website building assistant. How can I help you today?"
    }

    // Check if asking about who created the AI
    if (input.includes("who created you") || input.includes("who made you") || input.includes("who built you")) {
      return "I was created by Displan, a powerful website builder platform that helps users create professional websites with an intuitive drag-and-drop interface."
    }

    // Check if asking about the AI itself
    if (input.includes("who are you") || input.includes("what are you")) {
      return "I'm Displan AI, the custom AI assistant for the Displan website builder. I'm designed to help you create amazing websites by answering your questions and providing guidance on using our platform."
    }

    // Check if this is an element creation request
    if (
      (input.includes("add") || input.includes("create") || input.includes("insert") || input.includes("make")) &&
      (input.includes("button") ||
        input.includes("text") ||
        input.includes("heading") ||
        input.includes("image") ||
        input.includes("element") ||
        input.includes("component") ||
        input.includes("container"))
    ) {
      // Add a message indicating we're creating an element
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "Creating your element...",
          isCreatingElement: true,
        },
      ])

      const response = await handleElementCreation(userInput)
      return response
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
        },
      ])

      const searchResult = await searchWeb(userInput)
      return searchResult
    }

    // Check knowledge base for relevant information
    for (const entry of displanKnowledgeBase) {
      for (const keyword of entry.keywords) {
        if (input.includes(keyword)) {
          return entry.response
        }
      }
    }

    // Default response
    return "I'm here to help you build websites with Displan. You can ask me questions about web design, request me to create elements for your canvas, or get help with specific features. What would you like to know or create?"
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { id: uuidv4(), role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])

    // Add loading message
    const loadingMessageId = uuidv4()
    setMessages((prev) => [
      ...prev,
      { id: loadingMessageId, role: "assistant", content: "Thinking...", isLoading: true },
    ])

    setInput("")
    setIsLoading(true)

    try {
      // Generate response
      const responseText = await generateResponse(input)

      // Replace loading message with actual response
      setMessages(
        (prev) =>
          prev
            .map((msg) =>
              msg.id === loadingMessageId
                ? { id: loadingMessageId, role: "assistant", content: responseText }
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
            ? { id: loadingMessageId, role: "assistant", content: "Sorry, I encountered an error. Please try again." }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-gray-900 text-white ml-auto"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
            >
              {message.isLoading ? (
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
              ) : (
                <div className="whitespace-pre-line">{message.content}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about website building or request an element..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Ask me to create elements</span>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-3 h-3" />
            <span>Ask complex questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="w-3 h-3" />
            <span>Get design help</span>
          </div>
        </div>
      </div>
    </div>
  )
}
