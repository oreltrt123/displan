"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, Loader2, XCircle } from 'lucide-react'

// Lazy import Supabase client to avoid build-time errors
const createSupabaseClient = async () => {
  try {
    const { createClient } = await import("../../../../../supabase/client")
    return createClient()
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    throw new Error("Database connection unavailable")
  }
}

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    async function verifySubscription() {
      if (!sessionId) {
        setError("Invalid session ID")
        setVerifying(false)
        return
      }

      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          setError("This page requires client-side rendering")
          setVerifying(false)
          return
        }

        // Check for required environment variables
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError("Service configuration error. Please try again later.")
          setVerifying(false)
          return
        }

        const supabase = await createSupabaseClient()

        // Get current user
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser()

        if (authError) {
          console.error("Auth error:", authError)
          setError("Authentication error. Please sign in again.")
          setVerifying(false)
          return
        }

        if (!user) {
          router.push("/sign-in")
          return
        }

        // Verify the subscription with your backend
        const response = await fetch("/api/verify-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            userId: user.id,
          }),
          credentials: "include",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Network error" }))
          throw new Error(errorData.error || "Failed to verify subscription")
        }

        const data = await response.json()
        setSubscription(data.subscription || { plan: "ai_assistant" })

        // Set a cookie to persist the subscription status
        document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

        // Force reload user data in localStorage to update premium status
        localStorage.setItem("userPremiumStatus", "true")
        localStorage.setItem("premiumTimestamp", Date.now().toString())
      } catch (err) {
        console.error("Error verifying subscription:", err)
        setError(err instanceof Error ? err.message : "Failed to verify subscription")
      } finally {
        setVerifying(false)
      }
    }

    // Only run verification in browser environment
    if (typeof window !== "undefined") {
      verifySubscription()
    } else {
      setVerifying(false)
      setError("This page requires client-side rendering")
    }
  }, [sessionId, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        {verifying ? (
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Verifying your subscription</h1>
            <p className="text-gray-600 mb-4">Please wait while we confirm your payment...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Error</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/dashboard/apps/website-builder/designer")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Activated!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to the AI Design Assistant. Your subscription is now active.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Subscription Details:</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Plan:</span> AI Design Assistant
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Price:</span> $5.00/month
              </p>
            </div>

            <Link
              href="/dashboard/apps/website-builder/designer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Start Using AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}