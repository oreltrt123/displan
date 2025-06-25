"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, ShoppingCart, Star, Filter } from "lucide-react"

interface Template {
  id: string
  creator_email: string
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
}

interface Category {
  name: string
  slug: string
  description: string
  icon: string
}

export function TemplateMarketplace() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketplace()
  }, [selectedCategory, searchQuery])

  const loadMarketplace = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/templates/marketplace?${params}`)
      const result = await response.json()

      if (result.success) {
        setTemplates(result.templates || [])
        setCategories(result.categories || [])
      }
    } catch (error) {
      console.error("Error loading marketplace:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateClick = (template: Template) => {
    // Open template preview or redirect to project
    window.open(template.project_url, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Template Marketplace</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover stunning templates created by our community
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="mb-2"
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="mb-2"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                {template.template_image_url ? (
                  <img
                    src={template.template_image_url || "/placeholder.svg"}
                    alt={template.template_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Preview</div>
                )}

                {/* Price Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={template.is_free ? "secondary" : "default"}
                    className={template.is_free ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                  >
                    {template.is_free ? "Free" : `$${template.price}`}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{template.template_name}</h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.short_description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {template.view_count}
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

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {template.creator_email.split("@")[0]}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or category filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
