"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Code, Save, Play, Download, Plus, Trash, Eye, Smartphone, Tablet, Monitor } from "lucide-react"
import { createClient } from "../../../../../../../../supabase/client"

interface FileType {
  name: string
  content: string
  language: string
}

interface Project {
  id: string
  name: string
  description: string
  content: {
    files: FileType[]
  }
}

export default function CodeEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
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

        if (project.type !== "code") {
          setError("This is not a code project")
          setLoading(false)
          return
        }

        setProject(project)

        // Select the first file by default
        if (project.content?.files && project.content.files.length > 0) {
          setSelectedFile(project.content.files[0].name)
          setFileContent(project.content.files[0].content)
        }
      } catch (err) {
        console.error("Error fetching project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router, supabase])

  // Handle file selection
  const handleFileSelect = (fileName: string) => {
    if (unsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        selectFile(fileName)
      }
    } else {
      selectFile(fileName)
    }
  }

  const selectFile = (fileName: string) => {
    if (!project || !project.content?.files) return

    const file = project.content.files.find((f) => f.name === fileName)
    if (file) {
      setSelectedFile(fileName)
      setFileContent(file.content)
      setUnsavedChanges(false)
    }
  }

  // Handle file content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value)
    setUnsavedChanges(true)
  }

  // Save changes to the current file
  const saveCurrentFile = async () => {
    if (!project || !selectedFile) return

    try {
      setSaving(true)

      // Update the file content in the project
      const updatedFiles = project.content.files.map((file) => {
        if (file.name === selectedFile) {
          return { ...file, content: fileContent }
        }
        return file
      })

      const updatedProject = {
        ...project,
        content: {
          ...project.content,
          files: updatedFiles,
        },
      }

      // Save to database
      const { error } = await supabase
        .from("website_projects")
        .update({ content: updatedProject.content })
        .eq("id", project.id)

      if (error) throw error

      setProject(updatedProject)
      setUnsavedChanges(false)

      // Update preview if it's open
      if (showPreview) {
        updatePreview()
      }
    } catch (err) {
      console.error("Error saving file:", err)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  // Add a new file
  const addNewFile = async () => {
    if (!project) return

    const fileName = prompt("Enter file name (e.g. about.html, styles.css, script.js):")
    if (!fileName) return

    // Check if file already exists
    if (project.content.files.some((f) => f.name === fileName)) {
      alert("A file with this name already exists")
      return
    }

    // Determine language based on extension
    const extension = fileName.split(".").pop()?.toLowerCase() || ""
    let language = "text"

    if (["html", "htm"].includes(extension)) language = "html"
    else if (["css"].includes(extension)) language = "css"
    else if (["js", "javascript"].includes(extension)) language = "javascript"
    else if (["json"].includes(extension)) language = "json"
    else if (["md", "markdown"].includes(extension)) language = "markdown"

    // Create new file
    const newFile = {
      name: fileName,
      content: "",
      language,
    }

    try {
      // Update project with new file
      const updatedFiles = [...project.content.files, newFile]
      const updatedProject = {
        ...project,
        content: {
          ...project.content,
          files: updatedFiles,
        },
      }

      // Save to database
      const { error } = await supabase
        .from("website_projects")
        .update({ content: updatedProject.content })
        .eq("id", project.id)

      if (error) throw error

      setProject(updatedProject)
      setSelectedFile(fileName)
      setFileContent("")
      setUnsavedChanges(false)
    } catch (err) {
      console.error("Error adding file:", err)
      alert("Failed to add new file")
    }
  }

  // Delete the current file
  const deleteCurrentFile = async () => {
    if (!project || !selectedFile) return

    // Don't allow deleting the last file
    if (project.content.files.length <= 1) {
      alert("You cannot delete the last file in the project")
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedFile}?`)) return

    try {
      // Remove the file from the project
      const updatedFiles = project.content.files.filter((file) => file.name !== selectedFile)
      const updatedProject = {
        ...project,
        content: {
          ...project.content,
          files: updatedFiles,
        },
      }

      // Save to database
      const { error } = await supabase
        .from("website_projects")
        .update({ content: updatedProject.content })
        .eq("id", project.id)

      if (error) throw error

      setProject(updatedProject)

      // Select the first file after deletion
      if (updatedFiles.length > 0) {
        setSelectedFile(updatedFiles[0].name)
        setFileContent(updatedFiles[0].content)
      } else {
        setSelectedFile(null)
        setFileContent("")
      }

      setUnsavedChanges(false)
    } catch (err) {
      console.error("Error deleting file:", err)
      alert("Failed to delete file")
    }
  }

  // Update the preview iframe
  const updatePreview = () => {
    if (!iframeRef.current || !project) return

    const htmlFile = project.content.files.find((f) => f.name === "index.html")
    if (!htmlFile) {
      alert("No index.html file found in the project")
      return
    }

    // Create a blob URL for the HTML content
    const htmlContent = processHtmlForPreview(htmlFile.content, project.content.files)
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    // Set the iframe src to the blob URL
    iframeRef.current.src = url

    // Clean up the blob URL when the component unmounts
    return () => URL.revokeObjectURL(url)
  }

  // Process HTML to include other files (CSS, JS) for preview
  const processHtmlForPreview = (html: string, files: FileType[]) => {
    // Replace external CSS links with inline styles
    files.forEach((file) => {
      if (file.language === "css") {
        const linkRegex = new RegExp(`<link[^>]*href=["']${file.name}["'][^>]*>`, "g")
        if (linkRegex.test(html)) {
          html = html.replace(linkRegex, `<style>${file.content}</style>`)
        } else {
          // If no link tag found, append the style to the head
          html = html.replace("</head>", `<style>${file.content}</style></head>`)
        }
      }

      // Replace external JS scripts with inline scripts
      if (file.language === "javascript") {
        const scriptRegex = new RegExp(`<script[^>]*src=["']${file.name}["'][^>]*>`, "g")
        if (scriptRegex.test(html)) {
          html = html.replace(scriptRegex, `<script>${file.content}</script>`)
        } else {
          // If no script tag found, append the script to the body
          html = html.replace("</body>", `<script>${file.content}</script></body>`)
        }
      }
    })

    return html
  }

  // Toggle preview mode
  const togglePreview = () => {
    if (!showPreview) {
      // If we're opening the preview, update it first
      setShowPreview(true)
      setTimeout(updatePreview, 100) // Small delay to ensure the iframe is rendered
    } else {
      setShowPreview(false)
    }
  }

  // Change preview device mode
  const changePreviewMode = (mode: "desktop" | "tablet" | "mobile") => {
    setPreviewMode(mode)
  }

  // Download project as ZIP
  const downloadProject = () => {
    alert("Download functionality will be implemented in a future update")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link href="/dashboard/apps/website-builder/code" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard/apps/website-builder/code" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">{project?.name || "Code Editor"}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={saveCurrentFile}
              disabled={!unsavedChanges || saving}
              className={`flex items-center px-3 py-2 rounded text-sm ${unsavedChanges ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={togglePreview}
              className={`flex items-center px-3 py-2 rounded text-sm ${showPreview ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={downloadProject}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-700">Files</h2>
              <button onClick={addNewFile} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {project?.content?.files.map((file) => (
              <div
                key={file.name}
                onClick={() => handleFileSelect(file.name)}
                className={`flex items-center p-2 rounded cursor-pointer ${selectedFile === file.name ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <Code className="h-4 w-4 mr-2 text-gray-500" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                {selectedFile === file.name && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCurrentFile()
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 flex flex-col">
          {showPreview ? (
            <div className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePreviewMode("desktop")}
                    className={`p-1 rounded ${previewMode === "desktop" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Monitor className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => changePreviewMode("tablet")}
                    className={`p-1 rounded ${previewMode === "tablet" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Tablet className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => changePreviewMode("mobile")}
                    className={`p-1 rounded ${previewMode === "mobile" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Smartphone className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={updatePreview}
                  className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Refresh
                </button>
              </div>
              <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-auto">
                <div
                  className={`bg-white shadow-lg ${
                    previewMode === "desktop"
                      ? "w-full h-full"
                      : previewMode === "tablet"
                        ? "w-[768px] h-[1024px]"
                        : "w-[375px] h-[667px]"
                  } overflow-hidden`}
                >
                  <iframe ref={iframeRef} className="w-full h-full border-0" title="Preview"></iframe>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 p-2">
                <div className="text-sm text-gray-500">{selectedFile || "No file selected"}</div>
              </div>
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={fileContent}
                  onChange={handleContentChange}
                  className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none"
                  placeholder="Select a file to edit"
                  disabled={!selectedFile}
                ></textarea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
