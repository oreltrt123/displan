"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { WaitlistSignup } from "@/components/waitlist-signup"
import { InView } from "@/components/ui/in-view"
import { motion } from "framer-motion"
import "@/styles/template/template_11.css"
import "@/styles/template/template_14.css"
import "@/styles/button_elements_panel.css"

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
  src?: string | null
  link_url?: string | null
  link_page?: string | null
  opacity?: number
  visible?: boolean
  styles?: any
  created_at: string
  updated_at: string
}

interface PublishedSiteRendererProps {
  siteData: PublishedSiteData
}

export function PublishedSiteRenderer({ siteData }: PublishedSiteRendererProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Debug logging
  useEffect(() => {
    console.log("🔍 PublishedSiteRenderer Debug Info:", {
      siteData,
      elementsCount: siteData?.elements?.length || 0,
      elements: siteData?.elements,
      canvasWidth: siteData?.canvas_width,
      canvasHeight: siteData?.canvas_height,
    })

    setDebugInfo({
      elementsCount: siteData?.elements?.length || 0,
      hasElements: !!(siteData?.elements && siteData.elements.length > 0),
      sampleElement: siteData?.elements?.[0] || null,
    })
  }, [siteData])

  useEffect(() => {
    // Set the page title
    document.title = siteData.name || `${siteData.subdomain} - Built with DisPlan`

    // Set favicon if available
    if (siteData.favicon_light_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = siteData.favicon_light_url
      } else {
        const newFavicon = document.createElement("link")
        newFavicon.rel = "icon"
        newFavicon.href = siteData.favicon_light_url
        document.head.appendChild(newFavicon)
      }
    }

    // Set social preview meta tags
    if (siteData.social_preview_url) {
      let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement
      if (!ogImage) {
        ogImage = document.createElement("meta")
        ogImage.setAttribute("property", "og:image")
        document.head.appendChild(ogImage)
      }
      ogImage.content = siteData.social_preview_url
    }

    setIsLoading(false)
  }, [siteData])

  // Helper function to get user content with fallback
  const getUserContent = (element: CanvasElement, defaultContent: string) => {
    // Always use user's content if it exists and isn't a generic template name
    if (
      element.content &&
      !element.content.includes("Menu Template") &&
      !element.content.includes("Template Content") &&
      element.content.trim() !== ""
    ) {
      return element.content
    }
    return defaultContent
  }

  // Helper function to apply user styling to text elements
  const applyUserStyling = (element: CanvasElement, additionalStyles?: React.CSSProperties) => ({
    fontSize: element.font_size ? `${element.font_size}px` : undefined,
    fontWeight: element.font_weight || undefined,
    color: element.text_color || undefined,
    textAlign: (element.text_align as any) || undefined,
    ...additionalStyles,
  })

  // Helper function to apply user styling to button elements
  const applyButtonStyling = (element: CanvasElement, additionalStyles?: React.CSSProperties) => ({
    fontSize: element.font_size ? `${element.font_size}px` : undefined,
    fontWeight: element.font_weight || undefined,
    color: element.text_color || undefined,
    backgroundColor: element.background_color || undefined,
    borderRadius: element.border_radius ? `${element.border_radius}px` : undefined,
    borderWidth: element.border_width ? `${element.border_width}px` : undefined,
    borderColor: element.border_color || undefined,
    borderStyle: element.border_width ? "solid" : "none",
    textAlign: (element.text_align as any) || undefined,
    padding: "8px 16px",
    cursor: "pointer",
    ...additionalStyles,
  })

  // Function to check if element is a template
  const isTemplate = (elementType: string) => {
    return (
      elementType.startsWith("template-") ||
      elementType.startsWith("template_") ||
      elementType.startsWith("empty-") ||
      elementType.startsWith("menu-template") ||
      elementType.includes("template")
    )
  }

  // Function to check if element is a menu template
  const isMenuTemplate = (elementType: string) => {
    return elementType.startsWith("menu-template") || elementType.includes("menu-template")
  }

  // Function to get button class based on element type
  const getButtonClass = (elementType: string) => {
    const buttonTypeMap: { [key: string]: string } = {
      "button-primary": "displan-button-primary",
      "button-secondary": "displan-button-secondary",
      "button-outline": "displan-button-outline",
      "button-text": "displan-button-text",
      "button-rounded": "displan-button-rounded",
      "button-icon": "displan-button-icon",
      "button-gradient": "displan-button-gradient",
      "button-large": "displan-button-large",
      "button-small": "displan-button-small",
      "button-pill": "displan-button-pill",
    }
    return buttonTypeMap[elementType] || "displan-button-primary"
  }

  // Function to get text class based on element type
  const getTextClass = (elementType: string) => {
    const textTypeMap: { [key: string]: string } = {
      "text-title": "displan-text-title",
      "text-subtitle": "displan-text-subtitle",
      "text-paragraph": "displan-text-paragraph",
      "text-heading": "displan-text-heading",
      "text-link": "displan-text-link",
      "text-address": "displan-text-address",
      "text-phone": "displan-text-phone",
      "text-email": "displan-text-email",
    }
    return textTypeMap[elementType] || ""
  }

  // Template rendering function with ALL your exact templates
  const renderTemplateElement = (element: CanvasElement, baseStyle: React.CSSProperties, ElementWrapper: any) => {
    const templateId = element.element_type

    console.log("🎨 Rendering FULL TEMPLATE:", templateId, "with user content override")

    // Helper to get user content or fallback to default
    const getTemplateContent = (elementKey: string, defaultContent: string) => {
      // Try to get user's custom content, otherwise use default
      return element.content || defaultContent
    }

    // Handle menu templates specifically
    if (isMenuTemplate(templateId)) {
      const menuId = templateId.replace("menu-", "")
      console.log("🍔 Rendering MENU TEMPLATE:", menuId)

      switch (menuId) {
        case "template-1":
          return (
            <ElementWrapper
              key={element.id}
              style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
            >
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                  <div className="max-w-xl">
                    <h2
                      className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl"
                      style={applyUserStyling(element)}
                    >
                      {getTemplateContent("title", "Meet our leadership")}
                    </h2>
                    <p className="mt-6 text-lg/8 text-gray-600" style={applyUserStyling(element)}>
                      {getTemplateContent(
                        "description",
                        "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
                      )}
                    </p>
                  </div>
                  <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                    <li>
                      <div className="flex items-center gap-x-6">
                        <img
                          className="size-[35px] rounded-full"
                          src={
                            element.src ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt="Profile avatar"
                        />
                        <div>
                          <h3
                            className="text-base/7 font-semibold tracking-tight text-gray-900"
                            style={applyUserStyling(element)}
                          >
                            {getTemplateContent("name", "Test Name")}
                          </h3>
                          <p className="text-sm/6 font-semibold text-indigo-600" style={applyUserStyling(element)}>
                            {getTemplateContent("role", "Co-Founder / CEO")}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </ElementWrapper>
          )

        case "template-2":
          return (
            <ElementWrapper
              key={element.id}
              style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
            >
              <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                  <img className="mx-auto h-12" src={element.src || "/logo_light_mode.png"} alt="Company logo" />
                  <figure className="mt-10">
                    <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                      <p style={applyUserStyling(element)}>
                        "
                        {getTemplateContent(
                          "quote",
                          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.",
                        )}
                        "
                      </p>
                    </blockquote>
                    <figcaption className="mt-10">
                      <img
                        className="mx-auto size-10 rounded-full"
                        src={
                          element.src ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Testimonial avatar"
                      />
                      <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                        <div className="font-semibold text-gray-900" style={applyUserStyling(element)}>
                          {getTemplateContent("testimonial-name", "Test Name")}
                        </div>
                        <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        <div className="text-gray-600" style={applyUserStyling(element)}>
                          {getTemplateContent("testimonial-title", "CEO of Workcation")}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </section>
            </ElementWrapper>
          )

        // Add other menu templates here...
        default:
          return (
            <ElementWrapper
              key={element.id}
              style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
            >
              <nav
                style={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 2rem",
                  backgroundColor: element.background_color || "#ffffff",
                  borderBottom: "1px solid #e5e7eb",
                  ...applyUserStyling(element),
                }}
              >
                <div className="logo" style={applyUserStyling(element)}>
                  {getUserContent(element, "Logo")}
                </div>
                <div className="menu-items" style={{ display: "flex", gap: "2rem" }}>
                  <a href="#" style={applyUserStyling(element)}>
                    Home
                  </a>
                  <a href="#" style={applyUserStyling(element)}>
                    About
                  </a>
                  <a href="#" style={applyUserStyling(element)}>
                    Services
                  </a>
                  <a href="#" style={applyUserStyling(element)}>
                    Contact
                  </a>
                </div>
                <button style={applyButtonStyling(element)}>{getUserContent(element, "Get Started")}</button>
              </nav>
            </ElementWrapper>
          )
      }
    }

    switch (templateId) {
      case "template-1":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                <div className="max-w-xl">
                  <h2
                    className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl"
                    style={applyUserStyling(element)}
                  >
                    {getTemplateContent("title", "Meet our leadership")}
                  </h2>
                  <p className="mt-6 text-lg/8 text-gray-600" style={applyUserStyling(element)}>
                    {getTemplateContent(
                      "description",
                      "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
                    )}
                  </p>
                </div>
                <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                  <li>
                    <div className="flex items-center gap-x-6">
                      <img
                        className="size-[35px] rounded-full"
                        src={
                          element.src ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Profile avatar"
                      />
                      <div>
                        <h3
                          className="text-base/7 font-semibold tracking-tight text-gray-900"
                          style={applyUserStyling(element)}
                        >
                          {getTemplateContent("name", "Test Name")}
                        </h3>
                        <p className="text-sm/6 font-semibold text-indigo-600" style={applyUserStyling(element)}>
                          {getTemplateContent("role", "Co-Founder / CEO")}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </ElementWrapper>
        )

      case "template-2":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
              <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
              <div className="mx-auto max-w-2xl lg:max-w-4xl">
                <img className="mx-auto h-12" src={element.src || "/logo_light_mode.png"} alt="Company logo" />
                <figure className="mt-10">
                  <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                    <p style={applyUserStyling(element)}>
                      "
                      {getTemplateContent(
                        "quote",
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.",
                      )}
                      "
                    </p>
                  </blockquote>
                  <figcaption className="mt-10">
                    <img
                      className="mx-auto size-10 rounded-full"
                      src={
                        element.src ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Testimonial avatar"
                    />
                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                      <div className="font-semibold text-gray-900" style={applyUserStyling(element)}>
                        {getTemplateContent("testimonial-name", "Test Name")}
                      </div>
                      <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      <div className="text-gray-600" style={applyUserStyling(element)}>
                        {getTemplateContent("testimonial-title", "CEO of Workcation")}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </section>
          </ElementWrapper>
        )

      case "empty-0":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h2
                    className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
                    style={applyUserStyling(element)}
                  >
                    {getTemplateContent("blog-title", "From the blog")}
                  </h2>
                  <p className="mt-2 text-lg/8 text-gray-600" style={applyUserStyling(element)}>
                    {getTemplateContent("blog-subtitle", "Learn how to grow your business with our expert advice.")}
                  </p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  <article className="flex max-w-xl flex-col items-start justify-between">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime="2020-03-16" className="text-gray-500" style={applyUserStyling(element)}>
                        {getTemplateContent("article-date", "Mar 16, 2020")}
                      </time>
                      <a
                        href="#"
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                        style={applyUserStyling(element)}
                      >
                        {getTemplateContent("article-category", "Marketing")}
                      </a>
                    </div>
                    <div className="group relative">
                      <h3
                        className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600"
                        style={applyUserStyling(element)}
                      >
                        <a href="#">
                          <span className="absolute inset-0" />
                          {getTemplateContent("article-title", "Boost your conversion rate")}
                        </a>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600" style={applyUserStyling(element)}>
                        {getTemplateContent(
                          "article-excerpt",
                          "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
                        )}
                      </p>
                    </div>
                    <div className="relative mt-8 flex items-center gap-x-4">
                      <img
                        className="size-10 rounded-full bg-gray-50"
                        src={
                          element.src ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Author avatar"
                      />
                      <div className="text-sm/6">
                        <p className="font-semibold text-gray-900" style={applyUserStyling(element)}>
                          <a href="#">
                            <span className="absolute inset-0" />
                            {getTemplateContent("author-name", "Test Name")}
                          </a>
                        </p>
                        <p className="text-gray-600" style={applyUserStyling(element)}>
                          {getTemplateContent("author-role", "Co-Founder / CTO")}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </ElementWrapper>
        )

      case "empty-1":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
              <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
              >
                <div
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                />
              </div>
              <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-sm/6 font-semibold text-[#888888f1]"
                      style={applyUserStyling(element)}
                    >
                      {getTemplateContent("name-label", "Name")}
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="full-name"
                        id="full-name"
                        placeholder="Jane Smith"
                        autoComplete="name"
                        className="r2552esf25_252trewt3eSearchr w-[100%]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-semibold text-[#888888f1]"
                      style={applyUserStyling(element)}
                    >
                      {getTemplateContent("email-label", "Email")}
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        placeholder="jane@displan.com"
                        className="r2552esf25_252trewt3eSearchr w-[100%]"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm/6 font-semibold text-[#888888f1]"
                    style={applyUserStyling(element)}
                  >
                    {getTemplateContent("message-label", "Message")}
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      placeholder="Your message..."
                      className="r2552esf25_252trewt3eSearchr w-[100%]"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-10">
                  <button type="submit" className="rhdrthdrfhdrhdfhrhh" style={applyButtonStyling(element)}>
                    {getTemplateContent("submit-button", "Submit")}
                  </button>
                </div>
              </form>
            </div>
          </ElementWrapper>
        )

      case "template_11":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div>
              <div
                data-animation="default"
                className="navbar_component w-nav"
                data-easing2="ease"
                fs-scrolldisable-element="smart-nav"
                data-easing="ease"
                data-collapse="medium"
                data-w-id="c406ca79-d8dd-ac01-84ae-a3099c215e05"
                role="banner"
                data-duration="400"
              >
                <div className="navbar_container">
                  <a href="#" className="navbar_logo-link w-nav-brand">
                    <div className="navbar_logo" style={applyUserStyling(element)}>
                      {getTemplateContent("navbar_logo1", "Dirtny")}
                    </div>
                  </a>
                  <nav role="navigation" className="navbar_menu is-page-height-tablet w-nav-menu">
                    <div className="navbar_menu-links">
                      <a href="#mission" className="navbar_link w-nav-link" style={applyUserStyling(element)}>
                        {getTemplateContent("navbar_link1", "Our mission")}
                      </a>
                      <a href="#empower" className="navbar_link w-nav-link" style={applyUserStyling(element)}>
                        {getTemplateContent("navbar_link2", "Empower")}
                      </a>
                      <a href="#team" className="navbar_link w-nav-link" style={applyUserStyling(element)}>
                        {getTemplateContent("navbar_link3", "The team")}
                      </a>
                      <a href="#stats" className="navbar_link w-nav-link" style={applyUserStyling(element)}>
                        {getTemplateContent("navbar_link4", "Our impact")}
                      </a>
                    </div>
                    <a
                      data-wf--button--variant="full-blue"
                      href="#stats"
                      className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block"
                      style={applyButtonStyling(element)}
                    >
                      <div>{getTemplateContent("navbar_link5", "Donate")}</div>
                    </a>
                  </nav>
                  <div className="navbar_menu-button w-nav-button">
                    <div className="menu-icon1">
                      <div className="menu-icon1_line-top"></div>
                      <div className="menu-icon1_line-middle">
                        <div className="menu-icon1_line-middle-inner"></div>
                      </div>
                      <div className="menu-icon1_line-bottom"></div>
                    </div>
                  </div>
                </div>
              </div>
              <main className="main-wrapper">
                <br />
                <header className="section_hero">
                  <div className="padding-global">
                    <div className="container-large is--100">
                      <div className="hero_content">
                        <div className="padding-global">
                          <div className="margin-bottom margin-medium">
                            <div className="_2col_grid z-index-2">
                              <h1 className="hero-title" style={applyUserStyling(element)}>
                                {getTemplateContent("navbar_link6", "Dirtny")}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="hero_visuals">
                          <img
                            className="rounded w-full"
                            src={
                              element.src ||
                              "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Hero image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <section id="mission" animation-container="text-fade-in" className="section_mission">
                  <div className="padding-global">
                    <div className="container-small">
                      <div className="padding-section-large">
                        <div className="mission_component">
                          <h2 animation-element="text-fade-in" style={applyUserStyling(element)}>
                            <span className="text-style-tagline margin-right margin-xlarge">Our Mission</span>
                            {getTemplateContent(
                              "navbar_link7",
                              "Our mission is to empower creators and changemakers by providing a platform that connects their visions with generous supporters. We believe that every story deserves to be told and every dream deserves a chance to flourish.",
                            )}
                          </h2>
                          <div className="margin-top margin-medium">
                            <div className="button-group">
                              <a
                                data-wf--button--variant="full-blue"
                                href="#stats"
                                className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block"
                                style={applyButtonStyling(element)}
                              >
                                <div>{getTemplateContent("navbar_link8", "Our impact")}</div>
                              </a>
                              <a href="#" className="button is-link is-icon w-inline-block">
                                <div style={applyUserStyling(element)}>
                                  {getTemplateContent("navbar_link9", "Donate")}
                                </div>
                                <div className="icon-embed-xxsmall w-embed">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M6 3L11 8L6 13" stroke="CurrentColor" strokeWidth="1.5"></path>
                                  </svg>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </ElementWrapper>
        )

      case "template_14":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <main>
              <div className="container">
                <div className="card">
                  <div className="content">
                    <div className="asfasfawfgagwgwg">
                      <img
                        className="rounded w-full"
                        src={
                          element.src ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                      />
                    </div>
                    <h1 className="title" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg1", "Jessica Randall")}
                    </h1>
                    <h2 className="location" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg2", "London, United Kingdom")}
                    </h2>
                    <h2 className="description" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg3", '"Front-end developer and avid reader."')}
                    </h2>
                  </div>
                  <div className="social">
                    <a className="safafwfawfrewr3434" href="https://www.github.com" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg4", "GitHub")}
                    </a>
                    <a className="safafwfawfrewr3434" href="www.frontendmentor.io" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg5", "Frontend Mentor")}
                    </a>
                    <a className="safafwfawfrewr3434" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg6", "LinkedIn")}
                    </a>
                    <a className="safafwfawfrewr3434" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg7", "Twitter")}
                    </a>
                    <a className="safafwfawfrewr3434" style={applyUserStyling(element)}>
                      {getTemplateContent("asfasfawfgagwgwg8", "Instagram")}
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </ElementWrapper>
        )

      case "template_15":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <main
              className="min-h-screen flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at center, #1E40AF, #000000)",
              }}
            >
              <div className="bg-pattern"></div>
              <div className="content w-full">
                <WaitlistSignup />
              </div>
            </main>
          </ElementWrapper>
        )

      case "template_16":
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div className="h-[80vh] w-full overflow-y-auto overflow-x-hidden">
              <div className="mb-[50vh] mt-[50vh] py-12 text-center text-sm" style={applyUserStyling(element)}>
                Scroll down
              </div>
              <div className="flex h-[1200px] items-end justify-center pb-12">
                <InView
                  viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.09 },
                    },
                  }}
                >
                  <div className="columns-2 gap-4 px-8 sm:columns-3">
                    {[
                      "https://images.beta.cosmos.so/e5ebb6f8-8202-40ec-bc70-976f81153501?format=jpeg",
                      "https://images.beta.cosmos.so/1b6f1bee-1b4c-4035-9e93-c93ef4d445e1?format=jpeg",
                      "https://images.beta.cosmos.so/9968a6cf-d7f6-4ec9-a56d-ac4eef3f8689?format=jpeg",
                      "https://images.beta.cosmos.so/4b88a39c-c657-4911-b843-b473237e83b5?format=jpeg",
                      "https://images.beta.cosmos.so/86af92c0-064d-4801-b7ed-232535b03328?format=jpeg",
                      "https://images.beta.cosmos.so/399e2a4a-e118-4aaf-9c7e-155ed18f6556?format=jpeg",
                    ].map((imgSrc, index) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                          visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
                        }}
                        key={index}
                        className="mb-4"
                      >
                        <img
                          src={element.src || imgSrc}
                          alt={`Gallery image ${index}`}
                          className="size-full rounded-lg object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </InView>
              </div>
            </div>
          </ElementWrapper>
        )

      // Add fallback for unknown templates
      default:
        console.warn("Unknown template:", templateId)
        return (
          <ElementWrapper
            key={element.id}
            style={{ ...baseStyle, position: "relative", width: "100%", height: "auto" }}
          >
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                boxSizing: "border-box",
                backgroundColor: element.background_color || "#f8f9fa",
                border: "1px dashed #dee2e6",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>{templateId}</div>
                <div style={{ fontSize: "12px", color: "#666", ...applyUserStyling(element) }}>Template Content</div>
              </div>
            </div>
          </ElementWrapper>
        )
    }
  }

  // Enhanced element rendering
  const renderElement = (element: CanvasElement) => {
    console.log("🎨 Rendering element:", element.element_type, "Content:", element.content)

    // Skip invisible elements
    if (element.visible === false) {
      console.log("⏭️ Skipping invisible element:", element.id)
      return null
    }

    // For templates, use full-width layout instead of canvas positioning
    if (isTemplate(element.element_type)) {
      console.log("🎯 Rendering FULL TEMPLATE:", element.element_type)
      const templateStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height: "auto",
        zIndex: element.z_index || 1,
        opacity: element.opacity !== undefined ? element.opacity : 1,
      }

      const ElementWrapper = ({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) => {
        if (element.link_url) {
          return (
            <a
              href={element.link_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...style, textDecoration: "none", display: "block" }}
            >
              {children}
            </a>
          )
        }
        return <div style={style}>{children}</div>
      }

      return renderTemplateElement(element, templateStyle, ElementWrapper)
    }

    // For regular elements, use responsive positioning
    const canvasWidth = siteData.canvas_width || 1200
    const canvasHeight = siteData.canvas_height || 800

    // Convert canvas positions to responsive percentages
    const xPercent = (element.x_position / canvasWidth) * 100
    const yPercent = (element.y_position / canvasHeight) * 100
    const widthPercent = (element.width / canvasWidth) * 100
    const heightPercent = (element.height / canvasHeight) * 100

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${xPercent}%`,
      top: `${yPercent}%`,
      width: `${widthPercent}%`,
      height: `${heightPercent}%`,
      zIndex: element.z_index || 1,
      opacity: element.opacity !== undefined ? element.opacity : 1,
      boxSizing: "border-box",
      ...element.styles,
    }

    const ElementWrapper = ({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) => {
      if (element.link_url) {
        return (
          <a
            href={element.link_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...style, textDecoration: "none", display: "block" }}
          >
            {children}
          </a>
        )
      }
      return <div style={style}>{children}</div>
    }

    try {
      // 1. FIRST: Handle template-based elements (these render full templates)

      // 2. SECOND: Handle regular elements with user styling applied
      const userTextStyle: React.CSSProperties = {
        fontSize: element.font_size ? `${element.font_size}px` : "16px",
        fontWeight: element.font_weight || "normal",
        color: element.text_color || "#000000",
        textAlign: (element.text_align as any) || "left",
      }

      const userElementStyle: React.CSSProperties = {
        ...baseStyle,
        backgroundColor: element.background_color || "transparent",
        borderRadius: element.border_radius ? `${element.border_radius}px` : "0px",
        borderWidth: element.border_width ? `${element.border_width}px` : "0px",
        borderColor: element.border_color || "transparent",
        borderStyle: element.border_width ? "solid" : "none",
      }

      switch (element.element_type) {
        case "text":
        case "heading":
        case "text-address":
        case "text-phone":
        case "text-email":
        case "text-title":
        case "text-subtitle":
        case "text-description":
        case "text-paragraph":
        case "text-heading":
        case "text-link":
          console.log("📝 Rendering TEXT with styling:", userTextStyle)
          const textClass = getTextClass(element.element_type)
          return (
            <ElementWrapper key={element.id} style={userElementStyle}>
              <div
                className={textClass}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  boxSizing: "border-box",
                  wordWrap: "break-word",
                  overflow: "hidden",
                  ...userTextStyle,
                  // Special styling for text-link
                  ...(element.element_type === "text-link" && {
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: element.text_color || "#0066cc",
                  }),
                }}
              >
                {element.content || "Text Element"}
              </div>
            </ElementWrapper>
          )

        case "button":
        case "button-cta":
        case "button-primary":
        case "button-secondary":
        case "button-outline":
        case "button-text":
        case "button-rounded":
        case "button-icon":
        case "button-gradient":
        case "button-large":
        case "button-small":
        case "button-pill":
        case "button-link":
        case "button-premium":
          console.log("🔘 Rendering BUTTON with styling:", userElementStyle)
          const buttonClass = getButtonClass(element.element_type)
          return (
            <ElementWrapper
              key={element.id}
              style={{
                ...userElementStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                ...userTextStyle,
              }}
            >
              <button
                className={buttonClass}
                style={{
                  ...applyButtonStyling(element),
                  border: "none",
                  background: "transparent",
                  width: "100%",
                  height: "100%",
                }}
              >
                {element.content || "Button"}
              </button>
            </ElementWrapper>
          )

        case "image":
        case "image-logo":
        case "image-hero":
        case "image-gallery":
        case "image-profile":
          console.log("🖼️ Rendering IMAGE:", element.src || element.content)
          return (
            <ElementWrapper key={element.id} style={userElementStyle}>
              <img
                src={element.src || element.content || "/placeholder.svg?height=200&width=200"}
                alt={element.content || "Image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  border: "none",
                  borderRadius: element.border_radius ? `${element.border_radius}px` : "0px",
                }}
                onError={(e) => {
                  console.error("Image failed to load:", element.src || element.content)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=200"
                }}
              />
            </ElementWrapper>
          )

        // Handle shapes and rectangles
        case "rectangle":
        case "shape":
        case "box":
        case "card":
          console.log("🔲 Rendering SHAPE with styling")
          return (
            <ElementWrapper key={element.id} style={userElementStyle}>
              {element.content && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    boxSizing: "border-box",
                    ...userTextStyle,
                  }}
                >
                  {element.content}
                </div>
              )}
            </ElementWrapper>
          )

        // Fallback for unknown elements
        default:
          console.warn("❓ Unknown element type:", element.element_type)
          return (
            <ElementWrapper
              key={element.id}
              style={{
                ...userElementStyle,
                backgroundColor: "#fff3cd",
                border: "2px dashed #ffc107",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#856404",
                  textAlign: "center",
                  padding: "4px",
                  ...userTextStyle,
                }}
              >
                <div>Unknown: {element.element_type}</div>
                {element.content && <div style={{ marginTop: "4px", fontWeight: "bold" }}>{element.content}</div>}
              </div>
            </ElementWrapper>
          )
      }
    } catch (error) {
      console.error("Error rendering element:", element.id, error)
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor: "#ffebee",
            border: "2px solid #f44336",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "#f44336" }}>Error rendering element</div>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>Loading...</div>
          <div style={{ fontSize: "14px", color: "#666" }}>{siteData.name}</div>
        </div>
      </div>
    )
  }

  // Calculate canvas dimensions
  const canvasWidth = siteData.canvas_width || 1200
  const canvasHeight = siteData.canvas_height || 800
  const hasElements = siteData.elements && siteData.elements.length > 0

  console.log("🎯 Final render state:", {
    hasElements,
    elementsCount: siteData.elements?.length || 0,
    canvasWidth,
    canvasHeight,
  })

  return (
    <>
      {/* Custom CSS */}
      {siteData.custom_code && <style dangerouslySetInnerHTML={{ __html: siteData.custom_code }} />}

      {/* Template CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Template 11 CSS */
        .navbar_component { width: 100%; background: white; padding: 1rem 0; }
        .navbar_container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
        .navbar_logo { font-size: 1.5rem; font-weight: bold; }
        .navbar_menu { display: flex; align-items: center; gap: 2rem; }
        .navbar_menu-links { display: flex; gap: 1.5rem; }
        .navbar_link { text-decoration: none; color: #333; font-weight: 500; }
        .btn { background: #007bff; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; text-decoration: none; }
        .hero-title { font-size: 3rem; font-weight: bold; text-align: center; margin: 2rem 0; }
        .section_hero { padding: 4rem 0; }
        .section_mission { padding: 4rem 0; background: #f8f9fa; }
        
        /* Template 14 CSS */
        .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 2rem; }
        .card { background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; text-align: center; }
        .title { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; }
        .location { color: #666; margin: 0.5rem 0; }
        .description { font-style: italic; margin: 1rem 0; }
        .social { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.5rem; }
        .safafwfawfrewr3434 { background: #333; color: white; padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; }
        
        /* Background pattern for template 15 */
        .bg-pattern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 1;
        }
        .content { position: relative; z-index: 2; }

        /* Responsive design */
        @media (max-width: 768px) {
          .navbar_container { padding: 0 1rem; }
          .hero-title { font-size: 2rem; }
          .container { padding: 1rem; }
          .card { max-width: 100%; }
        }
      `,
        }}
      />

      {/* Debug info in development */}
      {/* {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 10000,
            maxWidth: "300px",
          }}
        >
          <div>Elements: {debugInfo?.elementsCount || 0}</div>
          <div>
            Canvas: {canvasWidth}x{canvasHeight}
          </div>
          <div>Has Elements: {debugInfo?.hasElements ? "Yes" : "No"}</div>
          {debugInfo?.sampleElement && <div>Sample: {debugInfo.sampleElement.element_type}</div>}
        </div>
      )} */}

      {/* Main content container - Responsive */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          margin: "0",
          padding: "0",
          overflow: "hidden", // Changed from "auto" to "hidden"
          overflowY: "auto", // Only allow vertical scrolling
        }}
      >
        {/* Canvas container - Responsive */}
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            margin: "0",
            backgroundColor: "#ffffff",
            padding: "0", // Remove any padding
          }}
        >
          {/* Render all elements */}
          {hasElements ? (
            siteData.elements
              .filter((element) => element && element.visible !== false)
              .sort((a, b) => (a.z_index || 1) - (b.z_index || 1))
              .map((element) => renderElement(element))
          ) : (
            // Fallback for empty sites
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#666",
                fontSize: "18px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>{siteData.name || "Welcome"}</div>
              <div style={{ fontSize: "14px" }}>This site is under construction</div>
              <div style={{ fontSize: "12px", marginTop: "20px", color: "#999" }}>
                No elements found to display (Elements count: {siteData.elements?.length || 0})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DisPlan branding - small and unobtrusive */}
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
    </>
  )
}
