"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Maximize2, Minimize2, Copy, Download, Type, Zap, FileCode, Loader2 } from "lucide-react"

interface AdvancedCodeEditorProps {
  isOpen: boolean
  onClose: () => void
  initialCode?: string
  language?: string
  onSave: (code: string, language: string) => void
  elementId?: string
}

const LANGUAGES = [
  { id: "css", name: "CSS", icon: "🎨" },
  { id: "javascript", name: "JavaScript", icon: "⚡" },
  { id: "html", name: "HTML", icon: "🌐" },
  { id: "typescript", name: "TypeScript", icon: "📘" },
  { id: "json", name: "JSON", icon: "📋" },
  { id: "scss", name: "SCSS", icon: "💎" },
]

const THEMES = [
  { id: "vs-dark", name: "Dark", bg: "#1e1e1e", color: "#d4d4d4" },
  { id: "vs-light", name: "Light", bg: "#ffffff", color: "#000000" },
  { id: "monokai", name: "Monokai", bg: "#272822", color: "#f8f8f2" },
  { id: "github", name: "GitHub", bg: "#f6f8fa", color: "#24292e" },
  { id: "dracula", name: "Dracula", bg: "#282a36", color: "#f8f8f2" },
]

const CSS_SNIPPETS = [
  {
    name: "Flexbox Center",
    code: `display: flex;
justify-content: center;
align-items: center;`,
  },
  {
    name: "Grid Layout",
    code: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 20px;`,
  },
  {
    name: "Smooth Animation",
    code: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(0);`,
  },
  {
    name: "Box Shadow",
    code: `box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
border-radius: 12px;`,
  },
  {
    name: "Gradient Background",
    code: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background-size: 200% 200%;
animation: gradientShift 4s ease infinite;`,
  },
  {
    name: "Hover Effects",
    code: `:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}`,
  },
]

export function AdvancedCodeEditor({
  isOpen,
  onClose,
  initialCode = "",
  language = "css",
  onSave,
  elementId,
}: AdvancedCodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [activeTab, setActiveTab] = useState("editor")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize code
  useEffect(() => {
    if (initialCode !== code) {
      setCode(initialCode)
    }
  }, [initialCode])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [code])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }

      // Ctrl/Cmd + / to toggle comment
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        toggleComment()
      }

      // F11 to toggle fullscreen
      if (e.key === "F11") {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }

      // Escape to close
      if (e.key === "Escape" && !isFullscreen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFullscreen, onClose])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(code, selectedLanguage)
      console.log("✅ Code saved successfully!")
    } catch (error) {
      console.error("❌ Failed to save code:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleComment = () => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = code.substring(start, end)

    let commentPrefix = "//"
    if (selectedLanguage === "css" || selectedLanguage === "scss") {
      commentPrefix = "/* "
    } else if (selectedLanguage === "html") {
      commentPrefix = "<!-- "
    }

    const lines = selectedText.split("\n")
    const commentedLines = lines.map((line) => {
      if (line.trim().startsWith(commentPrefix)) {
        return line.replace(commentPrefix, "").replace(" */", "").replace(" -->", "")
      } else {
        return (
          commentPrefix + line + (commentPrefix.includes("/*") ? " */" : commentPrefix.includes("<!--") ? " -->" : "")
        )
      }
    })

    const newCode = code.substring(0, start) + commentedLines.join("\n") + code.substring(end)
    setCode(newCode)
  }

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newCode = code.substring(0, start) + snippet + code.substring(end)
    setCode(newCode)

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + snippet.length, start + snippet.length)
    }, 0)
  }

  const formatCode = () => {
    // Simple CSS formatting
    if (selectedLanguage === "css" || selectedLanguage === "scss") {
      const formatted = code
        .replace(/\s*{\s*/g, " {\n  ")
        .replace(/;\s*/g, ";\n  ")
        .replace(/\s*}\s*/g, "\n}\n\n")
        .replace(/,\s*/g, ",\n")
        .trim()
      setCode(formatted)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      console.log("✅ Code copied to clipboard!")
    } catch (error) {
      console.error("❌ Failed to copy code:", error)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `element-${elementId || "code"}.${selectedLanguage}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLineNumbers = () => {
    const lines = code.split("\n")
    return lines.map((_, index) => index + 1).join("\n")
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isFullscreen ? "p-0" : "p-4"}`}>
      <Card className={`${isFullscreen ? "w-full h-full rounded-none" : "w-[90vw] h-[90vh] max-w-6xl"} flex flex-col`}>
        <CardHeader className="flex-shrink-0 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Advanced Code Editor</CardTitle>
              {elementId && (
                <Badge variant="secondary" className="text-xs">
                  Element: {elementId.slice(-8)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen (F11)" : "Fullscreen (F11)"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} title="Close (Esc)">
                ✕
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-800"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>

              {/* Theme Selector */}
              <select
                value={selectedTheme.id}
                onChange={(e) => {
                  const theme = THEMES.find((t) => t.id === e.target.value) || THEMES[0]
                  setSelectedTheme(theme)
                }}
                className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-800"
              >
                {THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>

              {/* Font Size */}
              <div className="flex items-center gap-1">
                <Type className="h-4 w-4" />
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-16"
                />
                <span className="text-xs w-6">{fontSize}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={formatCode} title="Format Code">
                <Zap className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy (Ctrl+C)">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadCode} title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                title="Save (Ctrl+S)"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="flex-shrink-0 w-full justify-start rounded-none border-b bg-gray-50 dark:bg-gray-900">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="snippets">Snippets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0 p-0">
              <div className="h-full flex">
                {/* Line Numbers */}
                {lineNumbers && (
                  <div
                    className="flex-shrink-0 w-12 p-2 text-right text-xs font-mono border-r select-none"
                    style={{
                      backgroundColor: selectedTheme.bg,
                      color: selectedTheme.color + "80",
                      fontSize: `${fontSize - 2}px`,
                    }}
                  >
                    <pre className="whitespace-pre-wrap">{getLineNumbers()}</pre>
                  </div>
                )}

                {/* Code Editor */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 font-mono resize-none border-none outline-none"
                    style={{
                      backgroundColor: selectedTheme.bg,
                      color: selectedTheme.color,
                      fontSize: `${fontSize}px`,
                      lineHeight: "1.5",
                      whiteSpace: wordWrap ? "pre-wrap" : "pre",
                      wordWrap: wordWrap ? "break-word" : "normal",
                      overflowWrap: wordWrap ? "break-word" : "normal",
                    }}
                    placeholder={`Enter your ${selectedLanguage.toUpperCase()} code here...`}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="snippets" className="flex-1 m-0 p-4 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CSS_SNIPPETS.map((snippet, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{snippet.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {snippet.code}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => insertSnippet(snippet.code)}
                      >
                        Insert Snippet
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 m-0 p-4 overflow-auto">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Editor Settings</h3>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Line Numbers</label>
                    <input
                      type="checkbox"
                      checked={lineNumbers}
                      onChange={(e) => setLineNumbers(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Word Wrap</label>
                    <input
                      type="checkbox"
                      checked={wordWrap}
                      onChange={(e) => setWordWrap(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Save</span>
                      <Badge variant="outline">Ctrl/Cmd + S</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle Comment</span>
                      <Badge variant="outline">Ctrl/Cmd + /</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Fullscreen</span>
                      <Badge variant="outline">F11</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Close</span>
                      <Badge variant="outline">Escape</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
