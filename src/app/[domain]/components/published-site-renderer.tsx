"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export interface PublishedSiteData {
  id: string
  name: string
  description: string | null
  subdomain: string
  favicon_light_url: string | null
  favicon_dark_url: string | null
  social_preview_url: string | null
  custom_code: string | null
  elements: CanvasElement[]
  is_published: boolean
  canvas_width?: number
  canvas_height?: number
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CanvasElement {
  id: string
  project_id: string
  page_id: string
  element_type: string
  content: string | null
  x_position: number
  y_position: number
  width: number
  height: number
  font_size: number | null
  font_weight: string | null
  text_color: string | null
  background_color: string | null
  border_radius: number | null
  border_width: number | null
  border_color: string | null
  text_align: string | null
  z_index: number | null
  created_at: string
  updated_at: string
}

interface PublishedSiteRendererProps {
  siteData: PublishedSiteData
}

export function PublishedSiteRenderer({ siteData }: PublishedSiteRendererProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [templateContent, setTemplateContent] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  console.log("🎨 PublishedSiteRenderer received data:", {
    siteName: siteData.name,
    elementsCount: siteData.elements?.length || 0,
    elements: siteData.elements,
    subdomain: siteData.subdomain,
  })

  useEffect(() => {
    // Set the page title and favicon
    document.title = siteData.name || `${siteData.subdomain} - Built with DisPlan`

    // Set favicon if available
    if (siteData.favicon_light_url) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = siteData.favicon_light_url
      } else {
        const newFavicon = document.createElement("link")
        newFavicon.rel = "icon"
        newFavicon.href = siteData.favicon_light_url
        document.head.appendChild(newFavicon)
      }
    }

    // Load template content
    loadTemplateContent()
  }, [siteData])

  // Load template content from database
  const loadTemplateContent = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load template content using the function we created
      const { data, error } = await supabase.rpc("template_canvas_name_v232_load_r23", {
        project_id_param: siteData.id,
        page_slug_param: "home",
      })

      if (error) {
        console.error("Error loading template content:", error)
        setError("Failed to load template content")
      } else if (data?.success) {
        setTemplateContent(data.content || {})
        console.log("✅ Template content loaded:", data.content)
      }
    } catch (err) {
      console.error("Error loading template content:", err)
      setError("Failed to load template content")
    } finally {
      setIsLoading(false)
    }
  }

  // Render individual canvas element
  const renderElement = (element: CanvasElement) => {
    console.log("🎯 Rendering element:", {
      id: element.id,
      type: element.element_type,
      position: { x: element.x_position, y: element.y_position },
      size: { width: element.width, height: element.height },
      content: element.content?.substring(0, 50) + "...",
    })

    // Handle menu templates differently
    if (element.element_type.startsWith("menu-")) {
      return renderMenuTemplate(element)
    }

    // Common styles for positioned elements
    const elementStyle: React.CSSProperties = {
      position: "absolute",
      left: `${element.x_position || 0}px`,
      top: `${element.y_position || 0}px`,
      width: `${element.width || 200}px`,
      height: `${element.height || 50}px`,
      zIndex: element.z_index || 1,
      fontSize: element.font_size ? `${element.font_size}px` : "16px",
      fontWeight: element.font_weight || "normal",
      color: element.text_color || "#000000",
      backgroundColor: element.background_color || "transparent",
      textAlign: (element.text_align as any) || "left",
      borderRadius: element.border_radius ? `${element.border_radius}px` : "0px",
      borderWidth: element.border_width ? `${element.border_width}px` : "0px",
      borderColor: element.border_color || "transparent",
      borderStyle: element.border_width ? "solid" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent:
        element.text_align === "center" ? "center" : element.text_align === "right" ? "flex-end" : "flex-start",
      padding: "8px",
      boxSizing: "border-box",
      overflow: "hidden",
      wordWrap: "break-word",
    }

    // Render based on element type
    switch (element.element_type) {
      case "text":
        return (
          <div key={element.id} style={elementStyle}>
            <div
              dangerouslySetInnerHTML={{
                __html: element.content || "Text Element",
              }}
            />
          </div>
        )

      case "button":
        return (
          <button
            key={element.id}
            style={{
              ...elementStyle,
              cursor: "pointer",
              border: element.border_width
                ? `${element.border_width}px solid ${element.border_color}`
                : "1px solid #ccc",
              backgroundColor: element.background_color || "#f0f0f0",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            {element.content || "Button"}
          </button>
        )

      case "image":
        return (
          <div key={element.id} style={elementStyle}>
            <img
              src={element.content || "/placeholder.svg?height=200&width=200"}
              alt="Image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: element.border_radius ? `${element.border_radius}px` : "0px",
              }}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=200"
              }}
            />
          </div>
        )

      case "heading":
        return (
          <div key={element.id} style={elementStyle}>
            <h1
              style={{
                margin: 0,
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
              }}
              dangerouslySetInnerHTML={{
                __html: element.content || "Heading",
              }}
            />
          </div>
        )

      case "paragraph":
        return (
          <div key={element.id} style={elementStyle}>
            <p
              style={{
                margin: 0,
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
                lineHeight: "1.5",
              }}
              dangerouslySetInnerHTML={{
                __html: element.content || "Paragraph text",
              }}
            />
          </div>
        )

      default:
        return (
          <div key={element.id} style={elementStyle}>
            <div style={{ textAlign: "center", color: "#666" }}>{element.content || element.element_type}</div>
          </div>
        )
    }
  }

  // Render menu templates as full-width sections
  const renderMenuTemplate = (element: CanvasElement) => {
    const templateId = element.element_type.replace("menu-", "")
    const templateKey = `${templateId}_content`
    const content = templateContent[templateKey] || element.content || ""

    console.log("🍔 Rendering menu template:", {
      templateId,
      templateKey,
      content: content.substring(0, 50) + "...",
    })

    // Base template styles
    const templateStyle: React.CSSProperties = {
      width: "100%",
      minHeight: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      backgroundColor: element.background_color || "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      position: "relative",
      zIndex: element.z_index || 10,
    }

    // Render different menu templates
    switch (templateId) {
      case "header-1":
        return (
          <header key={element.id} style={templateStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: element.text_color || "#000000",
                }}
              >
                {content || "Logo"}
              </div>
              <nav style={{ display: "flex", gap: "24px" }}>
                <a
                  href="#"
                  style={{
                    color: element.text_color || "#000000",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  Home
                </a>
                <a
                  href="#"
                  style={{
                    color: element.text_color || "#000000",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  About
                </a>
                <a
                  href="#"
                  style={{
                    color: element.text_color || "#000000",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  Services
                </a>
                <a
                  href="#"
                  style={{
                    color: element.text_color || "#000000",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  Contact
                </a>
              </nav>
            </div>
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Get Started
            </button>
          </header>
        )

      case "header-2":
        return (
          <header
            key={element.id}
            style={{
              ...templateStyle,
              backgroundColor: element.background_color || "#1f2937",
              color: element.text_color || "#ffffff",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: element.text_color || "#ffffff",
              }}
            >
              {content || "Brand"}
            </div>
            <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              <a
                href="#"
                style={{
                  color: element.text_color || "#ffffff",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Products
              </a>
              <a
                href="#"
                style={{
                  color: element.text_color || "#ffffff",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Solutions
              </a>
              <a
                href="#"
                style={{
                  color: element.text_color || "#ffffff",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Pricing
              </a>
              <button
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Sign Up
              </button>
            </nav>
          </header>
        )

      case "hero-1":
        return (
          <section
            key={element.id}
            style={{
              ...templateStyle,
              minHeight: "400px",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: element.background_color || "#f9fafb",
              padding: "80px 32px",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: element.text_color || "#111827",
                marginBottom: "24px",
                maxWidth: "800px",
              }}
            >
              {content || "Welcome to Our Amazing Platform"}
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                marginBottom: "32px",
                maxWidth: "600px",
              }}
            >
              Build, deploy, and scale your applications with ease using our powerful tools and services.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Get Started
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "#374151",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "2px solid #d1d5db",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Learn More
              </button>
            </div>
          </section>
        )

      case "footer-1":
        return (
          <footer
            key={element.id}
            style={{
              ...templateStyle,
              backgroundColor: element.background_color || "#111827",
              color: element.text_color || "#ffffff",
              padding: "48px 32px 24px",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "32px",
                width: "100%",
                maxWidth: "1200px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>{content || "Company"}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    About Us
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Careers
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Contact
                  </a>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Products</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Features
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Pricing
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    API
                  </a>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Support</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Help Center
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Documentation
                  </a>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Status
                  </a>
                </div>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #374151",
                paddingTop: "24px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              © 2024 {siteData.name}. All rights reserved.
            </div>
          </footer>
        )

      default:
        return (
          <div
            key={element.id}
            style={{
              ...templateStyle,
              backgroundColor: element.background_color || "#f3f4f6",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: element.text_color || "#111827",
                  marginBottom: "8px",
                }}
              >
                {templateId.toUpperCase()} Template
              </h2>
              <p style={{ color: "#6b7280", fontSize: "16px" }}>{content || "Template content will appear here"}</p>
            </div>
          </div>
        )
    }
  }

  // Separate menu templates from other elements
  const menuElements = siteData.elements.filter((el: CanvasElement) => el.element_type.startsWith("menu-"))
  const otherElements = siteData.elements.filter((el: CanvasElement) => !el.element_type.startsWith("menu-"))

  console.log("🎨 Rendering elements:", {
    menuElements: menuElements.length,
    otherElements: otherElements.length,
    totalElements: siteData.elements.length,
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadTemplateContent}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS from project */}
      {siteData.custom_code && <style dangerouslySetInnerHTML={{ __html: siteData.custom_code }} />}

      {/* Site Content */}
      <div className="relative">
        {/* Render menu templates as stacked full-width sections */}
        <div className="w-full">
          {menuElements.sort((a, b) => (a.y_position || 0) - (b.y_position || 0)).map(renderElement)}
        </div>

        {/* Render other elements with absolute positioning */}
        <div
          className="relative"
          style={{
            minHeight: `${siteData.canvas_height || 800}px`,
            width: "100%",
            maxWidth: `${siteData.canvas_width || 1200}px`,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {otherElements.length > 0
            ? otherElements.map(renderElement)
            : !menuElements.length && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to {siteData.name}</h2>
                    <p className="text-gray-600">This site is under construction.</p>
                  </div>
                </div>
              )}
        </div>
      </div>

      {/* DisPlan Branding */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://displan.design"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-3 py-1 rounded-full text-xs hover:bg-gray-800 transition-colors shadow-lg"
        >
          Built with DisPlan
        </a>
      </div>

      {/* SEO Meta Tags */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Set meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', '${siteData.description || `${siteData.name} - Built with DisPlan`}');
            } else {
              const meta = document.createElement('meta');
              meta.name = 'description';
              meta.content = '${siteData.description || `${siteData.name} - Built with DisPlan`}';
              document.head.appendChild(meta);
            }
            
            // Set Open Graph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
              ogTitle.setAttribute('content', '${siteData.name}');
            } else {
              const meta = document.createElement('meta');
              meta.setAttribute('property', 'og:title');
              meta.content = '${siteData.name}';
              document.head.appendChild(meta);
            }
          `,
        }}
      />
    </div>
  )
}
