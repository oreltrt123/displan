"use client"
import { useRouter } from "next/navigation"
import { Settings, ArrowLeft } from 'lucide-react'
import Link from "next/link"

interface ChatTopbarProps {
  chatName: string
  toggleSettings: () => void
  projectId: string
}

export function ChatTopbar({ chatName, toggleSettings, projectId }: ChatTopbarProps) {
  const router = useRouter()

  return (
    <header className="h-16 bg-background border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href={`/project/${projectId}`} className="mr-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground truncate">{chatName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSettings}
          className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
          title="Chat Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
