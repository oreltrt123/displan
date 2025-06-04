// Subscription manager utility to handle subscription data consistently

interface SubscriptionData {
  active: boolean
  subscriptionId: string
  customerId: string
  expiresAt: string
  verifiedAt: string
  paymentMethod: string
  plan: string
  userId?: string
}

class SubscriptionManager {
  private readonly STORAGE_KEY = "displan_ai_subscription"
  private readonly USER_ID_KEY = "displan_user_id"

  getUserId(): string {
    try {
      // Check localStorage for existing user ID
      let userId = localStorage.getItem(this.USER_ID_KEY)

      if (!userId) {
        // Create new user ID if none exists
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem(this.USER_ID_KEY, userId)
        console.log("🆕 Created new user ID:", userId)
      }

      return userId
    } catch (error) {
      console.error("❌ Error getting user ID:", error)
      return `user_fallback_${Date.now()}`
    }
  }

  getSubscription(): SubscriptionData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return null

      return JSON.parse(data)
    } catch (error) {
      console.error("❌ Error getting subscription:", error)
      return null
    }
  }

  setSubscription(data: SubscriptionData): void {
    try {
      // Ensure the userId is included in the subscription data
      const userId = this.getUserId()
      const subscriptionData = {
        ...data,
        userId,
      }

      // Store the subscription data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscriptionData))

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent("subscription-updated"))

      console.log("✅ Subscription data saved:", subscriptionData)
    } catch (error) {
      console.error("❌ Error setting subscription:", error)
    }
  }

  clearSubscription(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      window.dispatchEvent(new CustomEvent("subscription-updated"))
      console.log("🗑️ Subscription data cleared")
    } catch (error) {
      console.error("❌ Error clearing subscription:", error)
    }
  }
}

// Export a singleton instance
export const subscriptionManager = new SubscriptionManager()
