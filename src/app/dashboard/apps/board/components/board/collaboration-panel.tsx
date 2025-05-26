"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Users, Trash2, Crown, Edit, Eye, UserPlus } from "lucide-react"
import { inviteCollaborator, getCollaborations, removeCollaborator } from "../../actions/collaboration-actions"

interface Collaboration {
  id: string
  board_id: string
  owner_id: string
  collaborator_id: string
  collaborator_email: string
  role: "admin" | "editor" | "viewer"
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

interface CollaborationPanelProps {
  boardId: string
  userRole: string | null
  onClose: () => void
}

export function CollaborationPanel({ boardId, userRole, onClose }: CollaborationPanelProps) {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor")
  const [isInviting, setIsInviting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load collaborations when component mounts
  useEffect(() => {
    const loadCollaborations = async () => {
      console.log("Loading collaborations for board:", boardId)
      setLoading(true)

      const { data, error } = await getCollaborations(boardId)

      if (error) {
        console.error("Error loading collaborations:", error)
      } else {
        console.log("Loaded collaborations:", data)
        setCollaborations(data || [])
      }

      setLoading(false)
    }

    if (boardId) {
      loadCollaborations()
    }
  }, [boardId])

  const handleInvite = async () => {
    if (!email.trim()) {
      alert("Please enter an email address")
      return
    }

    setIsInviting(true)
    console.log("Sending invitation:", { boardId, email: email.trim(), role })

    const { data, error } = await inviteCollaborator(boardId, email.trim(), role)

    if (error) {
      console.error("Invitation error:", error)
      alert(error)
    } else {
      console.log("Invitation sent successfully:", data)
      setEmail("")
      // Reload collaborations to show the new pending invitation
      const { data: updatedCollaborations } = await getCollaborations(boardId)
      if (updatedCollaborations) {
        setCollaborations(updatedCollaborations)
      }
    }

    setIsInviting(false)
  }

  const handleRemove = async (collaborationId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) {
      return
    }

    const { error } = await removeCollaborator(collaborationId)

    if (error) {
      console.error("Remove error:", error)
      alert(error)
    } else {
      // Remove from local state
      setCollaborations((prev) => prev.filter((c) => c.id !== collaborationId))
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canManageCollaborations = userRole === "owner" || userRole === "admin"

  return (
    <div className="fixed top-20 right-6 z-50 w-96 h-[500px]">
      <div className="bg-white/98 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-xl h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Collaborators</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Invite form - only show if user can manage collaborations */}
          {canManageCollaborations && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select value={role} onValueChange={(value: "admin" | "editor" | "viewer") => setRole(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                    <SelectItem value="editor">Editor - Can edit</SelectItem>
                    <SelectItem value="viewer">Viewer - Read only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} disabled={isInviting || !email.trim()} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          )}
        </div>

        {/* Collaborators List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {collaborations.map((collaboration) => (
                <div key={collaboration.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {collaboration.collaborator_email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{collaboration.collaborator_email}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(collaboration.role)}`}
                          >
                            {getRoleIcon(collaboration.role)}
                            <span className="ml-1 capitalize">{collaboration.role}</span>
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}
                          >
                            {collaboration.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {canManageCollaborations && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(collaboration.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {collaborations.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No collaborators yet</p>
                  {canManageCollaborations && (
                    <p className="text-xs text-gray-400 mt-1">Invite someone to get started</p>
                  )}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
