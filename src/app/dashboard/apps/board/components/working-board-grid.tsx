"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"
import { toggleStarBoard } from "../actions/board-actions"
import { BoardActionsDropdown } from "./board-actions-dropdown"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { WorkingBoard } from "../actions/working-board-actions"

interface WorkingBoardGridProps {
  boards: WorkingBoard[]
  onUpdate?: () => void
}

export function WorkingBoardGrid({ boards, onUpdate }: WorkingBoardGridProps) {
  const [starringBoards, setStarringBoards] = useState<Set<string>>(new Set())

  const handleStarToggle = async (e: React.MouseEvent, boardId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (starringBoards.has(boardId)) return

    setStarringBoards((prev) => new Set(prev).add(boardId))

    try {
      const result = await toggleStarBoard(boardId)
      if (result.success) {
        toast.success(result.starred ? "Board starred!" : "Board unstarred!")
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to toggle star")
      }
    } catch (error) {
      toast.error("Failed to toggle star")
    } finally {
      setStarringBoards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(boardId)
        return newSet
      })
    }
  }

  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No boards yet. Create your first board to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {boards.map((board) => (
        <Card key={board.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
          <Link href={`/dashboard/apps/board/${board.id}`}>
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg relative overflow-hidden">
                {board.thumbnail_url ? (
                  <img
                    src={board.thumbnail_url || "/placeholder.svg"}
                    alt={board.board_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-4xl text-blue-300">🎨</div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleStarToggle(e, board.id)}
                      disabled={starringBoards.has(board.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-colors",
                          board.starred ? "fill-orange-500 text-orange-500" : "text-gray-500",
                        )}
                      />
                    </Button>
                    <div onClick={(e) => e.preventDefault()}>
                      <BoardActionsDropdown board={board} onUpdate={onUpdate} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Board info */}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-sm truncate text-foreground flex-1">{board.board_name}</h3>
                  {board.starred && <Star className="h-3 w-3 fill-orange-500 text-orange-500 ml-2 flex-shrink-0" />}
                </div>
                {board.board_description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{board.board_description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {new Date(board.updated_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
