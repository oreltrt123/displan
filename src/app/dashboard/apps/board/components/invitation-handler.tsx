"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Check, X, Crown, Edit, Eye } from "lucide-react"
import { acceptInvitation, rejectInvitation } from "../actions/collaboration-actions"
import { useRouter } from "next/navigation"

interface InvitationHandlerProps {
  invitation: any
}

export function InvitationHandler({ invitation }: InvitationHandlerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    setIsLoading(true)
    const { error } = await acceptInvitation(invitation.invitation_token)
    if (error) {
      alert(error)
    } else {
      router.push("/dashboard")
    }
    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)
    const { error } = await rejectInvitation(invitation.invitation_token)
    if (error) {
      alert(error)
    } else {
      router.push("/dashboard")
    }
    setIsLoading(false)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-5 w-5 text-yellow-500" />
      case "editor":
        return <Edit className="h-5 w-5 text-blue-500" />
      case "viewer":
        return <Eye className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full access - can edit, comment, and manage collaborators"
      case "editor":
        return "Can edit the board and add comments"
      case "viewer":
        return "Read-only access - can view but not edit"
      default:
        return ""
    }
  }

  if (invitation.status === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Already Accepted</CardTitle>
            <CardDescription>You have already accepted this invitation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (invitation.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Invitation Declined</CardTitle>
            <CardDescription>You have declined this invitation.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Collaboration Invitation</CardTitle>
          <CardDescription>You've been invited to collaborate on a board</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{invitation.boards?.name}</h3>
            {invitation.boards?.description && (
              <p className="text-sm text-gray-600 mt-1">{invitation.boards.description}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              {getRoleIcon(invitation.role)}
              <span className="font-medium capitalize">{invitation.role} Access</span>
            </div>
            <p className="text-sm text-gray-600">{getRoleDescription(invitation.role)}</p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleReject} variant="outline" className="flex-1" disabled={isLoading}>
              Decline
            </Button>
            <Button onClick={handleAccept} className="flex-1" disabled={isLoading}>
              {isLoading ? "Accepting..." : "Accept"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
