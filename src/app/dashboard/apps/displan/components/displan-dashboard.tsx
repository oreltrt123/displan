"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Grid, List, Plus } from "lucide-react"
import { DisplanProjectCard } from "./displan-project-card"
import type { DisplanProjectDesignerCssProject, ViewMode } from "../lib/types/displan-types"
import {
  displan_project_designer_css_create,
  displan_project_designer_css_fetch_all,
  displan_project_designer_css_search,
} from "../lib/actions/displan-project-actions"
import Link from "next/link"
import "../../website-builder/designer/styles/button.css"
import "@/styles/navbar.css"

interface DisplanDashboardProps {
  initialProjects: DisplanProjectDesignerCssProject[]
}

export function DisplanDashboard({ initialProjects }: DisplanDashboardProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<DisplanProjectDesignerCssProject[]>(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      await displan_project_designer_css_create()
    } catch (error) {
      console.error("Failed to create project:", error)
      setIsCreating(false)
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      const result = await displan_project_designer_css_fetch_all()
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

  const handleOpenProject = (projectId: string) => {
    router.push(`/dashboard/apps/displan/editor/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-black dark:text-white link_button dsafafwf2">
            <img src="/logo_light_mode.png" alt="Logo" className="dark:hidden" />
            <img src="/logo_dark_mode.png" alt="Logo" className="hidden dark:block" />
          </Link>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
                <input
                type="text"
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input_field"
                />
              </div>
            </div>

            {/* Create Project Button */}
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className="button_edit_project_r222SDS"
              >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="toggle-button-container1233">
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
            <p className="text-gray-500">No projects found. Create your first project to get started!</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {projects.map((project) => (
              <DisplanProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onOpenProject={handleOpenProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
