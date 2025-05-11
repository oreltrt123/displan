"use client"

import { useState } from "react"
import { X, CreditCard, Check } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null

// Get the publishable key from environment variables
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  }
  return stripePromise
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create checkout session
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // If user already has a subscription
      if (data.message && data.message.includes("already have")) {
        if (onSuccess) onSuccess()
        onClose()
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      console.error("Error creating subscription:", err)
      setError(err instanceof Error ? err.message : "Failed to start subscription process")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">AI Design Assistant</h4>
              <span className="text-2xl font-bold">
                $5<span className="text-sm font-normal text-gray-500">/month</span>
              </span>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Generate designs from text descriptions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Upload images for inspiration</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Get AI-powered design suggestions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Cancel anytime</span>
              </li>
            </ul>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscribe Now - $5/month
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center">
              <div className="flex space-x-2">
                <img src="/placeholder.svg?height=20&width=30" alt="Visa" className="h-5" />
                <img src="/placeholder.svg?height=20&width=30" alt="Mastercard" className="h-5" />
                <img src="/placeholder.svg?height=20&width=30" alt="Amex" className="h-5" />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically
              renew each month until canceled.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
