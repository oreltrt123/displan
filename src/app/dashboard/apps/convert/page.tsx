"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import "@/styles/convert.css"

interface ClonedProject {
  id: string
  name: string
  url: string
  html_content: string
  created_at: string
  is_deployed: boolean
  subdomain?: string
}

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [projects, setProjects] = useState<ClonedProject[]>([])
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects/projects_covert")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        console.error("Failed to load projects:", await response.text())
      }
    } catch (err) {
      console.error("Error loading projects:", err)
    }
  }

  const handleConvert = async () => {
    if (!url || !projectName) {
      setError("Please enter both URL and project name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // First, clone the website
      const cloneResponse = await fetch("/api/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!cloneResponse.ok) {
        const errorData = await cloneResponse.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to clone website")
      }

      const htmlContent = await cloneResponse.text()

      // Then, save the project
      const projectResponse = await fetch("/api/projects/projects_covert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          url: url,
          html_content: htmlContent,
        }),
      })

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save project")
      }

      const projectData = await projectResponse.json()

      // Redirect to the project page
      router.push(`/dashboard/apps/convert/project/${projectData.project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const viewProject = (projectId: string) => {
    router.push(`/dashboard/apps/convert/project/${projectId}`)
  }

  return (
    <div className="convert-container bg-white dark:bg-black">
      {/* Custom Sidebar */}
      <div className="convert-sidebar bg-white dark:bg-black border dark:border-[#8888881A]">
        <div className="sidebar-header">
          <h2>Website Converter</h2>
        </div>

        <div className="sidebar-content">
          {/* Navigation */}
          <div className="nav-section">
            <h3 className="nav-section-title">Tools</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <button className="nav-button active">
                  <span className="nav-text">Convert URL</span>
                </button>
              </li>
            </ul>
          </div>

          <hr className="sidebar-separator" />

          {/* Projects */}
          <div className="nav-section">
            <h3 className="nav-section-title">Your Projects ({projects.length})</h3>
            <ul className="nav-list">
              {projects.slice(0, 10).map((project) => (
                <li key={project.id} className="nav-item">
                  <button onClick={() => viewProject(project.id)} className="nav-button project-button">
                    <span className="nav-icon">🌐</span>
                    <span className="nav-text">{project.name}</span>
                    {project.is_deployed && <span className="deployed-badge">✓</span>}
                  </button>
                </li>
              ))}
              {projects.length === 0 && (
                <li className="nav-item">
                  <div className="nav-empty">No projects yet</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="convert-main">
        <div className="main-header">
          <h1 className="text-black dark:text-white">URL to HTML Converter</h1>
          <p className="text-black dark:text-[#727272]">Convert any website to a standalone HTML file with all assets embedded</p>
        </div>

        <div className="convert-section">
          <div className="convert-card">
            <h2 className="text-black dark:text-white">Convert Website</h2>
            <p className="text-black dark:text-[#727272]">Enter a URL and project name to convert a website to HTML</p>

            <div className="form-group">
              <label className="text-black dark:text-white">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Website Project"
                className="r2552esf25_252trewt3er"
              />
            </div>

            <div className="form-group">
              <label className="text-black dark:text-white">Website URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="r2552esf25_252trewt3er"
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button onClick={handleConvert} disabled={isLoading || !url || !projectName} className="convert-button">
              {isLoading ? "Converting..." : "Convert Website"}
            </button>
          </div>

          <div className="info-card">
            <h3 className="text-black dark:text-white">How it works:</h3>
            <ul>
              <li className="text-black dark:text-[#727272]">✓ Fetches the complete website with all assets</li>
              <li className="text-black dark:text-[#727272]">✓ Embeds all CSS, images, and JavaScript inline</li>
              <li className="text-black dark:text-[#727272]">✓ Creates a standalone HTML file that works offline</li>
              <li className="text-black dark:text-[#727272]">✓ Saves to your project library with unique ID</li>
              <li className="text-black dark:text-[#727272]">✓ Ready for download, editing, or deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
