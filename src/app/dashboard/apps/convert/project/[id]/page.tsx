"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import "@/styles/project.css"

interface ClonedProject {
  id: string
  name: string
  url: string
  html_content: string
  created_at: string
  updated_at: string
  is_deployed: boolean
  subdomain?: string
  deployed_at?: string
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<ClonedProject | null>(null)
  const [allProjects, setAllProjects] = useState<ClonedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedHtml, setEditedHtml] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    loadProject()
    loadAllProjects()
  }, [projectId])

  const loadProject = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/projects_covert/${projectId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to load project")
      }

      const data = await response.json()
      setProject(data.project)
      setEditedName(data.project.name)
      setEditedHtml(data.project.html_content)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAllProjects = async () => {
    try {
      const response = await fetch("/api/projects/projects_covert")

      if (!response.ok) {
        console.error("Failed to load projects:", await response.text())
        return
      }

      const data = await response.json()
      setAllProjects(data.projects || [])
    } catch (err) {
      console.error("Error loading projects:", err)
    }
  }

  const saveProject = async () => {
    if (!project) return

    setIsSaving(true)
    setSaveError("")

    try {
      const response = await fetch(`/api/projects/projects_covert/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          html_content: editedHtml,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save project")
      }

      const data = await response.json()
      setProject(data.project)
      setIsEditing(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save project")
    } finally {
      setIsSaving(false)
    }
  }

  const downloadHtml = () => {
    if (!project) return

    const blob = new Blob([project.html_content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${project.name}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    if (!project) return

    navigator.clipboard.writeText(project.html_content).then(() => {
      alert("HTML copied to clipboard!")
    })
  }

  const deployProject = async () => {
    if (!project) return

    const subdomain = prompt("Enter subdomain for deployment:")
    if (!subdomain) return

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: project.id, subdomain }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`Deployment failed: ${errorData.error || "Unknown error"}`)
        return
      }

      loadProject() // Reload to get updated deployment status
      alert("Project deployed successfully!")
    } catch (err) {
      alert("Deployment failed: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const viewProject = (id: string) => {
    router.push(`/dashboard/apps/convert/project/${id}`)
  }

  if (isLoading) {
    return (
      <div className="project-container">
        <div className="loading">Loading project...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="project-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error || "Project not found"}</p>
          <button onClick={() => router.push("/")} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="project-container">
      {/* Sidebar */}
      <div className="project-sidebar">
        <div className="sidebar-header">
          <h2>Projects</h2>
          <button onClick={() => router.push("/dashboard/apps/convert")} className="new-project-btn">
            + New Project
          </button>
        </div>

        <div className="sidebar-content">
          <div className="nav-section">
            <h3 className="nav-section-title">All Projects ({allProjects.length})</h3>
            <ul className="nav-list">
              {allProjects.map((proj) => (
                <li key={proj.id} className="nav-item">
                  <button
                    onClick={() => viewProject(proj.id)}
                    className={`nav-button project-button ${proj.id === projectId ? "active" : ""}`}
                  >
                    <span className="nav-icon">🌐</span>
                    <span className="nav-text">{proj.name}</span>
                    {proj.is_deployed && <span className="deployed-badge">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <hr className="sidebar-separator" />

          <div className="nav-section">
            <h3 className="nav-section-title">Tools</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <button onClick={() => router.push("/sql-editor")} className="nav-button">
                  <span className="nav-icon">🗄️</span>
                  <span className="nav-text">SQL Editor</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="project-main">
        <div className="project-header">
          <div className="project-info">
            <div className="project-id">Project ID: {project.id}</div>
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="project-name-input"
              />
            ) : (
              <h1>{project.name}</h1>
            )}
            <div className="project-meta">
              <span>Source: {project.url}</span>
              <span>Created: {new Date(project.created_at).toLocaleString()}</span>
              {project.updated_at !== project.created_at && (
                <span>Updated: {new Date(project.updated_at).toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="project-actions">
            {isEditing ? (
              <>
                <button onClick={saveProject} disabled={isSaving} className="action-button save">
                  {isSaving ? "Saving..." : "💾 Save"}
                </button>
                <button onClick={() => setIsEditing(false)} className="action-button cancel">
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="action-button edit">
                  ✏️ Edit
                </button>
                <button onClick={downloadHtml} className="action-button download">
                  📥 Download
                </button>
                <button onClick={copyToClipboard} className="action-button copy">
                  📋 Copy
                </button>
                {!project.is_deployed ? (
                  <button onClick={deployProject} className="action-button deploy">
                    🚀 Deploy
                  </button>
                ) : (
                  <div className="deployment-status">
                    <span className="deployed-label">✓ Deployed</span>
                    <a
                      href={`https://${project.subdomain}.displan.design`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="deployed-link"
                    >
                      {project.subdomain}.displan.design
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {saveError && <div className="alert alert-error save-error">{saveError}</div>}

        <div className="project-content">
          <div className="code-section">
            <div className="code-header">
              <span>HTML Code</span>
              <span className="code-size">{Math.round(project.html_content.length / 1024)}KB</span>
            </div>
            {isEditing ? (
              <textarea
                value={editedHtml}
                onChange={(e) => setEditedHtml(e.target.value)}
                className="code-textarea editable"
              />
            ) : (
              <textarea value={project.html_content} readOnly className="code-textarea" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
