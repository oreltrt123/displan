"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, ShoppingCart, Star, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  creator_email: string
  creator_id: string
  template_name: string
  short_description: string
  template_image_url: string
  category: string
  tags: string[]
  price: number
  is_free: boolean
  view_count: number
  purchase_count: number
  rating: number
  created_at: string
  project_url: string
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
  const router = useRouter()

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

  const handleTemplateClick = (template: Template) => {
    console.log("🔍 Clicking template:", template.id)
    // Navigate to template detail page
    router.push(`/marketplace/${template.id}`)
  }

  const getTemplateCountForCategory = (categoryName: string) => {
    return templates.filter((t) => t.category === categoryName).length
  }

  const getTotalTemplateCount = () => {
    return templates.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Template Marketplace</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Discover and purchase amazing templates created by our community of talented designers
            </p>

            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              All Templates ({getTotalTemplateCount()})
            </Button>
            {categories.map((category) => {
              const count = getTemplateCountForCategory(category.name)
              return (
                <Button
                  key={category.slug}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name} ({count})
                </Button>
              )
            })}
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg"
                onClick={() => handleTemplateClick(template)}
              >
                {/* Template Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                  {template.template_image_url ? (
                    <img
                      src={template.template_image_url || "/placeholder.svg"}
                      alt={template.template_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
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

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 mb-2">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <p className="text-white text-sm">
                        {template.is_free ? "Free to use" : `$${template.price} to purchase`}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Template Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {template.template_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {template.short_description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {template.view_count.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {template.purchase_count}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {template.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
  {template.creator_email && template.creator_id && (
    <a
      href={`/profile/${template.creator_id}`}
      onClick={(e) => e.stopPropagation()}
      className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
    >
      by {template.creator_email.split("@")[0]}
    </a>
  )}
                  </div>
                </CardContent>
              </Card>
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
                setSelectedCategory(null)
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
