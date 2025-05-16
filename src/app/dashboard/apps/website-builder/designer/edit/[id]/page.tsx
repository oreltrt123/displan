"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Plus, Layout, Trash } from 'lucide-react'
import { createClient } from "../../../../../../../../supabase/client"
import type { PostgrestError } from "@supabase/supabase-js"
import "../../styles/button.css"
// Import types
import type { Project, Section, ElementType, Page } from "../../types"

// Import components
import { SidebarNavigation } from "../../components/sidebar-navigation"
import { ElementsPanel } from "../../components/elements-panel"
import { ImagesPanel } from "../../components/images-panel"
import { AIDesignAssistant } from "../../components/ai-assistant-panel"
import { SettingsPanel } from "../../components/settings-panel"
import { ElementProperties } from "../../components/element-properties"
import { PreviewToolbar } from "../../components/preview-toolbar"
import { ElementRenderer } from "../../components/element-renderer"
import { DragDropProvider } from "../../components/drag-drop-context"
import { DroppableSection } from "../../components/droppable-section"
import { StripeCheckoutModal } from "../../components/stripe-checkout-modal"
import { SimplePanel } from "../../components/simple-panel"
import { PublishButton } from "../../components/publish-button"

// Import utilities
import { createNewElement } from "../../utils/element-factory"
import { deepClone } from "../../utils/deep-clone"

// Import styles
import "../../styles/designer.css"

export default function DesignerEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [activePanel, setActivePanel] = useState<string>("elements")
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [subscriptionChecked, setSubscriptionChecked] = useState(false)
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [gridSize, setGridSize] = useState(8)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [publishingStatus, setPublishingStatus] = useState<"idle" | "publishing" | "success" | "error">("idle")
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  // Fetch project data and user subscription status
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/sign-in")
          return
        }

        setUserId(user.id)

        // Store user ID in localStorage for subscription verification
        localStorage.setItem("userId", user.id)

        // Check premium status from multiple sources
        let isPremium = false

        // 1. Check cookies
        const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
        const isPremiumCookie = cookies.find((cookie) => cookie.startsWith("isPremium="))
        if (isPremiumCookie && isPremiumCookie.split("=")[1] === "true") {
          isPremium = true
        }

        // 2. Check localStorage
        if (localStorage.getItem("userPremiumStatus") === "true") {
          isPremium = true
        }

        // 3. Check database if not already determined to be premium
        if (!isPremium) {
          const { data: subscription } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single()

          if (
            subscription &&
            subscription.current_period_end &&
            new Date(subscription.current_period_end) > new Date()
          ) {
            isPremium = true

            // Update client-side storage
            localStorage.setItem("userPremiumStatus", "true")
            document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
          }
        }

        // 4. If still not determined, make API call to check
        if (!isPremium) {
          try {
            const response = await fetch("/api/subscription/check", {
              credentials: "include",
            })

            if (response.ok) {
              const data = await response.json()
              isPremium = data.isPremium

              if (isPremium) {
                // Update client-side storage
                localStorage.setItem("userPremiumStatus", "true")
                document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
              }
            }
          } catch (error) {
            console.error("Error checking subscription via API:", error)
          }
        }

        setIsPremiumUser(isPremium)
        setSubscriptionChecked(true)

        // Get project data
        const { data: project, error: projectError } = await supabase
          .from("website_projects")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (projectError || !project) {
          setError("Project not found or you don't have access to it")
          setLoading(false)
          return
        }

        if (project.type !== "designer") {
          setError("This is not a designer project")
          setLoading(false)
          return
        }

        // Initialize project structure if needed
        const initializedProject = initializeProjectStructure(project)
        setProject(initializedProject)

        // Select the first page by default
        if (initializedProject.content?.pages && initializedProject.content.pages.length > 0) {
          setSelectedPage(initializedProject.content.pages[0].id)

          // Select the first section of the first page by default
          const firstPageSections = initializedProject.content.pages[0].sections
          if (firstPageSections && firstPageSections.length > 0) {
            setSelectedSection(firstPageSections[0])
          }
        } else {
          // If no pages, select the first section
          if (initializedProject.content?.sections && initializedProject.content.sections.length > 0) {
            setSelectedSection(initializedProject.content.sections[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router, supabase])

  // Listen for export events from the SettingsPanel
  useEffect(() => {
    const handleExportEvent = (event: CustomEvent) => {
      const { format, type } = event.detail

      if (type === "download") {
        downloadProject(format)
      } else if (type === "repository") {
        uploadAsRepository(format)
      }
    }

    window.addEventListener("export-project", handleExportEvent as EventListener)

    return () => {
      window.removeEventListener("export-project", handleExportEvent as EventListener)
    }
  }, [project]) // Re-add event listener when project changes

  // Initialize project structure if needed
  const initializeProjectStructure = (project: any): Project => {
    if (!project.content) {
      project.content = {
        sections: [],
        globalStyles: {},
        pages: [],
        settings: {
          siteName: project.name,
          favicon: "",
          theme: {
            primaryColor: "#0066cc",
            secondaryColor: "#f5f5f5",
            fontFamily: "Arial, sans-serif",
          },
        },
      }
    }

    if (!project.content.sections) {
      project.content.sections = []
    }

    if (!project.content.globalStyles) {
      project.content.globalStyles = {}
    }

    if (!project.content.pages) {
      project.content.pages = []
    }

    if (!project.content.settings) {
      project.content.settings = {
        siteName: project.name,
        favicon: "",
        theme: {
          primaryColor: "#0066cc",
          secondaryColor: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
        },
      }
    }

    // Save the initialized structure to the database
    supabase
      .from("website_projects")
      .update({ content: project.content })
      .eq("id", project.id)
      .then(({ error }: { error: PostgrestError | null }) => {
        if (error) console.error("Error initializing project structure:", error)
      })

    return project
  }

  // Handle page selection
  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId)

    // Find the page
    const page = project?.content.pages?.find((p) => p.id === pageId)

    // If the page has sections, select the first one
    if (page && page.sections && page.sections.length > 0) {
      setSelectedSection(page.sections[0])
      setSelectedElement(null)
    } else {
      setSelectedSection(null)
      setSelectedElement(null)
    }
  }

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    setSelectedElement(null)
  }

  // Handle element selection
  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId)
  }

  // Add a new page
  const addNewPage = () => {
    if (!project) return

    const pageName = prompt("Enter page name:")
    if (!pageName) return

    const newPage: Page = {
      id: `page-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: pageName,
      path: `/${pageName.toLowerCase().replace(/\s+/g, "-")}`,
      sections: [],
    }

    // Create a deep clone of the project to avoid read-only property issues
    const updatedProject = deepClone(project)
    if (!updatedProject.content.pages) {
      updatedProject.content.pages = []
    }
    updatedProject.content.pages.push(newPage)

    setProject(updatedProject)
    setSelectedPage(newPage.id)
    setSelectedSection(null)
    setUnsavedChanges(true)
  }

  // Delete a page
  const deletePage = (pageId: string) => {
    if (!project) return

    if (!confirm("Are you sure you want to delete this page?")) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    updatedProject.content.pages = updatedProject.content.pages.filter((p) => p.id !== pageId)

    setProject(updatedProject)

    // Select another page if available
    if (updatedProject.content.pages.length > 0) {
      setSelectedPage(updatedProject.content.pages[0].id)
      if (updatedProject.content.pages[0].sections && updatedProject.content.pages[0].sections.length > 0) {
        setSelectedSection(updatedProject.content.pages[0].sections[0])
      } else {
        setSelectedSection(null)
      }
    } else {
      setSelectedPage(null)
      setSelectedSection(null)
    }

    setSelectedElement(null)
    setUnsavedChanges(true)
  }

  // Add a new section
  const addNewSection = () => {
    if (!project || !selectedPage) return

    const sectionName = prompt("Enter section name:")
    if (!sectionName) return

    const newSection: Section = {
      id: `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: sectionName,
      elements: [],
    }

    // Create a deep clone of the project to avoid read-only property issues
    const updatedProject = deepClone(project)

    // Add the section to the sections array
    updatedProject.content.sections.push(newSection)

    // Add the section reference to the selected page
    const pageIndex = updatedProject.content.pages.findIndex((p) => p.id === selectedPage)
    if (pageIndex !== -1) {
      if (!updatedProject.content.pages[pageIndex].sections) {
        updatedProject.content.pages[pageIndex].sections = []
      }
      updatedProject.content.pages[pageIndex].sections.push(newSection.id)
    }

    setProject(updatedProject)
    setSelectedSection(newSection.id)
    setUnsavedChanges(true)
  }

  // Delete a section
  const deleteSection = (sectionId: string) => {
    if (!project || !selectedPage) return

    if (!confirm("Are you sure you want to delete this section?")) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)

    // Remove the section from the sections array
    updatedProject.content.sections = updatedProject.content.sections.filter((s) => s.id !== sectionId)

    // Remove the section reference from all pages
    updatedProject.content.pages.forEach((page) => {
      if (page.sections) {
        page.sections = page.sections.filter((id) => id !== sectionId)
      }
    })

    setProject(updatedProject)

    // Select another section if available
    const currentPage = updatedProject.content.pages.find((p) => p.id === selectedPage)
    if (currentPage && currentPage.sections && currentPage.sections.length > 0) {
      setSelectedSection(currentPage.sections[0])
    } else {
      setSelectedSection(null)
    }

    setSelectedElement(null)
    setUnsavedChanges(true)
  }

  // Add a new element to the selected section
  const addNewElement = (type: string) => {
    if (!project || !selectedSection) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    // Create a new element
    const newElement = createNewElement(type)

    // Add the element to the section
    updatedProject.content.sections[sectionIndex].elements.push(newElement)

    setProject(updatedProject)
    setSelectedElement(newElement.id)
    setUnsavedChanges(true)
  }

  // Delete the selected element - no confirmation needed
  const deleteElement = (elementId: string) => {
    if (!project || !selectedSection) return

    console.log("Deleting element:", elementId)

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    // Remove the element from the section
    updatedProject.content.sections[sectionIndex].elements = updatedProject.content.sections[
      sectionIndex
    ].elements.filter((e) => e.id !== elementId)

    setProject(updatedProject)
    setSelectedElement(null)
    setUnsavedChanges(true)
  }

  // Move element up in the section
  const moveElementUp = () => {
    if (!project || !selectedSection || !selectedElement) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    const elements = updatedProject.content.sections[sectionIndex].elements
    const elementIndex = elements.findIndex((e) => e.id === selectedElement)

    if (elementIndex <= 0) return // Swap with the element above
    ;[elements[elementIndex - 1], elements[elementIndex]] = [elements[elementIndex], elements[elementIndex - 1]]

    setProject(updatedProject)
    setUnsavedChanges(true)
  }

  // Move element down in the section
  const moveElementDown = () => {
    if (!project || !selectedSection || !selectedElement) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    const elements = updatedProject.content.sections[sectionIndex].elements
    const elementIndex = elements.findIndex((e) => e.id === selectedElement)

    if (elementIndex === -1 || elementIndex >= elements.length - 1) return // Swap with the element below
    ;[elements[elementIndex], elements[elementIndex + 1]] = [elements[elementIndex + 1], elements[elementIndex]]

    setProject(updatedProject)
    setUnsavedChanges(true)
  }

  // Handle element property change
  const handlePropertyChange = (property: string, value: any) => {
    if (!project || !selectedSection || !selectedElement) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    const elementIndex = updatedProject.content.sections[sectionIndex].elements.findIndex(
      (e) => e.id === selectedElement,
    )

    if (elementIndex === -1) return

    // Determine if this is a content or style property
    if (["text", "src", "alt", "href", "buttonText", "level", "height"].includes(property)) {
      updatedProject.content.sections[sectionIndex].elements[elementIndex].content[property] = value
    } else {
      updatedProject.content.sections[sectionIndex].elements[elementIndex].style[property] = value
    }

    setProject(updatedProject)
    setUnsavedChanges(true)
  }

  // Handle element position change (from dragging)
  const handleElementPositionChange = useCallback(
    (elementId: string, x: number, y: number) => {
      if (!project) return

      // Create a deep clone of the project
      const updatedProject = deepClone(project)

      // Find the element in all sections
      let found = false

      for (let i = 0; i < updatedProject.content.sections.length; i++) {
        const elementIndex = updatedProject.content.sections[i].elements.findIndex((e) => e.id === elementId)

        if (elementIndex !== -1) {
          // Update the element's position
          updatedProject.content.sections[i].elements[elementIndex].style.x = x
          updatedProject.content.sections[i].elements[elementIndex].style.y = y
          found = true
          break
        }
      }

      if (found) {
        setProject(updatedProject)
        setUnsavedChanges(true)
      }
    },
    [project],
  )

  // Handle element resize
  const handleElementResize = useCallback(
    (elementId: string, width: number, height: number) => {
      if (!project) return

      // Create a deep clone of the project
      const updatedProject = deepClone(project)

      // Find the element in all sections
      let found = false

      for (let i = 0; i < updatedProject.content.sections.length; i++) {
        const elementIndex = updatedProject.content.sections[i].elements.findIndex((e) => e.id === elementId)

        if (elementIndex !== -1) {
          // Update the element's size
          updatedProject.content.sections[i].elements[elementIndex].style.width = `${width}px`
          updatedProject.content.sections[i].elements[elementIndex].style.height = `${height}px`
          found = true
          break
        }
      }

      if (found) {
        setProject(updatedProject)
        setUnsavedChanges(true)
      }
    },
    [project],
  )

  // Handle element move via drag and drop
  const handleElementMove = (elementId: string, targetId: string, position: "before" | "after" | "inside") => {
    if (!project) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)

    // Find the element to move
    let sourceElement: ElementType | null = null
    let sourceSectionIndex = -1
    let sourceElementIndex = -1

    for (let i = 0; i < updatedProject.content.sections.length; i++) {
      const elementIndex = updatedProject.content.sections[i].elements.findIndex((e) => e.id === elementId)
      if (elementIndex !== -1) {
        sourceElement = deepClone(updatedProject.content.sections[i].elements[elementIndex])
        sourceSectionIndex = i
        sourceElementIndex = elementIndex
        break
      }
    }

    if (!sourceElement || sourceSectionIndex === -1 || sourceElementIndex === -1) return

    // Remove the element from its original position
    updatedProject.content.sections[sourceSectionIndex].elements.splice(sourceElementIndex, 1)

    // Find the target section and element
    let targetSectionIndex = -1
    let targetElementIndex = -1

    // Check if the target is a section
    const targetSectionIndex2 = updatedProject.content.sections.findIndex((s) => s.id === targetId)
    if (targetSectionIndex2 !== -1) {
      targetSectionIndex = targetSectionIndex2

      // If dropping inside a section, add to the end
      if (position === "inside") {
        // Preserve the element's position if it has one
        if (sourceElement.style.x === undefined || sourceElement.style.y === undefined) {
          // Set default position if none exists
          sourceElement.style.x = 20
          sourceElement.style.y = 20
        }

        updatedProject.content.sections[targetSectionIndex].elements.push(sourceElement)
      } else {
        // If dropping before or after a section, we need to handle differently
        // For simplicity, we'll just add to the beginning or end of the section
        if (position === "before") {
          updatedProject.content.sections[targetSectionIndex].elements.unshift(sourceElement)
        } else {
          updatedProject.content.sections[targetSectionIndex].elements.push(sourceElement)
        }
      }
    } else {
      // Target is an element
      for (let i = 0; i < updatedProject.content.sections.length; i++) {
        const elementIndex = updatedProject.content.sections[i].elements.findIndex((e) => e.id === targetId)
        if (elementIndex !== -1) {
          targetSectionIndex = i
          targetElementIndex = elementIndex
          break
        }
      }

      if (targetSectionIndex === -1 || targetElementIndex === -1) return

      // Insert the element at the target position
      if (position === "before") {
        updatedProject.content.sections[targetSectionIndex].elements.splice(targetElementIndex, 0, sourceElement)
      } else if (position === "after") {
        updatedProject.content.sections[targetSectionIndex].elements.splice(targetElementIndex + 1, 0, sourceElement)
      } else {
        // "inside" doesn't make sense for elements, so we'll just insert after
        updatedProject.content.sections[targetSectionIndex].elements.splice(targetElementIndex + 1, 0, sourceElement)
      }
    }

    setProject(updatedProject)
    setSelectedElement(sourceElement.id)
    setUnsavedChanges(true)
  }

  // Update element with new properties
  const handleUpdateElement = (elementId: string, updates: Partial<ElementType>) => {
    if (!project || !selectedSection) return

    console.log("Updating element:", elementId, updates)

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    const elementIndex = updatedProject.content.sections[sectionIndex].elements.findIndex((e) => e.id === elementId)

    if (elementIndex === -1) return

    // Update the element with the new properties
    const updatedElement = {
      ...updatedProject.content.sections[sectionIndex].elements[elementIndex],
    }

    // Handle style updates
    if (updates.style) {
      updatedElement.style = {
        ...updatedElement.style,
        ...updates.style,
      }
    }

    // Handle content updates
    if (updates.content) {
      updatedElement.content = {
        ...updatedElement.content,
        ...updates.content,
      }
    }

    // Handle transitions updates
    if (updates.transitions) {
      updatedElement.transitions = updates.transitions
    }

    // Apply the updated element
    updatedProject.content.sections[sectionIndex].elements[elementIndex] = updatedElement

    setProject(updatedProject)
    setUnsavedChanges(true)
  }

  // Save project changes
  const saveProject = async () => {
    if (!project) return

    try {
      setSaving(true)
      setSaveStatus("saving")

      const { error } = await supabase
        .from("website_projects")
        .update({ content: project.content })
        .eq("id", project.id)

      if (error) throw error

      setUnsavedChanges(false)
      setSaveStatus("saved")

      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle")
      }, 3000)
    } catch (err) {
      console.error("Error saving project:", err)
      alert("Failed to save changes")
      setSaveStatus("error")
    } finally {
      setSaving(false)
    }
  }

  // Handle project name change
  const handleProjectNameChange = async (name: string) => {
    if (!project || name === project.name) return

    try {
      setSaving(true)

      const { error } = await supabase.from("website_projects").update({ name }).eq("id", project.id)

      if (error) throw error

      setProject({ ...project, name })
    } catch (err) {
      console.error("Error updating project name:", err)
      alert("Failed to update project name")
    } finally {
      setSaving(false)
    }
  }

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  // Open preview in new window
  const openPreview = () => {
    // Save any unsaved changes first
    if (unsavedChanges) {
      saveProject()
    }

    // Generate HTML for preview
    const previewHtml = generatePreviewHtml()

    // Open new window
    const newWindow = window.open("", "_blank", "width=1200,height=800")
    if (newWindow) {
      newWindow.document.write(previewHtml)
      newWindow.document.close()
      setPreviewWindow(newWindow)
    } else {
      alert("Please allow pop-ups to view the preview")
    }
  }

  // Generate HTML for preview
  const generatePreviewHtml = (): string => {
    if (!project) return "<html><body>No project data</body></html>"

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - Preview</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
    .preview-toolbar { position: fixed; top: 0; left: 0; right: 0; background: #1f2937; color: white; padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; }
    .preview-toolbar button { background: rgba(255,255,255,0.1); border: none; color: white; padding: 4px 8px; margin-left: 8px; border-radius: 4px; cursor: pointer; }
    .preview-toolbar button.active { background: rgba(59, 130, 246, 0.5); }
    .preview-content { margin-top: 50px; transition: all 0.3s ease; }
    .desktop { width: 100%; }
    .tablet { width: 768px; margin: 0 auto; border: 12px solid #374151; border-radius: 12px; height: 1024px; overflow-y: auto; }
    .mobile { width: 375px; margin: 0 auto; border: 12px solid #374151; border-radius: 12px; height: 667px; overflow-y: auto; }
    .relative { position: relative; }
    .absolute { position: absolute; }
  </style>
</head>
<body>
  <div class="preview-toolbar">
    <div>
      <strong>${project.name}</strong> - Preview
    </div>
    <div>
      <button id="desktop-btn" class="active" onclick="changeView('desktop')">Desktop</button>
      <button id="tablet-btn" onclick="changeView('tablet')">Tablet</button>
      <button id="mobile-btn" onclick="changeView('mobile')">Mobile</button>
    </div>
  </div>
  <div id="preview-content" class="preview-content desktop">
    <div class="container mx-auto">
`

    // Generate HTML for each section
    if (project.content && project.content.sections) {
      project.content.sections.forEach((section) => {
        html += `      <section class="my-8 relative">
        <h2 class="text-2xl font-bold mb-4">${section.name}</h2>
`

        // Generate HTML for each element in the section
        if (section.elements && section.elements.length) {
          section.elements.forEach((element) => {
            html += generateElementHtml(element, 8)
          })
        }

        html += `      </section>
`
      })
    }

    html += `    </div>
  </div>
  <script>
    function changeView(mode) {
      const content = document.getElementById('preview-content');
      content.className = 'preview-content ' + mode;
      
      // Update active button
      document.getElementById('desktop-btn').classList.remove('active');
      document.getElementById('tablet-btn').classList.remove('active');
      document.getElementById('mobile-btn').classList.remove('active');
      document.getElementById(mode + '-btn').classList.add('active');
    }
  </script>
</body>
</html>`

    return html
  }

  // Change preview device mode
  const changePreviewMode = (mode: "desktop" | "tablet" | "mobile") => {
    setPreviewMode(mode)

    // If preview window is open, update its view
    if (previewWindow && !previewWindow.closed) {
      previewWindow.changeView(mode)
    }
  }

  // Generate element HTML
  const generateElementHtml = (element: any, indentLevel: number): string => {
    const indent = " ".repeat(indentLevel)
    let code = ""

    // Position styles
    const positionStyle =
      element.style.x !== undefined && element.style.y !== undefined
        ? `position: absolute; left: ${element.style.x}px; top: ${element.style.y}px;`
        : ""

    // Size styles
    const sizeStyle =
      element.style.width || element.style.height
        ? `${element.style.width ? `width: ${element.style.width};` : ""} ${element.style.height ? `height: ${element.style.height};` : ""}`
        : ""

    // Combined inline style
    const inlineStyle = positionStyle || sizeStyle ? ` style="${positionStyle} ${sizeStyle}"` : ""

    switch (element.type) {
      case "heading":
        const HeadingTag = `h${element.content?.level || 2}`
        code += `${indent}<${HeadingTag} class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || "Heading"}</${HeadingTag}>\n`
        break
      case "paragraph":
        code += `${indent}<p class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || "Paragraph text"}</p>\n`
        break
      case "image":
        code += `${indent}<img src="${element.content?.src || "/placeholder.svg"}" alt="${element.content?.alt || ""}" class="${getStyleClasses(element.style, true)}"${inlineStyle} />\n`
        break
      case "button":
        code += `${indent}<button class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.buttonText || "Button"}</button>\n`
        break
      case "container":
        code += `${indent}<div class="${getStyleClasses(element.style, true)}"${inlineStyle}>\n`
        if (element.children && element.children.length) {
          element.children.forEach((child: any) => {
            code += generateElementHtml(child, indentLevel + 2)
          })
        }
        code += `${indent}</div>\n`
        break
      default:
        code += `${indent}<div class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || ""}</div>\n`
    }

    return code
  }

  // Get style classes
  const getStyleClasses = (style: Record<string, any> | undefined, isHtml = false): string => {
    if (!style) return ""

    const classes = []

    // Map some common style properties to Tailwind classes
    if (style.color) classes.push(`text-${style.color}`)
    if (style.backgroundColor) classes.push(`bg-${style.backgroundColor}`)
    if (style.fontSize) classes.push(`text-${style.fontSize}`)
    if (style.fontWeight) classes.push(`font-${style.fontWeight}`)
    if (style.textAlign) classes.push(`text-${style.textAlign}`)
    if (style.padding) classes.push(`p-${style.padding}`)
    if (style.margin) classes.push(`m-${style.margin}`)
    if (style.borderRadius) classes.push(`rounded-${style.borderRadius}`)

    return classes.join(" ")
  }

  // Format component name
  const formatComponentName = (name: string): string => {
    // Remove non-alphanumeric characters and convert to PascalCase
    return name
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  }

  // Download project as code
  const downloadProject = (format = "typescript") => {
    if (!project) return

    try {
      setExporting(true)
      let code = ""
      let fileName = ""

      // Generate code based on format
      switch (format) {
        case "typescript":
          code = generateTypeScriptCode()
          fileName = `${project.name.toLowerCase().replace(/\s+/g, "-")}.tsx`
          break
        case "javascript":
          code = generateJavaScriptCode()
          fileName = `${project.name.toLowerCase().replace(/\s+/g, "-")}.jsx`
          break
        case "html":
          code = generateHtmlCode()
          fileName = `${project.name.toLowerCase().replace(/\s+/g, "-")}.html`
          break
        default:
          code = JSON.stringify(project.content, null, 2)
          fileName = `${project.name.toLowerCase().replace(/\s+/g, "-")}.json`
      }

      // Create a blob and download it
      const blob = new Blob([code], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error exporting project:", err)
      alert("Failed to export project")
    } finally {
      setExporting(false)
    }
  }

  // Generate TypeScript code
  const generateTypeScriptCode = (): string => {
    if (!project) return ""

    let code = `// TypeScript export of ${project.name}\n\n`
    code += `import React from 'react';\n\n`
    code += `export default function ${formatComponentName(project.name)}() {\n`
    code += `  return (\n`
    code += `    <div className="container mx-auto">\n`

    // Generate code for each section
    if (project.content && project.content.sections) {
      project.content.sections.forEach((section) => {
        code += `      <section className="my-8">\n`
        code += `        <h2 className="text-2xl font-bold mb-4">${section.name}</h2>\n`

        // Generate code for each element in the section
        if (section.elements && section.elements.length) {
          section.elements.forEach((element) => {
            code += generateElementCode(element, 8)
          })
        }

        code += `      </section>\n`
      })
    }

    code += `    </div>\n`
    code += `  );\n`
    code += `}\n`

    return code
  }

  // Generate JavaScript code
  const generateJavaScriptCode = (): string => {
    // Convert TypeScript code to JavaScript (simplified)
    const tsCode = generateTypeScriptCode()
    return tsCode.replace(/: [a-zA-Z<>[\]]+/g, "")
  }

  // Generate HTML code
  const generateHtmlCode = (): string => {
    if (!project) return ""

    let code = `<!DOCTYPE html>\n`
    code += `<html lang="en">\n`
    code += `<head>\n`
    code += `  <meta charset="UTF-8">\n`
    code += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`
    code += `  <title>${project.name}</title>\n`
    code += `  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">\n`
    code += `</head>\n`
    code += `<body>\n`
    code += `  <div class="container mx-auto">\n`

    // Generate HTML for each section
    if (project.content && project.content.sections) {
      project.content.sections.forEach((section) => {
        code += `    <section class="my-8">\n`
        code += `      <h2 class="text-2xl font-bold mb-4">${section.name}</h2>\n`

        // Generate HTML for each element in the section
        if (section.elements && section.elements.length) {
          section.elements.forEach((element) => {
            code += generateElementHtml(element, 6)
          })
        }

        code += `    </section>\n`
      })
    }

    code += `  </div>\n`
    code += `</body>\n`
    code += `</html>`

    return code
  }

  // Generate element code
  const generateElementCode = (element: any, indentLevel: number): string => {
    const indent = " ".repeat(indentLevel)
    let code = ""

    switch (element.type) {
      case "heading":
        const HeadingTag = `h${element.content?.level || 2}`
        code += `${indent}<${HeadingTag} className="${getStyleClasses(element.style)}">${element.content?.text || "Heading"}</${HeadingTag}>\n`
        break
      case "paragraph":
        code += `${indent}<p className="${getStyleClasses(element.style)}">${element.content?.text || "Paragraph text"}</p>\n`
        break
      case "image":
        code += `${indent}<img src="${element.content?.src || "/placeholder.svg"}" alt="${element.content?.alt || ""}" className="${getStyleClasses(element.style)}" />\n`
        break
      case "button":
        code += `${indent}<button className="${getStyleClasses(element.style)}">${element.content?.buttonText || "Button"}</button>\n`
        break
      case "container":
        code += `${indent}<div className="${getStyleClasses(element.style)}">\n`
        if (element.children && element.children.length) {
          element.children.forEach((child: any) => {
            code += generateElementCode(child, indentLevel + 2)
          })
        }
        code += `${indent}</div>\n`
        break
      default:
        code += `${indent}<div className="${getStyleClasses(element.style)}">${element.content?.text || ""}</div>\n`
    }

    return code
  }

  // Upload project as repository
  const uploadAsRepository = async (format = "typescript") => {
    if (!project || !userId) return

    try {
      setExporting(true)

      // Generate files based on format
      const files = []
      const projectName = `${project.name}-export`

      switch (format) {
        case "typescript":
          // Add main component file
          files.push({
            name: `${formatComponentName(project.name)}.tsx`,
            content: generateTypeScriptCode(),
          })

          // Add package.json
          files.push({
            name: "package.json",
            content: JSON.stringify(
              {
                name: project.name.toLowerCase().replace(/\s+/g, "-"),
                version: "1.0.0",
                private: true,
                dependencies: {
                  react: "^18.2.0",
                  "react-dom": "^18.2.0",
                  next: "^13.4.0",
                  typescript: "^5.0.0",
                },
              },
              null,
              2,
            ),
          })

          // Add tsconfig.json
          files.push({
            name: "tsconfig.json",
            content: JSON.stringify(
              {
                compilerOptions: {
                  target: "es5",
                  lib: ["dom", "dom.iterable", "esnext"],
                  allowJs: true,
                  skipLibCheck: true,
                  strict: true,
                  forceConsistentCasingInFileNames: true,
                  noEmit: true,
                  esModuleInterop: true,
                  module: "esnext",
                  moduleResolution: "node",
                  resolveJsonModule: true,
                  isolatedModules: true,
                  jsx: "preserve",
                  incremental: true,
                },
                include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
                exclude: ["node_modules"],
              },
              null,
              2,
            ),
          })

          // Add README.md
          files.push({
            name: "README.md",
            content: `# ${project.name}\n\nThis project was exported from the Website Builder.\n\n## Getting Started\n\n1. Install dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n2. Run the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n3. Open [http://localhost:3000](http://localhost:3000) in your browser.\n`,
          })
          break

        case "javascript":
          // Add main component file
          files.push({
            name: `${formatComponentName(project.name)}.jsx`,
            content: generateJavaScriptCode(),
          })

          // Add package.json
          files.push({
            name: "package.json",
            content: JSON.stringify(
              {
                name: project.name.toLowerCase().replace(/\s+/g, "-"),
                version: "1.0.0",
                private: true,
                dependencies: {
                  react: "^18.2.0",
                  "react-dom": "^18.2.0",
                  next: "^13.4.0",
                },
              },
              null,
              2,
            ),
          })

          // Add README.md
          files.push({
            name: "README.md",
            content: `# ${project.name}\n\nThis project was exported from the Website Builder.\n\n## Getting Started\n\n1. Install dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n2. Run the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n3. Open [http://localhost:3000](http://localhost:3000) in your browser.\n`,
          })
          break

        case "html":
          // Add HTML file
          files.push({
            name: "index.html",
            content: generateHtmlCode(),
          })

          // Add README.md
          files.push({
            name: "README.md",
            content: `# ${project.name}\n\nThis project was exported from the Website Builder as a static HTML file.\n\n## Getting Started\n\nSimply open the index.html file in your browser to view the website.\n`,
          })
          break
      }

      // Create repository project
      const { data: repoProject, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: projectName,
          description: `Exported from Website Builder: ${project.name}`,
          visibility: "private",
          owner_id: userId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (projectError) throw new Error("Failed to create repository project")

      // Add files to the project
      const fileInserts = files.map((file) => ({
        project_id: repoProject.id,
        name: file.name,
        content: file.content,
        path: file.name,
        type: "file",
        created_at: new Date().toISOString(),
      }))

      const { error: filesError } = await supabase.from("project_files").insert(fileInserts)

      if (filesError) throw new Error("Failed to add files to repository project")

      alert(`Project successfully uploaded as repository: ${projectName}`)

      // Optionally redirect to the new project
      if (confirm("Would you like to view your new repository project?")) {
        router.push(`/dashboard/project/${repoProject.id}`)
      }
    } catch (err) {
      console.error("Error uploading as repository:", err)
      alert(err instanceof Error ? err.message : "Failed to upload as repository")
    } finally {
      setExporting(false)
    }
  }

  // Get the currently selected element
  const getSelectedElement = (): ElementType | null => {
    if (!project || !selectedSection || !selectedElement) return null

    const section = project.content.sections.find((s) => s.id === selectedSection)
    if (!section) return null

    return section.elements.find((e) => e.id === selectedElement) || null
  }

  // Get the sections for the currently selected page
  const getPageSections = (): Section[] => {
    if (!project || !selectedPage) return []

    const page = project.content.pages.find((p) => p.id === selectedPage)
    if (!page || !page.sections || page.sections.length === 0) return []

    return project.content.sections.filter((section) => page.sections.includes(section.id))
  }

  // Handle image selection from the images panel
  const handleImageSelect = (imageUrl: string) => {
    if (!project || !selectedSection) return

    // Create a new image element with the selected image
    const newElement = createNewElement("image")
    newElement.content.src = imageUrl
    newElement.content.alt = "Uploaded image"

    // Add the element to the selected section
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    updatedProject.content.sections[sectionIndex].elements.push(newElement)

    setProject(updatedProject)
    setSelectedElement(newElement.id)
    setUnsavedChanges(true)
  }

  // Handle AI-generated elements
  const handleAIGenerate = (elements: any[]) => {
    if (!project || !selectedSection || !elements.length) return

    // Create a deep clone of the project
    const updatedProject = deepClone(project)
    const sectionIndex = updatedProject.content.sections.findIndex((s) => s.id === selectedSection)

    if (sectionIndex === -1) return

    // Add all generated elements to the section
    updatedProject.content.sections[sectionIndex].elements.push(...elements)

    setProject(updatedProject)
    setUnsavedChanges(true)
  }

  // Handle premium upgrade success
  const handleUpgradeSuccess = () => {
    setShowCheckoutModal(false)
    setIsPremiumUser(true)

    // Update client-side storage
    localStorage.setItem("userPremiumStatus", "true")
    document.cookie = `isPremium=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`

    // Switch to AI panel after successful payment
    setActivePanel("ai")
  }

  // Apply theme to all elements
  const applyTheme = (theme: string) => {
    if (!project) return

    console.log("Applying theme:", theme)

    // Import the theme manager utility
    import("../../utils/theme-manager").then(({ applyThemeToPage }) => {
      // Create a deep clone of the project
      const updatedProject = deepClone(project)

      // Apply theme to all sections
      for (let i = 0; i < updatedProject.content.sections.length; i++) {
        updatedProject.content.sections[i].elements = applyThemeToPage(
          updatedProject.content.sections[i].elements,
          theme,
        )
      }

      setProject(updatedProject)
      setUnsavedChanges(true)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-foreground mb-6">{error}</p>
        <Link
          href="/dashboard/apps/website-builder/designer"
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard/apps/website-builder/designer"
              className="mr-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">{project?.name || "Website Designer"}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={saveProject}
              disabled={!unsavedChanges || saving}
              className="button_edit_project_r22"
            >
              {saving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}
            </button>
            <button
              onClick={togglePreview}
              className="button_edit_project_r22"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
            <PublishButton project={project} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <DragDropProvider onElementMove={handleElementMove}>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <SidebarNavigation
            onSelectPanel={setActivePanel}
            activePanel={activePanel}
            isPremiumUser={isPremiumUser}
            onUpgradeClick={() => setShowCheckoutModal(true)}
          />

          {/* Panel Content */}
          {!showPreview && (
            <>
              {activePanel === "elements" && <ElementsPanel onAddElement={addNewElement} />}

              {activePanel === "images" && <ImagesPanel onSelectImage={handleImageSelect} projectId={params.id} />}

              {activePanel === "simple" && <SimplePanel onAddElement={addNewElement} onApplyTheme={applyTheme} />}

              {activePanel === "ai" && (
                <AIDesignAssistant
                  isPremiumUser={isPremiumUser}
                  onUpgradeClick={() => setShowCheckoutModal(true)}
                  onAIGenerate={handleAIGenerate}
                  projectId={params.id}
                />
              )}

              {activePanel === "settings" && (
                <SettingsPanel
                  onSave={saveProject}
                  onExport={() => {}} // This is now handled via the custom event
                  projectName={project?.name || ""}
                  onProjectNameChange={handleProjectNameChange}
                  saving={saving}
                />
              )}

              {/* Pages Panel */}
              <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-foreground">Pages</h2>
                    <button
                      onClick={addNewPage}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {project?.content?.pages?.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => handlePageSelect(page.id)}
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        selectedPage === page.id ? "bg-secondary" : "hover:bg-secondary/50"
                      }`}
                    >
                      <Layout className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm text-foreground">{page.name}</span>
                      {selectedPage === page.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePage(page.id)
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections Panel */}
              <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-foreground">Sections</h2>
                    <button
                      onClick={addNewSection}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                      disabled={!selectedPage}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {getPageSections().map((section) => (
                    <div
                      key={section.id}
                      onClick={() => handleSectionSelect(section.id)}
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        selectedSection === section.id ? "bg-secondary" : "hover:bg-secondary/50"
                      }`}
                    >
                      <Layout className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm text-foreground">{section.name}</span>
                      {selectedSection === section.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSection(section.id)
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Properties Panel */}
              {selectedElement && getSelectedElement() && (
                <div className="w-72 bg-card border-r border-border flex flex-col">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-medium text-foreground">Properties</h2>
                  </div>
                  <ElementProperties element={getSelectedElement()!} onPropertyChange={handlePropertyChange} />
                </div>
              )}
            </>
          )}

          {/* Preview / Canvas */}
          <div className="flex-1 flex flex-col">
            {showPreview ? (
              <div className="flex-1 flex flex-col">
                <PreviewToolbar previewMode={previewMode} onChangePreviewMode={changePreviewMode} />
                <div className="flex-1 bg-secondary/50 flex items-center justify-center p-4 overflow-auto">
                  <div
                    className={`bg-background shadow-lg ${
                      previewMode === "desktop"
                        ? "w-full h-full"
                        : previewMode === "tablet"
                          ? "w-[768px] h-[1024px]"
                          : "w-[375px] h-[667px]"
                    } overflow-auto`}
                  >
                    <div className="p-4">
                      {getPageSections().map((section) => (
                        <div key={section.id} className="mb-8">
                          {/* <h2 className="text-lg font-semibold mb-4 text-muted-foreground border-b border-border pb-2">
                            {section.name}
                          </h2> */}
                          <div>
                            {section.elements.map((element) => (
                              <div key={element.id}>
                                <ElementRenderer element={element} isEditing={false} isSelected={false} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-secondary/50 flex items-center justify-center p-4 overflow-auto">
                <div className="bg-background shadow-lg w-full h-full overflow-auto">
                  <div className="p-4">
                    {selectedSection ? (
                      <div>
                        {project?.content?.sections
                          .filter((s) => s.id === selectedSection)
                          .map((section) => (
                            <DroppableSection
                              key={section.id}
                              section={section}
                              selectedElement={selectedElement}
                              onElementSelect={handleElementSelect}
                              onElementPositionChange={handleElementPositionChange}
                              onElementResize={handleElementResize}
                              onDeleteElement={deleteElement}
                              onUpdateElement={handleUpdateElement}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-10">
                        <div className="h-12 w-12 mx-auto mb-4 opacity-50 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                          +
                        </div>
                        <p>Select a section to edit or create a new one</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropProvider>

      {/* Stripe Checkout Modal */}
      {showCheckoutModal && userId && (
        <StripeCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={handleUpgradeSuccess}
          userId={userId}
          projectId={params.id}
        />
      )}
    </div>
  )
}