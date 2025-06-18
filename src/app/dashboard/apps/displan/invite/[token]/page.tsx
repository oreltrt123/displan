"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2, User, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface InvitePageProps {
  params: {
    token: string
  }
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  const [invitationType, setInvitationType] = useState<"collaborator" | "invite_link" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; folderId?: string } | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadInvitation()
    checkUser()
  }, [params.token])

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      console.log("Current user:", user?.email || "Not logged in")
    } catch (error) {
      console.error("Error checking user:", error)
    }
  }

  const loadInvitation = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading invitation for token:", params.token)

      // First check if it's a collaborator invitation
      const { data: collaboratorInvitation, error: collabError } = await supabase
        .from("displan_folder_collaborators")
        .select(`
          *,
          displan_project_folders (
            name,
            owner_id
          )
        `)
        .eq("invite_token", params.token)
        .eq("status", "pending")
        .single()

      console.log("Collaborator invitation check:", { collaboratorInvitation, collabError })

      if (!collabError && collaboratorInvitation) {
        setInvitation(collaboratorInvitation)
        setInvitationType("collaborator")
        setLoading(false)
        return
      }

      // If not found, check invite links table
      const { data: inviteLink, error: linkError } = await supabase
        .from("displan_invite_links")
        .select(`
          *,
          displan_project_folders (
            name,
            owner_id
          )
        `)
        .eq("token", params.token)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())
        .single()

      console.log("Invite link check:", { inviteLink, linkError })

      if (!linkError && inviteLink) {
        setInvitation(inviteLink)
        setInvitationType("invite_link")
        setLoading(false)
        return
      }

      // If neither found, set error
      setError("This invitation link is invalid or has expired.")
      setLoading(false)
    } catch (error) {
      console.error("Error loading invitation:", error)
      setError("There was an error loading this invitation.")
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      })

      if (error) {
        console.error("Login error:", error)
        alert("Failed to login: " + error.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Failed to login")
    }
  }

  const handleAccept = async () => {
    if (!user) {
      await handleLogin()
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/accept-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: params.token,
          type: invitationType,
          userEmail: user.email,
          userId: user.id,
        }),
      })

      const data = await response.json()
      console.log("Invitation response:", data)
      setResult(data)

      if (data.success && data.folderId) {
        setTimeout(() => {
          router.push(`/dashboard/apps/displan/folder/${data.folderId}`)
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
      router.push("/dashboard/apps/displan")
    }, 2000)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading Invitation...</h1>
          <p className="text-gray-600">Please wait while we verify your invitation.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !invitation || !invitationType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 mb-4">{error || "This invitation link is invalid or has expired."}</p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Result state (after accepting/declining)
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

  // Main invitation display
  const folderName = invitation.displan_project_folders?.name || "Unknown Folder"
  const userEmail = invitationType === "collaborator" ? invitation.user_email : user?.email || "You"
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

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              You need to be logged in to accept this invitation. Click "Accept & Join" to login with Google.
            </p>
          </div>
        )}

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
              {user ? "Accept & Join" : "Login & Accept"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
