"use server"

import { createClient } from "../../../../../supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { User, Message } from "../types/messaging"

async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Ensure user exists in users table
  const { data: dbUser } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!dbUser) {
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split("@")[0],
    })
  }

  return user
}

export async function searchUsers(query: string): Promise<User[]> {
  if (!query.trim()) return []

  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq("id", currentUser.id)
      .limit(10)

    if (error) {
      console.error("Search error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in searchUsers:", error)
    return []
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = createClient()
    await getCurrentUser()

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function getMessages(userId2: string): Promise<Message[]> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${currentUser.id})`,
      )
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getMessages:", error)
    return []
  }
}

export async function sendMessage(receiverId: string, content: string): Promise<Message | null> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    // Check if current user is blocked by the receiver
    const isBlocked = await checkIfBlocked(receiverId)
    if (isBlocked) {
      throw new Error("You are blocked by this user")
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: content.trim(),
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error sending message:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in sendMessage:", error)
    throw error
  }
}

export async function getRecentConversations(): Promise<User[]> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    // Get all messages involving current user
    const { data: messages, error } = await supabase
      .from("messages")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    // Get unique user IDs
    const uniqueUserIds = new Set<string>()
    messages?.forEach((message) => {
      if (message.sender_id !== currentUser.id) {
        uniqueUserIds.add(message.sender_id)
      }
      if (message.receiver_id !== currentUser.id) {
        uniqueUserIds.add(message.receiver_id)
      }
    })

    if (uniqueUserIds.size === 0) return []

    // Get users
    const userIds = Array.from(uniqueUserIds)
    const { data: users, error: usersError } = await supabase.from("users").select("*").in("id", userIds)

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return []
    }

    // Filter out deleted conversations and get settings
    const { data: settings } = await supabase
      .from("conversation_settings")
      .select("other_user_id, is_deleted, is_pinned")
      .eq("user_id", currentUser.id)
      .in("other_user_id", userIds)

    const deletedUsers = new Set(settings?.filter((s) => s.is_deleted).map((s) => s.other_user_id) || [])
    const pinnedUsers = new Set(settings?.filter((s) => s.is_pinned).map((s) => s.other_user_id) || [])

    const filteredUsers = (users || []).filter((user) => !deletedUsers.has(user.id))

    // Sort: pinned first, then by name
    return filteredUsers.sort((a, b) => {
      const aPinned = pinnedUsers.has(a.id)
      const bPinned = pinnedUsers.has(b.id)

      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1

      return (a.name || a.email).localeCompare(b.name || b.email)
    })
  } catch (error) {
    console.error("Error in getRecentConversations:", error)
    return []
  }
}

export async function togglePinConversation(userId2: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    console.log("Toggling pin for user:", userId2)

    // Get current settings
    const { data: settings, error: getError } = await supabase
      .from("conversation_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("other_user_id", userId2)
      .single()

    if (getError && getError.code !== "PGRST116") {
      console.error("Error getting settings:", getError)
      return { success: false, message: "Failed to get settings" }
    }

    if (settings) {
      // Update existing settings
      const newPinnedState = !settings.is_pinned
      const { error: updateError } = await supabase
        .from("conversation_settings")
        .update({
          is_pinned: newPinnedState,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (updateError) {
        console.error("Error updating pin:", updateError)
        return { success: false, message: "Failed to update pin" }
      }

      console.log("Pin updated successfully:", newPinnedState)
      revalidatePath("/messages")
      return { success: true, message: newPinnedState ? "Pinned" : "Unpinned" }
    } else {
      // Create new settings with pin
      const { error: insertError } = await supabase.from("conversation_settings").insert({
        user_id: currentUser.id,
        other_user_id: userId2,
        is_pinned: true,
        is_blocked: false,
        is_deleted: false,
      })

      if (insertError) {
        console.error("Error creating pin:", insertError)
        return { success: false, message: "Failed to create pin" }
      }

      console.log("Pin created successfully")
      revalidatePath("/messages")
      return { success: true, message: "Pinned" }
    }
  } catch (error) {
    console.error("Error in togglePinConversation:", error)
    return { success: false, message: "Error toggling pin" }
  }
}

export async function toggleBlockUser(userId2: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    console.log("Toggling block for user:", userId2)

    // Get current settings
    const { data: settings, error: getError } = await supabase
      .from("conversation_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("other_user_id", userId2)
      .single()

    if (getError && getError.code !== "PGRST116") {
      console.error("Error getting settings:", getError)
      return { success: false, message: "Failed to get settings" }
    }

    if (settings) {
      // Update existing settings
      const newBlockedState = !settings.is_blocked
      const { error: updateError } = await supabase
        .from("conversation_settings")
        .update({
          is_blocked: newBlockedState,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (updateError) {
        console.error("Error updating block:", updateError)
        return { success: false, message: "Failed to update block" }
      }

      console.log("Block updated successfully:", newBlockedState)
      revalidatePath("/messages")
      return { success: true, message: newBlockedState ? "Blocked" : "Unblocked" }
    } else {
      // Create new settings with block
      const { error: insertError } = await supabase.from("conversation_settings").insert({
        user_id: currentUser.id,
        other_user_id: userId2,
        is_pinned: false,
        is_blocked: true,
        is_deleted: false,
      })

      if (insertError) {
        console.error("Error creating block:", insertError)
        return { success: false, message: "Failed to create block" }
      }

      console.log("Block created successfully")
      revalidatePath("/messages")
      return { success: true, message: "Blocked" }
    }
  } catch (error) {
    console.error("Error in toggleBlockUser:", error)
    return { success: false, message: "Error toggling block" }
  }
}

export async function deleteConversation(userId2: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    console.log("Deleting conversation with user:", userId2)

    // Get current settings
    const { data: settings, error: getError } = await supabase
      .from("conversation_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("other_user_id", userId2)
      .single()

    if (getError && getError.code !== "PGRST116") {
      console.error("Error getting settings:", getError)
      return { success: false, message: "Failed to get settings" }
    }

    if (settings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from("conversation_settings")
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (updateError) {
        console.error("Error updating delete:", updateError)
        return { success: false, message: "Failed to delete conversation" }
      }

      console.log("Conversation deleted successfully")
      revalidatePath("/messages")
      return { success: true, message: "Conversation deleted" }
    } else {
      // Create new settings with delete
      const { error: insertError } = await supabase.from("conversation_settings").insert({
        user_id: currentUser.id,
        other_user_id: userId2,
        is_pinned: false,
        is_blocked: false,
        is_deleted: true,
      })

      if (insertError) {
        console.error("Error creating delete:", insertError)
        return { success: false, message: "Failed to delete conversation" }
      }

      console.log("Conversation deleted successfully")
      revalidatePath("/messages")
      return { success: true, message: "Conversation deleted" }
    }
  } catch (error) {
    console.error("Error in deleteConversation:", error)
    return { success: false, message: "Error deleting conversation" }
  }
}

export async function checkIfBlocked(userId2: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    // Check if the other user has blocked the current user
    const { data: settings } = await supabase
      .from("conversation_settings")
      .select("is_blocked")
      .eq("user_id", userId2)
      .eq("other_user_id", currentUser.id)
      .single()

    return settings?.is_blocked || false
  } catch (error) {
    console.error("Error checking if blocked:", error)
    return false
  }
}

export async function getConversationSettings(userId2: string) {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    const { data: settings } = await supabase
      .from("conversation_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("other_user_id", userId2)
      .single()

    return {
      is_pinned: settings?.is_pinned || false,
      is_blocked: settings?.is_blocked || false,
      is_deleted: settings?.is_deleted || false,
    }
  } catch (error) {
    return {
      is_pinned: false,
      is_blocked: false,
      is_deleted: false,
    }
  }
}

export async function getCurrentUserId(): Promise<string> {
  const currentUser = await getCurrentUser()
  return currentUser.id
}

export async function syncCurrentUser(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split("@")[0],
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: "User synced successfully" }
  } catch (error) {
    return { success: false, message: "Error syncing user" }
  }
}
