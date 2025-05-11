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
              <button className="text-blue-600 dark:text-blue-400 text-sm bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                Starter Workspace
              </button>
            </Link>
          )}
        </div>
        <Link href="/dashboard/apps/website-builder/designer/new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
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
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">Date created</span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${
                      sortOrder === "newest"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setSortOrder("newest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Newest first
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${
                      sortOrder === "oldest"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
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
          <div className="flex border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View site
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
