"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { StripePaymentModal } from "./stripe-payment-modal"

interface StripeSubscriptionProps {
  onSubscriptionSuccess: () => void
  projectId?: string
  userEmail?: string
}

export function StripeSubscription({ onSubscriptionSuccess, projectId, userEmail }: StripeSubscriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePaymentSuccess = () => {
    setIsModalOpen(false)
    onSubscriptionSuccess()
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Displan AI Assistant</h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Unlock the power of AI for your website building journey
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly Subscription</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">$5/month</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Cancel anytime</p>
        </div>

        <ul className="text-sm text-left text-gray-700 dark:text-gray-300 mb-6 space-y-2 w-full">
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span> AI-powered website assistance
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span> Generate website elements
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span> Get design recommendations
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span> Unlimited conversations
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span> 24/7 AI support
          </li>
        </ul>

        <button
          onClick={handleOpenModal}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Subscribe with Stripe</span>
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Secure payment powered by Stripe</p>
      </div>

      <StripePaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handlePaymentSuccess}
        userEmail={userEmail}
        projectId={projectId}
      />
    </>
  )
}
