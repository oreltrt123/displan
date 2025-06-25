"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, ShoppingCart, DollarSign, Calendar, Edit } from "lucide-react"
import { CreateTemplateModal } from "./components/create-template-modal"
import { useRouter } from "next/navigation"
import "@/app/dashboard/apps/website-builder/designer/styles/button.css"
import "@/styles/button_ui.css"
import Navbar  from "./components/navbar"

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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Get user info from your auth system
    const storedUserId = localStorage.getItem("user_id") || "user_" + Date.now()
    const storedUserEmail = localStorage.getItem("user_email") || "user@example.com"

    // Store user info if not exists
    if (!localStorage.getItem("user_id")) {
      localStorage.setItem("user_id", storedUserId)
    }
    if (!localStorage.getItem("user_email")) {
      localStorage.setItem("user_email", storedUserEmail)
    }

    setUserId(storedUserId)
    setUserEmail(storedUserEmail)

    loadTemplates(storedUserId)
  }, [])

  const loadTemplates = async (userIdToLoad: string) => {
    try {
      setLoading(true)
      console.log("🔄 Loading templates for user:", userIdToLoad)

      const response = await fetch(`/api/templates/user/${userIdToLoad}`, {
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
      console.log("📋 Templates result:", result)

      if (result.success && result.templates) {
        setTemplates(result.templates)
        console.log("✅ Templates loaded:", result.templates.length)
      } else {
        console.error("❌ Failed to load templates:", result.error)
        setTemplates([])
      }
    } catch (error) {
      console.error("❌ Error loading templates:", error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateCreated = () => {
    setShowCreateModal(false)
    // Force reload templates
    setTimeout(() => {
      loadTemplates(userId)
    }, 1000)
  }

  const handleEditTemplate = (templateId: string) => {
    router.push(`/dashboard/template/creators/editor/${templateId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return "Free"
    return `$${price.toFixed(2)}`
  }

  const calculateStats = () => {
    return {
      totalViews: templates.reduce((sum, t) => sum + t.view_count, 0),
      totalSales: templates.reduce((sum, t) => sum + t.purchase_count, 0),
      totalEarnings: templates.reduce((sum, t) => sum + t.price * t.purchase_count, 0),
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar/>
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r text-black dark:text-white">
            My Templates
          </h1>
          <p className="text-[#5E5F6E] dark:text-white/70 mt-2">Create and manage your template marketplace</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="button_edit_project_r222SDS">
          New Template
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="">
            <img className="w-8 h-8 mr-2 dark:hidden" src="/components/template/views_light.png" alt="" />
            <img className="w-8 h-8 mr-2 hidden dark:block" src="/components/template/views_dark.png" alt="" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{stats.totalSales}</p>
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
                <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="">
            <img className="w-8 h-8 mr-2 dark:hidden" src="/components/editor/element/template_light.png" alt="" />
            <img className="w-8 h-8 mr-2 hidden dark:block" src="/components/editor/element/template_dark.png" alt="" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid or Empty State */}
      {templates.length === 0 ? (
        <Card className="text-center py-16 border-none bg-background">
          <CardContent>
            <div className="max-w-md mx-auto dffdsfsegesgdseregesgesge">
              <h3 className="text-2xl font-bold mb-4" style={{fontSize: "13px", position: "relative", top: "20px", left: "-4px"}}>No Templates Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6" style={{fontSize: "11px", width: "40%", position: "relative", left: "30%"}}>
                Turn your amazing designs into income! Create templates that others can purchase and use.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="button_edit_project_r222SDSefegsgdsgesgg"
              >
                Create New Template
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleEditTemplate(template.id)}
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
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
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">{template.template_name}</h3>
                  <Badge variant={template.is_published ? "default" : "secondary"}>
                    {template.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {template.short_description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{template.category}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(template.price, template.is_free)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span>{template.view_count} views</span>
                  <span>{template.purchase_count} sales</span>
                  <span>{formatDate(template.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTemplateCreated={handleTemplateCreated}
        userId={userId}
        userEmail={userEmail}
      />
    </div>
    </div>
  )
}
