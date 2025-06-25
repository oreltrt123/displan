"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, ShoppingCart, Star, ExternalLink, CreditCard, User } from "lucide-react"

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
  view_count: number
  purchase_count: number
  rating: number
  created_at: string
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    // Get user info
    const storedUserId = localStorage.getItem("user_id") || "user_" + Date.now()
    const storedUserEmail = localStorage.getItem("user_email") || "user@example.com"
    setUserId(storedUserId)
    setUserEmail(storedUserEmail)

    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      console.log("🔍 Loading template:", templateId)

      const response = await fetch(`/api/templates/${templateId}`)
      const result = await response.json()

      if (result.success && result.template) {
        setTemplate(result.template)
        // Update view count
        updateViewCount()
      } else {
        console.error("Template not found")
        router.push("/marketplace")
      }
    } catch (error) {
      console.error("Error loading template:", error)
      router.push("/marketplace")
    } finally {
      setLoading(false)
    }
  }

  const updateViewCount = async () => {
    try {
      await fetch(`/api/templates/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })
    } catch (error) {
      console.error("Error updating view count:", error)
    }
  }

  const handleUseTemplate = async () => {
    if (!template) return

    if (template.is_free) {
      // For free templates, just open the project
      window.open(template.project_url, "_blank")
      return
    }

    // For paid templates, handle purchase
    setPurchasing(true)
    try {
      const response = await fetch("/api/templates/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          buyerId: userId,
          buyerEmail: userEmail,
          purchasePrice: template.price,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Template purchased successfully! Opening project...")
        window.open(template.project_url, "_blank")
        // Refresh template data to update purchase count
        loadTemplate()
      } else {
        alert("Purchase failed: " + result.error)
      }
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderFullDescription = (description: any) => {
    if (typeof description === "string") {
      return <p className="text-gray-600 dark:text-gray-400">{description}</p>
    }
    if (description?.content) {
      return <p className="text-gray-600 dark:text-gray-400">{description.content}</p>
    }
    return <p className="text-gray-600 dark:text-gray-400">No detailed description available.</p>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Template Image */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                {template.template_image_url ? (
                  <img
                    src={template.template_image_url || "/placeholder.svg"}
                    alt={template.template_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ExternalLink className="w-16 h-16" />
                  </div>
                )}
              </div>
            </Card>

            {/* Preview Button */}
            <Button
              onClick={() => window.open(template.project_url, "_blank")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Preview Template
            </Button>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{template.template_name}</h1>
                <Badge className={template.is_free ? "bg-green-500" : "bg-blue-500"} variant="default">
                  {template.is_free ? "FREE" : `$${template.price}`}
                </Badge>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{template.short_description}</p>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center text-gray-500">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{template.view_count.toLocaleString()} views</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>{template.purchase_count} sales</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating} rating</span>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Created by {template.creator_email.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-500">Published on {formatDate(template.created_at)}</p>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="prose dark:prose-invert max-w-none">
                  {renderFullDescription(template.full_description)}
                </div>
              </CardContent>
            </Card>

            {/* Use Template Button */}
            <Button
              onClick={handleUseTemplate}
              disabled={purchasing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              size="lg"
            >
              {purchasing ? (
                "Processing..."
              ) : template.is_free ? (
                <>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Use Template
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Template for ${template.price}
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              {template.is_free
                ? "This template is free to use. Click to open the project."
                : "Purchase this template to get full access to the project."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
