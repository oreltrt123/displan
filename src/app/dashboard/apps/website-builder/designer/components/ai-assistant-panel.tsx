"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Sparkles, ImageIcon, Loader2, Lock, AlertCircle, Wand2, Palette, Layout } from "lucide-react"

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

// Website templates
const WEBSITE_TEMPLATES = {
  professional: {
    name: "Professional Business",
    sections: ["navbar", "hero", "features", "testimonials", "pricing", "contact", "footer"],
  },
  portfolio: {
    name: "Creative Portfolio",
    sections: ["navbar", "hero", "projects", "about", "skills", "contact", "footer"],
  },
  ecommerce: {
    name: "E-Commerce Store",
    sections: ["navbar", "hero", "products", "categories", "featured", "newsletter", "footer"],
  },
  blog: {
    name: "Blog/Magazine",
    sections: ["navbar", "featured-posts", "recent-posts", "categories", "subscribe", "footer"],
  },
  landing: {
    name: "Landing Page",
    sections: ["navbar", "hero", "features", "cta", "faq", "footer"],
  },
}

// Color schemes
const COLOR_SCHEMES = {
  blue: {
    primary: "#3b82f6",
    secondary: "#93c5fd",
    accent: "#1d4ed8",
    background: "#f8fafc",
    text: "#1e293b",
  },
  green: {
    primary: "#10b981",
    secondary: "#6ee7b7",
    accent: "#047857",
    background: "#f8fafc",
    text: "#1e293b",
  },
  purple: {
    primary: "#8b5cf6",
    secondary: "#c4b5fd",
    accent: "#6d28d9",
    background: "#f8fafc",
    text: "#1e293b",
  },
  red: {
    primary: "#ef4444",
    secondary: "#fca5a5",
    accent: "#b91c1c",
    background: "#f8fafc",
    text: "#1e293b",
  },
  dark: {
    primary: "#6366f1",
    secondary: "#a5b4fc",
    accent: "#4f46e5",
    background: "#1e293b",
    text: "#f8fafc",
  },
}

export function AIDesignAssistant({ isPremiumUser, onUpgradeClick, onAIGenerate, projectId }: AIAssistantProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI design assistant. I can help you build your website. Just tell me what you need!",
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [localIsPremium, setLocalIsPremium] = useState(isPremiumUser)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
  const [dailyConversationsRemaining, setDailyConversationsRemaining] = useState<number>(FREE_DAILY_CONVERSATION_LIMIT)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showColorSchemes, setShowColorSchemes] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load conversation history from localStorage and check daily limit
  useEffect(() => {
    // Load conversation history
    const savedMessages = localStorage.getItem(`ai-conversation-${projectId}`)
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error("Failed to parse saved messages:", e)
      }
    }

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

    // Check daily limit
    checkDailyLimit()
  }, [projectId, localIsPremium])

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

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      // Only save if there are user messages
      localStorage.setItem(`ai-conversation-${projectId}`, JSON.stringify(messages))
    }
  }, [messages, projectId])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Check if user has reached daily limit
    if (!localIsPremium && dailyConversationsRemaining <= 0) {
      return
    }

    // Check for inappropriate content
    if (containsInappropriateContent(input)) {
      const newMessage: Message = {
        role: "user",
        content: input,
        timestamp: Date.now(),
      }

      const responseMessage: Message = {
        role: "assistant",
        content: "I was taught not to answer such questions. Please ask me something else.",
        timestamp: Date.now(),
      }

      setMessages([...messages, newMessage, responseMessage])
      setInput("")
      return
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Update daily conversation count for free users
      if (!localIsPremium) {
        const today = new Date().toDateString()
        const conversationData = localStorage.getItem(`ai-conversation-limit-${projectId}`)

        if (conversationData) {
          try {
            const data = JSON.parse(conversationData)
            const newCount = data.date === today ? data.count + 1 : 1

            localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: newCount }))

            setDailyConversationsRemaining(Math.max(0, FREE_DAILY_CONVERSATION_LIMIT - newCount))
          } catch (e) {
            console.error("Failed to update conversation limit:", e)
          }
        }
      }

      // Simulate a brief delay for the "thinking" state
      setTimeout(() => {
        // Process the user's message and generate a response
        const { responseText, elements } = processUserMessage(input)

        // Add assistant response
        const assistantMessage: Message = {
          role: "assistant",
          content: responseText,
          timestamp: Date.now(),
          elements: elements.length > 0 ? elements : undefined,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)

        // If elements were generated, add them to the canvas
        if (elements.length > 0) {
          onAIGenerate(elements)
        }
      }, 1500) // Simulate a 1.5-second delay for "thinking"
    } catch (error) {
      console.error("Error processing message:", error)

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  // Process user message and generate a response
  const processUserMessage = (message: string): { responseText: string; elements: any[] } => {
    const lowerMessage = message.toLowerCase()
    let responseText = ""
    let elements: any[] = []

    // Check for who created you
    if (lowerMessage.includes("who created you") || lowerMessage.includes("who made you")) {
      responseText = "I was created by DisPlan."
    }
    // Check for website template requests
    else if (
      (lowerMessage.includes("website") || lowerMessage.includes("site")) &&
      (lowerMessage.includes("build") ||
        lowerMessage.includes("create") ||
        lowerMessage.includes("make") ||
        lowerMessage.includes("design"))
    ) {
      // Check for specific website types
      const websiteType = getWebsiteType(lowerMessage)
      const colorScheme = getColorScheme(lowerMessage)

      if (websiteType) {
        // Generate a complete website based on the template
        const { elements: websiteElements, sections } = generateWebsite(websiteType, colorScheme)
        elements = websiteElements

        responseText = `I've created a ${WEBSITE_TEMPLATES[websiteType].name} website for you with the following sections: ${sections.join(
          ", ",
        )}. Feel free to ask me to modify any section or add more elements!`
      } else {
        responseText =
          "I'd be happy to build a website for you! What kind of website would you like? For example, I can create a professional business site, portfolio, e-commerce store, blog, or landing page."
      }
    }
    // Check for section requests
    else if (
      lowerMessage.includes("section") &&
      (lowerMessage.includes("add") ||
        lowerMessage.includes("create") ||
        lowerMessage.includes("build") ||
        lowerMessage.includes("make"))
    ) {
      const sectionType = getSectionType(lowerMessage)
      const colorScheme = getColorScheme(lowerMessage)

      if (sectionType) {
        // Generate a section
        elements = generateSection(sectionType, colorScheme)
        responseText = `I've added a ${sectionType} section to your website. Let me know if you'd like to make any changes!`
      } else {
        responseText =
          "I can create various sections for your website like hero, navbar, features, testimonials, pricing, contact, footer, and more. Which section would you like me to add?"
      }
    }
    // Check for build/create element requests
    else if (
      lowerMessage.includes("build") ||
      lowerMessage.includes("create") ||
      lowerMessage.includes("add") ||
      lowerMessage.includes("make")
    ) {
      // Parse the request to determine what elements to create
      const elementTypes = parseElementRequest(message)

      if (elementTypes.length > 0) {
        // Generate elements based on the parsed request
        elements = generateElements(elementTypes, message)

        // Generate a response based on what was created
        if (elements.length === 1) {
          responseText = `I've added a ${elements[0].type} to the canvas for you.`
        } else if (elements.length > 1) {
          responseText = `I've added ${elements.length} elements to the canvas for you.`
        } else {
          responseText = "I'm not sure what elements you want me to create. Could you be more specific?"
        }
      } else {
        responseText =
          "I'm not sure what you want me to build. Could you be more specific? For example, 'Build me a button' or 'Create a search bar'."
      }
    }
    // Handle greetings
    else if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage === "yo"
    ) {
      responseText = "Hello! How can I help you build your website today?"
    }
    // Handle thank you
    else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      responseText = "You're welcome! Let me know if you need anything else for your website."
    }
    // Handle questions about capabilities
    else if (lowerMessage.includes("what can you do") || lowerMessage.includes("help me")) {
      responseText =
        "I can help you build your website by creating complete websites, individual sections, or specific elements. I can create professional business sites, portfolios, e-commerce stores, blogs, and landing pages. I can also add individual elements like buttons, headings, paragraphs, images, input fields, and search bars. Just tell me what you need!"
    }
    // Default response
    else {
      responseText =
        "I'm here to help you build your website. I can create complete websites, individual sections, or specific elements. What would you like me to help you with today?"
    }

    return { responseText, elements }
  }

  // Get website type from message
  const getWebsiteType = (message: string): keyof typeof WEBSITE_TEMPLATES | null => {
    if (message.includes("professional") || message.includes("business") || message.includes("company")) {
      return "professional"
    } else if (message.includes("portfolio") || message.includes("creative") || message.includes("artist")) {
      return "portfolio"
    } else if (
      message.includes("ecommerce") ||
      message.includes("e-commerce") ||
      message.includes("shop") ||
      message.includes("store")
    ) {
      return "ecommerce"
    } else if (message.includes("blog") || message.includes("magazine") || message.includes("news")) {
      return "blog"
    } else if (message.includes("landing") || message.includes("sales")) {
      return "landing"
    }
    return null
  }

  // Get color scheme from message
  const getColorScheme = (message: string): keyof typeof COLOR_SCHEMES => {
    if (message.includes("blue")) {
      return "blue"
    } else if (message.includes("green")) {
      return "green"
    } else if (message.includes("purple")) {
      return "purple"
    } else if (message.includes("red")) {
      return "red"
    } else if (message.includes("dark")) {
      return "dark"
    }
    // Default to blue
    return "blue"
  }

  // Get section type from message
  const getSectionType = (message: string): string | null => {
    if (message.includes("hero") || message.includes("banner") || message.includes("header")) {
      return "hero"
    } else if (message.includes("navbar") || message.includes("navigation") || message.includes("menu")) {
      return "navbar"
    } else if (message.includes("feature") || message.includes("services")) {
      return "features"
    } else if (message.includes("testimonial") || message.includes("review")) {
      return "testimonials"
    } else if (message.includes("pricing") || message.includes("plans") || message.includes("packages")) {
      return "pricing"
    } else if (message.includes("contact") || message.includes("get in touch")) {
      return "contact"
    } else if (message.includes("footer")) {
      return "footer"
    } else if (message.includes("about")) {
      return "about"
    } else if (message.includes("faq") || message.includes("frequently asked")) {
      return "faq"
    } else if (message.includes("cta") || message.includes("call to action")) {
      return "cta"
    }
    return null
  }

  // Generate a complete website
  const generateWebsite = (
    type: keyof typeof WEBSITE_TEMPLATES,
    colorScheme: keyof typeof COLOR_SCHEMES = "blue",
  ): { elements: any[]; sections: string[] } => {
    const template = WEBSITE_TEMPLATES[type]
    const colors = COLOR_SCHEMES[colorScheme]
    const elements: any[] = []
    const sections: string[] = []

    // Generate each section in the template
    let yOffset = 20
    template.sections.forEach((section) => {
      const sectionElements = generateSection(section, colorScheme, yOffset)
      elements.push(...sectionElements)
      sections.push(section)

      // Update yOffset for the next section
      yOffset += 300 // Approximate height of a section
    })

    return { elements, sections }
  }

  // Generate a section
  const generateSection = (
    sectionType: string,
    colorScheme: keyof typeof COLOR_SCHEMES = "blue",
    yOffset = 20,
  ): any[] => {
    const colors = COLOR_SCHEMES[colorScheme]
    const elements: any[] = []

    switch (sectionType) {
      case "navbar":
        // Logo
        elements.push(
          createNewElement("heading", {
            text: "LOGO",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.primary,
            },
          }),
        )

        // Navigation links
        const navItems = ["Home", "About", "Services", "Portfolio", "Contact"]
        navItems.forEach((item, index) => {
          elements.push(
            createNewElement("button", {
              buttonText: item,
              style: {
                x: 200 + index * 120,
                y: yOffset + 20,
                backgroundColor: "transparent",
                color: colors.text,
                padding: "8px 16px",
                fontWeight: "medium",
              },
            }),
          )
        })
        break

      case "hero":
        // Heading
        elements.push(
          createNewElement("heading", {
            text: "Welcome to Our Website",
            level: 1,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              fontSize: "2.5rem",
              color: colors.text,
            },
          }),
        )

        // Subheading
        elements.push(
          createNewElement("paragraph", {
            text: "We provide the best solutions for your business needs",
            style: {
              x: 20,
              y: yOffset + 80,
              fontSize: "1.25rem",
              color: colors.text,
            },
          }),
        )

        // CTA Button
        elements.push(
          createNewElement("button", {
            buttonText: "Get Started",
            style: {
              x: 20,
              y: yOffset + 140,
              backgroundColor: colors.primary,
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
            },
          }),
        )

        // Secondary Button
        elements.push(
          createNewElement("button", {
            buttonText: "Learn More",
            style: {
              x: 180,
              y: yOffset + 140,
              backgroundColor: "transparent",
              color: colors.primary,
              padding: "12px 24px",
              borderRadius: "8px",
              border: `2px solid ${colors.primary}`,
              fontWeight: "medium",
            },
          }),
        )

        // Hero Image
        elements.push(
          createNewElement("image", {
            src: "/placeholder.svg",
            alt: "Hero Image",
            style: {
              x: 400,
              y: yOffset + 20,
              width: "400px",
              height: "250px",
            },
          }),
        )
        break

      case "features":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "Our Features",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
              textAlign: "center",
            },
          }),
        )

        // Feature Cards
        const features = [
          { title: "Feature 1", description: "Description of feature 1 and its benefits." },
          { title: "Feature 2", description: "Description of feature 2 and its benefits." },
          { title: "Feature 3", description: "Description of feature 3 and its benefits." },
        ]

        features.forEach((feature, index) => {
          // Feature Card Title
          elements.push(
            createNewElement("heading", {
              text: feature.title,
              level: 3,
              style: {
                x: 20 + index * 250,
                y: yOffset + 80,
                fontWeight: "bold",
                color: colors.text,
              },
            }),
          )

          // Feature Card Description
          elements.push(
            createNewElement("paragraph", {
              text: feature.description,
              style: {
                x: 20 + index * 250,
                y: yOffset + 120,
                width: "220px",
                color: colors.text,
              },
            }),
          )

          // Feature Card Button
          elements.push(
            createNewElement("button", {
              buttonText: "Learn More",
              style: {
                x: 20 + index * 250,
                y: yOffset + 180,
                backgroundColor: colors.primary,
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
              },
            }),
          )
        })
        break

      case "testimonials":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "What Our Clients Say",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
              textAlign: "center",
            },
          }),
        )

        // Testimonials
        const testimonials = [
          {
            quote: "This company provided excellent service and exceeded our expectations.",
            author: "John Doe, CEO",
          },
          {
            quote: "The team was professional and delivered the project on time and within budget.",
            author: "Jane Smith, Marketing Director",
          },
        ]

        testimonials.forEach((testimonial, index) => {
          // Testimonial Quote
          elements.push(
            createNewElement("paragraph", {
              text: `"${testimonial.quote}"`,
              style: {
                x: 20 + index * 350,
                y: yOffset + 80,
                width: "300px",
                fontStyle: "italic",
                color: colors.text,
              },
            }),
          )

          // Testimonial Author
          elements.push(
            createNewElement("paragraph", {
              text: testimonial.author,
              style: {
                x: 20 + index * 350,
                y: yOffset + 150,
                fontWeight: "bold",
                color: colors.text,
              },
            }),
          )
        })
        break

      case "pricing":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "Pricing Plans",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
              textAlign: "center",
            },
          }),
        )

        // Pricing Plans
        const plans = [
          { name: "Basic", price: "$19", features: ["Feature 1", "Feature 2", "Feature 3"] },
          { name: "Pro", price: "$49", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"] },
          { name: "Enterprise", price: "$99", features: ["All Features", "Priority Support", "Custom Solutions"] },
        ]

        plans.forEach((plan, index) => {
          // Plan Name
          elements.push(
            createNewElement("heading", {
              text: plan.name,
              level: 3,
              style: {
                x: 20 + index * 250,
                y: yOffset + 80,
                fontWeight: "bold",
                color: colors.text,
              },
            }),
          )

          // Plan Price
          elements.push(
            createNewElement("heading", {
              text: plan.price,
              level: 2,
              style: {
                x: 20 + index * 250,
                y: yOffset + 120,
                fontWeight: "bold",
                color: colors.primary,
              },
            }),
          )

          // Plan Features
          plan.features.forEach((feature, featureIndex) => {
            elements.push(
              createNewElement("paragraph", {
                text: `• ${feature}`,
                style: {
                  x: 20 + index * 250,
                  y: yOffset + 160 + featureIndex * 30,
                  color: colors.text,
                },
              }),
            )
          })

          // Plan Button
          elements.push(
            createNewElement("button", {
              buttonText: "Choose Plan",
              style: {
                x: 20 + index * 250,
                y: yOffset + 160 + plan.features.length * 30 + 20,
                backgroundColor: index === 1 ? colors.primary : "transparent",
                color: index === 1 ? "white" : colors.primary,
                border: `2px solid ${colors.primary}`,
                padding: "8px 16px",
                borderRadius: "4px",
              },
            }),
          )
        })
        break

      case "contact":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "Contact Us",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        // Contact Form
        const formFields = [
          { label: "Name", type: "text", placeholder: "Your Name" },
          { label: "Email", type: "email", placeholder: "Your Email" },
          { label: "Message", type: "textarea", placeholder: "Your Message" },
        ]

        // Form Description
        elements.push(
          createNewElement("paragraph", {
            text: "Fill out the form below to get in touch with us.",
            style: {
              x: 20,
              y: yOffset + 70,
              color: colors.text,
            },
          }),
        )

        formFields.forEach((field, index) => {
          // Field Label
          elements.push(
            createNewElement("paragraph", {
              text: field.label,
              style: {
                x: 20,
                y: yOffset + 120 + index * 80,
                fontWeight: "medium",
                color: colors.text,
              },
            }),
          )

          // Field Input
          elements.push(
            createNewElement(field.type === "textarea" ? "input" : "input", {
              placeholder: field.placeholder,
              inputType: field.type,
              style: {
                x: 20,
                y: yOffset + 150 + index * 80,
                width: "300px",
                height: field.type === "textarea" ? "100px" : "40px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              },
            }),
          )
        })

        // Submit Button
        elements.push(
          createNewElement("button", {
            buttonText: "Send Message",
            style: {
              x: 20,
              y: yOffset + 150 + formFields.length * 80 + 20,
              backgroundColor: colors.primary,
              color: "white",
              padding: "12px 24px",
              borderRadius: "4px",
              fontWeight: "medium",
            },
          }),
        )

        // Contact Information
        elements.push(
          createNewElement("heading", {
            text: "Our Information",
            level: 3,
            style: {
              x: 400,
              y: yOffset + 120,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        const contactInfo = ["Email: info@example.com", "Phone: (123) 456-7890", "Address: 123 Main St, City, Country"]

        contactInfo.forEach((info, index) => {
          elements.push(
            createNewElement("paragraph", {
              text: info,
              style: {
                x: 400,
                y: yOffset + 160 + index * 30,
                color: colors.text,
              },
            }),
          )
        })
        break

      case "footer":
        // Footer Background
        elements.push(
          createNewElement("paragraph", {
            text: "",
            style: {
              x: 0,
              y: yOffset,
              width: "100%",
              height: "200px",
              backgroundColor: colors.text,
              color: "white",
            },
          }),
        )

        // Company Name
        elements.push(
          createNewElement("heading", {
            text: "Company Name",
            level: 3,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: "white",
            },
          }),
        )

        // Footer Text
        elements.push(
          createNewElement("paragraph", {
            text: "© 2023 Company Name. All rights reserved.",
            style: {
              x: 20,
              y: yOffset + 60,
              color: "white",
            },
          }),
        )

        // Footer Links
        const footerLinks = ["Privacy Policy", "Terms of Service", "Contact Us"]
        footerLinks.forEach((link, index) => {
          elements.push(
            createNewElement("button", {
              buttonText: link,
              style: {
                x: 20 + index * 150,
                y: yOffset + 100,
                backgroundColor: "transparent",
                color: "white",
                padding: "4px 8px",
              },
            }),
          )
        })

        // Social Media Links
        const socialLinks = ["Facebook", "Twitter", "Instagram", "LinkedIn"]
        socialLinks.forEach((link, index) => {
          elements.push(
            createNewElement("button", {
              buttonText: link,
              style: {
                x: 400 + index * 100,
                y: yOffset + 20,
                backgroundColor: "transparent",
                color: "white",
                padding: "4px 8px",
              },
            }),
          )
        })
        break

      case "about":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "About Us",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        // About Text
        elements.push(
          createNewElement("paragraph", {
            text: "We are a dedicated team of professionals committed to delivering high-quality solutions for our clients. With years of experience in the industry, we have the expertise to handle projects of any size and complexity.",
            style: {
              x: 20,
              y: yOffset + 80,
              width: "400px",
              color: colors.text,
            },
          }),
        )

        // Mission Statement
        elements.push(
          createNewElement("heading", {
            text: "Our Mission",
            level: 3,
            style: {
              x: 20,
              y: yOffset + 180,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        elements.push(
          createNewElement("paragraph", {
            text: "Our mission is to provide innovative solutions that help our clients achieve their goals and overcome challenges in today's competitive market.",
            style: {
              x: 20,
              y: yOffset + 220,
              width: "400px",
              color: colors.text,
            },
          }),
        )

        // Team Image
        elements.push(
          createNewElement("image", {
            src: "/placeholder.svg",
            alt: "Our Team",
            style: {
              x: 500,
              y: yOffset + 80,
              width: "300px",
              height: "200px",
            },
          }),
        )
        break

      case "faq":
        // Section Title
        elements.push(
          createNewElement("heading", {
            text: "Frequently Asked Questions",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        // FAQ Items
        const faqItems = [
          {
            question: "What services do you offer?",
            answer:
              "We offer a wide range of services including web development, mobile app development, UI/UX design, and digital marketing.",
          },
          {
            question: "How much do your services cost?",
            answer:
              "Our pricing varies depending on the scope and requirements of your project. Contact us for a custom quote.",
          },
          {
            question: "How long does it take to complete a project?",
            answer:
              "Project timelines depend on complexity and requirements. We work closely with clients to establish realistic deadlines.",
          },
        ]

        faqItems.forEach((item, index) => {
          // Question
          elements.push(
            createNewElement("heading", {
              text: item.question,
              level: 3,
              style: {
                x: 20,
                y: yOffset + 80 + index * 100,
                fontWeight: "bold",
                color: colors.text,
              },
            }),
          )

          // Answer
          elements.push(
            createNewElement("paragraph", {
              text: item.answer,
              style: {
                x: 20,
                y: yOffset + 120 + index * 100,
                width: "600px",
                color: colors.text,
              },
            }),
          )
        })
        break

      case "cta":
        // CTA Background
        elements.push(
          createNewElement("paragraph", {
            text: "",
            style: {
              x: 0,
              y: yOffset,
              width: "100%",
              height: "200px",
              backgroundColor: colors.primary,
              color: "white",
            },
          }),
        )

        // CTA Heading
        elements.push(
          createNewElement("heading", {
            text: "Ready to Get Started?",
            level: 2,
            style: {
              x: 20,
              y: yOffset + 40,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            },
          }),
        )

        // CTA Text
        elements.push(
          createNewElement("paragraph", {
            text: "Join thousands of satisfied customers and take your business to the next level.",
            style: {
              x: 20,
              y: yOffset + 100,
              color: "white",
              textAlign: "center",
            },
          }),
        )

        // CTA Button
        elements.push(
          createNewElement("button", {
            buttonText: "Get Started Now",
            style: {
              x: 300,
              y: yOffset + 140,
              backgroundColor: "white",
              color: colors.primary,
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
            },
          }),
        )
        break

      default:
        // Default section with a heading
        elements.push(
          createNewElement("heading", {
            text: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
            level: 2,
            style: {
              x: 20,
              y: yOffset + 20,
              fontWeight: "bold",
              color: colors.text,
            },
          }),
        )

        // Default section text
        elements.push(
          createNewElement("paragraph", {
            text: `This is the ${sectionType} section of your website. You can customize it to fit your needs.`,
            style: {
              x: 20,
              y: yOffset + 80,
              width: "400px",
              color: colors.text,
            },
          }),
        )
    }

    return elements
  }

  // Parse the user's request to determine what elements to create
  const parseElementRequest = (message: string): string[] => {
    const elementTypes = []
    const lowerMessage = message.toLowerCase()

    // Check for specific element types
    if (lowerMessage.includes("button")) elementTypes.push("button")
    if (lowerMessage.includes("heading") || lowerMessage.includes("title") || lowerMessage.includes("header"))
      elementTypes.push("heading")
    if (lowerMessage.includes("paragraph") || lowerMessage.includes("text")) elementTypes.push("paragraph")
    if (lowerMessage.includes("image") || lowerMessage.includes("picture") || lowerMessage.includes("photo"))
      elementTypes.push("image")
    if (lowerMessage.includes("input") || lowerMessage.includes("field") || lowerMessage.includes("textbox"))
      elementTypes.push("input")
    if (lowerMessage.includes("search")) elementTypes.push("search")
    if (lowerMessage.includes("card")) elementTypes.push("card")
    if (lowerMessage.includes("form")) elementTypes.push("form")
    if (lowerMessage.includes("gallery")) elementTypes.push("gallery")
    if (lowerMessage.includes("slider") || lowerMessage.includes("carousel")) elementTypes.push("slider")

    return elementTypes
  }

  // Generate elements based on the parsed request
  const generateElements = (elementTypes: string[], message: string): any[] => {
    const elements = []
    const lowerMessage = message.toLowerCase()

    // Extract potential properties from the message
    const colorMatch = lowerMessage.match(/color(?:ed)?\s+(\w+)/)
    const textMatch = message.match(/(?:saying|that says|with text|labeled)\s+["']?([^"']+)["']?/i)

    // Default properties
    const properties: any = {
      text: textMatch ? textMatch[1] : undefined,
      buttonText: textMatch ? textMatch[1] : undefined,
    }

    // Add color if specified
    if (colorMatch) {
      const color = colorMatch[1]
      if (color === "blue") properties.backgroundColor = "#3b82f6"
      else if (color === "red") properties.backgroundColor = "#ef4444"
      else if (color === "green") properties.backgroundColor = "#10b981"
      else if (color === "yellow") properties.backgroundColor = "#f59e0b"
      else if (color === "purple") properties.backgroundColor = "#8b5cf6"
      else properties.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16)
    }

    // Generate elements based on the types
    for (const type of elementTypes) {
      elements.push(createNewElement(type, properties))
    }

    // If the user wants multiple of the same element
    const countMatch = lowerMessage.match(/(\d+)\s+(buttons|headings|paragraphs|images|inputs|searches|cards|forms)/i)
    if (countMatch) {
      const count = Number.parseInt(countMatch[1])
      const type = countMatch[2].toLowerCase()

      // Map plural to singular
      const typeMap: { [key: string]: string } = {
        buttons: "button",
        headings: "heading",
        paragraphs: "paragraph",
        images: "image",
        inputs: "input",
        searches: "search",
        cards: "card",
        forms: "form",
      }

      const elementType = typeMap[type]

      // Generate the specified number of elements
      if (elementType && count > 0) {
        // Clear existing elements of this type to avoid duplication
        const filteredElements = elements.filter((el) => el.type !== elementType)
        elements.length = 0
        elements.push(...filteredElements)

        // Add the requested number of elements
        for (let i = 0; i < count; i++) {
          // For multiple elements, position them side by side or stacked
          const newProps = { ...properties }

          // Adjust position for multiple elements
          if (
            lowerMessage.includes("side by side") ||
            lowerMessage.includes("next to each other") ||
            lowerMessage.includes("row")
          ) {
            newProps.style = { ...newProps.style, x: 20 + i * 220 }
          } else {
            newProps.style = { ...newProps.style, y: 20 + i * 60 }
          }

          // Adjust text for multiple elements
          if (textMatch) {
            if (elementType === "button") {
              newProps.buttonText = `${properties.buttonText} ${i + 1}`
            } else {
              newProps.text = `${properties.text} ${i + 1}`
            }
          }

          elements.push(createNewElement(elementType, newProps))
        }
      }
    }

    return elements
  }

  // Helper function to create a new element
  const createNewElement = (type: string, properties: any = {}): any => {
    const id = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const baseElement = {
      id,
      type,
      style: {
        x: 20,
        y: 20,
        width: "auto",
        height: "auto",
        ...properties.style,
      },
      content: {},
      transitions: [],
    }

    switch (type) {
      case "heading":
        return {
          ...baseElement,
          content: {
            text: properties.text || "Heading",
            level: properties.level || 2,
          },
        }
      case "paragraph":
        return {
          ...baseElement,
          content: {
            text: properties.text || "Paragraph text",
          },
        }
      case "button":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            backgroundColor: properties.backgroundColor || "#3b82f6",
            color: properties.color || "white",
            padding: properties.padding || "8px 16px",
            borderRadius: properties.borderRadius || "4px",
          },
          content: {
            buttonText: properties.buttonText || "Button",
            href: properties.href || "#",
          },
        }
      case "image":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "200px",
            height: properties.height || "150px",
          },
          content: {
            src: properties.src || "/placeholder.svg",
            alt: properties.alt || "Image",
          },
        }
      case "input":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "200px",
            padding: properties.padding || "8px",
            borderRadius: properties.borderRadius || "4px",
            border: properties.border || "1px solid #e2e8f0",
          },
          content: {
            placeholder: properties.placeholder || "Enter text...",
            type: properties.inputType || "text",
          },
        }
      case "search":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "300px",
            padding: properties.padding || "8px",
            borderRadius: properties.borderRadius || "4px",
            border: properties.border || "1px solid #e2e8f0",
          },
          content: {
            placeholder: properties.placeholder || "Search...",
          },
        }
      case "card":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "300px",
            height: properties.height || "200px",
            padding: properties.padding || "16px",
            borderRadius: properties.borderRadius || "8px",
            backgroundColor: properties.backgroundColor || "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          content: {
            title: properties.title || "Card Title",
            text: properties.text || "Card content goes here.",
          },
          children: [
            {
              id: `${id}-title`,
              type: "heading",
              style: {
                x: 16,
                y: 16,
              },
              content: {
                text: properties.title || "Card Title",
                level: 3,
              },
            },
            {
              id: `${id}-text`,
              type: "paragraph",
              style: {
                x: 16,
                y: 60,
              },
              content: {
                text: properties.text || "Card content goes here.",
              },
            },
          ],
        }
      case "form":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "400px",
            padding: properties.padding || "16px",
            borderRadius: properties.borderRadius || "8px",
            backgroundColor: properties.backgroundColor || "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          content: {
            title: properties.title || "Contact Form",
          },
          children: [
            {
              id: `${id}-title`,
              type: "heading",
              style: {
                x: 16,
                y: 16,
              },
              content: {
                text: properties.title || "Contact Form",
                level: 3,
              },
            },
            {
              id: `${id}-name-label`,
              type: "paragraph",
              style: {
                x: 16,
                y: 60,
              },
              content: {
                text: "Name",
              },
            },
            {
              id: `${id}-name-input`,
              type: "input",
              style: {
                x: 16,
                y: 90,
                width: "calc(100% - 32px)",
              },
              content: {
                placeholder: "Your Name",
                type: "text",
              },
            },
            {
              id: `${id}-email-label`,
              type: "paragraph",
              style: {
                x: 16,
                y: 140,
              },
              content: {
                text: "Email",
              },
            },
            {
              id: `${id}-email-input`,
              type: "input",
              style: {
                x: 16,
                y: 170,
                width: "calc(100% - 32px)",
              },
              content: {
                placeholder: "Your Email",
                type: "email",
              },
            },
            {
              id: `${id}-submit`,
              type: "button",
              style: {
                x: 16,
                y: 220,
                backgroundColor: "#3b82f6",
                color: "white",
              },
              content: {
                buttonText: "Submit",
              },
            },
          ],
        }
      case "gallery":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "600px",
            height: properties.height || "300px",
          },
          content: {
            title: properties.title || "Image Gallery",
          },
          children: [
            {
              id: `${id}-title`,
              type: "heading",
              style: {
                x: 0,
                y: 0,
              },
              content: {
                text: properties.title || "Image Gallery",
                level: 3,
              },
            },
            {
              id: `${id}-image-1`,
              type: "image",
              style: {
                x: 0,
                y: 40,
                width: "180px",
                height: "120px",
              },
              content: {
                src: "/placeholder.svg",
                alt: "Gallery Image 1",
              },
            },
            {
              id: `${id}-image-2`,
              type: "image",
              style: {
                x: 200,
                y: 40,
                width: "180px",
                height: "120px",
              },
              content: {
                src: "/placeholder.svg",
                alt: "Gallery Image 2",
              },
            },
            {
              id: `${id}-image-3`,
              type: "image",
              style: {
                x: 400,
                y: 40,
                width: "180px",
                height: "120px",
              },
              content: {
                src: "/placeholder.svg",
                alt: "Gallery Image 3",
              },
            },
          ],
        }
      case "slider":
        return {
          ...baseElement,
          style: {
            ...baseElement.style,
            width: properties.width || "600px",
            height: properties.height || "300px",
          },
          content: {
            title: properties.title || "Image Slider",
          },
          children: [
            {
              id: `${id}-title`,
              type: "heading",
              style: {
                x: 0,
                y: 0,
              },
              content: {
                text: properties.title || "Image Slider",
                level: 3,
              },
            },
            {
              id: `${id}-image`,
              type: "image",
              style: {
                x: 0,
                y: 40,
                width: "600px",
                height: "300px",
              },
              content: {
                src: "/placeholder.svg",
                alt: "Slider Image",
              },
            },
            {
              id: `${id}-prev`,
              type: "button",
              style: {
                x: 10,
                y: 170,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                padding: "8px",
              },
              content: {
                buttonText: "<",
              },
            },
            {
              id: `${id}-next`,
              type: "button",
              style: {
                x: 550,
                y: 170,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                padding: "8px",
              },
              content: {
                buttonText: ">",
              },
            },
          ],
        }
      default:
        return baseElement
    }
  }

  // Check for inappropriate content
  const containsInappropriateContent = (text: string): boolean => {
    const inappropriateTerms = [
      "sex",
      "sexual",
      "porn",
      "pornography",
      "nude",
      "naked",
      "explicit",
      "adult content",
      "xxx",
      "nsfw",
    ]

    const lowerText = text.toLowerCase()
    return inappropriateTerms.some((term) => lowerText.includes(term))
  }

  // Clear conversation
  const clearConversation = () => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Hi! I'm your AI design assistant. I can help you build your website. Just tell me what you need!",
      timestamp: Date.now(),
    }

    setMessages([initialMessage])
    localStorage.removeItem(`ai-conversation-${projectId}`)
  }

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle template selection
  const handleTemplateSelect = (type: keyof typeof WEBSITE_TEMPLATES) => {
    setShowTemplates(false)
    setIsLoading(true)

    setTimeout(() => {
      const { elements, sections } = generateWebsite(type)

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: `I've created a ${WEBSITE_TEMPLATES[type].name} website for you with the following sections: ${sections.join(
          ", ",
        )}. Feel free to ask me to modify any section or add more elements!`,
        timestamp: Date.now(),
        elements,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Add elements to the canvas
      onAIGenerate(elements)
    }, 1500)
  }

  // Handle color scheme selection
  const handleColorSchemeSelect = (scheme: keyof typeof COLOR_SCHEMES) => {
    setShowColorSchemes(false)
    setIsLoading(true)

    setTimeout(() => {
      // Get the last website type from messages or default to professional
      let websiteType: keyof typeof WEBSITE_TEMPLATES = "professional"
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        if (message.role === "assistant" && message.content.includes("website for you")) {
          Object.keys(WEBSITE_TEMPLATES).forEach((type) => {
            if (message.content.includes(WEBSITE_TEMPLATES[type as keyof typeof WEBSITE_TEMPLATES].name)) {
              websiteType = type as keyof typeof WEBSITE_TEMPLATES
            }
          })
          break
        }
      }

      const { elements, sections } = generateWebsite(websiteType, scheme)

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: `I've updated your ${
          WEBSITE_TEMPLATES[websiteType].name
        } website with the ${scheme} color scheme. The sections include: ${sections.join(
          ", ",
        )}. Let me know if you'd like to make any other changes!`,
        timestamp: Date.now(),
        elements,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Add elements to the canvas
      onAIGenerate(elements)
    }, 1500)
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
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            AI Design Assistant
          </h2>
          <div className="flex items-center space-x-2">
            {!localIsPremium && (
              <div className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                {dailyConversationsRemaining}/{FREE_DAILY_CONVERSATION_LIMIT} free chats left
              </div>
            )}
            <button onClick={clearConversation} className="text-xs text-muted-foreground hover:text-foreground">
              Clear chat
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.elements && message.elements.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/30 text-xs">
                  <div className="flex items-center text-green-500 dark:text-green-400">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Added {message.elements.length} element(s) to canvas
                  </div>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-t border-border bg-secondary/30">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium text-muted-foreground">Quick Actions</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-center p-2 bg-secondary rounded-md text-xs text-foreground hover:bg-secondary/80"
          >
            <Layout className="h-3 w-3 mr-1" />
            Website Templates
          </button>
          <button
            onClick={() => setShowColorSchemes(!showColorSchemes)}
            className="flex items-center justify-center p-2 bg-secondary rounded-md text-xs text-foreground hover:bg-secondary/80"
          >
            <Palette className="h-3 w-3 mr-1" />
            Color Schemes
          </button>
          <button
            onClick={() => {
              setInput("Create a professional website with a hero section, navbar, and contact form")
            }}
            className="flex items-center justify-center p-2 bg-secondary rounded-md text-xs text-foreground hover:bg-secondary/80"
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Suggest Website
          </button>
        </div>
      </div>

      {/* Website Templates Selector */}
      {showTemplates && (
        <div className="p-4 border-t border-border bg-background">
          <h3 className="text-sm font-medium mb-3">Choose a Website Template</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(WEBSITE_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(key as keyof typeof WEBSITE_TEMPLATES)}
                className="p-3 bg-secondary rounded-md text-xs text-left hover:bg-secondary/80"
              >
                <div className="font-medium mb-1">{template.name}</div>
                <div className="text-muted-foreground text-xs truncate">
                  {template.sections.slice(0, 3).join(", ")}...
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Schemes Selector */}
      {showColorSchemes && (
        <div className="p-4 border-t border-border bg-background">
          <h3 className="text-sm font-medium mb-3">Choose a Color Scheme</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
              <button
                key={key}
                onClick={() => handleColorSchemeSelect(key as keyof typeof COLOR_SCHEMES)}
                className="p-2 rounded-md text-xs text-center hover:bg-secondary/80 flex flex-col items-center"
                style={{ backgroundColor: scheme.background }}
              >
                <div
                  className="w-full h-6 rounded mb-1 flex justify-center items-center"
                  style={{ backgroundColor: scheme.primary }}
                >
                  <span style={{ color: "white" }}>{key}</span>
                </div>
                <div className="w-full h-4 rounded" style={{ backgroundColor: scheme.secondary }}></div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to build something for you..."
            className="flex-1 bg-secondary text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading || (!localIsPremium && dailyConversationsRemaining <= 0)}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || (!localIsPremium && dailyConversationsRemaining <= 0)}
            className="bg-purple-500 text-white rounded-md p-2 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
        {!localIsPremium && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Free tier: {dailyConversationsRemaining} conversations remaining today</span>
            <button onClick={onUpgradeClick} className="text-purple-500 hover:text-purple-600 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Upgrade for unlimited
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Bot, Send, Sparkles, ImageIcon, Loader2, Lock, AlertCircle, Maximize2 } from 'lucide-react'
// import { createClient } from "../../../../../../../supabase/client"

// interface AIAssistantProps {
//   isPremiumUser: boolean
//   onUpgradeClick: () => void
//   onAIGenerate: (elements: any[]) => void
//   projectId: string
// }

// interface Message {
//   role: "user" | "assistant"
//   content: string
//   timestamp: number
//   elements?: any[]
// }

// // Daily conversation limit for free users
// const FREE_DAILY_CONVERSATION_LIMIT = 5

// export function AIDesignAssistant({ isPremiumUser, onUpgradeClick, onAIGenerate, projectId }: AIAssistantProps) {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [imageFile, setImageFile] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [localIsPremium, setLocalIsPremium] = useState(isPremiumUser)
//   const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
//   const [dailyConversationsRemaining, setDailyConversationsRemaining] = useState<number>(FREE_DAILY_CONVERSATION_LIMIT)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const supabase = createClient()

//   // Load conversation history from localStorage and check daily limit
//   useEffect(() => {
//     // Check daily conversation limit
//     const checkDailyLimit = () => {
//       if (localIsPremium) {
//         // Premium users have unlimited conversations
//         setDailyConversationsRemaining(Number.POSITIVE_INFINITY)
//         return
//       }

//       const today = new Date().toDateString()
//       const conversationData = localStorage.getItem(`ai-conversation-limit-${projectId}`)

//       if (conversationData) {
//         try {
//           const { date, count } = JSON.parse(conversationData)

//           // If it's a new day, reset the counter
//           if (date !== today) {
//             localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
//             setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
//           } else {
//             // Otherwise, set the remaining conversations
//             setDailyConversationsRemaining(Math.max(0, FREE_DAILY_CONVERSATION_LIMIT - count))
//           }
//         } catch (e) {
//           console.error("Failed to parse conversation limit data:", e)
//           // Reset if there's an error
//           localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
//           setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
//         }
//       } else {
//         // Initialize if no data exists
//         localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 0 }))
//         setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT)
//       }
//     }

//     // Load conversation history
//     const savedMessages = localStorage.getItem(`ai-conversation-${projectId}`)
//     if (savedMessages) {
//       try {
//         setMessages(JSON.parse(savedMessages))
//       } catch (e) {
//         console.error("Failed to parse saved messages:", e)
//       }
//     } else {
//       // Add welcome message if no history
//       setMessages([
//         {
//           role: "assistant",
//           content:
//             "👋 Hi! I'm your AI design assistant. I can help you create website elements, suggest design improvements, or answer questions about web design. What would you like to create today?",
//           timestamp: Date.now(),
//         },
//       ])
//     }

//     // Check daily limit
//     checkDailyLimit()
//   }, [projectId, localIsPremium])

//   // Save messages to localStorage whenever they change
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem(`ai-conversation-${projectId}`, JSON.stringify(messages))
//     }
//   }, [messages, projectId])

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Check subscription status
//   useEffect(() => {
//     // Set initial state from props
//     setLocalIsPremium(isPremiumUser)

//     // Check cookies for premium status
//     const checkCookies = () => {
//       const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
//       const isPremiumCookie = cookies.find((cookie) => cookie.startsWith("isPremium="))
//       if (isPremiumCookie && isPremiumCookie.split("=")[1] === "true") {
//         setLocalIsPremium(true)
//         return true
//       }
//       return false
//     }

//     // Check localStorage for premium status
//     const checkLocalStorage = () => {
//       const isPremiumFromStorage = localStorage.getItem("userPremiumStatus") === "true"
//       if (isPremiumFromStorage) {
//         setLocalIsPremium(true)
//         return true
//       }
//       return false
//     }

//     // First check client-side storage
//     const isPremiumFromClient = checkCookies() || checkLocalStorage()

//     // Then verify with the server if needed
//     if (!isPremiumFromClient) {
//       verifySubscription()
//     }

//     // Function to verify subscription with the server
//     async function verifySubscription() {
//       setIsCheckingSubscription(true)
//       try {
//         const response = await fetch("/api/subscription/check", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()
//         console.log("Subscription check response:", data)

//         if (data.isPremium) {
//           setLocalIsPremium(true)

//           // Update client-side storage
//           localStorage.setItem("userPremiumStatus", "true")
//           localStorage.setItem("premiumTimestamp", Date.now().toString())

//           // Set cookie directly from client
//           document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
//         }
//       } catch (error) {
//         console.error("Error checking subscription:", error)
//       } finally {
//         setIsCheckingSubscription(false)
//       }
//     }

//     // Set up interval to periodically check subscription status
//     const intervalId = setInterval(verifySubscription, 60000) // Check every minute

//     // Clean up interval on unmount
//     return () => clearInterval(intervalId)
//   }, [isPremiumUser])

//   // Update conversation count in localStorage
//   const incrementConversationCount = () => {
//     if (localIsPremium) return // Premium users don't need counting

//     const today = new Date().toDateString()
//     const conversationData = localStorage.getItem(`ai-conversation-limit-${projectId}`)

//     if (conversationData) {
//       try {
//         const data = JSON.parse(conversationData)

//         // If it's a new day, reset the counter
//         if (data.date !== today) {
//           localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 1 }))
//           setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT - 1)
//         } else {
//           // Otherwise, increment the count
//           const newCount = data.count + 1
//           localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: newCount }))
//           setDailyConversationsRemaining(Math.max(0, FREE_DAILY_CONVERSATION_LIMIT - newCount))
//         }
//       } catch (e) {
//         console.error("Failed to update conversation count:", e)
//       }
//     } else {
//       // Initialize if no data exists
//       localStorage.setItem(`ai-conversation-limit-${projectId}`, JSON.stringify({ date: today, count: 1 }))
//       setDailyConversationsRemaining(FREE_DAILY_CONVERSATION_LIMIT - 1)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim() && !imageFile) return

//     // Check if user has reached daily limit and is not premium
//     if (!localIsPremium && dailyConversationsRemaining <= 0) {
//       setError("You've reached your daily conversation limit. Upgrade to premium for unlimited conversations.")
//       return
//     }

//     setError(null)
//     const userMessage = input.trim()
//     setInput("")

//     // Add user message to chat
//     const newUserMessage: Message = {
//       role: "user",
//       content: userMessage,
//       timestamp: Date.now(),
//     }
//     setMessages((prev) => [...prev, newUserMessage])

//     // Increment conversation count for free users
//     incrementConversationCount()

//     // Show loading state
//     setIsLoading(true)

//     try {
//       // Upload image if present
//       let imageUrl = null
//       if (imageFile) {
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from("design-images")
//           .upload(`${projectId}/${Date.now()}-${imageFile.name}`, imageFile)

//         if (uploadError) {
//           throw new Error(`Failed to upload image: ${uploadError.message}`)
//         }

//         // Get public URL
//         const { data: urlData } = await supabase.storage.from("design-images").getPublicUrl(uploadData.path)
//         imageUrl = urlData.publicUrl
//         setImageFile(null)
//         setImagePreview(null)
//       }

//       // Gemini API integration
//       const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA" // Your API Key

//       // Request to fetch available models
//       const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
//       const modelsData = await modelsRes.json()
//       console.log("Available models:", modelsData)

//       // Use a model that supports generateContent
//       const modelName = "gemini-2.0" // Replace with an actual model name from the response

//       // Prepare the request body with image if available
//       const requestBody: any = {
//         contents: [{ parts: [{ text: userMessage }] }],
//       }

//       // Add image to request if available
//       if (imageUrl) {
//         requestBody.contents[0].parts.push({
//           inline_data: {
//             mime_type: "image/jpeg",
//             data: imageUrl,
//           },
//         })
//       }

//       // Request to generate content
//       const res = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/${modelName}-flash:generateContent?key=${apiKey}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestBody),
//         },
//       )

//       const data = await res.json()
//       console.log("API raw response:", data)

//       // Get real reply from Gemini
//       const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

//       if (reply) {
//         // Add AI response to chat
//         const newAIMessage: Message = {
//           role: "assistant",
//           content: reply,
//           timestamp: Date.now(),
//         }
//         setMessages((prev) => [...prev, newAIMessage])
//       } else if (data.error) {
//         // Show error message from API
//         const errorMessage: Message = {
//           role: "assistant",
//           content: `API Error: ${data.error.message}`,
//           timestamp: Date.now(),
//         }
//         setMessages((prev) => [...prev, errorMessage])
//       } else {
//         const errorMessage: Message = {
//           role: "assistant",
//           content: "Gemini gave empty reply. (Check API key or quota)",
//           timestamp: Date.now(),
//         }
//         setMessages((prev) => [...prev, errorMessage])
//       }
//     } catch (err) {
//       console.error("Error generating response:", err)

//       // Add a more helpful error message to the chat
//       const errorMessage: Message = {
//         role: "assistant",
//         content:
//           err instanceof Error
//             ? `I'm sorry, I encountered an issue: ${err.message}. Please try a different request or try again later.`
//             : "I'm having trouble processing your request right now. Please try again with a different question.",
//         timestamp: Date.now(),
//       }

//       setMessages((prev) => [...prev, errorMessage])
//       setError(null) // Clear the error state since we're showing it in the chat
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     // Check file type
//     if (!file.type.startsWith("image/")) {
//       setError("Please upload an image file")
//       return
//     }

//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image size should be less than 5MB")
//       return
//     }

//     setImageFile(file)
//     setError(null)

//     // Create preview
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string)
//     }
//     reader.readAsDataURL(file)
//   }

//   const handleImageUploadClick = () => {
//     fileInputRef.current?.click()
//   }

//   const removeImage = () => {
//     setImageFile(null)
//     setImagePreview(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   const openFullscreenChat = () => {
//     // Open a new window with the chat
//     window.open(`/dashboard/apps/website-builder/designer/edit/${projectId}/chat/${projectId}`, "_blank")
//   }

//   // Free tier UI with daily limit indicator
//   if (!localIsPremium && dailyConversationsRemaining <= 0) {
//     return (
//       <div className="bg-background border-r border-border flex flex-col h-full w-[600px]">
//         <div className="p-4 border-b border-border">
//           <div className="flex items-center justify-between">
//             <h2 className="font-medium text-foreground flex items-center">
//               <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
//               AI Design Assistant
//             </h2>
//             <button
//               onClick={openFullscreenChat}
//               className="p-1 text-muted-foreground hover:text-foreground"
//               title="Open in fullscreen"
//             >
//               <Maximize2 className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
//           <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
//             <Bot className="h-8 w-8 text-purple-500" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2 text-foreground">Daily Limit Reached</h3>
//           <p className="text-muted-foreground mb-6">
//             You've used all {FREE_DAILY_CONVERSATION_LIMIT} of your free daily conversations with the AI assistant.
//           </p>

//           <div className="bg-secondary p-4 rounded-lg mb-6 text-left">
//             <h4 className="font-medium text-foreground mb-2">Options:</h4>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li className="flex items-start">
//                 <AlertCircle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
//                 <span>Wait until tomorrow for {FREE_DAILY_CONVERSATION_LIMIT} more free conversations</span>
//               </li>
//               <li className="flex items-start">
//                 <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-0.5" />
//                 <span>Upgrade to premium for unlimited conversations</span>
//               </li>
//             </ul>
//           </div>

//           <button
//             onClick={onUpgradeClick}
//             className="w-full py-2 px-4 bg-purple-500 text-white rounded-md font-medium flex items-center justify-center hover:bg-purple-600 transition-colors"
//           >
//             <Lock className="h-4 w-4 mr-2" />
//             Upgrade for $5/month
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-background border-r border-border flex flex-col h-full w-[600px]">
//       <div className="p-4 border-b border-border">
//         <div className="flex items-center justify-between">
//           <h2 className="font-medium text-foreground flex items-center">
//             <Bot className="h-4 w-4 mr-2 text-purple-500" />
//             AI Design Assistant
//           </h2>
//           <button
//             onClick={openFullscreenChat}
//             className="p-1 text-muted-foreground hover:text-foreground"
//             title="Open in fullscreen"
//           >
//             <Maximize2 className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Daily limit indicator for free users */}
//         {!localIsPremium && (
//           <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
//             <span>Daily conversations:</span>
//             <span className="font-medium">
//               {dailyConversationsRemaining} of {FREE_DAILY_CONVERSATION_LIMIT} remaining
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 bg-secondary/50">
//         {messages.map((message, index) => (
//           <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
//             <div
//               className={`inline-block rounded-lg p-3 max-w-[85%] ${
//                 message.role === "user"
//                   ? "bg-primary text-primary-foreground rounded-tr-none"
//                   : "bg-card text-card-foreground border border-border rounded-tl-none"
//               }`}
//             >
//               <p className="whitespace-pre-wrap">{message.content}</p>
//               {message.elements && message.elements.length > 0 && (
//                 <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
//                   {message.role === "assistant" && (
//                     <button
//                       onClick={() => onAIGenerate(message.elements!)}
//                       className="text-purple-500 hover:text-purple-700 font-medium"
//                     >
//                       Apply these elements again
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="text-xs text-muted-foreground mt-1">
//               {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="mb-4 text-left">
//             <div className="inline-block rounded-lg p-3 bg-card text-card-foreground border border-border rounded-tl-none">
//               <div className="flex items-center">
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 <span>Generating response...</span>
//               </div>
//             </div>
//           </div>
//         )}
//         {error && (
//           <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
//             <p>{error}</p>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {imagePreview && (
//         <div className="p-2 border-t border-border bg-secondary/50 relative">
//           <div className="relative w-full h-24 bg-background rounded border border-border">
//             <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full mx-auto object-contain" />
//             <button
//               onClick={removeImage}
//               className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="p-2 border-t border-border">
//         <div className="flex items-center">
//           <button
//             type="button"
//             onClick={handleImageUploadClick}
//             className="p-2 text-muted-foreground hover:text-foreground"
//             title="Upload image"
//           >
//             <ImageIcon className="h-5 w-5" />
//           </button>
//           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask me anything..."
//             className="flex-1 p-2 border border-input bg-background text-foreground rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             disabled={isLoading}
//           />
//           <button
//             type="submit"
//             className="p-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 disabled:opacity-50"
//             disabled={
//               isLoading || (!input.trim() && !imageFile) || (!localIsPremium && dailyConversationsRemaining <= 0)
//             }
//           >
//             <Send className="h-5 w-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
