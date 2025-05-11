"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Check, Sparkles, Bot, ImageIcon, Layout } from 'lucide-react'
import { createClient } from "../../../../../../../supabase/client"

export default function SubscriptionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSubscription() {
      try {
        setIsLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/sign-in")
          return
        }

        // Check if user has premium subscription
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single()

        setIsPremiumUser(!!subscription)
      } catch (err) {
        console.error("Error checking subscription:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: "subscription",
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error("Error processing payment:", err)
      setError(err instanceof Error ? err.message : "Failed to process payment. Please try again.")
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isPremiumUser) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/dashboard/apps/website-builder/designer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Designer
          </Link>

          <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-500/20 p-3 rounded-full">
                <Check size={32} className="text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">You're already subscribed!</h1>
            <p className="text-white/70 text-center mb-8">
              You already have access to all premium features including the AI Design Assistant.
            </p>
            <div className="flex justify-center">
              <Link
                href="/dashboard/apps/website-builder/designer"
                className="px-5 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <Layout size={18} />
                Go to your projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/dashboard/apps/website-builder/designer"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
        >
          <ArrowLeft size={16} />
          Back to Designer
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
            <p className="text-white/70 mb-6">Unlock the power of AI to create stunning designs in seconds</p>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
              <h2 className="text-xl font-semibold mb-4">What you'll get:</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Bot className="h-5 w-5 mr-3 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">AI Design Assistant</h3>
                    <p className="text-white/70 text-sm">Generate complete sections with simple text prompts</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ImageIcon className="h-5 w-5 mr-3 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Image Analysis</h3>
                    <p className="text-white/70 text-sm">Upload images for inspiration and get matching designs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 mr-3 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Design Suggestions</h3>
                    <p className="text-white/70 text-sm">Get personalized design advice and recommendations</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles size={16} className="text-white" />
                </div>
                <p className="font-medium">Customer testimonial</p>
              </div>
              <p className="text-white/90 italic mb-3">
                "The AI assistant saved me hours of design work. I described what I wanted, and it created beautiful
                sections instantly!"
              </p>
              <p className="text-white/70 text-sm">— Sarah K., Web Designer</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Complete your purchase</h2>
            <div className="flex items-center justify-between mb-6 bg-white/10 p-3 rounded-lg">
              <div>
                <h3 className="font-medium">AI Design Assistant</h3>
                <p className="text-white/70 text-sm">Monthly subscription</p>
              </div>
              <p className="font-bold">$5.00</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-500 text-white rounded-md font-medium flex items-center justify-center disabled:opacity-50 hover:bg-purple-600 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </span>
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center text-sm text-white/60">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
