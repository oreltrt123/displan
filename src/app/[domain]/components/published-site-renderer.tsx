"use client"

import { useEffect, useState, Component, ErrorInfo } from "react"
import type { PublishedSiteData } from "../lib/get-published-site"
import ClickSelect from "../../dashboard/apps/displan/components/editor/canvas/user-search"
import UserSearch from "../../dashboard/apps/displan/components/editor/canvas/click-select"
import ImageCarousel from "../../dashboard/apps/displan/components/editor/canvas/carousel"
import Cursor from "../../dashboard/apps/displan/components/editor/canvas/cursor"
import View from "../../dashboard/apps/displan/components/editor/canvas/view"
import Feedback from "../../dashboard/apps/displan/components/editor/canvas/feedback"
import Plan from "../../dashboard/apps/displan/components/editor/canvas/plan"
import Uploader from "../../dashboard/apps/displan/components/editor/canvas/file-uploader"
import AnimatedValue from "../../dashboard/apps/displan/components/editor/canvas/slider"
import InputShotcut from "../../dashboard/apps/displan/components/editor/canvas/input-shotcut"
import Loader from "../../dashboard/apps/displan/components/editor/canvas/loader"
import Template from "../../dashboard/apps/displan/components/editor/canvas/template"


class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Rendering error:", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p>Error rendering component. Please check your site configuration.</p>
        </div>
      )
    }
    return this.props.children
  }
}

interface PublishedSiteRendererProps {
  siteData: PublishedSiteData
}

export function PublishedSiteRenderer({ siteData }: PublishedSiteRendererProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  useEffect(() => {
    document.title = siteData.name || `${siteData.subdomain} - Built with DisPlan`
    console.log("siteData:", siteData)
    console.log("siteData.elements:", siteData.elements)
    setIsLoading(false)
  }, [siteData])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
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
    if (siteData.custom_code) {
      const customCodeContainer = document.getElementById("custom-code-container")
      if (customCodeContainer) {
        customCodeContainer.innerHTML = siteData.custom_code
        const scripts = customCodeContainer.querySelectorAll("script")
        scripts.forEach((script) => {
          try {
            const newScript = document.createElement("script")
            newScript.textContent = script.textContent
            document.head.appendChild(newScript)
            document.head.removeChild(newScript)
          } catch (error) {
            console.error("Error executing custom script:", error)
          }
        })
      }
    }
  }, [siteData.custom_code])

  useEffect(() => {
    const animationStyles = `
      <style id="canvas-animations">
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideInDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes rotateIn { from { transform: rotate(-200deg); opacity: 0; } to { transform: rotate(0); opacity: 1; } }
        @keyframes flipInX { from { transform: perspective(400px) rotateX(90deg); opacity: 0; } to { transform: perspective(400px) rotateX(0deg); opacity: 1; } }
        @keyframes flipInY { from { transform: perspective(400px) rotateY(90deg); opacity: 0; } to { transform: perspective(400px) rotateY(0deg); opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .fadeIn { animation: fadeIn 1s ease-in-out; }
        .slideInLeft { animation: slideInLeft 1s ease-in-out; }
        .slideInRight { animation: slideInRight 1s ease-in-out; }
        .slideInUp { animation: slideInUp 1s ease-in-out; }
        .slideInDown { animation: slideInDown 1s ease-in-out; }
        .bounceIn { animation: bounceIn 1s ease-in-out; }
        .zoomIn { animation: zoomIn 1s ease-in-out; }
        .rotateIn { animation: rotateIn 1s ease-in-out; }
        .flipInX { animation: flipInX 1s ease-in-out; }
        .flipInY { animation: flipInY 1s ease-in-out; }
        .pulse { animation: pulse 2s infinite; }

        .input_field {
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          border: none;
          padding: 0.5rem 0.875rem;
          color: #111827;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          ring: 1px solid #d1d5db inset;
          placeholder-color: #9ca3af;
          focus:ring: 2px solid #4f46e5 inset;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        [class^="displan-text-"] {
          font-size: 16px;
          color: #333;
        }
        [class^="displan-button-"] {
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border-radius: 4px;
          border: none;
        }
        [class^="displan-image-"] {
          object-fit: cover;
        }
        [class^="displan-container-"] {
          background-color: #f3f4f6;
        }
      </style>
    `
    if (!document.querySelector("#canvas-animations")) {
      const styleElement = document.createElement("div")
      styleElement.innerHTML = animationStyles
      document.head.appendChild(styleElement)
    }
  }, [])

  const generateElementStyles = (element: any): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: "absolute",
      left: element.x_position,
      top: element.y_position,
    }

    if (element.width_type === "fixed") {
      styles.width = element.width
    } else if (element.width_type === "fill") {
      styles.width = "100%"
    } else if (element.width_type === "fit-content") {
      styles.width = "fit-content"
    } else if (element.width_type === "relative") {
      styles.width = `${element.width}%`
    }

    if (element.height_type === "fixed") {
      styles.height = element.height
    } else if (element.height_type === "fill") {
      styles.height = "100%"
    } else if (element.height_type === "fit-content") {
      styles.height = "fit-content"
    } else if (element.height_type === "relative") {
      styles.height = `${element.height}%`
    }

    if (element.opacity !== undefined) {
      styles.opacity = element.opacity
    }
    if (element.visible === false) {
      styles.display = "none"
    }
    if (element.cursor) {
      styles.cursor = element.cursor
    }
    if (element.background_color) {
      styles.backgroundColor = element.background_color
    }
    if (element.text_color) {
      styles.color = element.text_color
    }
    if (element.border_width && element.border_width > 0) {
      styles.border = `${element.border_width}px solid ${element.border_color || "#000000"}`
    }
    if (element.border_radius && element.border_radius > 0) {
      styles.borderRadius = element.border_radius
    }
    if (element.font_size) {
      styles.fontSize = element.font_size
    }
    if (element.font_weight) {
      styles.fontWeight = element.font_weight
    }
    if (element.text_align) {
      styles.textAlign = element.text_align
    }
    styles.padding = `${element.padding_top || 0}px ${element.padding_right || 0}px ${element.padding_bottom || 0}px ${element.padding_left || 0}px`
    styles.margin = `${element.margin_top || 0}px ${element.margin_right || 0}px ${element.margin_bottom || 0}px ${element.margin_left || 0}px`
    if (element.z_index !== undefined) {
      styles.zIndex = element.z_index
    }
    if (element.device_type && element.device_type !== previewDevice) {
      styles.display = "none"
    }

    return styles
  }

  const getAnimationClass = (element: any): string => {
    if (!element.animation || element.animation === "none") return ""
    return element.animation
  }

  const renderMenuTemplate = (templateId: string) => {
    try {
      switch (templateId) {
        case "template-1":
          return (
            <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Meet our leadership
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering
                    the best results for our clients.
                  </p>
                </div>
                <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                  <li>
                    <div className="flex items-center gap-x-6">
                      <img
                        className="size-9 rounded-full"
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt=""
                      />
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Test Name</h3>
                        <p className="text-sm font-semibold leading-6 text-indigo-600">Co-Founder / CEO</p>
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
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,#e0e7ff,white)] opacity-20"></div>
              <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
              <div className="mx-auto max-w-2xl lg:max-w-4xl">
                <img className="mx-auto h-12" src="/logo_light_mode.png" alt="" />
                <figure className="mt-10">
                  <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
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
        case "empty-0":
          return (
            <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    From the blog
                  </h2>
                  <p className="mt-2 text-lg leading-8 text-gray-600">Learn how to grow your business with our expert advice.</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  <article className="flex max-w-xl flex-col items-start justify-between">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime="2020-03-16" className="text-gray-500">Mar 16, 2020</time>
                      <a
                        href="#"
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                      >
                        Marketing
                      </a>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href="#">
                          <span className="absolute inset-0"></span>
                          Boost your conversion rate
                        </a>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid
                        explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto
                        corrupti dicta.
                      </p>
                    </div>
                    <div className="relative mt-8 flex items-center gap-x-4">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt=""
                        className="size-10 rounded-full bg-gray-50"
                      />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <a href="#">
                            <span className="absolute inset-0"></span>
                            Test Name
                          </a>
                        </p>
                        <p className="text-gray-600">Co-Founder / CTO</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          )
        case "empty-1":
          return (
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
                ></div>
              </div>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Contact sales
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Aute magna irure deserunt veniam aliqua magna enim voluptate.
                </p>
              </div>
              <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                      First name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="input_field"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                      Last name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="input_field"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Let's talk
                  </button>
                </div>
              </form>
            </div>
          )
        case "empty-2":
          return (
            <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
              <div
                className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[577/310] w-[36.125rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                  }}
                ></div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-gray-900">
                  <strong className="font-semibold">DisPlan 2025</strong>
                  <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  Join us in Denver from June 7 – 9 to see what's coming next.
                </p>
                <a
                  href="#"
                  className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Register now <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="flex flex-1 justify-end">
                <button type="button" className="-m-3 p-3 focus-visible:outline-none">
                  <span className="sr-only">Dismiss</span>
                  <svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            </div>
          )
        case "empty-3":
          return (
            <div className="bg-gray-50 py-24 sm:py-32">
              <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-center text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
                <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                  Everything you need to deploy your app
                </p>
                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                  <div className="relative lg:row-span-2">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div className="relative flex h-full flex-col overflow-hidden">
                      <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                        <p className="mt-2 text-lg font-semibold tracking-tight text-gray-950 lg:text-center">Mobile friendly</p>
                        <p className="mt-2 max-w-prose text-sm leading-6 text-gray-600 lg:text-center">
                          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                        </p>
                      </div>
                    </div>
                    <div className="pointer-events-none">
                      <div className="absolute inset-px rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 lg:ring-0 lg:rounded-l-[2rem]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        case "empty-4":
          return (
            <div className="bg-white">
              <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:p-8" aria-label="Global">
                  <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                      <span className="sr-only">Your Company</span>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg"
                        alt="Your Company"
                      />
                    </a>
                  </div>
                  <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-600">Product</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-600">Features</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-600">Marketplace</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-600">Company</a>
                  </div>
                  <div className="flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-600">
                      Log in <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </nav>
              </header>
              <div className="relative isolate px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                  <div className="text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                      Data to enrich your online business
                    </h1>
                    <p className="mt-8 text-lg font-medium text-gray-600 sm:text-xl">
                      Anim aute irure id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                      Elit sunt amet fugiat veniam occaecat.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <a
                        href="#"
                        className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get started
                      </a>
                      <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        case "empty-5":
          return (
            <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Choose your DisPlan plan
                </p>
              </div>
              <p className="mt-6 mx-auto max-w-2xl text-center text-lg leading-8 text-gray-600">
                Choose an affordable plan packed with the best features for engaging your audience, creating customer
                loyalty, and driving sales.
              </p>
              <div className="mt-16 mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:mx-8 sm:p-10 lg:rounded-r-none">
                  <h3 className="text-base font-semibold leading-7 text-indigo-600">Hobby</h3>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-semibold tracking-tight text-gray-900">$10</span>
                    <span className="text-base text-gray-500">/month</span>
                  </p>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    The perfect plan if you're just getting started with our product.
                  </p>
                  <a
                    href="#"
                    className="mt-10 block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started today
                  </a>
                </div>
                <div className="rounded-3xl bg-gray-900 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:p-10 lg:rounded-l-none">
                  <h3 className="text-base font-semibold leading-7 text-indigo-400">Enterprise</h3>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-semibold tracking-tight text-white">$50</span>
                    <span className="text-base text-gray-400">/month</span>
                  </p>
                  <p className="mt-6 text-base leading-7 text-gray-300">
                    Dedicated support and infrastructure for your company.
                  </p>
                  <a
                    href="#"
                    className="mt-10 block rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Get started today
                  </a>
                </div>
              </div>
            </div>
          )
        case "empty-6":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <UserSearch />
              </div>
            </ErrorBoundary>
          )
        case "empty-7":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <ClickSelect />
              </div>
            </ErrorBoundary>
          )
        case "empty-8":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <ImageCarousel />
              </div>
            </ErrorBoundary>
          )
        case "empty-9":
          return (
            <ErrorBoundary>
              <div className="">
                <View />
              </div>
            </ErrorBoundary>
          )
        case "empty-10":
          return (
            <ErrorBoundary>
              <div className="">
                <AnimatedValue />
              </div>
            </ErrorBoundary>
          )
        case "empty-11":
          return (
            <ErrorBoundary>
              <div className="">
                <Cursor />
              </div>
            </ErrorBoundary>
          )
        case "empty-12":
          return (
            <ErrorBoundary>
              <div className="">
                <Feedback />
              </div>
            </ErrorBoundary>
          )
        case "empty-13":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <Uploader />
              </div>
            </ErrorBoundary>
          )
        case "empty-14":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <InputShotcut />
              </div>
            </ErrorBoundary>
          )
        case "empty-15":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <Plan />
              </div>
            </ErrorBoundary>
          )
        case "empty-16":
          return (
            <ErrorBoundary>
              <div className="p-8">
                <Loader />
              </div>
            </ErrorBoundary>
          )
        case "template_11":
          return (
            <ErrorBoundary>
              <div className="">
                <Template />
              </div>
            </ErrorBoundary>
          )
        default:
          console.warn(`Unrecognized template: ${templateId}`)
          return (
            <div className="w-full h-64 bg-white border border-gray-200 py-4">
              <span className="text-sm text-gray-400">Template {templateId} not found</span>
            </div>
          )
      }
    } catch (error) {
      console.error(`Error rendering template ${templateId}:`, error)
      return (
        <div className="w-full h-64 bg-white border border-red-500 py-4">
          <span className="text-sm text-red-500">Error rendering template {templateId}</span>
        </div>
      )
    }
  }

  const renderElement = (element: any) => {
    if (!element || !element.element_type || !element.id) {
      console.warn("Invalid element:", element)
      return null
    }

    const animationClass = getAnimationClass(element)
    const elementStyles = generateElementStyles(element)

    if (
      typeof element.x_position !== "number" ||
      typeof element.y_position !== "number" ||
      (typeof element.width !== "undefined" && element.width <= 0) ||
      (typeof element.height !== "undefined" && element.height <= 0)
    ) {
      console.warn("Invalid positioning for element:", element)
      return (
        <div key={element.id} className="border border-red-600 p-4">
          <p className="text-red-600">Invalid element positioning: {element.element_type}</p>
        </div>
      )
    }

    if (element.element_type.startsWith("menu-")) {
      const templateId = element.element_type.replace("menu-", "")
      if (element.device_type && element.device_type !== previewDevice) {
        return null
      }
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`w-full ${animationClass}`}
          style={{
            opacity: element.opacity,
            display: element.visible === false ? "none" : "block",
            zIndex: element.z_index,
          }}
        >
          <ErrorBoundary>
            {renderMenuTemplate(templateId)}
          </ErrorBoundary>
        </div>
      )
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      e.preventDefault()
      if (element.link_url) {
        window.open(element.link_url, "_blank")
      }
    }

    if (element.element_type.startsWith("text-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`absolute ${animationClass}`}
          style={elementStyles}
          onClick={handleClick}
        >
          <div className={`displan-${element.element_type} select-none`}>
            {element.content || "Text Element"}
          </div>
        </div>
      )
    }

    if (element.element_type.startsWith("button-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`absolute ${animationClass}`}
          style={elementStyles}
        >
          <button
            className={`displan-${element.element_type} select-none text-sm cursor-pointer`}
            onClick={handleClick}
          >
            {element.content || "Button"}
          </button>
        </div>
      )
    }

    if (element.element_type.startsWith("image-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`absolute ${animationClass}`}
          style={elementStyles}
          onClick={handleClick}
        >
          <img
            src={element.content || "/placeholder.svg"}
            alt={element.id}
            className="w-full h-full object-cover select-none"
          />
        </div>
      )
    }

    if (element.element_type.startsWith("container-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`absolute ${animationClass}`}
          style={elementStyles}
          onClick={handleClick}
        >
          <div className={`displan-${element.element_type} w-full h-full p-4`}>
            {element.content && <div className="p-4">{element.content}</div>}
          </div>
        </div>
      )
    }

    console.warn(`Unrecognized element type: ${element.element_type}`, element)
    return (
      <div
        key={element.id}
        className="absolute border border-red-600 p-4"
        style={elementStyles}
      >
        <div className="text-sm text-red-600">Unrecognized element: {element.element_type}</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-sm">Loading your site...</p>
      </div>
    )
  }

  if (!siteData.elements || siteData.elements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-sm">No elements or templates found for this site.</p>
      </div>
    )
  }

  const menuElements = siteData.elements?.filter((el: any) => el.element_type?.startsWith("menu-")) || []
  const otherElements = siteData.elements?.filter((el: any) => !el.element_type?.startsWith("menu-")) || []
  const visibleElements = otherElements.filter((el: any) => !el.device_type || el.device_type === previewDevice)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <div id="custom-code-container" className="w-full"></div>
        <div className="relative" style={{ minWidth: 1200, minHeight: 800 }}>
          <div className="w-full">
            {menuElements.map(renderElement)}
          </div>
          <div className="relative" style={{ width: "100%", minHeight: "inherit" }}>
            {visibleElements.map(renderElement)}
          </div>
        </div>
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://displan.design"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-700"
          >
            Built with DisPlan
          </a>
        </div>
      </div>
    </ErrorBoundary>
  )
}