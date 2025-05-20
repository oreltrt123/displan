"use client"

import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CreateDesignDialog from "./create-design-dialog"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Designs</h1>
          <p className="text-muted-foreground mt-1">Create and manage your design projects</p>
        </div>
        <CreateDesignDialog />
      </div>

      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>Welcome to Designa! Create your first design to get started.</AlertDescription>
      </Alert>
    </div>
  )
}
