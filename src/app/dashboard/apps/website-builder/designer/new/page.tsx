"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Palette, Save, X } from "lucide-react"
import { createClient } from "../../../../../../../supabase/client"

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

      // Create initial content based on template
      let initialContent = {}

      if (template === "blank") {
        initialContent = {
          pages: [
            {
              id: "home",
              name: "Home",
              elements: [
                {
                  id: "header",
                  type: "header",
                  content: {
                    title: "My Website",
                    subtitle: "Welcome to my website",
                    showNav: true,
                    navItems: [
                      { label: "Home", link: "#" },
                      { label: "About", link: "#" },
                      { label: "Contact", link: "#" },
                    ],
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    textColor: "#000000",
                    padding: "20px",
                  },
                },
                {
                  id: "hero",
                  type: "hero",
                  content: {
                    heading: "Welcome to My Website",
                    subheading: "This is a blank template. Start building your website!",
                    buttonText: "Learn More",
                    buttonLink: "#",
                  },
                  style: {
                    backgroundColor: "#f5f5f5",
                    textColor: "#333333",
                    height: "500px",
                    alignment: "center",
                  },
                },
                {
                  id: "footer",
                  type: "footer",
                  content: {
                    copyright: "© 2023 My Website. All rights reserved.",
                    showSocial: true,
                    socialLinks: [
                      { platform: "twitter", link: "#" },
                      { platform: "facebook", link: "#" },
                      { platform: "instagram", link: "#" },
                    ],
                  },
                  style: {
                    backgroundColor: "#333333",
                    textColor: "#ffffff",
                    padding: "20px",
                  },
                },
              ],
            },
          ],
          settings: {
            siteName: name,
            favicon: "",
            theme: {
              primaryColor: "#0066cc",
              secondaryColor: "#f5f5f5",
              fontFamily: "Arial, sans-serif",
            },
          },
        }
      } else if (template === "business") {
        initialContent = {
          pages: [
            {
              id: "home",
              name: "Home",
              elements: [
                {
                  id: "header",
                  type: "header",
                  content: {
                    title: "Business Name",
                    subtitle: "Professional services",
                    showNav: true,
                    navItems: [
                      { label: "Home", link: "#" },
                      { label: "Services", link: "#" },
                      { label: "About", link: "#" },
                      { label: "Contact", link: "#" },
                    ],
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    textColor: "#333333",
                    padding: "20px",
                  },
                },
                {
                  id: "hero",
                  type: "hero",
                  content: {
                    heading: "Professional Solutions for Your Business",
                    subheading: "We provide top-quality services to help your business grow",
                    buttonText: "Get Started",
                    buttonLink: "#",
                  },
                  style: {
                    backgroundColor: "#0066cc",
                    textColor: "#ffffff",
                    height: "600px",
                    alignment: "center",
                  },
                },
                {
                  id: "services",
                  type: "features",
                  content: {
                    heading: "Our Services",
                    features: [
                      {
                        title: "Service 1",
                        description: "Description of service 1",
                        icon: "briefcase",
                      },
                      {
                        title: "Service 2",
                        description: "Description of service 2",
                        icon: "chart",
                      },
                      {
                        title: "Service 3",
                        description: "Description of service 3",
                        icon: "shield",
                      },
                    ],
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    textColor: "#333333",
                    padding: "60px 20px",
                  },
                },
                {
                  id: "testimonials",
                  type: "testimonials",
                  content: {
                    heading: "What Our Clients Say",
                    testimonials: [
                      {
                        quote: "This company provided excellent service!",
                        author: "John Doe",
                        company: "ABC Corp",
                      },
                      {
                        quote: "Highly recommended for business solutions.",
                        author: "Jane Smith",
                        company: "XYZ Inc",
                      },
                    ],
                  },
                  style: {
                    backgroundColor: "#f5f5f5",
                    textColor: "#333333",
                    padding: "60px 20px",
                  },
                },
                {
                  id: "footer",
                  type: "footer",
                  content: {
                    copyright: "© 2023 Business Name. All rights reserved.",
                    showSocial: true,
                    socialLinks: [
                      { platform: "twitter", link: "#" },
                      { platform: "linkedin", link: "#" },
                      { platform: "facebook", link: "#" },
                    ],
                    address: "123 Business St, City, Country",
                    phone: "+1 234 567 890",
                    email: "info@business.com",
                  },
                  style: {
                    backgroundColor: "#333333",
                    textColor: "#ffffff",
                    padding: "40px 20px",
                  },
                },
              ],
            },
          ],
          settings: {
            siteName: name,
            favicon: "",
            theme: {
              primaryColor: "#0066cc",
              secondaryColor: "#f5f5f5",
              fontFamily: "Helvetica, Arial, sans-serif",
            },
          },
        }
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "blank"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("blank")}
                  >
                    <div className="aspect-video bg-white/10 rounded flex items-center justify-center mb-3">
                      <span className="text-lg font-medium">Blank</span>
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
                    <div className="aspect-video bg-white/10 rounded flex items-center justify-center mb-3">
                      <span className="text-lg font-medium">Business</span>
                    </div>
                    <h3 className="font-medium">Business Template</h3>
                    <p className="text-sm text-white/70">Professional business website</p>
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
