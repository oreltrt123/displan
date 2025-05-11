"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { createClient } from "../../../../../../../../supabase/client"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function verifySubscription() {
      if (!sessionId) {
        setError("Invalid session ID")
        setLoading(false)
        return
      }

      try {
        // Verify the subscription with the server
        const response = await fetch("/api/subscription/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to verify subscription")
        }

        const data = await response.json()
        setSubscription(data.subscription)

        // Set a cookie to remember the premium status
        document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
      } catch (err) {
        console.error("Error verifying subscription:", err)
        setError(err instanceof Error ? err.message : "Failed to verify subscription")
      } finally {
        setLoading(false)
      }
    }

    verifySubscription()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Verifying your subscription...</h1>
        <p className="text-white/70">Please wait while we confirm your payment.</p>
      </div>
    )
  }

  if (error) {
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
              <div className="bg-red-500/20 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Subscription Error</h1>
            <p className="text-white/70 text-center mb-8">{error}</p>
            <div className="flex justify-center">
              <Link
                href="/dashboard/apps/website-builder/designer"
                className="px-5 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Return to Designer
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

        <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-500/20 p-3 rounded-full">
              <Check size={32} className="text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Subscription Activated!</h1>
          <p className="text-white/70 text-center mb-8">
            Thank you for subscribing to the AI Design Assistant. You now have full access to all premium features.
          </p>
          <div className="bg-white/10 rounded-lg p-4 mb-8">
            <h2 className="font-semibold mb-2">Subscription Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-white/70">Plan:</div>
              <div>AI Assistant</div>
              <div className="text-white/70">Price:</div>
              <div>$5.00/month</div>
              {subscription?.current_period_end && (
                <>
                  <div className="text-white/70">Next billing date:</div>
                  <div>{new Date(subscription.current_period_end).toLocaleDateString()}</div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/dashboard/apps/website-builder/designer"
              className="px-5 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
            >
              Start using AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
