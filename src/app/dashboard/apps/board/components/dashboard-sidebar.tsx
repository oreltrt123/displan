"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, FolderOpen, Archive, Plus } from "lucide-react"
import Link from "next/link"
import { getStarredBoards } from "../actions/board-actions"
import type { WorkingBoard } from "../actions/working-board-actions"

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [starredBoards, setStarredBoards] = useState<WorkingBoard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStarredBoards() {
      try {
        const { data } = await getStarredBoards()
        setStarredBoards(data)
      } catch (error) {
        console.error("Error fetching starred boards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStarredBoards()
  }, [])

  return (
    <div className={`w-64 bg-background border-r border-border ${className}`}>
      <div className="p-4 space-y-4">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Starred Boards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              Starred Boards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : starredBoards.length === 0 ? (
              <p className="text-xs text-muted-foreground">No starred boards yet. Star a board to see it here!</p>
            ) : (
              <div className="space-y-1">
                {starredBoards.map((board) => (
                  <Link key={board.id} href={`/dashboard/apps/board/${board.id}`} className="block">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group">
                      <div className="w-8 h-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded flex-shrink-0 flex items-center justify-center">
                        {board.thumbnail_url ? (
                          <img
                            src={board.thumbnail_url || "/placeholder.svg"}
                            alt=""
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs">🎨</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{board.board_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(board.updated_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start h-8">
              <FolderOpen className="h-4 w-4 mr-2" />
              All Boards
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start h-8">
              <Archive className="h-4 w-4 mr-2" />
              Archived
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
