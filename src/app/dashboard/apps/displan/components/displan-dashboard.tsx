"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Grid, List, User, Folder, Plus, FolderPlus, Users, X, UserPlus, RefreshCw, Circle } from "lucide-react"
import { DisplanProjectCard } from "./displan-project-card"
import type { DisplanProjectDesignerCssProject, ViewMode } from "../lib/types/displan-types"
import {
  displan_project_designer_css_create,
  displan_project_designer_css_fetch_by_folder,
  displan_project_designer_css_search,
  displan_folders_fetch_all,
  displan_folder_create,
  displan_folder_get_member_count,
  displan_folder_get_collaborators,
  displan_folder_create_invite_link,
  displan_folder_get_user_role,
  displan_folder_remove_collaborator,
  displan_folder_get_owner_info,
} from "../lib/actions/displan-project-actions"
import { supabase } from "@/lib/supabase-client"
import "../../website-builder/designer/styles/button.css"
import "@/styles/navbar.css"
import "@/styles/sidebar_settings_editor.css"

interface DisplanDashboardProps {
  initialProjects: DisplanProjectDesignerCssProject[]
  currentFolderId?: string
}

export function DisplanDashboard({ initialProjects, currentFolderId }: DisplanDashboardProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<DisplanProjectDesignerCssProject[]>(initialProjects)
  const [folders, setFolders] = useState<any[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // Collaborators modal states
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [collaboratorsTab, setCollaboratorsTab] = useState<"invite" | "members">("invite")
  const [memberCount, setMemberCount] = useState(1)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [inviteLink, setInviteLink] = useState("")
  const [inviteRole, setInviteRole] = useState("Editor")
  const [searchMembers, setSearchMembers] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [currentUserId, setCurrentUserId] = useState("")
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoadingRole, setIsLoadingRole] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [folderOwnerEmail, setFolderOwnerEmail] = useState("")

  useEffect(() => {
    loadCurrentUser()
    loadFolders()
    loadUserRole()
    if (selectedFolderId) {
      loadMemberCount()
      loadCollaborators()
      loadFolderOwner()
    }

    // Update user activity every 30 seconds
    const activityInterval = setInterval(() => {
      updateUserActivity()
    }, 30000)

    // Mark user as offline when leaving
    const handleBeforeUnload = () => {
      if (currentUserId) {
        navigator.sendBeacon("/api/mark-offline", JSON.stringify({ userId: currentUserId }))
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      clearInterval(activityInterval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [selectedFolderId, currentUserId])

  const updateUserActivity = async () => {
    if (currentUserId && currentUserEmail) {
      try {
        await supabase.rpc("update_user_activity", {
          p_user_id: currentUserId,
          p_user_email: currentUserEmail,
          p_activity_type: "dashboard_active",
        })
      } catch (error) {
        console.error("Failed to update activity:", error)
      }
    }
  }

  const loadCurrentUser = async () => {
    setIsLoadingUser(true)
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      console.log("Loading user:", { user: user?.email, error })

      if (error) {
        console.error("Error getting user:", error)
        setIsLoadingUser(false)
        return
      }

      if (user?.email) {
        setCurrentUserEmail(user.email)
        setCurrentUserId(user.id)
        console.log("User loaded successfully:", user.email)

        // Update activity on load
        await supabase.rpc("update_user_activity", {
          p_user_id: user.id,
          p_user_email: user.email,
          p_activity_type: "dashboard_load",
        })
      } else {
        console.log("No user email found")
      }
    } catch (error) {
      console.error("Failed to get current user:", error)
    } finally {
      setIsLoadingUser(false)
    }
  }

  const loadFolders = async () => {
    try {
      const result = await displan_folders_fetch_all()
      if (result.success) {
        setFolders(result.data)
      }
    } catch (error) {
      console.error("Failed to load folders:", error)
    }
  }

  const loadMemberCount = async () => {
    if (!selectedFolderId) return
    try {
      const result = await displan_folder_get_member_count(selectedFolderId)
      if (result.success) {
        setMemberCount(result.count)
      }
    } catch (error) {
      console.error("Failed to load member count:", error)
    }
  }

  const loadCollaborators = async () => {
    if (!selectedFolderId) return
    try {
      const result = await displan_folder_get_collaborators(selectedFolderId)
      if (result.success) {
        setCollaborators(result.data)
      }
    } catch (error) {
      console.error("Failed to load collaborators:", error)
    }
  }

  const loadFolderOwner = async () => {
    if (!selectedFolderId) return
    try {
      const result = await displan_folder_get_owner_info(selectedFolderId)
      if (result.success && result.data) {
        // For now, we'll use the owner_id. You might want to fetch the actual email
        setFolderOwnerEmail("Admin") // Placeholder
      }
    } catch (error) {
      console.error("Failed to load folder owner:", error)
    }
  }

  const generateInviteLink = async () => {
    if (!selectedFolderId) return
    setIsGeneratingLink(true)
    try {
      const result = await displan_folder_create_invite_link(selectedFolderId, inviteRole)
      if (result.success) {
        const fullLink = `${window.location.origin}/dashboard/apps/displan/invite/${result.data.invite_link}`
        setInviteLink(fullLink)
        console.log("Generated invite link:", fullLink)
      } else {
        console.error("Failed to generate invite link:", result.error)
        alert("Failed to generate invite link: " + result.error)
      }
    } catch (error) {
      console.error("Failed to generate invite link:", error)
      alert("Failed to generate invite link")
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      await displan_project_designer_css_create(selectedFolderId)
    } catch (error) {
      console.error("Failed to create project:", error)
      setIsCreating(false)
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      // If no search term, load projects based on selected folder
      if (selectedFolderId === null) {
        const result = await displan_project_designer_css_fetch_by_folder(null)
        if (result.success) {
          setProjects(result.data)
        }
      } else {
        const result = await displan_project_designer_css_fetch_by_folder(selectedFolderId)
        if (result.success) {
          setProjects(result.data)
        }
      }
    } else {
      const result = await displan_project_designer_css_search(term)
      if (result.success) {
        setProjects(result.data)
      }
    }
  }

  const handleFolderSelect = async (folderId: string | null) => {
    setSelectedFolderId(folderId)
    setSearchTerm("") // Clear search when switching folders

    // Update URL
    if (folderId === null) {
      router.push("/dashboard/apps/displan")
    } else {
      router.push(`/dashboard/apps/displan/folder/${folderId}`)
    }

    try {
      const result = await displan_project_designer_css_fetch_by_folder(folderId)
      if (result.success) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error("Failed to load projects for folder:", error)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      const result = await displan_folder_create(newFolderName.trim())
      if (result.success) {
        setShowCreateFolderModal(false)
        setNewFolderName("")
        await loadFolders() // Reload folders
      } else {
        alert(`Failed to create folder: ${result.error}`)
      }
    } catch (error) {
      console.error("Failed to create folder:", error)
      alert("Failed to create folder")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleOpenProject = (projectId: string) => {
    router.push(`/dashboard/apps/displan/editor/${projectId}`)
  }

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleProjectMoved = (projectId: string) => {
    // Remove project from current view since it was moved
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const getCurrentFolderName = () => {
    if (selectedFolderId === null) return "All"
    const folder = folders.find((f) => f.id === selectedFolderId)
    return folder ? folder.name : "All"
  }

  const openCollaboratorsModal = () => {
    if (selectedFolderId) {
      setShowCollaboratorsModal(true)
      setInviteLink("") // Clear previous link
      generateInviteLink() // Generate new link
    }
  }

  const filteredCollaborators = collaborators.filter((collab) =>
    collab.user_email.toLowerCase().includes(searchMembers.toLowerCase()),
  )

  const loadUserRole = async () => {
    if (!selectedFolderId) {
      setUserRole("Admin") // User is admin of their own "All" folder
      return
    }

    setIsLoadingRole(true)
    try {
      const result = await displan_folder_get_user_role(selectedFolderId)
      if (result.success) {
        setUserRole(result.role)
      } else {
        setUserRole(null)
      }
    } catch (error) {
      console.error("Failed to load user role:", error)
      setUserRole(null)
    } finally {
      setIsLoadingRole(false)
    }
  }

  const removeCollaborator = async (collaboratorId: string) => {
    if (!selectedFolderId) return

    try {
      const result = await displan_folder_remove_collaborator(selectedFolderId, collaboratorId)
      if (result.success) {
        // Reload collaborators and member count
        await loadCollaborators()
        await loadMemberCount()
      } else {
        alert("Failed to remove collaborator: " + result.error)
      }
    } catch (error) {
      console.error("Failed to remove collaborator:", error)
      alert("Failed to remove collaborator")
    }
  }

  const handleCreateProjectWithPermission = async () => {
    // Check if user has permission to create projects
    if (selectedFolderId && userRole === "Viewer") {
      setShowPermissionModal(true)
      return
    }

    await handleCreateProject()
  }

  const formatLastActivity = (lastActivity: string | null) => {
    if (!lastActivity) return "Never"

    const now = new Date()
    const activity = new Date(lastActivity)
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return activity.toLocaleDateString()
  }

  const renderPermissionModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPermissionModal(false)}></div>
        <div className="bg_13_fsdf_delete relative z-10 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="settings_nav_section_title122323">Access Restricted</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="Text_span_css_codecss mb-2">Viewer Access Only</h4>
              <p className="Text_span_css_codecss1212 mb-4">
                You cannot create any project in this workspace because you can only be a viewer. You can view and open
                existing projects but you cannot create them or edit them.
              </p>
              <p className="text-sm text-gray-500">Contact the workspace admin to upgrade your permissions.</p>
            </div>

            <div className="flex justify-center">
              <button onClick={() => setShowPermissionModal(false)} className="button_edit_project_r22232_Bu">
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCreateFolderModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isCreatingFolder ? () => setShowCreateFolderModal(false) : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2 mb-4">
            <FolderPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="settings_nav_section_title122323">Create New Folder</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isCreatingFolder ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="Text_span_css_codecss">Creating folder...</span>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="Text_span_css_codecss1212">Enter a name for your new folder:</span>

                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="input_field_re223 w-full"
                    placeholder="Folder name"
                    autoFocus
                    maxLength={50}
                  />

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCreateFolderModal(false)}
                      className="button_edit_projectsfdafgfwf12_dfdd_none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim()}
                      className="button_edit_project_r22232_Bu"
                    >
                      Create Folder
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderCollaboratorsModal = () => {
    // Sort members: current user first, then admin, then others
    const sortedMembers = [...filteredCollaborators].sort((a, b) => {
      // Current user first
      if (a.user_email === currentUserEmail) return -1
      if (b.user_email === currentUserEmail) return 1

      // Admin second (if not current user)
      if (a.role === "Admin" && b.role !== "Admin") return -1
      if (b.role === "Admin" && a.role !== "Admin") return 1

      // Then by email alphabetically
      return a.user_email.localeCompare(b.user_email)
    })

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCollaboratorsModal(false)}></div>
        <div
          className="bg_13_fsdf_delete relative z-10 w-full max-w-4xl mx-4"
          style={{ maxHeight: "85vh", height: "600px", width: "100%" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="settings_nav_section_title12232324">Settings</h3>
            <button onClick={() => setShowCollaboratorsModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="border border-[#8888881A]"></div>
          <div className="flex" style={{ height: "520px" }}>
            {/* Sidebar */}
            <div className="w-48 border-r border-[#8888881A] pr-4">
              <nav className="space-y-2 asfafawfasfawff1">
                <button
                  onClick={() => setCollaboratorsTab("invite")}
                  className={`settings-nav-button ${
                    collaboratorsTab === "invite" ? "bg-[#8888881A] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <UserPlus className="settings-nav-icon" />
                  <span className="settings-nav-text">Invite</span>
                </button>
                <button
                  onClick={() => setCollaboratorsTab("members")}
                  className={`settings-nav-button ${
                    collaboratorsTab === "members" ? "bg-[#8888881A] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Users className="settings-nav-icon" />
                  <span className="settings-nav-text">Members</span>
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 pl-6">
              {collaboratorsTab === "invite" ? (
                <div className="space-y-6">
                  <div>
                    <div className="space-y-4 asfafawfasfawff">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="input_field_re223 flex-1 bg-gray-800 text-gray-300"
                          placeholder={isGeneratingLink ? "Generating link..." : "Click refresh to generate link"}
                        />
                        <select
                          value={inviteRole}
                          onChange={(e) => {
                            setInviteRole(e.target.value)
                            if (inviteLink) {
                              generateInviteLink() // Regenerate with new role
                            }
                          }}
                          className="button_edit_project_r222323A"
                          style={{ width: "10%" }}
                        >
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                        <button
                          onClick={generateInviteLink}
                          disabled={isGeneratingLink}
                          className="button_edit_project_r222323A"
                          title="Generate new link"
                        >
                          <RefreshCw className={`w-4 h-4 ${isGeneratingLink ? "animate-spin" : ""}`} />
                        </button>
                        <button
                          onClick={copyInviteLink}
                          disabled={!inviteLink || isGeneratingLink}
                          className="button_edit_project_r222SDS"
                        >
                          {linkCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-12">
                    <p className="Text_span_css_codecss1212">There are no pending invites for this workspace.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 asfafawfasfawff">
                  <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search for members..."
                        value={searchMembers}
                        onChange={(e) => setSearchMembers(e.target.value)}
                        className="input_field_re223 pl-10"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {/* Current user first */}
                    {userRole && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#8888881A]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="Text_span_css_codecss">You</p>
                            <p className="text-sm text-gray-400">
                              {isLoadingUser ? "Loading..." : currentUserEmail || "No email found"}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                              <span className="text-xs text-green-400">Active now</span>
                            </div>
                          </div>
                        </div>
                        <span className="Text_span_css_codecss">{userRole}</span>
                      </div>
                    )}

                    {/* Other members */}
                    {sortedMembers
                      .filter((collaborator) => collaborator.user_email !== currentUserEmail)
                      .map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#8888881A]"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {collaborator.user_email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="Text_span_css_codecss">{collaborator.user_email}</p>
                              <p className="text-sm text-gray-400">
                                {collaborator.status === "pending" ? "Pending" : "Registered"}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Circle
                                  className={`w-2 h-2 ${
                                    collaborator.is_online
                                      ? "fill-green-500 text-green-500"
                                      : "fill-gray-500 text-gray-500"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${collaborator.is_online ? "text-green-400" : "text-gray-400"}`}
                                >
                                  {collaborator.is_online
                                    ? "Active now"
                                    : `Last seen ${formatLastActivity(collaborator.last_activity)}`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="Text_span_css_codecss">{collaborator.role}</span>
                            {userRole === "Admin" && (
                              <button
                                onClick={() => removeCollaborator(collaborator.id)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                title="Remove collaborator"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                    {filteredCollaborators.length === 0 && searchMembers && (
                      <div className="text-center py-8">
                        <p className="Text_span_css_codecss1212">No members found matching your search.</p>
                      </div>
                    )}

                    {filteredCollaborators.length === 0 && !searchMembers && (
                      <div className="text-center py-8">
                        <p className="Text_span_css_codecss1212">
                          No collaborators yet. Use the invite link to add members.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Full Width */}
      <header className="bg-background flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Workspace Button - Far Left */}


            {/* Search - Center */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Collaborators Button - Only show if folder is selected */}
              {selectedFolderId && (
                <button
                  onClick={openCollaboratorsModal}
                  className="button_edit_project_r222SDSggaggg flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-[#8888881A] dark:bg-[#1D1D1D] rounded-md"
                >
                  <User className="w-4 h-4" />
                  <span>{memberCount}</span>
                </button>
              )}

              <button
                onClick={handleCreateProjectWithPermission}
                disabled={isCreating}
                className="button_edit_project_r222SDS"
              >
                {isCreating ? "Creating..." : "New Project"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area Below Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Left Side, Below Header */}
        <div className="settings-sidebar flex-shrink-0">
          <div className="settings-sidebar-content bg-background h-full">
            <nav className="settings-nav h-full overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input_field1asdw bg-[#8888881A] dark:bg-[#1D1D1D]"
                />
              <div className="settings-nav-section">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="settings-nav-section-title">Folders</h3>
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Create new folder"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <ul className="settings-nav-list">
                  {/* All folder - always present */}
                  <li className="settings-nav-item">
                    <button
                      onClick={() => handleFolderSelect(null)}
                      className={`settings-nav-button ${selectedFolderId === null ? "active" : ""}`}
                    >
                      <Folder className="settings-nav-icon" />
                      <span className="settings-nav-text">All</span>
                    </button>
                  </li>

                  {/* User created and accessible folders */}
                  {folders.map((folder) => (
                    <li key={folder.id} className="settings-nav-item">
                      <button
                        onClick={() => handleFolderSelect(folder.id)}
                        className={`settings-nav-button ${selectedFolderId === folder.id ? "active" : ""}`}
                      >
                        <Folder className="settings-nav-icon" />
                        <span className="settings-nav-text">{folder.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content - Right Side, Below Header */}
        <div className="flex-1 bg-[#8888881A] dark:bg-[#1D1D1D] overflow-hidden fdgrggfgrgr">
          <div className="h-full overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              {/* Page Title and Filter */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{getCurrentFolderName()}</h1>
                  <p className="text-sm text-muted-foreground">Last viewed by me</p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="toggle-button-container1233 mb-6">
                <button
                  className={`toggle_button1233 ${viewMode === "grid" ? "active" : "inactive"}`}
                  style={{ borderRadius: "8px 0 0 8px" }}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="icon" />
                  Grid
                </button>
                <button
                  className={`toggle_button1233 text-sm ${viewMode === "list" ? "active" : "inactive"}`}
                  style={{ borderRadius: "0 8px 8px 0" }}
                  onClick={() => setViewMode("list")}
                >
                  <List className="icon" />
                  List
                </button>
              </div>

              {/* Projects Grid/List */}
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No projects found matching your search."
                      : `No projects found in ${getCurrentFolderName()}. Create your first project to get started!`}
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {projects.map((project) => (
                    <DisplanProjectCard
                      key={project.id}
                      project={project}
                      viewMode={viewMode}
                      onOpenProject={handleOpenProject}
                      onProjectDeleted={handleProjectDeleted}
                      onProjectMoved={handleProjectMoved}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateFolderModal && renderCreateFolderModal()}
      {showCollaboratorsModal && renderCollaboratorsModal()}
      {showPermissionModal && renderPermissionModal()}
    </div>
  )
}
