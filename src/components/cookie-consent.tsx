"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface CookieConsentProps {
  onAccept?: () => void
}

export function CookieConsent({ onAccept }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem("cookie-consent")

    if (!hasConsented) {
      // Show the banner after a small delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem("cookie-consent", "true")
    setShowConsent(false)

    // Call optional callback
    if (onAccept) {
      onAccept()
    }
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="bg-black dark:bg-white rounded-lg p-4 max-w-md w-full"
      style={{position: "absolute", bottom: "10%", left: "0"}}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white dark:text-[#5d626bb2] flex-1" style={{fontSize: "12px"}}>
            We use cookies to personalize content, run ads, and analyze traffic.
          </p>
          <button
            onClick={handleAccept}
            className="px-3 py-1 rounded displan-button-outline bg-[#8888881A] text-white dark:text-black"
            style={{cursor: "default", }}
          >
            <span style={{fontSize: "14px"}}>Okay</span>
          </button>
        </div>
      </div>
    </div>
  )
}
