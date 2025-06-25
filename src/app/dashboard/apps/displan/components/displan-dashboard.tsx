
  "use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
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
  displan_folder_remove_collaborator,
} from "../lib/actions/displan-project-actions"
import { supabase } from "@/lib/supabase-client"
import "../../website-builder/designer/styles/button.css"
import "@/styles/navbar.css"
import "@/styles/sidebar_settings_editor.css"

interface DisplanDashboardProps {
  initialProjects: DisplanProjectDesignerCssProject[]
  userId: string
  currentFolderId?: string
}

export function DisplanDashboard({ initialProjects, userId, currentFolderId }: DisplanDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<DisplanProjectDesignerCssProject[]>(initialProjects)
  const [folders, setFolders] = useState<any[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // Store consistent user ID in localStorage
  const [consistentUserId, setConsistentUserId] = useState(userId)

  // Collaborators modal states
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [collaboratorsTab, setCollaboratorsTab] = useState<"invite" | "members">("invite")
  const [memberCount, setMemberCount] = useState(1)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [inviteLink, setInviteLink] = useState("")
  const [inviteRole, setInviteRole] = useState("Editor")
  const [searchMembers, setSearchMembers] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [userRole, setUserRole] = useState<string | null>("Admin")

  // Template cloning states
  const [isCloningTemplate, setIsCloningTemplate] = useState(false)
  const [cloningMessage, setCloningMessage] = useState("")

  // Initialize consistent user ID
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        // Try to get real Supabase user first
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.id) {
          setConsistentUserId(user.id)
          localStorage.setItem("displan_user_id", user.id)
          return
        }
      } catch (error) {
        console.log("No Supabase user, using fallback")
      }

      // Use consistent fallback ID
      const storedUserId = localStorage.getItem("displan_user_id")
      if (storedUserId) {
        setConsistentUserId(storedUserId)
      } else {
        // Create new consistent ID and store it
        const newUserId = `guest_user_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`
        setConsistentUserId(newUserId)
        localStorage.setItem("displan_user_id", newUserId)
      }
    }

    initializeUserId()
  }, [])

  // Check for template cloning on page load
  useEffect(() => {
    const templateId = searchParams.get("clone_template")
    if (templateId && consistentUserId) {
      handleCloneTemplate(templateId)
    }
  }, [searchParams, consistentUserId])

  // Update URL with consistent user ID
  useEffect(() => {
    if (consistentUserId) {
      const currentId = searchParams.get("id")
      if (currentId !== consistentUserId) {
        const newUrl = selectedFolderId
          ? `/dashboard/apps/displan/folder/${selectedFolderId}?id=${consistentUserId}`
          : `/dashboard/apps/displan?id=${consistentUserId}`
        router.replace(newUrl)
      }
    }
  }, [consistentUserId, selectedFolderId, searchParams, router])

  useEffect(() => {
    loadFolders()
    if (selectedFolderId) {
      loadMemberCount()
      loadCollaborators()
    }
    loadCurrentUserSimple()
  }, [selectedFolderId])

  const loadCurrentUserSimple = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setCurrentUserEmail(user.email)
      } else {
        setCurrentUserEmail(`user@example.com`)
      }
    } catch (error) {
      setCurrentUserEmail(`user@example.com`)
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

  const generateInviteLink = async () => {
    if (!selectedFolderId) return
    setIsGeneratingLink(true)
    try {
      const result = await displan_folder_create_invite_link(selectedFolderId, inviteRole)
      if (result.success) {
        const fullLink = `${window.location.origin}/dashboard/apps/displan/invite/${result.data.invite_link}?id=${consistentUserId}`
        setInviteLink(fullLink)
      }
    } catch (error) {
      console.error("Failed to generate invite link:", error)
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

  // 🔥 NEW: Handle template cloning
  const handleCloneTemplate = async (templateId: string) => {
    console.log("🎨 Cloning template:", templateId)
    setIsCloningTemplate(true)
    setCloningMessage("Preparing template...")

    try {
      const userEmail = currentUserEmail || "user@example.com"

      setCloningMessage("Cloning template data...")

      const response = await fetch("/api/templates/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          userId: consistentUserId,
          userEmail,
          folderId: selectedFolderId,
        }),
      })

      const result = await response.json()
      console.log("🎨 Clone result:", result)

      if (result.success) {
        setCloningMessage("Template cloned successfully!")

        // Refresh projects list to show the new cloned project
        const refreshResult = await displan_project_designer_css_fetch_by_folder(selectedFolderId)
        if (refreshResult.success) {
          setProjects(refreshResult.data)
        }

        // Clear URL parameter
        const newUrl = selectedFolderId
          ? `/dashboard/apps/displan/folder/${selectedFolderId}?id=${consistentUserId}`
          : `/dashboard/apps/displan?id=${consistentUserId}`
        router.replace(newUrl)

        // Show success message
        setTimeout(() => {
          setIsCloningTemplate(false)
          setCloningMessage("")
          alert(`Template "${result.project_name}" has been added to your projects!`)
        }, 1000)
      } else {
        setIsCloningTemplate(false)
        setCloningMessage("")
        alert("Failed to clone template: " + result.error)
      }
    } catch (error) {
      console.error("❌ Template cloning error:", error)
      setIsCloningTemplate(false)
      setCloningMessage("")
      alert("Failed to clone template. Please try again.")
    }
  }

  // FIXED: Immediate project creation with loading state and refresh
  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      const result = await displan_project_designer_css_create(selectedFolderId)
      if (result.success) {
        // Immediately refresh projects list
        const refreshResult = await displan_project_designer_css_fetch_by_folder(selectedFolderId)
        if (refreshResult.success) {
          setProjects(refreshResult.data)
        }

        // Show success feedback
        setTimeout(() => {
          setIsCreating(false)
        }, 500) // Short delay to show success
      } else {
        setIsCreating(false)
        alert("Failed to create project: " + result.error)
      }
    } catch (error) {
      console.error("Failed to create project:", error)
      setIsCreating(false)
      alert("Failed to create project")
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      const result = await displan_project_designer_css_fetch_by_folder(selectedFolderId)
      if (result.success) {
        setProjects(result.data)
      }
    } else {
      const result = await displan_project_designer_css_search(term)
      if (result.success) {
        setProjects(result.data)
      }
    }
  }

  // FIXED: Instant folder navigation with immediate URL update
  const handleFolderSelect = async (folderId: string | null) => {
    // Update state immediately
    setSelectedFolderId(folderId)
    setSearchTerm("")

    // Update URL immediately
    const newUrl =
      folderId === null
        ? `/dashboard/apps/displan?id=${consistentUserId}`
        : `/dashboard/apps/displan/folder/${folderId}?id=${consistentUserId}`

    // Use router.push for immediate navigation
    router.push(newUrl)

    // Load projects immediately
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
        await loadFolders()
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
    router.push(`/dashboard/apps/displan/editor/${projectId}?id=${consistentUserId}`)
  }

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleProjectMoved = (projectId: string) => {
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
      setInviteLink("")
      generateInviteLink()
    }
  }

  const filteredCollaborators = collaborators.filter((collab) =>
    collab.user_email.toLowerCase().includes(searchMembers.toLowerCase()),
  )

  const removeCollaborator = async (collaboratorId: string) => {
    if (!selectedFolderId) return

    try {
      const result = await displan_folder_remove_collaborator(selectedFolderId, collaboratorId)
      if (result.success) {
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
    const sortedMembers = [...filteredCollaborators].sort((a, b) => {
      if (a.user_email === currentUserEmail) return -1
      if (b.user_email === currentUserEmail) return 1
      if (a.role === "Admin" && b.role !== "Admin") return -1
      if (b.role === "Admin" && a.role !== "Admin") return 1
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
                              generateInviteLink()
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
                    {/* Current user */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#8888881A]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="Text_span_css_codecss">You</p>
                          <p className="text-sm text-gray-400">{currentUserEmail}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                            <span className="text-xs text-green-400">Active now</span>
                          </div>
                        </div>
                      </div>
                      <span className="Text_span_css_codecss">{userRole}</span>
                    </div>

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

  // 🔥 NEW: Template cloning modal
  const renderCloningModal = () => {
    if (!isCloningTemplate) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="bg_13_fsdf_delete relative z-10 w-full max-w-md mx-4">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="settings_nav_section_title122323 mb-2">Cloning Template</h3>
            <p className="Text_span_css_codecss1212 text-center">{cloningMessage}</p>
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
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Workspace</h1>
            </div>

            {/* Search - Center */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input_field1asdw bg-[#8888881A] dark:bg-[#1D1D1D] w-full"
                />
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

              <button onClick={handleCreateProject} disabled={isCreating} className="button_edit_project_r222SDS">
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "New Project"
                )}
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
              <div className="settings-nav-section">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="settings-nav-section-title">Folders</h3>
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="p-1 hover:bg-[#8888881A] hoverdark:bg-[#1D1D1D] rounded"
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
      {renderCloningModal()}
    </div>
  )
}
