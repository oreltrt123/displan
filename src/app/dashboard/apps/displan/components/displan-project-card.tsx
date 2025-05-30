"use client"

import type { DisplanProjectDesignerCssProject } from "../lib/types/displan-types"
import { formatDistanceToNow } from "date-fns"

interface DisplanProjectCardProps {
  project: DisplanProjectDesignerCssProject
  viewMode: "grid" | "list"
  onOpenProject: (projectId: string) => void
}

export function DisplanProjectCard({ project, viewMode, onOpenProject }: DisplanProjectCardProps) {
  const handleOpenProject = () => {
    onOpenProject(project.id)
  }

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
            preview
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">
              Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="badge_b1arctdq clickable_csx2rjz plans_p10t7dc2 freeSite text-black">Free</div>
        <button
          onClick={handleOpenProject}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Open project
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-background p-4 hover:shadow-md transition-shadow" onClick={handleOpenProject}>
       {project.social_preview_url ? (
          <img
            src={project.social_preview_url || "/placeholder.svg"}
            alt="Project preview"
            className="thumbnailContainerDark"
          />
        ) : (
          <div className="thumbnailContainerDark">
          </div>
        )}
      <div className="space-y-2 _dddddd1_project">
        <div className="badge_b1arctdq clickable_csx2rjz plans_p10t7dc2 freeSite"><span className="badge_b1arctdq_free_span_text">Free</span></div>
        <h3 className="text-sm Text_css_project_simple">{project.name}</h3>
        <p className="Text_css_project_simple_p">
          Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
