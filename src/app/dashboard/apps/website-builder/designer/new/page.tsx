"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Palette, Save, X } from "lucide-react"
import { createClient } from "../../../../../../../supabase/client"
import { blankTemplate } from "../templates/blank-template"
import { businessTemplate } from "../templates/business-template"
import { portfolioTemplate } from "../templates/portfolio-template"
import { ecommerceTemplate } from "../templates/ecommerce-template"
import  blogTemplate from "../templates/blog-template"
import { landingTemplate } from "../templates/landing-template"

export default function NewDesignerProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [template, setTemplate] = useState("blank")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/sign-in")
        return
      }

      // Get the selected template
      let initialContent = {}

      switch (template) {
        case "blank":
          initialContent = blankTemplate(name)
          break
        case "business":
          initialContent = businessTemplate(name)
          break
        case "portfolio":
          initialContent = portfolioTemplate(name)
          break
        case "ecommerce":
          initialContent = ecommerceTemplate(name)
          break
        case "blog":
          initialContent = blogTemplate(name)
          break
        case "landing":
          initialContent = landingTemplate(name)
          break
        default:
          initialContent = blankTemplate(name)
      }

      // Create new project in database
      const { data: project, error: projectError } = await supabase
        .from("website_projects")
        .insert({
          user_id: user.id,
          name,
          description,
          type: "designer",
          content: initialContent,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Redirect to the editor
      router.push(`/dashboard/apps/website-builder/designer/edit/${project.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <header className="w-full border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
            DisPlan
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/apps/website-builder/designer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Visual Designer
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={24} className="text-purple-400" />
              <h1 className="text-2xl font-bold">Create New Design Project</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <X size={18} className="text-red-400" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Project Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="My Awesome Website"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="A brief description of your website project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Choose a Template</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "blank"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("blank")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="Blank Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Blank Template</h3>
                    <p className="text-sm text-white/70">Start with a clean slate</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "business"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("business")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="Business Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Business Template</h3>
                    <p className="text-sm text-white/70">Professional business website</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "portfolio"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("portfolio")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="Portfolio Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Portfolio Template</h3>
                    <p className="text-sm text-white/70">Showcase your work beautifully</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "ecommerce"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("ecommerce")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="E-commerce Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">E-commerce Template</h3>
                    <p className="text-sm text-white/70">Online store with product showcase</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "blog"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("blog")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="Blog Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Blog Template</h3>
                    <p className="text-sm text-white/70">Content-focused blog layout</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "landing"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("landing")}
                  >
                    <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=320"
                        alt="Landing Page Template Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Landing Page</h3>
                    <p className="text-sm text-white/70">High-conversion landing page</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isLoading ? "Creating Project..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
