"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import "@/styles/sidebar_settings_editor.css"
import "@/styles/button_rrui.css"
import "@/styles/loading.css"

interface Template {
  id: string
  creator_id: string
  creator_email: string
  template_name: string
  short_description: string
  full_description: any
  template_image_url: string
  category: string
  tags: string[]
  project_url: string
  price: number
  is_free: boolean
  is_published: boolean
  is_draft: boolean
  view_count: number
  purchase_count: number
  rating: number
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  "Landing Pages",
  "E-commerce",
  "Portfolio",
  "Blog",
  "Business",
  "Creative",
  "SaaS",
  "Restaurant",
  "Real Estate",
  "Education",
]

export default function TemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    template_name: "",
    short_description: "",
    full_description: "",
    template_image_url: "",
    category: "",
    price: 0,
    is_free: true,
    is_published: false,
  })

  useEffect(() => {
    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      console.log("🔍 Loading template for editing:", templateId)

      const response = await fetch(`/api/templates/${templateId}`)
      const result = await response.json()

      if (result.success && result.template) {
        const template = result.template
        setTemplate(template)
        setFormData({
          template_name: template.template_name,
          short_description: template.short_description,
          full_description:
            typeof template.full_description === "string"
              ? template.full_description
              : template.full_description?.content || "",
          template_image_url: template.template_image_url,
          category: template.category,
          price: template.price,
          is_free: template.is_free,
          is_published: template.is_published,
        })
      } else {
        console.error("Template not found")
        router.push("/dashboard/template")
      }
    } catch (error) {
      console.error("Error loading template:", error)
      router.push("/dashboard/template")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log("💾 Saving template:", formData)

      const response = await fetch(`/api/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          full_description: { content: formData.full_description },
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Template updated successfully!")
        loadTemplate() // Reload to get updated data
      } else {
        alert("Failed to update template: " + result.error)
      }
    } catch (error) {
      console.error("Error saving template:", error)
      alert("Failed to save template. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    if (template) {
      window.open(`/marketplace/${template.id}`, "_blank")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#8888881A] dark:bg-[#1D1D1D]">
        <div id="page">
        <div id="container">
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
          <div className="h3">
          <div className="loader">
            <p>loading</p>
           <div className="words">
           <span className="word">buttons</span>
           <span className="word">forms</span>
           <span className="word">switches</span>
           <span className="word">cards</span>
           <span className="word">buttons</span>
        </div>
      </div>
    </div>
        </div>
    </div>
  </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => router.push("/dashboard/template")}>Back to Templates</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Template</h1>
              <p className="text-[#5E5F6E] dark:text-white/70" style={{fontSize: "11p x"}}>Last updated: {formatDate(template.updated_at)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push("/dashboard/template")} className="button_rrui">
              Back to Templates
            </button>
            <button onClick={handlePreview} className="button_rrui2">
              Preview
            </button>
            <button onClick={handleSave} disabled={saving} className="button_rrui1">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
          <div className="flex items-center">
              <div className="">
            <img className="w-8 h-8 mr-2 dark:hidden" src="/components/template/views_light.png" alt="" />
            <img className="w-8 h-8 mr-2 hidden dark:block" src="/components/template/views_dark.png" alt="" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{template.view_count}</p>
              </div>
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center">
              <div className="">
            <img className="w-8 h-8 mr-2 dark:hidden" src="/components/template/sales_light.png" alt="" />
            <img className="w-8 h-8 mr-2 hidden dark:block" src="/components/template/sales_dark.png" alt="" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold">{template.purchase_count}</p>
              </div>
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center">
              <div className="">
            <img className="w-8 h-8 mr-2 dark:hidden" src="/components/template/earnings_light.png" alt="" />
            <img className="w-8 h-8 mr-2 hidden dark:block" src="/components/template/earnings_dark.png" alt="" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold">${(template.price * template.purchase_count).toFixed(2)}</p>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template_name">Template Name</Label>
                  <input
                    id="template_name"
                    value={formData.template_name}
                    onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                    placeholder="Brief description for marketplace"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="full_description">Full Description</Label>
                  <textarea
                    id="full_description"
                    value={formData.full_description}
                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                    placeholder="Detailed description with features and benefits"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="template_image_url">Template Image URL</Label>
                  <input
                    id="template_image_url"
                    value={formData.template_image_url}
                    onChange={(e) => setFormData({ ...formData, template_image_url: e.target.value })}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })
                    }
                  />
                  <Label htmlFor="is_free">Free Template</Label>
                </div>

                {!formData.is_free && (
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Publish to Marketplace</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={formData.is_published ? "default" : "secondary"}>
                    {formData.is_published ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant={formData.is_free ? "secondary" : "default"}>
                    {formData.is_free ? "Free" : `$${formData.price}`}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                  {formData.template_image_url ? (
                    <img
                      src={formData.template_image_url || "/placeholder.svg"}
                      alt={formData.template_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{formData.template_name || "Template Name"}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {formData.short_description || "Short description will appear here"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{formData.category || "Category"}</Badge>
                  <span className="font-semibold">{formData.is_free ? "Free" : `$${formData.price.toFixed(2)}`}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span>{formatDate(template.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Project URL:</span>
                  <a
                    href={template.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-xs"
                  >
                    {template.project_url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Template ID:</span>
                  <span className="font-mono text-xs">{template.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
