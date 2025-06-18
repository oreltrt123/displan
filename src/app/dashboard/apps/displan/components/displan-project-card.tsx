"use client"

import type React from "react"

import type { DisplanProjectDesignerCssProject } from "../lib/types/displan-types"
import { formatDistanceToNow } from "date-fns"
import {
  ExternalLink,
  MoreVertical,
  Trash2,
  Settings,
  Loader2,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  FolderOpen,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { displan_project_designer_css_get_project_settings } from "../lib/actions/displan-project-settings-actions"
import { displan_folders_fetch_all, displan_project_move_to_folder } from "../lib/actions/displan-project-actions"
import "../../../../../styles/sidebar_settings_editor.css"

interface DisplanProjectCardProps {
  project: DisplanProjectDesignerCssProject
  viewMode: "grid" | "list"
  onOpenProject: (projectId: string) => void
  onProjectDeleted?: (projectId: string) => void
  onProjectMoved?: (projectId: string) => void
}

interface Folder {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export function DisplanProjectCard({
  project,
  viewMode,
  onOpenProject,
  onProjectDeleted,
  onProjectMoved,
}: DisplanProjectCardProps) {
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "loading">("loading")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  // Password protection states
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false)
  const [projectPassword, setProjectPassword] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    checkUserPlan()
    loadProjectSettings()
    loadFolders()

    // Listen for subscription changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "displan_ai_subscription") {
        checkUserPlan()
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("mousedown", handleClickOutside)
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  // Load folders for move functionality
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

  // Load project settings to check for password protection
  const loadProjectSettings = async () => {
    try {
      const result = await displan_project_designer_css_get_project_settings(project.id)
      if (result.success && result.data) {
        setProjectPassword(result.data.password_protection || null)
      }
    } catch (error) {
      console.error("Failed to load project settings:", error)
    }
  }

  // Check user plan
  const checkUserPlan = () => {
    try {
      // Get current user ID
      const userId = getCurrentUserId()

      if (!userId) {
        setUserPlan("free")
        return
      }

      // Check localStorage for subscription
      const subscriptionData = localStorage.getItem("displan_ai_subscription")
      if (subscriptionData) {
        try {
          const parsedData = JSON.parse(subscriptionData)
          console.log("ProjectCard: Found subscription data:", parsedData)

          if (parsedData.active && parsedData.userId === userId && new Date(parsedData.expiresAt) > new Date()) {
            console.log("ProjectCard: User has active subscription")
            setUserPlan("pro")
            return
          }
        } catch (e) {
          console.error("Error parsing subscription data:", e)
        }
      }

      // Default to free if no valid subscription found
      console.log("ProjectCard: No valid subscription found, setting to free")
      setUserPlan("free")
    } catch (error) {
      console.error("ProjectCard: Failed to check user plan:", error)
      setUserPlan("free")
    }
  }

  // Helper function to get current user ID - FIXED TO GENERATE UUID
  const getCurrentUserId = () => {
    let userId = localStorage.getItem("displan_user_id")
    if (!userId) {
      // Generate a proper UUID instead of string
      userId = crypto.randomUUID()
      localStorage.setItem("displan_user_id", userId)
    }
    return userId
  }

  const handleOpenProject = () => {
    // Check if project has password protection
    if (projectPassword && projectPassword.trim() !== "") {
      // Show password modal
      setShowPasswordModal(true)
      setPasswordInput("")
      setPasswordError("")
    } else {
      // No password protection, open project directly
      onOpenProject(project.id)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordInput.trim()) {
      // If no password entered, show error - don't allow access
      setPasswordError("Password is required to access this project.")
      return
    }

    setIsVerifyingPassword(true)
    setPasswordError("")

    // Simulate verification delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (passwordInput === projectPassword) {
      // Correct password - grant access
      setShowPasswordModal(false)
      setPasswordInput("")
      setIsVerifyingPassword(false)
      onOpenProject(project.id)
    } else {
      // Wrong password - deny access
      setPasswordError("Incorrect password. Please try again.")
      setIsVerifyingPassword(false)
      setPasswordInput("")
    }
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordInput("")
    setPasswordError("")
    setIsVerifyingPassword(false)
  }

  const handleOpenLivesite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.published_url) {
      window.open(project.published_url, "_blank")
    }
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setShowDropdown(!showDropdown)
  }

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowDeleteModal(true)
  }

  const openMoveModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowMoveModal(true)
    setSelectedFolderId(null)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const closeMoveModal = () => {
    setShowMoveModal(false)
    setSelectedFolderId(null)
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)

    try {
      // Use the project's actual owner_id instead of generated user ID
      const projectOwnerId = project.owner_id

      console.log("Attempting to delete project:", {
        project_id: project.id,
        owner_id: projectOwnerId,
      })

      // Method 1: Try using the RPC function with the actual owner_id from the project
      const { data: rpcData, error: rpcError } = await supabase.rpc("delete_displan_project", {
        project_id: project.id,
        user_id: projectOwnerId, // Use the actual owner_id from the project
      })

      console.log("RPC Response:", { data: rpcData, error: rpcError })

      if (rpcError) {
        console.error("RPC Error:", rpcError)

        // Method 2: Fallback - Try direct delete using the project's owner_id
        console.log("Trying direct delete as fallback...")
        const { error: directError } = await supabase
          .from("displan_project_designer_css_projects")
          .delete()
          .eq("id", project.id)
          .eq("owner_id", projectOwnerId)

        if (directError) {
          console.error("Direct delete error:", directError)
          alert(`Failed to delete project: ${directError.message}`)
          return
        }
      }

      console.log("Project deleted successfully")

      // Close modal after a brief delay to show loading state
      setTimeout(() => {
        setShowDeleteModal(false)
        setIsDeleting(false)

        // Show success notification
        setShowNotification(true)

        // Auto-dismiss notification after 5 seconds
        notificationTimeoutRef.current = setTimeout(() => {
          setShowNotification(false)
        }, 5000)

        // Notify parent component that project was deleted
        if (onProjectDeleted) {
          onProjectDeleted(project.id)
        }
      }, 1000)
    } catch (error) {
      console.error("Unexpected error deleting project:", error)
      alert(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsDeleting(false)
    }
  }

  const handleMoveProject = async () => {
    if (selectedFolderId === undefined) return

    setIsMoving(true)

    try {
      const result = await displan_project_move_to_folder(project.id, selectedFolderId)

      if (result.success) {
        // Close modal after a brief delay to show loading state
        setTimeout(() => {
          setShowMoveModal(false)
          setIsMoving(false)
          setSelectedFolderId(null)

          // Show success notification
          setShowNotification(true)

          // Auto-dismiss notification after 5 seconds
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false)
          }, 5000)

          // Notify parent component that project was moved
          if (onProjectMoved) {
            onProjectMoved(project.id)
          }
        }, 1000)
      } else {
        alert(`Failed to move project: ${result.error}`)
        setIsMoving(false)
      }
    } catch (error) {
      console.error("Unexpected error moving project:", error)
      alert(`Failed to move project: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsMoving(false)
    }
  }

  const handleProjectSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(false)
    // Navigate to project settings
    window.location.href = `/dashboard/apps/displan/editor/${project.id}/settings`
  }

  // Render three-dot menu
  const renderMenuButton = () => {
    return (
      <div className="badge_b1arctdq" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleMenuClick} className="badge_b1arctdq_free_span_text" disabled={isDeleting}>
          <MoreVertical className="w-4 h-4 text-black dark:text-white sdadwdasdadawdasdaw" />
        </button>

        {showDropdown && (
          <div className="menu_container">
             <button onClick={openMoveModal} className="menu_item">
              <span className="">Move</span>
            </button>
            <button onClick={handleProjectSettings} className="menu_item">
              <span className="">Project Settings</span>
            </button>
            <button onClick={openDeleteModal} disabled={isDeleting} className="menu_item">
              <span className="">Delete Project</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // Password verification modal
  const renderPasswordModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isVerifyingPassword ? closePasswordModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="settings_nav_section_title122323">Password Protected</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isVerifyingPassword ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Verifying password...</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <span className="Text_span_css_codecss1212">
                    This project is password protected. You must enter the correct password to access it.
                  </span>

                  <div className="relative">
                    <input
                      type={showPasswordInput ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="input_field_re223 pr-10 w-full"
                      placeholder="Enter password"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordInput(!showPasswordInput)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      className="button_edit_projectsfdafgfwf12_dfdd_none"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button_edit_project_r22232_Bu">
                      Continue
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Move project modal
  const renderMoveModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={!isMoving ? closeMoveModal : undefined}></div>
        <div className="bg_13_fsdf_delete relative z-10 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2 mb-4">
            <FolderOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="settings_nav_section_title122323">Move ({project.name})</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isMoving ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Moving project...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  Select the folder where you want to move this project:
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {/* All folder option */}
                  <button
                    onClick={() => setSelectedFolderId(null)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedFolderId === null
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-4 h-4" />
                      <span className="Text_span_css_codecss">All</span>
                      {selectedFolderId === null && <ArrowRight className="w-4 h-4 ml-auto text-blue-500" />}
                    </div>
                  </button>

                  {/* User folders */}
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedFolderId === folder.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4" />
                        <span className="Text_span_css_codecss">{folder.name}</span>
                        {selectedFolderId === folder.id && <ArrowRight className="w-4 h-4 ml-auto text-blue-500" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button onClick={closeMoveModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Cancel
                  </button>
                  <button
                    onClick={handleMoveProject}
                    disabled={selectedFolderId === undefined}
                    className="button_edit_project_r22232_Bu"
                  >
                    Move
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Delete confirmation modal
  const renderDeleteModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isDeleting ? closeDeleteModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10">
          <div className="">
            <h3 className="settings_nav_section_title122323">Delete Project</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />

          <div className="space-y-4">
            {isDeleting ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Deleting project...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  This action is permanent and cannot be undone. The project and all its contents, including files and
                  data, will be permanently deleted.
                </span>
                <div className="flex space-x-3">
                  <button onClick={closeDeleteModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Cancel
                  </button>
                  <button onClick={handleDeleteProject} className="button_edit_projectsfdafgfwf12_dfdd_delete">
                    Delete Project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Success notification
  const renderNotification = () => {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-up">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-white dark:text-black">
          {showMoveModal || isMoving ? "Project successfully moved" : "Project successfully deleted"}
        </span>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4" onClick={handleOpenProject}>
            <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 relative">
              preview
              {projectPassword && <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-600" />}
            </div>
            <div>
            {renderMenuButton()}
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                {projectPassword && <Lock className="w-4 h-4 text-gray-500" />}
              </div>
              <p className="text-sm text-gray-500">
                Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </p>
              {project.published_url && (
                <button
                  onClick={handleOpenLivesite}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {project.published_url}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenProject}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Open project
            </button>
          </div>
        </div>
        {showPasswordModal && renderPasswordModal()}
        {showDeleteModal && renderDeleteModal()}
        {showMoveModal && renderMoveModal()}
        {showNotification && renderNotification()}
      </>
    )
  }

  return (
    <>
      <div className="rounded-lg p-4 transition-shadow relative dasdawdasdawdd">
        <div onClick={handleOpenProject}>
          <div className="relative">
            {project.social_preview_url ? (
              <img
                src={project.social_preview_url || "/placeholder.svg"}
                alt="Project preview"
                className="thumbnailContainerDark"
              />
            ) : (
              <div className="thumbnailContainerDark"></div>
            )}
            {projectPassword && (
              <div className="absolute top-2 left-[8px] bg-black bg-opacity-50 rounded-full p-1">
                <Lock className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="space-y-2 _dddddd1_project">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm Text_css_project_simple">{project.name}</h3>
            </div>
            <p className="Text_css_project_simple_p">
              Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </p>
            {project.published_url && (
              <button
                onClick={handleOpenLivesite}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {project.published_url}
              </button>
            )}
          </div>
        </div>
        <div className="safasfawfafs">{renderMenuButton()}</div>
      </div>
      {showPasswordModal && renderPasswordModal()}
      {showDeleteModal && renderDeleteModal()}
      {showMoveModal && renderMoveModal()}
      {showNotification && renderNotification()}
    </>
  )
}
