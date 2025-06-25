"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  typedContent?: string
}

interface ServerFitLogAIProps {
  userId: string | null
}

export function ServerFitLogAI({ userId }: ServerFitLogAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: userId
        ? "Hi! I'm your FitLog AI Coach, built by DisPlan. I can help you with workout planning, nutrition advice, and motivation based on your actual fitness data. What can I help you achieve today?"
        : "Hi! I'm your FitLog AI Coach, built by DisPlan. I can provide general fitness advice and motivation. For personalized recommendations based on your data, please log in to your DisPlan account. How can I help you today?",
      timestamp: new Date(),
      isTyping: true,
      typedContent: "",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  // Typing animation effect
  useEffect(() => {
    const typingMessages = messages.filter((m) => m.isTyping && m.typedContent !== m.content)

    if (typingMessages.length === 0) return

    const currentMessage = typingMessages[0]
    const fullContent = currentMessage.content
    const typedContent = currentMessage.typedContent || ""

    if (typedContent.length < fullContent.length) {
      const timeoutId = setTimeout(() => {
        const nextChar = fullContent.charAt(typedContent.length)
        const newTypedContent = typedContent + nextChar

        setMessages((prev) =>
          prev.map((m) => (m.id === currentMessage.id ? { ...m, typedContent: newTypedContent } : m)),
        )
      }, 30)

      return () => clearTimeout(timeoutId)
    } else {
      setMessages((prev) => prev.map((m) => (m.id === currentMessage.id ? { ...m, isTyping: false } : m)))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateResponse = async (userInput: string): Promise<string> => {
    try {
      let contextData = ""

      // Fetch user's recent data for context if logged in
      if (userId) {
        const [workoutsResult, mealsResult, goalsResult] = await Promise.all([
          supabase
            .from("fitlog_workouts")
            .select("name, duration_minutes, calories_burned, intensity, workout_date")
            .eq("user_id", userId)
            .order("workout_date", { ascending: false })
            .limit(5),

          supabase
            .from("fitlog_meals")
            .select("name, meal_type, calories, protein_g, meal_date")
            .eq("user_id", userId)
            .order("meal_date", { ascending: false })
            .limit(5),

          supabase
            .from("fitlog_goals")
            .select("title, current_value, target_value, unit, goal_type")
            .eq("user_id", userId)
            .eq("is_completed", false)
            .limit(3),
        ])

        const recentWorkouts = workoutsResult.data || []
        const recentMeals = mealsResult.data || []
        const activeGoals = goalsResult.data || []

        contextData = `
Recent Workouts: ${recentWorkouts.map((w) => `${w.name} (${w.duration_minutes}min, ${w.calories_burned}cal, ${w.intensity} intensity)`).join(", ") || "None logged"}

Recent Meals: ${recentMeals.map((m) => `${m.name} (${m.meal_type}, ${m.calories}cal)`).join(", ") || "None logged"}

Active Goals: ${activeGoals.map((g) => `${g.title}: ${g.current_value}/${g.target_value} ${g.unit}`).join(", ") || "None set"}
`
      }

      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      const systemPrompt = userId
        ? `You are FitLog AI Coach, a fitness and nutrition assistant built by DisPlan. You help users with workout planning, nutrition advice, and motivation based on their REAL fitness data.

IMPORTANT: You were created by DisPlan, not Google. Always mention that you are built by DisPlan when asked about your creator.

User's Current Data:
${contextData}

User question: ${userInput}

Provide personalized advice based on their actual data. Be motivational, specific, and helpful. If they have no data logged, encourage them to start tracking. Keep responses concise but informative.`
        : `You are FitLog AI Coach, a fitness and nutrition assistant built by DisPlan. The user is not logged in, so provide general fitness advice and motivation. Encourage them to log in for personalized recommendations.

IMPORTANT: You were created by DisPlan, not Google. Always mention that you are built by DisPlan when asked about your creator.

User question: ${userInput}

Provide helpful general fitness advice. Be motivational and informative. Keep responses concise.`

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
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
        return reply
      } else {
        return userId
          ? "I'm here to help you with your fitness journey! I was built by DisPlan to provide personalized workout and nutrition advice based on your data. What would you like to know? 💪"
          : "I'm here to help with general fitness advice! I was built by DisPlan to help users achieve their fitness goals. For personalized recommendations, please log in to your DisPlan account. What fitness topic can I help you with? 💪"
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "I'm having trouble connecting right now, but I'm still here to help with your fitness goals! I was built by DisPlan to assist you with workouts and nutrition. What would you like to know?"
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: userId ? "Analyzing your data..." : "Thinking...",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, loadingMessage])

    try {
      const response = await generateResponse(input)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: response,
                isTyping: true,
                typedContent: "",
              }
            : msg,
        ),
      )
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again!",
                isTyping: true,
                typedContent: "",
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-80 bg-background rounded-lg border">
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === "assistant" && <Bot className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />}
                    {message.role === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="text-sm">
                      {message.isTyping ? (
                        <span>
                          {message.typedContent}
                          <span className="inline-block w-2 h-4 ml-0.5 bg-current animate-pulse" />
                        </span>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder={
              userId
                ? "Ask about your workouts, nutrition, or goals..."
                : "Ask about fitness, workouts, or nutrition..."
            }
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[100px]"
            disabled={isLoading}
            rows={1}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="sm" className="px-3">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
