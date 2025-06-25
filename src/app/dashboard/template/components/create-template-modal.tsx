"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Upload, DollarSign } from "lucide-react"
import "@/styles/sidebar_settings_editor.css"

interface Category {
  name: string
  slug: string
  description: string
}

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateCreated: () => void
  userId: string
  userEmail: string
}

export function CreateTemplateModal({
  isOpen,
  onClose,
  onTemplateCreated,
  userId,
  userEmail,
}: CreateTemplateModalProps) {
  const [formData, setFormData] = useState({
    templateName: "",
    shortDescription: "",
    fullDescription: "",
    templateImageUrl: "",
    category: "",
    tags: [] as string[],
    projectUrl: "",
    price: 0,
    isFree: true,
    isPublished: false,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [showCategories, setShowCategories] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      console.log("🔄 Loading categories...")
      const response = await fetch("/api/templates/marketplace")
      const result = await response.json()
      console.log("📋 Categories result:", result)

      if (result.success && result.categories) {
        setCategories(result.categories)
        console.log("✅ Categories loaded:", result.categories.length)
      } else {
        console.error("❌ No categories found")
        // Fallback categories if API fails
        setCategories([
          {
            name: "Landing Pages",
            slug: "landing-pages",
            description: "High-converting landing page templates"
          },
          { name: "E-commerce", slug: "ecommerce", description: "Online store templates"},
          { name: "Portfolio", slug: "portfolio", description: "Creative portfolio templates"},
          { name: "Business", slug: "business", description: "Corporate website templates"},
          { name: "Blog", slug: "blog", description: "Blog and content templates"},
        ])
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error)
      // Fallback categories
      setCategories([
        {
          name: "Landing Pages",
          slug: "landing-pages",
          description: "High-converting landing page templates"
        },
        { name: "E-commerce", slug: "ecommerce", description: "Online store templates" },
        { name: "Portfolio", slug: "portfolio", description: "Creative portfolio templates" },
        { name: "Business", slug: "business", description: "Corporate website templates"},
        { name: "Blog", slug: "blog", description: "Blog and content templates"},
      ])
    }
  }

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true)
    try {
      const response = await fetch("/api/templates/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: userId,
          creatorEmail: userEmail,
          templateName: formData.templateName,
          shortDescription: formData.shortDescription,
          fullDescription: { content: formData.fullDescription },
          templateImageUrl: formData.templateImageUrl,
          category: formData.category,
          tags: formData.tags,
          projectUrl: formData.projectUrl,
          price: formData.isFree ? 0 : formData.price,
          isFree: formData.isFree,
          isPublished: !isDraft,
        }),
      })

      const result = await response.json()
      if (result.success) {
        onTemplateCreated()
        resetForm()
      }
    } catch (error) {
      console.error("Error creating template:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      templateName: "",
      shortDescription: "",
      fullDescription: "",
      templateImageUrl: "",
      category: "",
      tags: [],
      projectUrl: "",
      price: 0,
      isFree: true,
      isPublished: false,
    })
    setShowCategories(false)
    setShowPricing(false)
  }

  const handleCategorySelect = (category: Category) => {
    setFormData({ ...formData, category: category.name })
    setShowCategories(false)
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <h1 className="text-3xl font-bold bg-gradient-to-r text-black dark:text-white">
            Create Templates
          </h1>
          <p className="text-[#5E5F6E] dark:text-white/70" style={{fontSize: "12px"}}>
            Turn your designs into income - Create stunning templates that sell!
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Image */}
          <div className="space-y-2">
            <Label>Template Preview Image</Label>
            <div className="">
              {formData.templateImageUrl ? (
                <div className="relative">
                  <img
                    src={formData.templateImageUrl || "/placeholder.svg"}
                    alt="Template preview"
                    className="max-w-full h-32 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFormData({ ...formData, templateImageUrl: "" })}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                    value={formData.templateImageUrl}
                    onChange={(e) => setFormData({ ...formData, templateImageUrl: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label>Template Name *</Label>
            <input
              placeholder="Enter template name"
              value={formData.templateName}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label>Short Description *</Label>
            <textarea
              placeholder="Brief description that appears in marketplace"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              rows={2}
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <Label>Full Description</Label>
            <textarea
              placeholder="Detailed description with features, use cases, etc."
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              rows={4}
            />
          </div>

          {/* Category Selection - FIXED */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="relative">
              <button
                type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                onClick={() => setShowCategories(!showCategories)}
              >
                <span>{formData.category || "Select a category"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCategories && (
                <div className="menu_container2323232323rer3">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.slug}
                        type="button"
                        className="menu_container2323232323rer3_item"
                        onClick={() => handleCategorySelect(category)}
                      >
                          <span className="text-white">{category.name} - <span className="text-white/70">{category.description}</span></span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400">Loading categories...</div>
                  )}
                </div>
              )}
            </div>
            {/* {formData.category && (
              <div className="text-sm text-green-600 dark:text-green-400">✓ Selected: {formData.category}</div>
            )} */}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <input
              placeholder="Add tags (press Enter)"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag(e.currentTarget.value)
                  e.currentTarget.value = ""
                }
              }}
            />
          </div>

          {/* Project URL */}
          <div className="space-y-2">
            <Label>Project URL *</Label>
            <input
              type="url"
              placeholder="Paste your editor project URL here"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
            />
            <p className="text-sm text-[#5E5F6E] dark:text-white/70" style={{fontSize: "12px"}}>
              Copy the URL from your editor page (the one where you edit elements)
            </p>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Pricing</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Free</span>
                <Switch
                  checked={!formData.isFree}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, isFree: !checked })
                    setShowPricing(checked)
                  }}
                />
                <span className="text-sm">Paid</span>
              </div>
            </div>

            {!formData.isFree && (
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={
                loading ||
                !formData.templateName ||
                !formData.shortDescription ||
                !formData.category ||
                !formData.projectUrl
              }
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={
                loading ||
                !formData.templateName ||
                !formData.shortDescription ||
                !formData.category ||
                !formData.projectUrl
              }
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            >
              {loading ? "Publishing..." : "Publish Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
