"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2, User } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface InviteAcceptanceProps {
  invitation: any
  token: string
  type: "collaborator" | "invite_link"
}

export function InviteAcceptance({ invitation, token, type }: InviteAcceptanceProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; folderId?: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        setIsAuthenticated(false)
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href)
        window.location.href = `/login?returnUrl=${returnUrl}`
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsAuthenticated(false)
    }
  }

  const handleAccept = async () => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.href)
      window.location.href = `/login?returnUrl=${returnUrl}`
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/accept-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, type }),
      })

      const data = await response.json()
      console.log("Invitation response:", data)
      setResult(data)

      if (data.success && data.folderId) {
        setTimeout(() => {
          router.push(`/dashboard/folder/${data.folderId}`)
        }, 2000)
      }
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setResult({ success: false, message: "Failed to process invitation" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecline = () => {
    setResult({ success: false, message: "Invitation declined" })
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Checking Authentication...</h1>
          <p className="text-gray-600">Please wait while we verify your login status.</p>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          {result.success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">Welcome!</h1>
              <p className="text-gray-600 mb-4">{result.message}</p>
              <p className="text-sm text-gray-500">Redirecting to folder...</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {result.message.includes("declined") ? "Invitation Declined" : "Error"}
              </h1>
              <p className="text-gray-600 mb-4">{result.message}</p>
              {result.message.includes("declined") && (
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  const folderName = invitation.displan_project_folders?.name || "Unknown Folder"
  const userEmail = type === "collaborator" ? invitation.user_email : "You"
  const role = invitation.role || "Editor"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Invited!</h1>
          <p className="text-gray-600">You've been invited to collaborate on the folder "{folderName}"</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{userEmail}</p>
              <p className="text-sm text-gray-500">Role: {role}</p>
            </div>
          </div>
        </div>

        {isProcessing ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Processing invitation...</span>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Accept & Join
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
