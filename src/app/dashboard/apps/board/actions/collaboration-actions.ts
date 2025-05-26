"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseClient } from "@/lib/supabase"

export async function inviteCollaborator(boardId: string, email: string, role: "admin" | "editor" | "viewer") {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  console.log("Inviting collaborator:", { boardId, email, role, inviterId: user.id })

  // Check if the inviter owns the board or is an admin
  const { data: board } = await supabase.from("boards").select("user_id").eq("id", boardId).single()

  if (!board) {
    return { error: "Board not found" }
  }

  let canInvite = false

  if (board.user_id === user.id) {
    canInvite = true
  } else {
    // Check if user is admin collaborator
    const { data: collaboration } = await supabase
      .from("collaborations")
      .select("role")
      .eq("board_id", boardId)
      .eq("collaborator_id", user.id)
      .eq("status", "accepted")
      .single()

    if (collaboration && collaboration.role === "admin") {
      canInvite = true
    }
  }

  if (!canInvite) {
    return { error: "You don't have permission to invite collaborators" }
  }

  // Check if user exists in auth.users by email
  const { data: authUsers, error: authError } = await supabase.rpc("get_user_by_email", {
    email_address: email,
  })

  if (authError || !authUsers || authUsers.length === 0) {
    return { error: "User not found with this email. They need to sign up first." }
  }

  const collaboratorId = authUsers[0].id

  // Check if user is trying to invite themselves
  if (collaboratorId === user.id) {
    return { error: "You cannot invite yourself" }
  }

  // Check if collaboration already exists
  const { data: existingCollaboration } = await supabase
    .from("collaborations")
    .select("id, status")
    .eq("board_id", boardId)
    .eq("collaborator_id", collaboratorId)
    .single()

  if (existingCollaboration) {
    if (existingCollaboration.status === "accepted") {
      return { error: "User is already a collaborator" }
    } else if (existingCollaboration.status === "pending") {
      return { error: "Invitation already sent to this user" }
    }
  }

  // Create the collaboration invitation
  const { data, error } = await supabase
    .from("collaborations")
    .insert({
      board_id: boardId,
      collaborator_id: collaboratorId,
      collaborator_email: email,
      role,
      status: "pending",
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating collaboration:", error)
    return { error: "Failed to send invitation" }
  }

  console.log("Collaboration created:", data)

  revalidatePath("/dashboard")
  return { data, error: null }
}

export async function getCollaborations(boardId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: "User not authenticated" }
  }

  console.log("Getting collaborations for board:", boardId)

  const { data, error } = await supabase
    .from("collaborations")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching collaborations:", error)
    return { data: [], error: "Failed to fetch collaborations" }
  }

  console.log("Collaborations found:", data)

  return { data: data || [], error: null }
}

export async function getUserRole(boardId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { role: null, error: "User not authenticated" }
  }

  console.log("Getting user role for board:", boardId, "user:", user.id)

  // Check if user is board owner
  const { data: board } = await supabase.from("boards").select("user_id").eq("id", boardId).single()

  if (!board) {
    return { role: null, error: "Board not found" }
  }

  if (board.user_id === user.id) {
    console.log("User is owner")
    return { role: "owner", error: null }
  }

  // Check collaboration role
  const { data: collaboration } = await supabase
    .from("collaborations")
    .select("role")
    .eq("board_id", boardId)
    .eq("collaborator_id", user.id)
    .eq("status", "accepted")
    .single()

  const role = collaboration?.role || null
  console.log("User collaboration role:", role)

  return { role, error: null }
}

export async function getPendingInvitations() {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: "User not authenticated" }
  }

  console.log("Getting pending invitations for user:", user.id)

  const { data, error } = await supabase
    .from("collaborations")
    .select(`
      id,
      board_id,
      role,
      created_at,
      boards (
        id,
        name,
        description,
        thumbnail_url
      )
    `)
    .eq("collaborator_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending invitations:", error)
    return { data: [], error: "Failed to fetch invitations" }
  }

  console.log("Pending invitations:", data)

  return { data: data || [], error: null }
}

export async function acceptInvitation(collaborationId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  console.log("Accepting invitation:", collaborationId)

  const { data, error } = await supabase
    .from("collaborations")
    .update({ status: "accepted" })
    .eq("id", collaborationId)
    .eq("collaborator_id", user.id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    console.error("Error accepting invitation:", error)
    return { error: "Failed to accept invitation" }
  }

  console.log("Invitation accepted:", data)

  revalidatePath("/dashboard")
  return { data, error: null }
}

export async function rejectInvitation(collaborationId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  console.log("Rejecting invitation:", collaborationId)

  const { error } = await supabase
    .from("collaborations")
    .delete()
    .eq("id", collaborationId)
    .eq("collaborator_id", user.id)
    .eq("status", "pending")

  if (error) {
    console.error("Error rejecting invitation:", error)
    return { error: "Failed to reject invitation" }
  }

  revalidatePath("/dashboard")
  return { error: null }
}

export async function removeCollaborator(collaborationId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { error } = await supabase.from("collaborations").delete().eq("id", collaborationId)

  if (error) {
    console.error("Error removing collaborator:", error)
    return { error: "Failed to remove collaborator" }
  }

  revalidatePath("/dashboard")
  return { error: null }
}
