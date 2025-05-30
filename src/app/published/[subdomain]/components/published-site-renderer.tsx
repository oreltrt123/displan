"use client"

import { useEffect, useState } from "react"
import type { PublishedSiteData } from "../lib/get-published-site"

interface PublishedSiteRendererProps {
  siteData: PublishedSiteData
}

export function PublishedSiteRenderer({ siteData }: PublishedSiteRendererProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Detect user's preferred color scheme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    // Set the favicon based on dark/light mode
    const favicon = isDarkMode ? siteData.favicon_dark_url : siteData.favicon_light_url
    if (favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (link) {
        link.href = favicon
      } else {
        const newLink = document.createElement("link")
        newLink.rel = "icon"
        newLink.href = favicon
        document.head.appendChild(newLink)
      }
    }
  }, [isDarkMode, siteData.favicon_dark_url, siteData.favicon_light_url])

  useEffect(() => {
    // Inject custom code if present
    if (siteData.custom_code) {
      const customCodeContainer = document.getElementById("custom-code-container")
      if (customCodeContainer) {
        customCodeContainer.innerHTML = siteData.custom_code

        // Execute any script tags in the custom code
        const scripts = customCodeContainer.querySelectorAll("script")
        scripts.forEach((script) => {
          const newScript = document.createElement("script")
          newScript.textContent = script.textContent
          document.head.appendChild(newScript)
          document.head.removeChild(newScript)
        })
      }
    }
  }, [siteData.custom_code])

  const renderElement = (element: any) => {
    if (element.element_type.startsWith("menu-")) {
      return renderMenuTemplate(element.element_type.replace("menu-", ""))
    }

    const baseClasses = "absolute"

    if (element.element_type.startsWith("text-")) {
      return (
        <div
          key={element.id}
          className={baseClasses}
          style={{
            left: element.x_position,
            top: element.y_position,
            width: element.width,
            height: element.height,
          }}
        >
          <div className={`displan-${element.element_type} select-none`}>{element.content}</div>
        </div>
      )
    }

    if (element.element_type.startsWith("button-")) {
      return (
        <div
          key={element.id}
          className={baseClasses}
          style={{
            left: element.x_position,
            top: element.y_position,
            width: element.width,
            height: element.height,
          }}
        >
          <button
            className={`displan-${element.element_type} select-none cursor-pointer`}
            onClick={() => {
              if (element.link_url) {
                window.open(element.link_url, "_blank")
              }
            }}
          >
            {element.content}
          </button>
        </div>
      )
    }

    return null
  }

  const renderMenuTemplate = (templateId: string) => {
    // Include all your existing menu templates here
    switch (templateId) {
      case "template-1":
        return (
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                  Meet our leadership
                </h2>
                <p className="mt-6 text-lg/8 text-gray-600">
                  We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering
                  the best results for our clients.
                </p>
              </div>
            </div>
          </div>
        )
      // Add all other templates...
      default:
        return (
          <div className="w-full h-full bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-sm text-gray-500">Template {templateId}</span>
          </div>
        )
    }
  }

  // Separate menu templates from other elements
  const menuElements = siteData.elements.filter((el: any) => el.element_type.startsWith("menu-"))
  const otherElements = siteData.elements.filter((el: any) => !el.element_type.startsWith("menu-"))

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Code Container */}
      <div id="custom-code-container"></div>

      {/* Site Content */}
      <div className="relative">
        {/* Render menu templates as stacked full-width sections */}
        <div className="w-full">{menuElements.map(renderElement)}</div>

        {/* Render other elements with absolute positioning */}
        <div className="relative" style={{ minHeight: "800px" }}>
          {otherElements.map(renderElement)}
        </div>
      </div>

      {/* DisPlan Branding */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://displan.design"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-3 py-1 rounded-full text-xs hover:bg-gray-800 transition-colors"
        >
          Built with DisPlan
        </a>
      </div>
    </div>
  )
}
