"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { X, CreditCard, Lock, Calendar, Shield, CheckCircle } from "lucide-react"
import { subscriptionManager } from "../../../../../../utils/subscription-manager"
import "../../../../../../styles/navbar.css"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  onSuccess: () => void
  onCancel: () => void
  userEmail?: string
  projectId?: string
}

function PaymentForm({ onSuccess, onCancel, userEmail, projectId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError("Payment system is loading. Please wait a moment and try again.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use subscription manager to get consistent user ID
      const userId = subscriptionManager.getUserId()
      const cardNumberElement = elements.getElement(CardNumberElement)

      if (!cardNumberElement) {
        throw new Error("Payment form not ready. Please refresh and try again.")
      }

      console.log("Creating payment method for user:", userId)

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          email: userEmail || `${userId}@displan.com`,
        },
      })

      if (paymentMethodError) {
        console.error("Payment method error:", paymentMethodError)
        throw new Error(paymentMethodError.message || "Invalid card information")
      }

      console.log("Payment method created successfully:", paymentMethod.id)

      // Create subscription
      console.log("Creating subscription...")
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          userEmail: userEmail || `${userId}@displan.com`,
          projectId: projectId,
        }),
      })

      const result = await response.json()
      console.log("Subscription response:", result)

      if (!response.ok) {
        throw new Error(result.error || result.details || "Payment failed")
      }

      if (result.requiresAction && result.clientSecret) {
        console.log("Handling 3D Secure...")
        const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret)

        if (confirmError) {
          throw new Error(confirmError.message || "Card authentication failed")
        }
      }

      // Success! Store subscription using the manager
      console.log("Payment successful! Storing subscription data...")
      setSuccess(true)

      const subscriptionData = {
        active: true,
        subscriptionId: result.subscriptionId || "sub_" + Date.now(),
        customerId: result.customerId || "cus_" + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        verifiedAt: new Date().toISOString(),
        paymentMethod: "stripe",
        plan: "pro",
      }

      // Use the subscription manager to store data consistently
      subscriptionManager.setSubscription(subscriptionData)

      console.log("✅ Subscription data stored successfully")

      // Wait a moment to show success, then call onSuccess
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        fontFamily: '"Inter", "system-ui", "sans-serif"',
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
      complete: {
        color: "#059669",
        iconColor: "#059669",
      },
    },
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-400">Your AI subscription is now active.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Card Number
          </label>
          <div className="p-4 rounded-lg bg-[#8888881A] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Expiry Date
            </label>
          <div className="p-4 rounded-lg bg-[#8888881A] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <CardExpiryElement options={elementOptions} />
            </div>
          </div>

          {/* CVC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              CVC
            </label>
          <div className="p-4 rounded-lg bg-[#8888881A] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
           <CardCvcElement options={elementOptions} />
            </div>
          </div>
        </div>

        {userEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <X className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="Start_browsing_2311231"
          >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="Start_browsing_23112311"
          >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Subscribe $5/month</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Lock className="w-4 h-4" />
        <span>Secured by Stripe • SSL Encrypted</span>
      </div>
    </form>
  )
}

interface StripePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userEmail?: string
  projectId?: string
}

export function StripePaymentModal({ isOpen, onClose, onSuccess, userEmail, projectId }: StripePaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscribe to Displan</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Unlock AI-powered website building features</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-[#8888881A] rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-8">
            <div className="bg-[#8888881A] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Plan</h3>
                  <p className="text-gray-600 dark:text-gray-400">Monthly subscription</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">$5</div>
                  <div className="text-gray-500 dark:text-gray-400">/month</div>
                </div>
              </div>
            </div>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm onSuccess={onSuccess} onCancel={onClose} userEmail={userEmail} projectId={projectId} />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default StripePaymentModal
