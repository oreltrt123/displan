export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  conversation_id?: string
  content: string
  created_at: string
  read_at?: string
}

export interface Conversation {
  id: string
  user1_id: string
  user2_id: string
  last_message_at: string
  created_at: string
  other_user: User
  last_message?: Message
  is_pinned: boolean
  is_blocked: boolean
  is_deleted: boolean
}

export interface ConversationSettings {
  id: string
  conversation_id: string
  user_id: string
  is_pinned: boolean
  is_blocked: boolean
  is_deleted: boolean
}
