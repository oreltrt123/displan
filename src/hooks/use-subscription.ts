"use client"

import { useState, useEffect } from "react"
import { subscriptionManager } from "../utils/subscription-manager"

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkSubscription = () => {
    try {
      console.log("🔍 === CHECKING SUBSCRIPTION STATUS ===")
      setIsLoading(true)

      // Get current user ID using the subscription manager
      const userId = subscriptionManager.getUserId()
      console.log("👤 Current user ID:", userId)

      if (!userId) {
        console.log("❌ No user ID found, setting to FREE")
        setIsSubscribed(false)
        setIsLoading(false)
        return
      }

      // Get subscription data using the subscription manager
      const subscriptionData = subscriptionManager.getSubscription()
      console.log("📦 Subscription data:", subscriptionData)

      if (!subscriptionData) {
        console.log("❌ No subscription data found")
        setIsSubscribed(false)
        setIsLoading(false)
        return
      }

      // More detailed validation
      console.log("🔍 Validating subscription...")

      // Check if subscription is active
      const isActive = subscriptionData.active === true
      console.log("✅ Subscription active:", isActive)

      // Check if user IDs match (case-sensitive)
      const storedUserId = subscriptionData.userId
      const userIdMatch = storedUserId === userId
      console.log("👥 User ID match:", userIdMatch)
      console.log("   - Stored user ID:", storedUserId)
      console.log("   - Current user ID:", userId)
      console.log("   - Are they equal?", storedUserId === userId)

      // Check expiration with better date handling
      let notExpired = true
      if (subscriptionData.expiresAt) {
        const expiresAt = new Date(subscriptionData.expiresAt)
        const now = new Date()
        notExpired = expiresAt > now
        console.log("⏰ Expiration check:")
        console.log("   - Expires at:", expiresAt.toISOString())
        console.log("   - Current time:", now.toISOString())
        console.log("   - Not expired:", notExpired)
      } else {
        console.log("⚠️ No expiration date found, assuming valid")
      }

      // Final validation
      const isValidSubscription = isActive && userIdMatch && notExpired
      console.log("🎯 Final validation result:", isValidSubscription)
      console.log("   - Active:", isActive)
      console.log("   - User match:", userIdMatch)
      console.log("   - Not expired:", notExpired)

      if (isValidSubscription) {
        console.log("🎉 SUBSCRIPTION IS VALID - Setting to PRO")
        setIsSubscribed(true)
      } else {
        console.log("❌ SUBSCRIPTION INVALID - Setting to FREE")
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error("❌ Failed to check subscription:", error)
      setIsSubscribed(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("🚀 useSubscription hook mounted")

    // Initial check with slight delay to ensure localStorage is ready
    setTimeout(() => {
      checkSubscription()
    }, 100)

    // Listen for subscription changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log("📢 Storage change detected:", e.key, "New value:", e.newValue)
      if (e.key === "displan_ai_subscription" || e.key === "displan_user_id") {
        setTimeout(() => {
          checkSubscription()
        }, 100)
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleCustomEvent = () => {
      console.log("📢 Custom subscription event detected")
      setTimeout(() => {
        checkSubscription()
      }, 100)
    }

    // Listen for page visibility changes (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Page became visible, rechecking subscription")
        setTimeout(() => {
          checkSubscription()
        }, 100)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("subscription-updated", handleCustomEvent)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("subscription-updated", handleCustomEvent)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Debug function to manually check subscription
  const debugSubscription = () => {
    console.log("🐛 DEBUG: Manual subscription check")
    const subscription = subscriptionManager.getSubscription()
    const userId = subscriptionManager.getUserId()

    console.log("🐛 Current user ID:", userId)
    console.log("🐛 Subscription data:", subscription)
  }

  return {
    isSubscribed,
    isLoading,
    refetch: checkSubscription,
    debug: debugSubscription,
  }
}
