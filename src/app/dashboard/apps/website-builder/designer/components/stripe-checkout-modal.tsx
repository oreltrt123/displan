"use client"

import { useState } from "react"
import { X, CreditCard, Check, Loader2 } from "lucide-react"

interface StripeCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
  projectId: string
}

export function StripeCheckoutModal({ isOpen, onClose, onSuccess, userId, projectId }: StripeCheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a checkout session on the server
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          userId,
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
      console.error("Error creating checkout session:", err)
      setError(err instanceof Error ? err.message : "Failed to process payment. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1">Upgrade to Premium</h2>
          <p className="text-gray-600 mb-6">Get access to AI Design Assistant for $5/month</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Premium Features:</h3>
            <ul className="space-y-2">
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
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay $5.00 with Stripe
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
  )
}
