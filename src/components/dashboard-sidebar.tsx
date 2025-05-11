"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserCircle, Plus, Lock, Globe, Search, Home, LogOut } from "lucide-react"

interface Project {
  id: string
  name: string
  visibility: string
}

interface Profile {
  full_name?: string
}

interface DashboardSidebarProps {
  projects: Project[]
  userEmail: string
  profile?: Profile | null
  userId: string
}

export default function DashboardSidebar({ projects, userEmail, profile, userId }: DashboardSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)

  // Filter projects when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-sm text-gray-500 dark:text-gray-400">PROJECTS</h2>
            <Link
              href="/dashboard/project/create"
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              title="New Project"
            >
              <Plus size={16} />
            </Link>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="space-y-1">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 group"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                  <span className="text-sm truncate flex-1">{project.name}</span>
                  {project.visibility === "private" ? (
                    <Lock size={14} className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100" />
                  ) : (
                    <Globe size={14} className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100" />
                  )}
                </Link>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">No projects match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet</p>
              <Link
                href="/dashboard/project/create"
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <Plus size={12} />
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || userEmail}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
