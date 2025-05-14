"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { PublishDialog } from "./publish-dialog"
import type { Project } from "../types"

interface PublishButtonProps {
  project: Project
}

export function PublishButton({ project }: PublishButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center px-3 py-2 rounded text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80"
      >
        <Globe className="h-4 w-4 mr-1" />
        Publish
      </button>

      <PublishDialog project={project} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}
