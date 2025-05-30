"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Trash2, Copy, Edit, Archive, Share, Download, FileText } from "lucide-react"
import {
  deleteBoard,
  duplicateBoard,
  renameBoard,
  updateBoardDescription,
  archiveBoard,
} from "../actions/board-actions"
import { toast } from "sonner"
import type { WorkingBoard } from "../actions/working-board-actions"

interface BoardActionsDropdownProps {
  board: WorkingBoard
  onUpdate?: () => void
}

export function BoardActionsDropdown({ board, onUpdate }: BoardActionsDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false)
  const [newName, setNewName] = useState(board.board_name)
  const [newDescription, setNewDescription] = useState(board.board_description || "")
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteBoard(board.id)
      if (result.success) {
        toast.success("Board deleted successfully")
        setShowDeleteDialog(false)
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to delete board")
      }
    } catch (error) {
      toast.error("Failed to delete board")
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const result = await duplicateBoard(board.id)
      if (result.success) {
        toast.success("Board duplicated successfully")
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to duplicate board")
      }
    } catch (error) {
      toast.error("Failed to duplicate board")
    } finally {
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!newName.trim()) return

    setLoading(true)
    try {
      const result = await renameBoard(board.id, newName.trim())
      if (result.success) {
        toast.success("Board renamed successfully")
        setShowRenameDialog(false)
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to rename board")
      }
    } catch (error) {
      toast.error("Failed to rename board")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDescription = async () => {
    setLoading(true)
    try {
      const result = await updateBoardDescription(board.id, newDescription.trim())
      if (result.success) {
        toast.success("Description updated successfully")
        setShowDescriptionDialog(false)
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to update description")
      }
    } catch (error) {
      toast.error("Failed to update description")
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    setLoading(true)
    try {
      const result = await archiveBoard(board.id)
      if (result.success) {
        toast.success("Board archived successfully")
        onUpdate?.()
      } else {
        toast.error(result.error || "Failed to archive board")
      }
    } catch (error) {
      toast.error("Failed to archive board")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/dashboard/apps/board/${board.id}`
    navigator.clipboard.writeText(url)
    toast.success("Board link copied to clipboard")
  }

  const handleExport = () => {
    // Placeholder for export functionality
    toast.info("Export feature coming soon!")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDescriptionDialog(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Edit Description
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate} disabled={loading}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive} disabled={loading}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{board.board_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
            <DialogDescription>Enter a new name for your board.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="board-name">Board Name</Label>
              <Input
                id="board-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter board name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={loading || !newName.trim()}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Description Dialog */}
      <Dialog open={showDescriptionDialog} onOpenChange={setShowDescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
            <DialogDescription>Update the description for your board.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="board-description">Description</Label>
              <Textarea
                id="board-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter board description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDescriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDescription} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
