import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message } from "../types/messaging"
import { formatDistanceToNow } from "date-fns"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  otherUserName?: string
}

export function MessageBubble({ message, isOwn, otherUserName }: MessageBubbleProps) {
  const userName = isOwn ? "You" : otherUserName || "User"
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={`text-xs ${isOwn ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
        >
          {userInitial}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
