"use server"

import { createClient } from "../../../../../../../supabase/server"
import { redirect } from "next/navigation"

export async function displan_project_designer_css_create(folderId?: string | null) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "project_create")

    // If creating in a folder, check permissions
    if (folderId) {
      const accessCheck = await displan_folder_check_access(folderId)
      if (!accessCheck.success || !accessCheck.hasAccess) {
        return { success: false, error: "Access denied to this folder" }
      }

      if (accessCheck.role === "Viewer") {
        return { success: false, error: "Viewers cannot create projects" }
      }
    }

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .insert({
        name: "Untitled Project",
        owner_id: user.id,
        folder_id: folderId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    // Redirect to the project editor
    redirect(`/editor/${data.id}`)
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function displan_project_designer_css_fetch_all() {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "browse_projects")

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch projects", data: [] }
  }
}

export async function displan_project_designer_css_fetch_by_folder(folderId: string | null) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "browse_folder")

    if (folderId === null) {
      // Fetch projects not in any folder that user owns
      const { data, error } = await supabase
        .from("displan_project_designer_css_projects")
        .select("*")
        .eq("owner_id", user.id)
        .is("folder_id", null)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    } else {
      // Check if user has access to this folder
      const accessCheck = await displan_folder_check_access(folderId)
      if (!accessCheck.success || !accessCheck.hasAccess) {
        return { success: false, error: "Access denied to this folder", data: [] }
      }

      // Fetch ALL projects in this folder (shared workspace)
      const { data, error } = await supabase
        .from("displan_project_designer_css_projects")
        .select("*")
        .eq("folder_id", folderId)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects by folder:", error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch projects by folder", data: [] }
  }
}

export async function displan_project_designer_css_search(searchTerm: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "search_projects")

    const { data, error } = await supabase
      .from("displan_project_designer_css_projects")
      .select("*")
      .eq("owner_id", user.id)
      .ilike("name", `%${searchTerm}%`)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error searching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to search projects", data: [] }
  }
}

export async function displan_project_designer_css_delete(projectId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "delete_project")

    const { error } = await supabase
      .from("displan_project_designer_css_projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", user.id) // Ensure user can only delete their own projects

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

// Folder management functions
export async function displan_folders_fetch_all() {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "browse_folders")

    // Get folders user owns
    const { data: ownedFolders, error: ownedError } = await supabase
      .from("displan_project_folders")
      .select("*")
      .eq("owner_id", user.id)
      .order("name", { ascending: true })

    if (ownedError) {
      console.error("Error fetching owned folders:", ownedError)
      return { success: false, error: ownedError.message, data: [] }
    }

    // Get folders user is a collaborator in
    const { data: collaboratorFolders, error: collabError } = await supabase
      .from("displan_folder_collaborators")
      .select(`
        displan_project_folders (
          id,
          name,
          owner_id,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted")

    if (collabError) {
      console.error("Error fetching collaborator folders:", collabError)
      return { success: false, error: collabError.message, data: [] }
    }

    // Combine owned and collaborator folders
    const allFolders = [
      ...(ownedFolders || []),
      ...(collaboratorFolders?.map((cf) => cf.displan_project_folders).filter(Boolean) || []),
    ]

    // Remove duplicates and sort
    const uniqueFolders = allFolders
      .filter((folder, index, self) => index === self.findIndex((f) => f.id === folder.id))
      .sort((a, b) => a.name.localeCompare(b.name))

    return { success: true, data: uniqueFolders }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch folders", data: [] }
  }
}

export async function displan_folder_create(name: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "create_folder")

    const { data, error } = await supabase.rpc("create_displan_folder", {
      folder_name: name,
      user_id: user.id,
    })

    if (error) {
      console.error("Error creating folder:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: { id: data } }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to create folder" }
  }
}

export async function displan_project_move_to_folder(projectId: string, folderId: string | null) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "move_project")

    const { data, error } = await supabase.rpc("move_project_to_folder", {
      project_id: projectId,
      target_folder_id: folderId,
      user_id: user.id,
    })

    if (error) {
      console.error("Error moving project:", error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: "Failed to move project - project or folder not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to move project" }
  }
}

// Collaborator functions
export async function displan_folder_invite_collaborator(folderId: string, email: string, role: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "invite_collaborator")

    const { data, error } = await supabase.rpc("create_displan_folder_collaborators_re22", {
      p_folder_id: folderId,
      p_user_email: email,
      p_role: role,
      p_invited_by: user.id,
    })

    if (error) {
      console.error("Error inviting collaborator:", error)
      return { success: false, error: error.message }
    }

    const result = data[0]
    if (!result.success) {
      return { success: false, error: result.message }
    }

    return { success: true, data: { invite_token: result.invite_token } }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to invite collaborator" }
  }
}

export async function displan_folder_create_invite_link(folderId: string, role: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "create_invite_link")

    const { data, error } = await supabase.rpc("create_invite_link", {
      p_folder_id: folderId,
      p_role: role,
      p_created_by: user.id,
    })

    if (error) {
      console.error("Error creating invite link:", error)
      return { success: false, error: error.message }
    }

    const result = data[0]
    if (!result.success) {
      return { success: false, error: result.message }
    }

    return { success: true, data: { invite_link: result.invite_link } }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to create invite link" }
  }
}

export async function displan_folder_get_collaborators(folderId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated", data: [] }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "view_collaborators")

    const { data, error } = await supabase
      .from("displan_folder_collaborators")
      .select("*")
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching collaborators:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Get activity status for each collaborator
    const collaboratorsWithActivity = await Promise.all(
      (data || []).map(async (collaborator) => {
        const { data: activityData } = await supabase.rpc("get_user_activity_status", {
          p_user_email: collaborator.user_email,
        })

        const activity = activityData?.[0] || {
          is_online: false,
          last_activity: null,
          activity_type: null,
        }

        return {
          ...collaborator,
          is_online: activity.is_online,
          last_activity: activity.last_activity,
          activity_type: activity.activity_type,
        }
      }),
    )

    return { success: true, data: collaboratorsWithActivity }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch collaborators", data: [] }
  }
}

export async function displan_folder_get_member_count(folderId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated", count: 0 }
    }

    const { data, error } = await supabase
      .from("displan_folder_collaborators")
      .select("id", { count: "exact" })
      .eq("folder_id", folderId)
      .eq("status", "accepted")

    if (error) {
      console.error("Error fetching member count:", error)
      return { success: false, error: error.message, count: 0 }
    }

    // Add 1 for the owner
    return { success: true, count: (data?.length || 0) + 1 }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to fetch member count", count: 0 }
  }
}

// Remove collaborator function
export async function displan_folder_remove_collaborator(folderId: string, collaboratorId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Update user activity
    await updateUserActivity(user.id, user.email || "", "remove_collaborator")

    // Check if current user is the folder owner
    const { data: folder, error: folderError } = await supabase
      .from("displan_project_folders")
      .select("owner_id")
      .eq("id", folderId)
      .single()

    if (folderError || !folder || folder.owner_id !== user.id) {
      return { success: false, error: "Access denied - only folder owner can remove collaborators" }
    }

    // Remove the collaborator
    const { error } = await supabase
      .from("displan_folder_collaborators")
      .delete()
      .eq("id", collaboratorId)
      .eq("folder_id", folderId)

    if (error) {
      console.error("Error removing collaborator:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to remove collaborator" }
  }
}

// Get user's role in folder
export async function displan_folder_get_user_role(folderId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated", role: null }
    }

    // Check if user is the folder owner
    const { data: folder, error: folderError } = await supabase
      .from("displan_project_folders")
      .select("owner_id")
      .eq("id", folderId)
      .single()

    if (!folderError && folder && folder.owner_id === user.id) {
      return { success: true, role: "Admin" }
    }

    // Check if user is a collaborator
    const { data: collaborator, error: collabError } = await supabase
      .from("displan_folder_collaborators")
      .select("role")
      .eq("folder_id", folderId)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .single()

    if (collabError || !collaborator) {
      return { success: false, error: "User not found in folder", role: null }
    }

    return { success: true, role: collaborator.role }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to get user role", role: null }
  }
}

// Check if user can access folder
export async function displan_folder_check_access(folderId: string) {
  try {
    const supabase = createClient()

    // Get the current user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated", hasAccess: false }
    }

    // Check if user is the folder owner
    const { data: folder, error: folderError } = await supabase
      .from("displan_project_folders")
      .select("owner_id")
      .eq("id", folderId)
      .single()

    if (!folderError && folder && folder.owner_id === user.id) {
      return { success: true, hasAccess: true, role: "Admin" }
    }

    // Check if user is a collaborator
    const { data: collaborator, error: collabError } = await supabase
      .from("displan_folder_collaborators")
      .select("role")
      .eq("folder_id", folderId)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .single()

    if (collabError || !collaborator) {
      return { success: false, error: "Access denied", hasAccess: false }
    }

    return { success: true, hasAccess: true, role: collaborator.role }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to check access", hasAccess: false }
  }
}

// Helper function to update user activity
async function updateUserActivity(userId: string, userEmail: string, activityType: string) {
  try {
    const supabase = createClient()
    await supabase.rpc("update_user_activity", {
      p_user_id: userId,
      p_user_email: userEmail,
      p_activity_type: activityType,
    })
  } catch (error) {
    console.error("Failed to update user activity:", error)
  }
}

// Function to get folder owner info
export async function displan_folder_get_owner_info(folderId: string) {
  try {
    const supabase = createClient()

    const { data: folder, error } = await supabase
      .from("displan_project_folders")
      .select("owner_id")
      .eq("id", folderId)
      .single()

    if (error || !folder) {
      return { success: false, error: "Folder not found", data: null }
    }

    // Get owner's email from auth.users (this might need adjustment based on your setup)
    // For now, we'll return the owner_id and you can get email from your user management
    return { success: true, data: { owner_id: folder.owner_id } }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to get folder owner", data: null }
  }
}
