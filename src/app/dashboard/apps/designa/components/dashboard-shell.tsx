import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <div className={cn("container mx-auto px-4 py-8 md:px-8", className)} {...props}>
          {children}
        </div>
      </main>
    </div>
  )
}
