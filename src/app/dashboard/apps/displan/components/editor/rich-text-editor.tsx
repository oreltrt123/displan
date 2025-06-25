"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  Link,
  Quote,
  Code,
  ImageIcon,
  Video,
  Table,
  Type,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Upload,
} from "lucide-react"
import "../../../website-builder/designer/styles/button.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  projectId: string
  pages?: Array<{ id: string; name: string; slug: string }>
}

interface ToolbarButton {
  icon: React.ReactNode
  label: string
  action: () => void
  isActive?: boolean
}

export function RichTextEditor({ value, onChange, placeholder, projectId, pages = [] }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkType, setLinkType] = useState<"url" | "page">("url")
  const [selectedPage, setSelectedPage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [selectedText, setSelectedText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleInput()
    },
    [handleInput],
  )

  const getSelectedText = useCallback(() => {
    const selection = window.getSelection()
    return selection ? selection.toString() : ""
  }, [])

  const insertHTML = useCallback(
    (html: string) => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const div = document.createElement("div")
        div.innerHTML = html
        const fragment = document.createDocumentFragment()
        while (div.firstChild) {
          fragment.appendChild(div.firstChild)
        }
        range.insertNode(fragment)
        selection.removeAllRanges()
      }
      handleInput()
    },
    [handleInput],
  )

  const handleHeadingChange = useCallback(
    (level: string) => {
      execCommand("formatBlock", `<h${level}>`)
    },
    [execCommand],
  )

  const handleLinkInsert = useCallback(() => {
    const text = getSelectedText()
    setSelectedText(text)
    setLinkText(text || "Link text")
    setShowLinkModal(true)
  }, [getSelectedText])

  const insertLink = useCallback(() => {
    let url = linkUrl
    if (linkType === "page" && selectedPage) {
      const page = pages.find((p) => p.id === selectedPage)
      url = page ? `/page/${page.slug}` : ""
    }

    if (url && linkText) {
      const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
      if (selectedText) {
        execCommand("insertHTML", linkHTML)
      } else {
        insertHTML(linkHTML)
      }
    }

    setShowLinkModal(false)
    setLinkUrl("")
    setLinkText("")
    setSelectedPage("")
  }, [linkUrl, linkText, linkType, selectedPage, pages, selectedText, execCommand, insertHTML])

  // Enhanced file upload handler
  const handleFileUpload = useCallback(
    async (file: File, type: "image" | "video") => {
      setIsUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("project_id", projectId)
        formData.append("file_type", type)

        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100
            setUploadProgress(progress)
          }
        })

        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText)
              if (response.success) {
                resolve(response.file_url)
              } else {
                reject(new Error(response.error || "Upload failed"))
              }
            } else {
              reject(new Error("Upload failed"))
            }
          }
          xhr.onerror = () => reject(new Error("Upload failed"))
        })

        xhr.open("POST", "/api/upload-media")
        xhr.send(formData)

        const fileUrl = await uploadPromise

        // Insert the uploaded media into the editor
        if (type === "image") {
          const imageHTML = `<img src="${fileUrl}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 10px 0;" />`
          insertHTML(imageHTML)
        } else if (type === "video") {
          const videoHTML = `
          <video controls style="max-width: 100%; height: auto; margin: 10px 0;">
            <source src="${fileUrl}" type="${file.type}">
            Your browser does not support the video tag.
          </video>
        `
          insertHTML(videoHTML)
        }
      } catch (error) {
        console.error("Upload failed:", error)
        alert("Upload failed. Please try again.")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [projectId, insertHTML],
  )

  const handleFileSelect = useCallback(
    (type: "image" | "video") => {
      if (fileInputRef.current) {
        fileInputRef.current.accept = type === "image" ? "image/*" : "video/*"
        fileInputRef.current.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            handleFileUpload(file, type)
          }
        }
        fileInputRef.current.click()
      }
    },
    [handleFileUpload],
  )

  const insertImage = useCallback(() => {
    if (imageUrl) {
      const imageHTML = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0;" />`
      insertHTML(imageHTML)
    }
    setShowImageModal(false)
    setImageUrl("")
  }, [imageUrl, insertHTML])

  const insertVideo = useCallback(() => {
    if (videoUrl) {
      let embedUrl = videoUrl

      // Convert YouTube URLs to embed format
      if (videoUrl.includes("youtube.com/watch?v=")) {
        const videoId = videoUrl.split("v=")[1]?.split("&")[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (videoUrl.includes("youtu.be/")) {
        const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }

      const videoHTML = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 10px 0;">
          <iframe 
            src="${embedUrl}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            frameborder="0" 
            allowfullscreen>
          </iframe>
        </div>
      `
      insertHTML(videoHTML)
    }
    setShowVideoModal(false)
    setVideoUrl("")
  }, [videoUrl, insertHTML])

  const insertTable = useCallback(() => {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">'

    // Header row
    tableHTML += "<thead><tr>"
    for (let j = 0; j < tableCols; j++) {
      tableHTML += '<th style="border: 1px solid #8888881A; padding: 8px; background-color: #8888881A;">Header</th>'
    }
    tableHTML += "</tr></thead>"

    // Body rows
    tableHTML += "<tbody>"
    for (let i = 0; i < tableRows - 1; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < tableCols; j++) {
        tableHTML += '<td style="border: 1px solid #8888881A; padding: 8px;">Cell</td>'
      }
      tableHTML += "</tr>"
    }
    tableHTML += "</tbody></table>"

    insertHTML(tableHTML)
    setShowTableModal(false)
  }, [tableRows, tableCols, insertHTML])

  const insertCode = useCallback(() => {
    const codeHTML = `<pre style="background-color: #8888881A; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0;"><code>// Your code here</code></pre>`
    insertHTML(codeHTML)
  }, [insertHTML])

  const insertQuote = useCallback(() => {
    execCommand("formatBlock", "<blockquote>")
  }, [execCommand])

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Type className="w-4 h-4" />,
      label: "Heading",
      action: () => {},
    },
    {
      icon: <Bold className="w-4 h-4" />,
      label: "Bold",
      action: () => execCommand("bold"),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: "Italic",
      action: () => execCommand("italic"),
    },
    {
      icon: <Underline className="w-4 h-4" />,
      label: "Underline",
      action: () => execCommand("underline"),
    },
    {
      icon: <Link className="w-4 h-4" />,
      label: "Link",
      action: handleLinkInsert,
    },
    {
      icon: <Quote className="w-4 h-4" />,
      label: "Quote",
      action: insertQuote,
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: "Code",
      action: insertCode,
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      label: "Image",
      action: () => setShowImageModal(true),
    },
    {
      icon: <Upload className="w-4 h-4" />,
      label: "Upload Image",
      action: () => handleFileSelect("image"),
    },
    {
      icon: <Video className="w-4 h-4" />,
      label: "Video",
      action: () => setShowVideoModal(true),
    },
    {
      icon: <Upload className="w-4 h-4" />,
      label: "Upload Video",
      action: () => handleFileSelect("video"),
    },
    {
      icon: <Table className="w-4 h-4" />,
      label: "Table",
      action: () => setShowTableModal(true),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: "Bullet List",
      action: () => execCommand("insertUnorderedList"),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      label: "Numbered List",
      action: () => execCommand("insertOrderedList"),
    },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      label: "Align Left",
      action: () => execCommand("justifyLeft"),
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      label: "Align Center",
      action: () => execCommand("justifyCenter"),
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      label: "Align Right",
      action: () => execCommand("justifyRight"),
    },
  ]

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" style={{ display: "none" }} />

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 dark:bg-blue-900 p-3 border-b border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 dark:text-blue-300">Uploading...</span>
            <span className="text-sm text-blue-700 dark:text-blue-300">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-[#8888881A] border-b border-[#8888881A] p-2">
        <div className="flex flex-wrap gap-1">
          {/* Heading Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="p-2 rounded hover:bg-[#8888881A] transition-colors"
              title="Heading"
            >
              <Type className="w-4 h-4" />
            </button>
              <div className="menu_container_dsgasegagwgasgwg absolute top-full left-0 mt-1 z-10 hidden group-hover:block">
              <button
                type="button"
                onClick={() => handleHeadingChange("1")}
                className="menu_item"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => handleHeadingChange("2")}
                className="menu_item"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => handleHeadingChange("3")}
                className="menu_item"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => handleHeadingChange("4")}
                className="menu_item"
              >
                H4
              </button>
              <button
                type="button"
                onClick={() => handleHeadingChange("5")}
                className="menu_item"
              >
                H5
              </button>
              <button
                type="button"
                onClick={() => handleHeadingChange("6")}
                className="menu_item"
              >
                H6
              </button>
            </div>
          </div>

          {/* Other toolbar buttons */}
          {toolbarButtons.slice(1).map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-2 rounded hover:bg-[#8888881A] transition-colors"
              title={button.label}
              disabled={isUploading}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] p-4 focus:outline-none bg-[#8888881A] text-gray-900 dark:text-white"
        style={{ minHeight: "200px" }}
        data-placeholder={placeholder}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="menu_container_dsgasegagwgasgwgdsfsfe">
          <div className="menu_container_dsgasegagwgasgwgdsfsfe2 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Link Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType("url")}
                    className={`px-3 py-2 rounded ${linkType === "url" ? "bg-[rgb(0,153,255)] text-white" : "bg-[#8888881A]"}`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType("page")}
                    className={`px-3 py-2 rounded ${linkType === "page" ? "bg-[rgb(0,153,255)] text-white" : "bg-[#8888881A]"}`}
                  >
                    Page
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="r2552esf25_252trewt3er"
                  placeholder="Enter link text"
                />
              </div>

              {linkType === "url" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="r2552esf25_252trewt3er"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Page</label>
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="r2552esf25_252trewt3er"
                  >
                    <option value="">Select a page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-[#8888881A] rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-[rgb(0,153,255)] text-white rounded"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="menu_container_dsgasegagwgasgwgdsfsfe23">
          <div className="menu_container_dsgasegagwgasgwgdsfsfe2 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="r2552esf25_252trewt3er"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

                <p className="text-center text-black dark:text-white mb-2">Or</p>
                <button
                  type="button"
                  onClick={() => handleFileSelect("image")}
                  className="r2552esf25_252trewt3er"
                  disabled={isUploading}
                >
                  Upload Image File
                </button>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-[#8888881A] rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                className="px-4 py-2 bg-[rgb(0,153,255)] text-white rounded"
                disabled={!imageUrl}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="menu_container_dsgasegagwgasgwgdsfsfe24">
          <div className="menu_container_dsgasegagwgasgwgdsfsfe2 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Video</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="r2552esf25_252trewt3er"
                  placeholder="YouTube URL or direct video URL"
                />
                <p className="asfasfawfffwf">Supports YouTube URLs and direct video links</p>
              </div>

                <p className="text-center text-black dark:text-white mb-2">Or</p>
                <button
                  type="button"
                  onClick={() => handleFileSelect("video")}
                  className="r2552esf25_252trewt3er"
                  disabled={isUploading}
                >
                  Upload Video File
                </button>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 bg-[#8888881A] rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertVideo}
                className="px-4 py-2 bg-[rgb(0,153,255)] text-white rounded"
                disabled={!videoUrl}
              >
                Insert Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="menu_container_dsgasegagwgasgwgdsfsfe25">
          <div className="menu_container_dsgasegagwgasgwgdsfsfe2 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Table</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Number.parseInt(e.target.value) || 3)}
                  className="r2552esf25_252trewt3er"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Number.parseInt(e.target.value) || 3)}
                  className="r2552esf25_252trewt3er"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 bg-[#8888881A] rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-4 py-2 bg-[rgb(0,153,255)] text-white rounded"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
