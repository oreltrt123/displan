"use client"

import { useState, useEffect } from "react"
import { Layers, ImageIcon, Bot, Settings, Lock, RefreshCw, Loader2, Palette } from "lucide-react"

interface SidebarNavigationProps {
  onSelectPanel: (panel: string) => void
  activePanel: string
  isPremiumUser: boolean
  onUpgradeClick?: () => void
}

export function SidebarNavigation({
  onSelectPanel,
  activePanel,
  isPremiumUser,
  onUpgradeClick,
}: SidebarNavigationProps) {
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
  const [localIsPremium, setLocalIsPremium] = useState(isPremiumUser)
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  // Check subscription status on mount and when localStorage changes
  useEffect(() => {
    // Set initial state from props
    setLocalIsPremium(isPremiumUser)

    const checkSubscriptionFromCookie = () => {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const isPremiumCookie = cookies.find((cookie) => cookie.startsWith("isPremium="))
      if (isPremiumCookie && isPremiumCookie.split("=")[1] === "true") {
        setLocalIsPremium(true)
        return true
      }
      return false
    }

    // Check localStorage for premium status
    const checkLocalStorage = () => {
      const isPremiumFromStorage = localStorage.getItem("userPremiumStatus") === "true"
      if (isPremiumFromStorage) {
        setLocalIsPremium(true)
        return true
      }
      return false
    }

    const checkCookies = () => {
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith("isPremium=")) {
          return cookie.substring("isPremium=".length) === "true"
        }
      }
      return false
    }

    // First check client-side storage
    const isPremiumFromClient = checkCookies() || checkLocalStorage()

    // Then verify with the server if needed
    if (!isPremiumFromClient) {
      verifySubscription()
    }

    // Function to verify subscription with the server
    async function verifySubscription() {
      setIsCheckingSubscription(true)
      try {
        const response = await fetch("/api/subscription/check", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Sidebar subscription check:", data)

          if (data.isPremium) {
            setLocalIsPremium(true)
            setShowRefreshButton(false)

            // Update client-side storage
            localStorage.setItem("userPremiumStatus", "true")
            localStorage.setItem("premiumTimestamp", Date.now().toString())

            // Set cookie directly from client
            document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
          } else {
            // If the server says not premium but props say premium, show refresh button
            if (isPremiumUser && !data.isPremium) {
              setShowRefreshButton(true)
            }
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
        // If error occurs and props say premium, show refresh button
        if (isPremiumUser) {
          setShowRefreshButton(true)
        }
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    // Listen for storage events (in case subscription status changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userPremiumStatus") {
        setLocalIsPremium(e.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Set up interval to periodically check subscription status
    const intervalId = setInterval(verifySubscription, 60000) // Check every minute

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [isPremiumUser])

  const refreshSubscriptionStatus = async () => {
    setIsCheckingSubscription(true)
    try {
      const response = await fetch("/api/subscription/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Manual subscription check response:", data)

      if (data.isPremium) {
        setLocalIsPremium(true)
        setShowRefreshButton(false)
        localStorage.setItem("userPremiumStatus", "true")
        document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`

        // Force reload to ensure all components recognize the premium status
        window.location.reload()
      }
    } catch (error) {
      console.error("Error checking subscription:", error)
    } finally {
      setIsCheckingSubscription(false)
    }
  }

  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => onSelectPanel("elements")}
                    className={`p-3 rounded-lg ${
          activePanel === "elements"
    ? "bg-[rgb(43,43,43)] text-white"
    : "text-muted-foreground hover:bg-[rgb(63,63,63)]"
          }`}
          title="Elements"
        >
          <Layers className="h-6 w-6" />
        </button>

        <button
          onClick={() => onSelectPanel("images")}
          className={`p-3 rounded-lg ${
          activePanel === "images"
    ? "bg-[rgb(43,43,43)] text-white"
    : "text-muted-foreground hover:bg-[rgb(63,63,63)]"
          }`}
          title="Images"
        >
          <ImageIcon className="h-6 w-6" />
        </button>

        <button
          onClick={() => onSelectPanel("simple")}
          className={`p-3 rounded-lg ${
          activePanel === "simple"
    ? "bg-[rgb(43,43,43)] text-white"
    : "text-muted-foreground hover:bg-[rgb(63,63,63)]"
          }`}
          title="Simple Designs"
        >
          <Palette className="h-6 w-6" />
        </button>

        {localIsPremium ? (
          <button
            onClick={() => onSelectPanel("ai")}
           className={`p-3 rounded-lg ${
          activePanel === "ai"
    ? "bg-[rgb(43,43,43)] text-white"
    : "text-muted-foreground hover:bg-[rgb(63,63,63)]"
          }`}
            title="AI Assistant"
          >
            <Bot className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={onUpgradeClick}
            className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 relative"
            title="Upgrade to Premium"
          >
            <Lock className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              $
            </span>
          </button>
        )}

        <button
          onClick={() => onSelectPanel("settings")}
          className={`p-3 rounded-lg ${
          activePanel === "settings"
    ? "bg-[rgb(43,43,43)] text-white"
    : "text-muted-foreground hover:bg-[rgb(63,63,63)]"
          }`}
          title="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>

        {showRefreshButton && (
          <button
            onClick={refreshSubscriptionStatus}
            className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
            title="Refresh Subscription Status"
            disabled={isCheckingSubscription}
          >
            {isCheckingSubscription ? <Loader2 className="h-6 w-6 animate-spin" /> : <RefreshCw className="h-6 w-6" />}
          </button>
        )}
      </div>
    </div>
  )
}
