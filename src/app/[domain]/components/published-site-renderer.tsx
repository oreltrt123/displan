"use client"

import { useEffect, useState } from "react"
import type { PublishedSiteData } from "../lib/get-published-site"

// Import all the canvas components
import UserSearch from "../../dashboard/apps/displan/components/editor/canvas/user-search"
import ClickSelect from "../../dashboard/apps/displan/components/editor/canvas/click-select"
import ImageCarousel from "../../dashboard/apps/displan/components/editor/canvas/carousel"
import Cursor from "../../dashboard/apps/displan/components/editor/canvas/cursor"
import View from "../../dashboard/apps/displan/components/editor/canvas/view"
import Feedback from "../../dashboard/apps/displan/components/editor/canvas/feedback"
import Plan from "../../dashboard/apps/displan/components/editor/canvas/plan"
import Uploader from "../../dashboard/apps/displan/components/editor/canvas/file-uploader"
import AnimatedValue from "../../dashboard/apps/displan/components/editor/canvas/slider"
import InputShotcut from "../../dashboard/apps/displan/components/editor/canvas/input-shotcut"
import Template from "../../dashboard/apps/displan/components/editor/canvas/template"

interface PublishedSiteRendererProps {
  siteData: PublishedSiteData
}

export function PublishedSiteRenderer({ siteData }: PublishedSiteRendererProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Set the page title to the project name
    document.title = siteData.name || `${siteData.subdomain} - Built with DisPlan`
  }, [siteData.name, siteData.subdomain])

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

  const renderMenuTemplate = (templateId: string) => {
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
              <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                <li>
                  <div className="flex items-center gap-x-6">
                    <img
                      className="size-[35px] rounded-full"
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt=""
                    />
                    <div>
                      <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">Test Name</h3>
                      <p className="text-sm/6 font-semibold text-indigo-600">Co-Founder / CEO</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )

      case "template-2":
        return (
          <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20"></div>
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <img className="mx-auto h-12" src="/logo_light_mode.png" alt="" />
              <figure className="mt-10">
                <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                  <p>
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente
                    alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                  </p>
                </blockquote>
                <figcaption className="mt-10">
                  <img
                    className="mx-auto size-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt=""
                  />
                  <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                    <div className="font-semibold text-gray-900">Test Name</div>
                    <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                      <circle cx="1" cy="1" r="1" />
                    </svg>
                    <div className="text-gray-600">CEO of Workcation</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </section>
        )

      // Add all other templates...
      case "empty-6":
        return (
          <div>
            <UserSearch />
          </div>
        )

      case "empty-7":
        return (
          <div>
            <ClickSelect />
          </div>
        )
      case "empty-8":
        return (
          <div>
            <ImageCarousel />
          </div>
        )
      case "empty-9":
        return (
          <div>
            <View />
          </div>
        )
      case "empty-10":
        return (
          <div>
            <AnimatedValue />
          </div>
        )
      case "empty-11":
        return (
          <div>
            <Cursor />
          </div>
        )
      case "empty-12":
        return (
          <div>
            <Feedback />
          </div>
        )
      case "empty-13":
        return (
          <div>
            <Uploader />
          </div>
        )
      case "empty-14":
        return (
          <div>
            <InputShotcut />
          </div>
        )
      case "empty-15":
        return (
          <div>
            <Plan />
          </div>
        )
      case "template_11":
        return (
          <div className="">
              <Template />
          </div>
        )

      default:
        return (
          <div className="w-full h-full bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-sm text-gray-500">Template {templateId}</span>
          </div>
        )
    }
  }

  const renderElement = (element: any) => {
    // For menu templates, render them as full-width sections
    if (element.element_type.startsWith("menu-")) {
      const templateId = element.element_type.replace("menu-", "")
      return (
        <div key={element.id} className="w-full">
          {renderMenuTemplate(templateId)}
        </div>
      )
    }

    // For other elements (text, buttons), use absolute positioning
    if (element.element_type.startsWith("text-")) {
      return (
        <div
          key={element.id}
          className="absolute"
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
          className="absolute"
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

  // Separate menu templates from other elements
  const menuElements = siteData.elements.filter((el: any) => el.element_type.startsWith("menu-"))
  const otherElements = siteData.elements.filter((el: any) => !el.element_type.startsWith("menu-"))

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Code Container */}
      <div id="custom-code-container"></div>

      {/* Site Content - Render exactly like the canvas */}
      <div className="relative">
        {/* Render menu templates as stacked full-width sections */}
        <div className="w-full">{menuElements.map(renderElement)}</div>

        {/* Render other elements with absolute positioning in a container */}
        <div className="relative bg-white" style={{ minHeight: "800px", width: "100%" }}>
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
