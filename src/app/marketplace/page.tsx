"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, ShoppingCart, Star, ExternalLink, ChevronDown, Grid3X3 } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import "@/styles/sidebar_settings_editor.css"
import "@/app/dashboard/apps/website-builder/designer/styles/button.css"

interface Template {
  id: string
  creator_email: string
  creator_id: string
  creator_name: string // NEW: Real creator name
  template_name: string
  short_description: string
  template_image_url: string
  template_hover_image_url?: string // NEW: Hover image
  category: string
  tags: string[]
  price: number
  is_free: boolean
  view_count: number
  purchase_count: number
  clone_count: number // NEW: Track clones
  rating: number
  created_at: string
  project_url: string
  live_demo_url?: string // NEW: Published site URL
}

interface Category {
  name: string
  slug: string
  description: string
  icon: string
}

export default function MarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false) // NEW: Category dropdown

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // NEW: Read category from URL on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    loadMarketplace()
  }, [selectedCategory, searchQuery])

  const loadMarketplace = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      console.log("🏪 Loading marketplace with params:", { selectedCategory, searchQuery })

      const response = await fetch(`/api/templates/marketplace?${params}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("📋 Marketplace result:", result)

      if (result.success) {
        setTemplates(result.templates || [])
        setCategories(result.categories || [])
      } else {
        console.error("❌ Marketplace error:", result.error)
        setTemplates([])
        setCategories([])
      }
    } catch (error) {
      console.error("❌ Error loading marketplace:", error)
      setTemplates([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // NEW: Handle category selection with URL update
  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (categoryName) {
      // Convert category name to URL-friendly format (lowercase, replace spaces with hyphens)
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "")
      params.set("category", categorySlug)
    } else {
      params.delete("category")
    }

    // Push new URL
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)
  }

  const handleTemplateClick = (template: Template) => {
    console.log("🔍 Clicking template:", template.id)
    router.push(`/marketplace/${template.id}`)
  }

  // 🔥 NEW: Handle template usage (cloning)
  const handleUseTemplate = async (template: Template, event: React.MouseEvent) => {
    event.stopPropagation()
    if (!template.is_free) {
      alert("Purchase functionality coming soon!")
      return
    }

    console.log("🎨 Using free template:", template.id)
    // Get user ID from localStorage or generate one
    const userId = localStorage.getItem("displan_user_id") || "user_" + Date.now()
    localStorage.setItem("displan_user_id", userId)

    // Redirect to dashboard with clone parameter
    const dashboardUrl = `/dashboard/apps/displan?id=${userId}&clone_template=${template.id}`
    router.push(dashboardUrl)
  }

  const getTemplateCountForCategory = (categoryName: string) => {
    return templates.filter((t) => t.category === categoryName).length
  }

  const getTotalTemplateCount = () => {
    return templates.length
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="market_place_ere32">
            <h1 className="text-5xl font-bold mb-6">Marketplace</h1>
            <p className="text_market_place_ere32">
              Discover and purchase amazing templates created by our community of talented designers
            </p>
          </div>
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="r2552esf25_252trewt3er12323232ewafser"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter - ENHANCED */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategorySelect(null)}
              className={
                selectedCategory === null ? "button_edit_project_marketplace_button" : "button_edit_project_marketplace"
              }
               style={{cursor: "default"}}
            >
              All Templates ({getTotalTemplateCount()})
            </button>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={
                selectedCategory === null ? "button_edit_project_marketplace" : "button_edit_project_marketplace"
              }
              style={{cursor: "default"}}
              >
                <span>Templates</span>
                {/* <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} /> */}
              </button>
            {showCategoryDropdown && (
              <div className="menu_container2323232323rer33">
                {categories.map((category) => {
                  const count = getTemplateCountForCategory(category.name)
                  return (
                    <button
                      key={category.slug}
                      onClick={() => {
                        handleCategorySelect(category.name)
                        setShowCategoryDropdown(false)
                      }}
                      className="menu_container2323232323rer33_item"
                    >
                      <span className="text-white">
                        {category.icon} - <span className="text-white/70">{category.name}</span> - <span className="text-white/70">{count} templates</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            {categories.slice(0, 6).map((category) => {
              const count = getTemplateCountForCategory(category.name)
              return (
                <button
                  key={category.slug}
                  onClick={() => handleCategorySelect(category.name)}
                  className={
                    selectedCategory === category.name
                      ? "button_edit_project_marketplace_button"
                      : "button_edit_project_marketplace"
                  }
                      style={{cursor: "default"}}

                >
                  {/* <span className="mr-2">{category.icon}</span> */}
                  {category.name} ({count})
                </button>
              )
            })}
            {categories.length > 6 && (
              <button onClick={() => setShowCategoryDropdown(true)} className="button_edit_project_marketplace">
                +{categories.length - 6} more
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {templates.map((template) => (
              <div                 key={template.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg"
                onClick={() => handleTemplateClick(template)}>
                {/* Template Image with Hover Effect */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                  {template.template_image_url ? (
                    <>
                      <img
                        src={template.template_image_url || "/placeholder.svg"}
                        alt={template.template_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* NEW: Hover Image Effect */}
                      {template.template_hover_image_url && (
                        <img
                          src={template.template_hover_image_url || "/placeholder.svg"}
                          alt={`${template.template_name} hover`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ExternalLink className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Click to View</p>
                      </div>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        template.is_free
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }
                    >
                      {template.is_free ? "FREE" : `$${template.price}`}
                    </Badge>
                  </div>
                  {/* Hover Overlay with Use Template Button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Button
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={(e) => handleUseTemplate(template, e)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {template.is_free ? "Use Template" : "Buy Template"}
                      </Button>
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                  {/* Template Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {template.template_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {template.short_description}
                    </p>
                  </div>

                  {/* Stats - ENHANCED */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {template.view_count.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {template.clone_count || template.purchase_count}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {template.rating.toFixed(1)}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <a
                      href={`/profile/${template.creator_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:underline flex items-center"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs font-bold">
                          {(template.creator_name || template.creator_email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      by {template.creator_name || template.creator_email.split("@")[0]}
                    </a>
                  </div> */}
            </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery || selectedCategory
                ? "Try adjusting your search terms or browse different categories to find the perfect template."
                : "No templates have been published yet. Check back soon for amazing designs!"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                handleCategorySelect(null)
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
