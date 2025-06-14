"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, Trash2, X, Save } from 'lucide-react'
import "../../../../../../../../styles/sidebar_settings_editor.css"
import "../../../../../website-builder/designer/styles/button.css"

export default function AISettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [userData, setUserData] = useState({
    hasAISubscription: true,
    subscriptionId: "sub_123456789",
  })
  const [showNotification, setShowNotification] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showClearChatModal, setShowClearChatModal] = useState(false)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if subscription exists in localStorage
        const subscriptionData = localStorage.getItem("displan_ai_subscription")
        const hasSubscription = !!subscriptionData

        setUserData({
          hasAISubscription: hasSubscription,
          subscriptionId: hasSubscription ? "sub_123456789" : "",
        })
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    let userId = localStorage.getItem("displan_user_id")
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("displan_user_id", userId)
    }
    return userId
  }

  // Open cancel subscription modal
  const openCancelModal = () => {
    setShowCancelModal(true)
  }

  // Close cancel subscription modal
  const closeCancelModal = () => {
    setShowCancelModal(false)
  }

  // Open clear chat modal
  const openClearChatModal = () => {
    setShowClearChatModal(true)
  }

  // Close clear chat modal
  const closeClearChatModal = () => {
    setShowClearChatModal(false)
  }

  // Cancel subscription function
  const handleCancelSubscription = async () => {
    setIsCancelling(true)

    try {
      const userId = getCurrentUserId()
      const subscriptionData = localStorage.getItem("displan_ai_subscription")

      if (subscriptionData) {
        const parsedData = JSON.parse(subscriptionData)

        // Call server API to cancel subscription
        await fetch("/api/cancel-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({
            subscriptionId: parsedData.subscriptionId,
            userId: userId,
          }),
        })
      }

      // Remove subscription from localStorage
      localStorage.removeItem("displan_ai_subscription")

      // Trigger storage event to notify other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "displan_ai_subscription",
          newValue: null,
        }),
      )

      // Close modal
      setShowCancelModal(false)

      // Show success notification
      setShowNotification(true)

      // Update user data
      setUserData({
        hasAISubscription: false,
        subscriptionId: "",
      })

      // Auto-dismiss notification after 5 seconds
      notificationTimeoutRef.current = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      alert("Failed to cancel subscription. Please try again or contact support.")
    } finally {
      setIsCancelling(false)
    }
  }

  // Clear chat history
  const handleClearChat = async () => {
    setIsClearing(true)

    try {
      // Clear chat history from localStorage
      localStorage.removeItem(`displan_ai_chat_default`)

      // Close modal
      setShowClearChatModal(false)

      setSaveMessage("Chat history cleared successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error clearing chat:", error)
      setSaveMessage("Failed to clear chat history")
    } finally {
      setIsClearing(false)
    }
  }

  // Save chat to server
  const handleSaveChat = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Simulate API call to save chat
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSaveMessage("Chat history saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving chat:", error)
      setSaveMessage("Failed to save chat history")
    } finally {
      setIsSaving(false)
    }
  }

  // Success notification
  const renderNotification = () => {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-up">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-white dark:text-black">Subscription successfully cancelled</span>
      </div>
    )
  }

  // Cancel subscription modal
  const renderCancelModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isCancelling ? closeCancelModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10">
          <div className="">
            <h3 className="settings_nav_section_title122323">Cancel AI Subscription</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isCancelling ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Cancelling subscription...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  Are you sure you want to cancel your AI subscription? You will lose access to AI features when your
                  current billing period ends. This action cannot be undone.
                </span>
                <div className="flex space-x-3">
                  <button onClick={closeCancelModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Keep Subscription
                  </button>
                  <button onClick={handleCancelSubscription} className="button_edit_projectsfdafgfwf12_dfdd_delete">
                    Cancel Subscription
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Clear chat history modal
  const renderClearChatModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isClearing ? closeClearChatModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10">
          <div className="">
            <h3 className="settings_nav_section_title122323">Clear Chat History</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isClearing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Clearing chat history...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  Are you sure you want to clear your chat history? This will permanently delete all conversations with the AI assistant. 
                  This action cannot be undone.
                </span>
                <div className="flex space-x-3">
                  <button onClick={closeClearChatModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Keep History
                  </button>
                  <button onClick={handleClearChat} className="button_edit_projectsfdafgfwf12_dfdd_delete">
                    Clear History
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading AI settings...</div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="titl2_d2m1313 dark:text-white">AI Assistant Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </div>

        {/* AI Subscription Section */}
        <div className="space-y-4 mb-8">
          <h2 className="settings_nav_section_title12">Subscription Status</h2>

          {userData.hasAISubscription ? (
            <div className="p-2 border-b border-gray-200 bg-green-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-xs text-green-600">
                  <span className="text-green-500">●</span> AI Subscription Active
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openCancelModal}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">○</span> No Active AI Subscription
                </div>
                <button
                  onClick={() => router.push("/dashboard/apps/displan/subscribe")}
                  className="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center space-x-1"
                >
                  <span>Subscribe Now</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat History Management */}
        <div className="space-y-4">
          <h2 className="settings_nav_section_title12">Chat History</h2>

          <div className="flex items-center space-x-4">
            <button onClick={handleSaveChat} disabled={isSaving} className="button_edit_project_r22232_Bu">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Chat History</span>
                </>
              )}
            </button>

            <button onClick={openClearChatModal} disabled={isClearing} className="button_edit_project_r22232_Bu_delete">
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                </>
              ) : (
                <>
                  <span className="text-white">Clear Chat History</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showNotification && renderNotification()}
      {showCancelModal && renderCancelModal()}
      {showClearChatModal && renderClearChatModal()}
    </>
  )
}
