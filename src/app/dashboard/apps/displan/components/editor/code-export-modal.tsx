"use client"

import { useState, useEffect } from "react"
import { X, Copy, Download, Check, ChevronDown, RefreshCw } from "lucide-react"
import { CodeGenerator } from "../../utils/code-generator"
import { SyntaxHighlighter } from "./syntax-highlighter"

interface CodeExportModalProps {
  isOpen: boolean
  onClose: () => void
  canvasElements: any[]
  canvasWidth: number
  canvasHeight: number
  projectId: string
}

type CodeLanguage = "html" | "react" | "typescript" | "javascript" | "vue" | "angular"

interface GeneratedCode {
  html: string
  css: string
  react: string
  typescript: string
  javascript: string
  vue: string
  angular: string
}

interface CanvasData {
  elements: any[]
  canvasWidth: number
  canvasHeight: number
  projectId: string
}

export function CodeExportModal({
  isOpen,
  onClose,
  canvasElements,
  canvasWidth,
  canvasHeight,
  projectId,
}: CodeExportModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>("react")
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const languages = [
    { value: "html", label: "HTML", icon: "🌐" },
    { value: "react", label: "React", icon: "⚛️" },
    { value: "typescript", label: "TypeScript", icon: "📘" },
    { value: "javascript", label: "JavaScript", icon: "📜" },
    { value: "vue", label: "Vue.js", icon: "💚" },
    { value: "angular", label: "Angular", icon: "🅰️" },
  ] as const

  // Initialize with props data first, then try to fetch more from API
  useEffect(() => {
    if (isOpen && projectId) {
      console.log("🎯 Export modal opened with:", {
        projectId,
        propsElements: canvasElements.length,
        canvasSize: `${canvasWidth}x${canvasHeight}`,
      })

      // Use props data immediately
      const propsData = {
        elements: canvasElements,
        canvasWidth,
        canvasHeight,
        projectId,
      }
      setCanvasData(propsData)

      // Also try to fetch additional data from API
      fetchAdditionalCanvasData()
    }
  }, [isOpen, projectId, canvasElements, canvasWidth, canvasHeight])

  // Generate code when canvas data is available
  useEffect(() => {
    if (canvasData) {
      generateCode()
    }
  }, [canvasData])

  const fetchAdditionalCanvasData = async () => {
    setIsFetching(true)
    setFetchError(null)

    try {
      console.log("🔄 Fetching additional canvas data for project:", projectId)

      const response = await fetch(`/api/canvas-export?projectId=${encodeURIComponent(projectId)}`)

      if (response.ok) {
        const apiData = await response.json()
        console.log("✅ Fetched additional canvas data:", apiData)

        // Merge API data with props data
        const mergedElements = [
          ...canvasElements,
          ...apiData.elements.filter((apiEl: any) => !canvasElements.some((propsEl) => propsEl.id === apiEl.id)),
        ]

        setCanvasData({
          elements: mergedElements,
          canvasWidth: apiData.canvasWidth || canvasWidth,
          canvasHeight: apiData.canvasHeight || canvasHeight,
          projectId,
        })
      } else {
        console.warn("⚠️ API fetch failed, using props data only")
      }
    } catch (error) {
      console.warn("⚠️ API fetch error, using props data only:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const generateCode = async () => {
    if (!canvasData) return

    setIsGenerating(true)
    setFetchError(null)

    try {
      console.log("🏗️ Generating code for", canvasData.elements.length, "elements")

      const codeGenerator = new CodeGenerator()
      const code = await codeGenerator.generateAllFormats({
        elements: canvasData.elements,
        canvasWidth: canvasData.canvasWidth,
        canvasHeight: canvasData.canvasHeight,
        projectId: canvasData.projectId,
      })

      console.log("✅ Code generated successfully")
      setGeneratedCode(code)

      // Show helpful message if no elements
      if (canvasData.elements.length === 0) {
        setFetchError("No elements found on canvas. Add some elements to your design first.")
      }
    } catch (error) {
      console.error("❌ Error generating code:", error)
      setFetchError("Failed to generate code. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (content: string, type: string) => {
    if (!content || content.trim() === "") {
      console.warn("⚠️ No content to copy")
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopiedStates((prev) => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }))
      }, 2000)
      console.log("✅ Copied to clipboard:", type)
    } catch (error) {
      console.error("❌ Failed to copy:", error)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    if (!content || content.trim() === "") {
      console.warn("⚠️ No content to download")
      return
    }

    try {
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log("✅ Downloaded:", filename)
    } catch (error) {
      console.error("❌ Failed to download:", error)
    }
  }

  const getFileExtension = (language: CodeLanguage): string => {
    const extensions = {
      html: "html",
      react: "jsx",
      typescript: "tsx",
      javascript: "js",
      vue: "vue",
      angular: "ts",
    }
    return extensions[language]
  }

  const getCurrentCode = (): string => {
    if (!generatedCode) return ""
    return generatedCode[selectedLanguage] || ""
  }

  const getCurrentCSS = (): string => {
    return generatedCode?.css || ""
  }

  const handleRefresh = () => {
    fetchAdditionalCanvasData()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[95vw] h-[90vh] max-w-7xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Code</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{canvasData?.elements.length || 0} elements</span>
              <span>•</span>
              <span>
                {canvasData?.canvasWidth || canvasWidth}×{canvasData?.canvasHeight || canvasHeight}px
              </span>
            </div>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Error State */}
          {fetchError && canvasData?.elements.length === 0 && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Canvas is Empty</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{fetchError}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close and Add Elements
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Generating code...</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isGenerating && canvasData && canvasData.elements.length > 0 && (
            <>
              {/* Left Panel - Code */}
              <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
                {/* Language Selector */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[160px]"
                    >
                      <span className="text-lg">{languages.find((lang) => lang.value === selectedLanguage)?.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {languages.find((lang) => lang.value === selectedLanguage)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
                    </button>

                    {isLanguageDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        {languages.map((language) => (
                          <button
                            key={language.value}
                            onClick={() => {
                              setSelectedLanguage(language.value)
                              setIsLanguageDropdownOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            <span className="text-lg">{language.icon}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{language.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Content */}
                <div className="flex-1 relative">
                  {/* Code Actions */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => handleCopy(getCurrentCode(), "code")}
                      disabled={!getCurrentCode()}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      {copiedStates.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm">{copiedStates.code ? "Copied!" : "Copy"}</span>
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(getCurrentCode(), `${projectId}-component.${getFileExtension(selectedLanguage)}`)
                      }
                      disabled={!getCurrentCode()}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>

                  {/* Code Display */}
                  <div className="h-full overflow-auto">
                    <SyntaxHighlighter language={selectedLanguage} code={getCurrentCode()} />
                  </div>
                </div>
              </div>

              {/* Right Panel - CSS */}
              <div className="w-1/2 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎨</span>
                      <h3 className="font-medium text-gray-900 dark:text-white">Production CSS</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(getCurrentCSS(), "css")}
                        disabled={!getCurrentCSS()}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        {copiedStates.css ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm">{copiedStates.css ? "Copied!" : "Copy"}</span>
                      </button>
                      <button
                        onClick={() => handleDownload(getCurrentCSS(), `${projectId}-styles.css`)}
                        disabled={!getCurrentCSS()}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <SyntaxHighlighter language="css" code={getCurrentCSS()} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Generated code is production-ready and optimized for performance.</p>
              <p>Includes responsive design and accessibility features.</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
