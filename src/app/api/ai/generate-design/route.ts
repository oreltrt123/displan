import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"
import { createNewElement } from "@/app/dashboard/apps/website-builder/designer/utils/element-factory"

export async function POST(request: Request) {
  try {
    // Get the current user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { prompt, imageUrl, bypassPremiumCheck } = body

    // Only check subscription if not bypassing (the client is handling limits)
    if (!bypassPremiumCheck) {
      // Check if user has premium subscription
      const { data: subscription, error: subError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (subError && subError.code !== "PGRST116") {
        console.error("Error checking subscription:", subError)
      }

      // Verify subscription is active and not expired
      const isPremium =
        !!subscription && subscription.current_period_end && new Date(subscription.current_period_end) > new Date()

      if (!isPremium) {
        return NextResponse.json(
          {
            message: "To use this feature, you need to upgrade to our premium plan. Would you like to upgrade now?",
            requiresUpgrade: true,
            elements: [],
          },
          { status: 403 },
        )
      }
    }

    if (!prompt && !imageUrl) {
      return NextResponse.json({ error: "Prompt or image required" }, { status: 400 })
    }

    // Call Anthropic's Claude API
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY || ""

    if (!anthropicApiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Prepare the prompt for Claude
    let fullPrompt = "You are a web design assistant. "

    if (imageUrl) {
      fullPrompt += `I'm sharing an image for inspiration. Based on this image and the following request, generate website elements: ${prompt}`
    } else {
      fullPrompt += `Generate website elements based on this request: ${prompt}`
    }

    // Add specific instructions for the AI
    fullPrompt += `\n\nPlease respond in a conversational, helpful manner. First, acknowledge the request and provide some design thinking. Then, describe the elements you're creating.`

    try {
      // Call Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: fullPrompt,
                },
                ...(imageUrl
                  ? [
                      {
                        type: "image",
                        source: {
                          type: "url",
                          url: imageUrl,
                        },
                      },
                    ]
                  : []),
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Claude API error:", errorData)

        // Return a friendly message instead of exposing the error
        return NextResponse.json({
          message: "I'm having trouble designing that right now. Could you try a simpler request or try again later?",
          elements: [],
        })
      }

      const claudeResponse = await response.json()
      const aiMessage = claudeResponse.content[0].text

      // Generate elements based on the prompt
      let elements: any[] = []

      // Check if the prompt is asking for design elements or just a general question
      const isDesignRequest =
        prompt.toLowerCase().includes("create") ||
        prompt.toLowerCase().includes("design") ||
        prompt.toLowerCase().includes("add") ||
        prompt.toLowerCase().includes("make") ||
        prompt.toLowerCase().includes("generate") ||
        prompt.toLowerCase().includes("build")

      if (isDesignRequest) {
        // For button request specifically
        if (prompt.toLowerCase().includes("button")) {
          elements = [
            {
              ...createNewElement("button"),
              content: {
                buttonText: prompt.toLowerCase().includes("ural") ? "Ural" : "Click Me",
                href: "#",
              },
              style: {
                backgroundColor: "#6c63ff",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                display: "inline-block",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  backgroundColor: "#5a52d5",
                },
              },
            },
          ]
        } else if (prompt.toLowerCase().includes("hero")) {
          elements = [
            {
              ...createNewElement("container"),
              content: { text: "Hero Section" },
              style: {
                backgroundColor: "#f8fafc",
                padding: "3rem",
                borderRadius: "0.5rem",
                marginBottom: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              },
            },
            {
              ...createNewElement("heading"),
              content: { text: "Welcome to Your Website", level: "h1" },
              style: {
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              },
            },
            {
              ...createNewElement("paragraph"),
              content: { text: "A beautiful, modern website built with our amazing website builder." },
              style: {
                fontSize: "1.25rem",
                color: "#64748b",
                maxWidth: "600px",
                marginBottom: "2rem",
              },
            },
            {
              ...createNewElement("button"),
              content: { buttonText: "Get Started", href: "#" },
              style: {
                backgroundColor: "#6c63ff",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                fontSize: "1.125rem",
                border: "none",
                cursor: "pointer",
                display: "inline-block",
              },
            },
          ]
        } else if (prompt.toLowerCase().includes("contact")) {
          elements = [
            {
              ...createNewElement("container"),
              content: { text: "Contact Form" },
              style: {
                backgroundColor: "#f8fafc",
                padding: "2rem",
                borderRadius: "0.5rem",
                marginBottom: "2rem",
              },
            },
            {
              ...createNewElement("heading"),
              content: { text: "Contact Us", level: "h2" },
              style: {
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1.5rem",
              },
            },
            {
              ...createNewElement("paragraph"),
              content: { text: "Fill out the form below to get in touch with our team." },
              style: {
                fontSize: "1rem",
                color: "#64748b",
                marginBottom: "2rem",
              },
            },
          ]
        } else if (prompt.toLowerCase().includes("pricing") || prompt.toLowerCase().includes("tier")) {
          elements = [
            {
              ...createNewElement("container"),
              content: { text: "Pricing Section" },
              style: {
                backgroundColor: "#f8fafc",
                padding: "3rem",
                borderRadius: "0.5rem",
                marginBottom: "2rem",
              },
            },
            {
              ...createNewElement("heading"),
              content: { text: "Pricing Plans", level: "h2" },
              style: {
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
                textAlign: "center",
              },
            },
            {
              ...createNewElement("paragraph"),
              content: { text: "Choose the perfect plan for your needs." },
              style: {
                fontSize: "1.125rem",
                color: "#64748b",
                marginBottom: "3rem",
                textAlign: "center",
              },
            },
          ]
        } else {
          // Default response for other design prompts
          elements = [
            {
              ...createNewElement("heading"),
              content: { text: "Generated Content", level: "h2" },
              style: {
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              },
            },
            {
              ...createNewElement("paragraph"),
              content: { text: `Here's some content based on your prompt: "${prompt}"` },
              style: {
                fontSize: "1rem",
                color: "#64748b",
                marginBottom: "1.5rem",
              },
            },
          ]
        }
      }

      // If we couldn't connect to Claude or there was an issue, use a fallback response system
      if (!aiMessage) {
        // Create a simple response based on the prompt
        let fallbackResponse = "I understand you're asking about "

        if (prompt.toLowerCase().includes("button")) {
          fallbackResponse +=
            "creating a button. I've generated a simple button element for you that you can customize further."
        } else if (prompt.toLowerCase().includes("hi") || prompt.toLowerCase().includes("hello")) {
          fallbackResponse = "Hello! How can I help with your website design today?"
        } else {
          fallbackResponse +=
            prompt + ". Let me help you with that. I've created some basic elements to get you started."
        }

        return NextResponse.json({
          message: fallbackResponse,
          elements,
        })
      }

      return NextResponse.json({
        message: aiMessage,
        elements,
      })
    } catch (error) {
      console.error("Error calling Claude API:", error)

      // Create a more helpful fallback response
      let fallbackResponse = "I'm sorry, I couldn't connect to my AI capabilities right now. "

      if (prompt.toLowerCase().includes("hi") || prompt.toLowerCase().includes("hello")) {
        fallbackResponse =
          "Hello! I'm having some trouble with my advanced features, but I'm still here to help. What would you like to design today?"
      } else if (prompt.toLowerCase().includes("button")) {
        fallbackResponse =
          "I understand you want to create a button. I've generated a simple button element for you, even though I'm having some connection issues."

        // Create a basic button element
        const elements = [
          {
            ...createNewElement("button"),
            content: {
              buttonText: prompt.toLowerCase().includes("ural") ? "Ural" : "Click Me",
              href: "#",
            },
            style: {
              backgroundColor: "#6c63ff",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              display: "inline-block",
            },
          },
        ]

        return NextResponse.json({
          message: fallbackResponse,
          elements,
        })
      }

      return NextResponse.json({
        message: fallbackResponse,
        elements: [],
      })
    }
  } catch (error) {
    console.error("Error generating design:", error)
    return NextResponse.json({
      message: "I encountered an unexpected error. Please try again.",
      elements: [],
    })
  }
}
