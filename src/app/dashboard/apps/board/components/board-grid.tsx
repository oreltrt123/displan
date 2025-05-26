"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Edit, Users, Crown, Eye, Star, Copy, Download, Share } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteBoard } from "../actions/board-actions"
import type { Board } from "../actions/board-actions"

interface FigmaBoardGridProps {
  boards: Board[]
}

export function FigmaBoardGrid({ boards }: FigmaBoardGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this board?")) return

    setDeletingId(id)
    const { error } = await deleteBoard(id)

    if (error) {
      alert(error)
    } else {
      window.location.reload()
    }

    setDeletingId(null)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-600" />
      case "admin":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "editor":
        return <Edit className="h-3 w-3 text-blue-500" />
      case "viewer":
        return <Eye className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "admin":
        return "bg-yellow-50 text-yellow-600 border border-yellow-200"
      case "editor":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      case "viewer":
        return "bg-gray-50 text-gray-700 border border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  if (boards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
          <Users className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No boards yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Create your first design board to start collaborating with your team
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {boards.map((board) => (
        <div
          key={board.id}
          className="group relative"
          onMouseEnter={() => setHoveredId(board.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Link href={`/dashboard/apps/board/${board.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg hover:shadow-gray-100/50 overflow-hidden">
              {/* Board Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                {board.thumbnail_url ? (
                  <img
                    src={board.thumbnail_url || "/placeholder.svg"}
                    alt={board.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 ${hoveredId === board.id ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Star className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${getRoleBadgeColor(board.role || "viewer")} text-xs font-medium px-2 py-1`}>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(board.role || "viewer")}
                      <span className="capitalize">{board.role}</span>
                    </div>
                  </Badge>
                </div>

                {/* Collaboration Indicator */}
                {!board.is_owner && (
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                      <Users className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Board Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">{board.name}</h3>

                  {/* Actions Menu */}
                  {board.is_owner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(board.id)
                          }}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          disabled={deletingId === board.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === board.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Description */}
                {board.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{board.description}</p>}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Updated {formatDate(board.updated_at)}</span>
                  {!board.is_owner && <span className="text-blue-600 font-medium">Shared</span>}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
