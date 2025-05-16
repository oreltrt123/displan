"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Palette,
  MoreHorizontal,
  Grid,
  List,
  Calendar,
  ChevronDown,
  Plus,
  Settings,
  Trash2,
  ExternalLink,
} from "lucide-react"
import WebsiteSearch from "./website-search"
import DeleteProjectModal from "./delete-project-modal"
import "../styles/button.css"

interface Website {
  id: string
  name: string
  type: string
  created_at: string
  [key: string]: any
}

interface WebsiteGridProps {
  websites: Website[]
  username: string
  isPremiumUser: boolean
}

export default function WebsiteGrid({ websites = [], username, isPremiumUser }: WebsiteGridProps) {
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>(websites)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)

  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const projectDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Sort websites by creation date
  const sortWebsites = (websites: Website[], order: "newest" | "oldest") => {
    return [...websites].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return order === "newest" ? dateB - dateA : dateA - dateB
    })
  }

  // Apply sorting when sort order changes
  useEffect(() => {
    setFilteredWebsites(sortWebsites(filteredWebsites, sortOrder))
  }, [sortOrder])

  // Handle search results with current sort order
  const handleSearchResults = (results: Website[]) => {
    setFilteredWebsites(sortWebsites(results, sortOrder))
  }

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle sort dropdown
      if (showSortDropdown && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false)
      }

      // Handle project dropdowns
      if (activeDropdown && projectDropdownRefs.current[activeDropdown]) {
        const dropdown = projectDropdownRefs.current[activeDropdown]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setActiveDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSortDropdown, activeDropdown])

  // Toggle project dropdown
  const toggleProjectDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle delete project
  const handleDeleteProject = (website: Website) => {
    setSelectedWebsite(website)
    setDeleteModalOpen(true)
  }

  // Confirm delete project
  const confirmDeleteProject = () => {
    if (selectedWebsite) {
      // Here you would call your API to delete the project
      console.log("Deleting project:", selectedWebsite.id)

      // Update the UI by removing the deleted project
      const updatedWebsites = filteredWebsites.filter((w) => w.id !== selectedWebsite.id)
      setFilteredWebsites(updatedWebsites)
    }
  }

  return (
    <>
      {/* Workspace Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{username}'s Workspace</h1>
          {!isPremiumUser && (
            <Link href="/dashboard/apps/website-builder/designer/subscription">
              <button className=" text-sm bg_button px-3 py-1 rounded-md transition-colors">
                Starter Workspace
              </button>
            </Link>
          )}
        </div>
        <Link href="/dashboard/apps/website-builder/designer/new">
        <button className="new_site_button">
        <Plus className="icon" />
         New site
        </button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <WebsiteSearch websites={websites} onFilteredWebsitesChange={handleSearchResults} />
        <div className="flex items-center gap-2">
          <div className="relative" ref={sortDropdownRef}>
            <button
              className="button_edit_project_r222"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className="text-sm">Date created</span>
            </button>

            {showSortDropdown && (
              <div className="menu_container">
                <div className="py-1">
                  <button
                    className="menu_item"
                    onClick={() => {
                      setSortOrder("newest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Newest first
                  </button>
                  <button
                    className="menu_item"
                    onClick={() => {
                      setSortOrder("oldest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Oldest first
                  </button>
                </div>
              </div>
            )}
          </div>
      <div className="toggle-button-container">
      <button
        className={`toggle-button ${viewMode === "grid" ? "active" : "inactive"}`}
        style={{ borderRadius: "8px 0 0 8px" }}
        onClick={() => setViewMode("grid")}
      >
        <Grid className="icon" />
        Grid
      </button>
      <button
        className={`toggle-button ${viewMode === "list" ? "active" : "inactive"}`}
        style={{ borderRadius: "0 8px 8px 0" }}
        onClick={() => setViewMode("list")}
      >
        <List className="icon" />
        List
      </button>
     </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        } mb-8`}
      >
        {filteredWebsites.length > 0 ? (
          filteredWebsites.map((website) => (
            <div
              key={website.id}
              className={`border border-gray-200 dark:border-gray-900 rounded-lg overflow-hidden group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`${viewMode === "grid" ? "h-40" : "h-32 w-48"} bg-gray-100 dark:bg-gray-800 relative`}>
                {/* Site preview image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <div className="w-full h-full p-4">
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 mb-3 rounded"></div>
                    <div className="flex gap-2 h-24">
                      <div className="w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-2/3 flex flex-col gap-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={`/dashboard/apps/website-builder/designer/edit/${website.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view_site"
                  >
                    <span className="view_site_rr2">View site</span>
                  </a>
                </div>
              </div>
              <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{website.name || "Untitled"}</h3>
                <div className="flex flex-col mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5" />
                    Starter site
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created {formatDate(website.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Palette size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
              {websites.length > 0 ? "No matching projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {websites.length > 0 ? "Try a different search term" : "Create your first website project to get started"}
            </p>
            {websites.length === 0 && (
              <Link
                href="/dashboard/apps/website-builder/designer/new"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Project
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Project Modal */}
      {selectedWebsite && (
        <DeleteProjectModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={confirmDeleteProject}
          projectName={selectedWebsite.name || "Untitled"}
        />
      )}
    </>
  )
}
