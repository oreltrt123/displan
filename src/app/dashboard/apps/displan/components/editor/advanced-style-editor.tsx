"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Copy, Download, X, Code, Eye, Palette } from "lucide-react"

interface AdvancedStyleEditorProps {
  element: any
  isOpen: boolean
  onClose: () => void
  onSave: (styles: string, htmlContent?: string) => void
}

export function AdvancedStyleEditor({ element, isOpen, onClose, onSave }: AdvancedStyleEditorProps) {
  const [activeTab, setActiveTab] = useState("css")
  const [cssCode, setCssCode] = useState("")
  const [htmlCode, setHtmlCode] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const cssEditorRef = useRef<HTMLTextAreaElement>(null)
  const htmlEditorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (element && isOpen) {
      // Generate current element CSS
      const currentCSS = generateElementCSS(element)
      setCssCode(currentCSS)

      // Generate current element HTML
      const currentHTML = generateElementHTML(element)
      setHtmlCode(currentHTML)
    }
  }, [element, isOpen])

  const generateElementCSS = (el: any) => {
    const styles = el?.styles || {}
    const className = styles.customClass || `element-${el.id?.slice(-4)}`

    return `/* Element: ${styles.elementName || "Unnamed Element"} */
.${className} {
  /* Layout */
  display: ${styles.display || "block"};
  ${
    styles.display === "flex"
      ? `
  justify-content: ${styles.justifyContent || "flex-start"};
  align-items: ${styles.alignItems || "flex-start"};`
      : ""
  }
  
  /* Spacing */
  margin: ${styles.marginTop || 0}px ${styles.marginRight || 0}px ${styles.marginBottom || 0}px ${styles.marginLeft || 0}px;
  padding: ${styles.paddingTop || 0}px ${styles.paddingRight || 0}px ${styles.paddingBottom || 0}px ${styles.paddingLeft || 0}px;
  
  /* Appearance */
  background-color: ${el.background_color || "transparent"};
  color: ${el.text_color || "inherit"};
  font-size: ${el.font_size ? `${el.font_size}px` : "inherit"};
  font-weight: ${el.font_weight || "normal"};
  font-family: ${el.font_family || "inherit"};
  text-align: ${el.text_align || "left"};
  
  /* Border */
  border-radius: ${el.border_radius ? `${el.border_radius}px` : "0"};
  border: ${el.border_width ? `${el.border_width}px solid ${el.border_color || "#000"}` : "none"};
  
  /* Effects */
  opacity: ${el.opacity || 1};
  transition: all 0.3s ease;
}

/* Hover Effects */
.${className}:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Custom Styles */
${styles.customStyles || "/* Add your custom CSS here */"}
`
  }

  const generateElementHTML = (el: any) => {
    const styles = el?.styles || {}
    const tag = styles.htmlTag || "div"
    const className = styles.customClass || `element-${el.id?.slice(-4)}`
    const id = styles.customId || ""

    if (el.element_type?.includes("button")) {
      return `<button 
  class="${className}"
  ${id ? `id="${id}"` : ""}
  ${styles.linkUrl ? `onclick="window.open('${styles.linkUrl}', '${styles.linkTarget || "_self"}')"` : ""}
>
  ${el.content || "Button Text"}
</button>`
    }

    return `<${tag} 
  class="${className}"
  ${id ? `id="${id}"` : ""}
>
  ${el.content || "Element Content"}
</${tag}>`
  }

  const handleSave = () => {
    onSave(cssCode, htmlCode)
    onClose()
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Advanced Style Editor
              </CardTitle>
              <Badge variant="secondary">{element?.styles?.elementName || `Element ${element?.id?.slice(-4)}`}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
                {isPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreview ? "Code" : "Preview"}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="flex-shrink-0 mx-6 mt-4">
              <TabsTrigger value="css" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                CSS
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                HTML
              </TabsTrigger>
            </TabsList>

            <TabsContent value="css" className="flex-1 flex flex-col m-6 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">CSS Styles</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(cssCode)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cssCode, `${element?.id || "element"}.css`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isPreview ? (
                <div className="flex-1 border rounded-lg p-4 bg-white">
                  <style dangerouslySetInnerHTML={{ __html: cssCode }} />
                  <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
                </div>
              ) : (
                <textarea
                  ref={cssEditorRef}
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="flex-1 font-mono text-sm border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/* Write your CSS here */"
                  spellCheck={false}
                />
              )}
            </TabsContent>

            <TabsContent value="html" className="flex-1 flex flex-col m-6 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">HTML Structure</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(htmlCode)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(htmlCode, `${element?.id || "element"}.html`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isPreview ? (
                <div className="flex-1 border rounded-lg p-4 bg-white">
                  <style dangerouslySetInnerHTML={{ __html: cssCode }} />
                  <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
                </div>
              ) : (
                <textarea
                  ref={htmlEditorRef}
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="flex-1 font-mono text-sm border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="<!-- HTML structure -->"
                  spellCheck={false}
                />
              )}
            </TabsContent>
          </Tabs>

          <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
