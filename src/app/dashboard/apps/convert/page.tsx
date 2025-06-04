"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Globe, Loader2, Code, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function WebsiteCloner() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [activeTab, setActiveTab] = useState("input")

  const handleClone = async () => {
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setHtmlContent("")

    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to clone website")
      }

      // Get the HTML content directly as text
      const htmlText = await response.text()
      setHtmlContent(htmlText)
      setSuccess("Website cloned successfully! You can now download or copy the HTML.")
      setActiveTab("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadHtml = () => {
    if (!htmlContent) return

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cloned-website-${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    if (!htmlContent) return

    navigator.clipboard
      .writeText(htmlContent)
      .then(() => {
        setSuccess("HTML copied to clipboard!")
        setTimeout(() => setSuccess(""), 3000)
      })
      .catch(() => {
        setError("Failed to copy HTML")
        setTimeout(() => setError(""), 3000)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-10">
        <div className="text-center mb-8">
          <Globe className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Perfect Website Cloner</h1>
          <p className="text-lg text-gray-600">Clone any website into an exact HTML replica with all assets embedded</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="input">Clone Website</TabsTrigger>
            <TabsTrigger value="result" disabled={!htmlContent}>
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Clone Any Website
                </CardTitle>
                <CardDescription>
                  Enter the URL of the website you want to clone into a standalone HTML file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && activeTab === "input" && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleClone} disabled={isLoading || !url} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cloning Website...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Clone Website
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">What this cloner does:</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mt-0.5">
                    1
                  </div>
                  <p>
                    <strong>Exact Replica</strong> - Creates a perfect copy of the original website with identical
                    design
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mt-0.5">
                    2
                  </div>
                  <p>
                    <strong>All Assets Embedded</strong> - Images, CSS, fonts, and JavaScript are embedded in the HTML
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mt-0.5">
                    3
                  </div>
                  <p>
                    <strong>Fully Editable</strong> - The HTML code can be edited normally like any HTML file
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mt-0.5">
                    4
                  </div>
                  <p>
                    <strong>Works Offline</strong> - The generated HTML file works completely offline
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Cloned Website HTML
                </CardTitle>
                <CardDescription>Your website has been cloned! You can download or copy the HTML.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button onClick={downloadHtml} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download HTML
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>

                <div className="border rounded-md p-2 bg-gray-50">
                  <Textarea value={htmlContent} readOnly className="font-mono text-sm h-[400px] bg-gray-50" />
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-2">How to use this HTML file:</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                    <li>Download or copy the HTML code above</li>
                    <li>Create a new file with a .html extension</li>
                    <li>Paste the HTML code into the file</li>
                    <li>Open the file in any web browser</li>
                    <li>Edit the HTML code normally to customize the website!</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
