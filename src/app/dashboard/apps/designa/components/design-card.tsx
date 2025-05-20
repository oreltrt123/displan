"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Design } from "../types/design"
import { formatDistanceToNow } from "date-fns"
import { Edit2, Calendar, MoreHorizontal, Trash2, Copy } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createClient } from "../../../../../../supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DesignCardProps {
  design: Design
}

export default function DesignCard({ design }: DesignCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createdDate = new Date(design.created_at)
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })

  const handleEditClick = () => {
    router.push(`/dashboard/apps/designa/editor/${design.id}`)
  }

  const handleDeleteDesign = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.from("designs").delete().eq("id", design.id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting design:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDuplicateDesign = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("designs")
        .insert({
          name: `${design.name} (Copy)`,
          description: design.description,
          user_id: user.id,
          content: design.content,
        })
        .select()
        .single()

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error duplicating design:", error)
    }
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md group">
        <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0">
          <CardTitle className="text-lg line-clamp-1">{design.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicateDesign}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pb-2 cursor-pointer" onClick={handleEditClick}>
          <div className="h-32 bg-secondary/30 rounded-md flex items-center justify-center mb-3 overflow-hidden group-hover:bg-secondary/50 transition-colors">
            {/* This would be a preview of the design */}
            {design.content && Object.keys(design.content).length > 0 ? (
              <div className="text-xs text-muted-foreground">Preview Available</div>
            ) : (
              <div className="text-xs text-muted-foreground">No Preview</div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {design.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{timeAgo}</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {design.status || "Draft"}
          </Badge>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the design "{design.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDesign}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
