"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"

interface UserMenuProps {
  userEmail: string | null
  onLogin: () => void
  onLogout: () => void
  onOpenSettings: () => void
}

export function UserMenu({ userEmail, onLogin, onLogout, onOpenSettings }: UserMenuProps) {
  if (!userEmail) {
    return (
      <Button onClick={onLogin} variant="outline" size="sm">
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <User className="h-4 w-4" />
          Hello, {userEmail.split("@")[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Supabase Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
