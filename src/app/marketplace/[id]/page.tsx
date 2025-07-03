"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Star, ExternalLink, CreditCard, MessageSquare, Calendar, Globe, Download } from "lucide-react"

interface Template {
  id: string
  creator_id: string
  creator_email: string
  creator_name: string
  template_name: string
  short_description: string
  full_description: any
  template_image_url: string
  template_hover_image_url?: string
  category: string
  tags: string[]
  project_url: string
  live_demo_url?: string
  price: number
  is_free: boolean
  view_count: number
  purchase_count: number
  clone_count: number
  rating: number
  created_at: string
}

interface Review {
  id: string
  reviewer_id: string
  reviewer_email: string
  reviewer_name: string
  rating: number
  review_text: string
  created_at: string
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, text: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    // Get user info
    const storedUserId = localStorage.getItem("displan_user_id") || "user_" + Date.now()
    const storedUserEmail = localStorage.getItem("user_email") || "user@example.com"
    setUserId(storedUserId)
    setUserEmail(storedUserEmail)

    loadTemplate()
    loadReviews()
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

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/templates/reviews?templateId=${templateId}`)
      const result = await response.json()

      if (result.success) {
        setReviews(result.reviews || [])
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
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
      // For free templates, redirect to dashboard for cloning
      const dashboardUrl = `/dashboard/apps/displan?id=${userId}&clone_template=${template.id}`
      router.push(dashboardUrl)
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
        alert("Template purchased successfully! Redirecting to your dashboard...")
        const dashboardUrl = `/dashboard/apps/displan?id=${userId}&clone_template=${template.id}`
        router.push(dashboardUrl)
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

  const submitReview = async () => {
    if (!template || !newReview.text.trim()) return

    setSubmittingReview(true)
    try {
      const response = await fetch("/api/templates/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          reviewerId: userId,
          reviewerEmail: userEmail,
          rating: newReview.rating,
          reviewText: newReview.text,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShowReviewModal(false)
        setNewReview({ rating: 5, text: "" })
        loadReviews()
        loadTemplate() // Refresh to get updated rating
      } else {
        alert("Failed to submit review: " + result.error)
      }
    } catch (error) {
      console.error("Review submission error:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setSubmittingReview(false)
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
      return (
        <div className="prose dark:prose-invert max-w-none">
          {description.split("\n").map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-400 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )
    }
    if (description?.content) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          {/* Enhanced formatting for full description */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border-l-4 border-blue-500">
            <div className="space-y-4">
              {description.content.split("\n").map((line: string, index: number) => {
                if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 flex-1">{line.replace(/^[•-]\s*/, "")}</p>
                    </div>
                  )
                }
                return line.trim() ? (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {line}
                  </p>
                ) : null
              })}
            </div>
          </div>
        </div>
      )
    }
    return <p className="text-gray-600 dark:text-gray-400">No detailed description available.</p>
  }

  const renderStarRating = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    )
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
          {/* Template Images */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative group">
                {template.template_image_url ? (
                  <>
                    <img
                      src={template.template_image_url || "/placeholder.svg"}
                      alt={template.template_name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {/* Hover Image Effect */}
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
                    <ExternalLink className="w-16 h-16" />
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => window.open(template.project_url, "_blank")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Preview Template
              </Button>

              {template.live_demo_url && (
                <Button
                  onClick={() => window.open(template.live_demo_url, "_blank")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
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

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-semibold">{template.view_count.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Download className="w-5 h-5 mx-auto mb-1 text-green-500" />
                  <div className="text-lg font-semibold">{template.clone_count || template.purchase_count}</div>
                  <div className="text-xs text-gray-500">Uses</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500 fill-current" />
                  <div className="text-lg font-semibold">{template.rating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                  <div className="text-lg font-semibold">{reviews.length}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {(template.creator_name || template.creator_email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Created by {template.creator_name || template.creator_email.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Published on {formatDate(template.created_at)}
                  </p>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {template.category}
                  </Badge>
                </div>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
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
                {renderFullDescription(template.full_description)}
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
                ? "This template is free to use. Click to create your own copy."
                : "Purchase this template to get full access and create your own copy."}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews ({reviews.length})</h2>
            <Button onClick={() => setShowReviewModal(true)} variant="outline" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Write Review</span>
            </Button>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {(review.reviewer_name || review.reviewer_email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {review.reviewer_name || review.reviewer_email.split("@")[0]}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {renderStarRating(review.rating)}
                              <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.review_text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to review this template!</p>
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Write First Review
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              {renderStarRating(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Review</label>
              <Textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Share your thoughts about this template..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReviewModal(false)} disabled={submittingReview}>
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={submittingReview || !newReview.text.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
