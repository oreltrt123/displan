"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, ShoppingCart, Star, Edit, Trash2, DollarSign } from "lucide-react"
import { CreateTemplateModal } from "./create-template-modal"

interface Template {
  id: string
  template_name: string
  short_description: string
  template_image_url: string
  category: string
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

interface CreatorDashboardProps {
  userId: string
  userEmail: string
}

export function TemplateCreatorDashboard({ userId, userEmail }: CreatorDashboardProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalViews: 0,
    totalPurchases: 0,
    totalEarnings: 0,
  })

  useEffect(() => {
    loadTemplates()
  }, [userId])

  const loadTemplates = async () => {
    try {
      const response = await fetch(`/api/templates/user/${userId}`)
      const result = await response.json()

      if (result.success) {
        setTemplates(result.templates || [])
        calculateStats(result.templates || [])
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (templates: Template[]) => {
    const stats = templates.reduce(
      (acc, template) => ({
        totalTemplates: acc.totalTemplates + 1,
        totalViews: acc.totalViews + template.view_count,
        totalPurchases: acc.totalPurchases + template.purchase_count,
        totalEarnings: acc.totalEarnings + template.purchase_count * template.price,
      }),
      { totalTemplates: 0, totalViews: 0, totalPurchases: 0, totalEarnings: 0 },
    )
    setStats(stats)
  }

  const handleTemplateCreated = () => {
    setIsCreateModalOpen(false)
    loadTemplates()
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Creator Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your template marketplace</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-pink-500 hover:bg-pink-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPurchases}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <Star className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTemplates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                {template.template_image_url ? (
                  <img
                    src={template.template_image_url || "/placeholder.svg"}
                    alt={template.template_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{template.template_name}</h3>
                  <div className="flex gap-1 ml-2">
                    {template.is_draft && (
                      <Badge variant="secondary" className="text-xs">
                        Draft
                      </Badge>
                    )}
                    {template.is_published && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        Live
                      </Badge>
                    )}
                  </div>
                </div>

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
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {template.is_free ? "Free" : `$${template.price}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first template to start earning from your designs
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-pink-500 hover:bg-pink-600 text-white">
              Create Your First Template
            </Button>
          </div>
        )}
      </div>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTemplateCreated={handleTemplateCreated}
        userId={userId}
        userEmail={userEmail}
      />
    </div>
  )
}
