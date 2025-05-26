"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Users, Crown, Edit, Eye, Mail } from "lucide-react"
import { getPendingInvitations, acceptInvitation, rejectInvitation } from "../actions/collaboration-actions"

interface PendingInvitation {
  id: string
  board_id: string
  role: "admin" | "editor" | "viewer"
  created_at: string
  boards: {
    id: string
    name: string
    description: string | null
    thumbnail_url: string | null
  } | null
}

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadInvitations = async () => {
      console.log("Loading pending invitations...")
      setLoading(true)

      const { data, error } = await getPendingInvitations()

      if (error) {
        console.error("Error loading pending invitations:", error)
      } else {
        console.log("Pending invitations loaded:", data)
        // Filter out invitations with null boards
        const validInvitations = (data || []).filter((inv) => inv.boards !== null)
        setInvitations(validInvitations)
      }

      setLoading(false)
    }

    loadInvitations()
  }, [])

  const handleAccept = async (collaborationId: string) => {
    setProcessingIds((prev) => new Set(prev).add(collaborationId))

    console.log("Accepting invitation:", collaborationId)
    const { error } = await acceptInvitation(collaborationId)

    if (error) {
      console.error("Accept error:", error)
      alert(error)
    } else {
      console.log("Invitation accepted successfully")
      setInvitations((prev) => prev.filter((inv) => inv.id !== collaborationId))
      // Refresh the page to show the new board in the main grid
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }

    setProcessingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(collaborationId)
      return newSet
    })
  }

  const handleReject = async (collaborationId: string) => {
    setProcessingIds((prev) => new Set(prev).add(collaborationId))

    console.log("Rejecting invitation:", collaborationId)
    const { error } = await rejectInvitation(collaborationId)

    if (error) {
      console.error("Reject error:", error)
      alert(error)
    } else {
      console.log("Invitation rejected successfully")
      setInvitations((prev) => prev.filter((inv) => inv.id !== collaborationId))
    }

    setProcessingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(collaborationId)
      return newSet
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "editor":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full access - can edit and manage collaborators"
      case "editor":
        return "Can edit and comment on the board"
      case "viewer":
        return "Read-only access to view the board"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Pending Invitations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 bg-muted rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Mail className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-foreground">Pending Invitations</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {invitations.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((invitation) => {
          // Safety check for boards
          if (!invitation.boards) {
            return null
          }

          return (
            <Card key={invitation.id} className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{invitation.boards.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">You've been invited to collaborate</CardDescription>
                  </div>
                  <Badge className={`${getRoleColor(invitation.role)} flex items-center space-x-1`}>
                    {getRoleIcon(invitation.role)}
                    <span className="capitalize">{invitation.role}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Board preview */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                    {invitation.boards.thumbnail_url ? (
                      <img
                        src={invitation.boards.thumbnail_url || "/placeholder.svg"}
                        alt={invitation.boards.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm">No preview</div>
                    )}
                  </div>

                  {/* Role description */}
                  <p className="text-sm text-muted-foreground">{getRoleDescription(invitation.role)}</p>

                  {/* Board description */}
                  {invitation.boards.description && (
                    <p className="text-sm text-foreground line-clamp-2">{invitation.boards.description}</p>
                  )}

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAccept(invitation.id)}
                      disabled={processingIds.has(invitation.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {processingIds.has(invitation.id) ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      onClick={() => handleReject(invitation.id)}
                      disabled={processingIds.has(invitation.id)}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {processingIds.has(invitation.id) ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
