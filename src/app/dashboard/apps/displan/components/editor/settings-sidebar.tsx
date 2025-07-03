"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { Code, Globe, ImageIcon, Lock, Settings, FileText, Folder } from "lucide-react"
import { useState, useEffect } from "react"
import "@/styles/sidebar_settings_editor.css"

interface DisplanProjectDesignerCssPage {
  id: string
  name: string
  slug: string
  is_folder: boolean
  project_id: string
}

type NavItem =
  | {
      title: string
      icon: React.ElementType
      path: string
    }
  | {
      title: string
      iconLight: string
      iconDark: string
      path: string
    }

export function SettingsSidebar() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const projectId = params.id as string
  const [pages, setPages] = useState<DisplanProjectDesignerCssPage[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(true)

  const settingsNavItems: NavItem[] = [
    {
      title: "General",
      icon: Settings,
      path: `/dashboard/apps/displan/editor/${projectId}/settings`,
    },
    {
      title: "API keys",
      icon: Settings,
      path: `/dashboard/apps/displan/editor/${projectId}/settings/keys`,
    },
    {
      title: "Domains",
      icon: Globe,
      path: `/dashboard/apps/displan/editor/${projectId}/settings/domains`,
    },
    {
      title: "Password",
      icon: Lock,
      path: `/dashboard/apps/displan/editor/${projectId}/settings/password`,
    },
    {
      title: "Code",
      icon: Code,
      path: `/dashboard/apps/displan/editor/${projectId}/settings/code`,
    },
    {
      title: "Images",
      icon: ImageIcon,
      path: `/dashboard/apps/displan/editor/${projectId}/settings/images`,
    },
    {
      title: "AI",
      iconLight: "/components/editor/ai_dark.png",
      iconDark: "/components/editor/ai_light.png",
      path: `/dashboard/apps/displan/editor/${projectId}/settings/ai`,
    },
  ]

  useEffect(() => {
    loadProjectPages()
  }, [projectId])

  const loadProjectPages = async () => {
    setIsLoadingPages(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/pages`)
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages || [])
      } else {
        console.error("Failed to load project pages")
      }
    } catch (error) {
      console.error("Error loading project pages:", error)
    } finally {
      setIsLoadingPages(false)
    }
  }

  const isActive = (path: string) => pathname === path
  const isPageActive = (pageId: string) =>
    pathname === `/dashboard/apps/displan/editor/${projectId}/settings/pages/${pageId}`

  return (
    <div className="settings-sidebar">
      <div className="settings-sidebar-content">
        <nav className="settings-nav">
          <ul className="settings-nav-list">
            <h3 className="settings-nav-section-title">Site Settings</h3>
            {settingsNavItems.map((item) => (
              <li key={item.title} className="settings-nav-item">
                <button
                  onClick={() => router.push(item.path)}
                  className={`settings-nav-button ${isActive(item.path) ? "active" : ""}`}
                >
                  {"icon" in item ? (
                    <item.icon className="settings-nav-icon" />
                  ) : (
                    <>
                      <img
                        src={item.iconLight}
                        alt={item.title}
                        className="settings-nav-icon light-mode"
                      />
                      <img
                        src={item.iconDark}
                        alt={item.title}
                        className="settings-nav-icon dark-mode"
                      />
                    </>
                  )}
                  <span className="settings-nav-text">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <hr className="fsdfadsgesgdg" />

          <div className="settings-nav-section">
            <h3 className="settings-nav-section-title">Pages</h3>
            <ul className="settings-nav-list">
              {isLoadingPages ? (
                <li className="settings-nav-item">
                  <div className="settings-nav-loading">Loading pages...</div>
                </li>
              ) : pages.length === 0 ? (
                <li className="settings-nav-item">
                  <div className="settings-nav-empty">No pages found</div>
                </li>
              ) : (
                pages.map((page) => (
                  <li key={page.id} className="settings-nav-item">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/apps/displan/editor/${projectId}/settings/pages/${page.id}`)
                      }
                      className={`settings-nav-button ${isPageActive(page.id) ? "active" : ""}`}
                    >
                      {page.is_folder ? (
                        <Folder className="settings-nav-icon" />
                      ) : (
                        <FileText className="settings-nav-icon" />
                      )}
                      <span className="settings-nav-text">{page.name}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
