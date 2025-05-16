"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { PublishDialog } from "./publish-dialog"
import type { Project } from "../types"
import "../styles/button.css"

interface PublishButtonProps {
  project: Project
}

export function PublishButton({ project }: PublishButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="button_edit_project"
      >
        Publish
      </button>

      <PublishDialog project={project} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}
