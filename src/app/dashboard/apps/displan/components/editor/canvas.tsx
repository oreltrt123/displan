"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { X, ArrowUp, MessageCircle } from "lucide-react"
import { BottomToolbar } from "./bottom-toolbar"
import type { DisplanProjectDesignerCssComment } from "../../lib/types/displan-editor-types"
import type { DisplanCanvasElement } from "../../lib/types/displan-canvas-types"
import { useRouter, useSearchParams } from "next/navigation"
import ClickSelect from "./canvas/user-search"
import UserSearch from "./canvas/click-select"
import ImageCarousel from "./canvas/carousel"
import Cursor from "./canvas/cursor"
import View from "./canvas/view"
import Feedback from "./canvas/feedback"
import Plan from "./canvas/plan"
import Uploader from "./canvas/file-uploader"
import AnimatedValue from "./canvas/slider"
import InputShotcut from "./canvas/input-shotcut"

type Tool = "cursor" | "hand" | "comment"

interface CanvasProps {
  currentTool: Tool
  comments: DisplanProjectDesignerCssComment[]
  elements: DisplanCanvasElement[]
  selectedElement: DisplanCanvasElement | null
  onCreateComment: (x: number, y: number, message: string) => void
  onSelectElement: (element: DisplanCanvasElement | null) => void
  onMoveElement: (elementId: string, x: number, y: number) => void
  onUpdateElement: (elementId: string, properties: any) => void
  zoom: number
  onToolChange: (tool: Tool) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onZoomChange: (zoom: number) => void
  projectId: string
  isPreviewMode?: boolean
  customCode?: string
}

export function Canvas({
  currentTool,
  comments,
  elements,
  selectedElement,
  onCreateComment,
  onSelectElement,
  onMoveElement,
  onUpdateElement,
  zoom,
  onToolChange,
  isDarkMode,
  onToggleDarkMode,
  onZoomChange,
  projectId,
  isPreviewMode = false,
  customCode = "",
}: CanvasProps) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 })
  const [commentMessage, setCommentMessage] = useState("")
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newCommentId, setNewCommentId] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [localElements, setLocalElements] = useState<DisplanCanvasElement[]>([])
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setLocalElements(elements)
  }, [elements])

  useEffect(() => {
    if (newCommentId) {
      const timer = setTimeout(() => {
        setNewCommentId(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [newCommentId])

  // Inject custom code into the canvas
  useEffect(() => {
    if (customCode && canvasRef.current) {
      const customCodeContainer = canvasRef.current.querySelector("#custom-code-container")
      if (customCodeContainer) {
        customCodeContainer.innerHTML = customCode

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
  }, [customCode])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-canvas="true"]') && !target.closest('[data-element="true"]')) {
        onSelectElement(null)
      }
    },
    [onSelectElement],
  )

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (showCommentInput) return

      if (currentTool === "hand") {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - canvasPosition.x,
          y: e.clientY - canvasPosition.y,
        })
      } else if (currentTool === "comment") {
        const canvasElement = e.currentTarget.querySelector('[data-canvas="true"]') as HTMLElement
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          setCommentPosition({ x, y })
          setShowCommentInput(true)
        }
      }
    },
    [currentTool, canvasPosition, showCommentInput],
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (showCommentInput) return

      if (isDragging && currentTool === "hand") {
        setCanvasPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - canvasPosition.y,
        })
      }

      if (draggedElement && currentTool === "cursor") {
        const canvasElement = canvasRef.current?.querySelector('[data-canvas="true"]') as HTMLElement
        if (canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect()
          const newX = e.clientX - canvasRect.left - dragOffset.x
          const newY = e.clientY - canvasRect.top - dragOffset.y

          setLocalElements((prev) =>
            prev.map((el) => (el.id === draggedElement ? { ...el, x_position: newX, y_position: newY } : el)),
          )
        }
      }
    },
    [isDragging, currentTool, dragStart, showCommentInput, draggedElement, dragOffset],
  )

  const handleCanvasMouseUp = useCallback(() => {
    if (draggedElement && currentTool === "cursor") {
      const draggedEl = localElements.find((el) => el.id === draggedElement)
      if (draggedEl) {
        onMoveElement(draggedElement, draggedEl.x_position, draggedEl.y_position)
      }
    }

    setIsDragging(false)
    setDraggedElement(null)
  }, [draggedElement, currentTool, localElements, onMoveElement])

  const handleElementClick = (element: DisplanCanvasElement) => {
    if (isPreviewMode && element.element_type.startsWith("button-")) {
      if (element.link_url) {
        window.open(element.link_url, "_blank")
      } else if (element.link_page) {
        router.push(`/dashboard/apps/displan/editor/${projectId}?page=${element.link_page}`)
      }
      return
    }

    if (currentTool === "cursor" && !isPreviewMode) {
      onSelectElement(element)
    }
  }

  const handleElementMouseDown = (element: DisplanCanvasElement, e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentTool === "cursor" && !isPreviewMode) {
      setDraggedElement(element.id)

      const elementRect = canvasRef.current?.querySelector(`[data-element="${element.id}"]`)?.getBoundingClientRect()
      const canvasElement = canvasRef.current?.querySelector('[data-canvas="true"]') as HTMLElement

      if (elementRect && canvasElement) {
        const clickX = e.clientX - elementRect.left
        const clickY = e.clientY - elementRect.top
        setDragOffset({ x: clickX, y: clickY })
      }
    }
  }

  const handleSubmitComment = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (commentMessage.trim()) {
      await onCreateComment(commentPosition.x, commentPosition.y, commentMessage)
      setNewCommentId(`temp-${Date.now()}`)
      setCommentMessage("")
      setShowCommentInput(false)
    }
  }

  const handleCloseComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setShowCommentInput(false)
    setCommentMessage("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setCommentMessage(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()

    if (e.key === "Enter") {
      e.preventDefault()
      if (commentMessage.trim()) {
        onCreateComment(commentPosition.x, commentPosition.y, commentMessage)
        setNewCommentId(`temp-${Date.now()}`)
        setCommentMessage("")
        setShowCommentInput(false)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setShowCommentInput(false)
      setCommentMessage("")
    }
  }

  const handleCommentInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const getCursor = () => {
    if (showCommentInput) return "default"
    if (currentTool === "hand") return isDragging ? "grabbing" : "grab"
    if (currentTool === "comment") return "crosshair"
    if (currentTool === "cursor" && draggedElement) return "grabbing"
    return "default"
  }

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

      case "empty-0":
        return (
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  From the blog
                </h2>
                <p className="mt-2 text-lg/8 text-gray-600">Learn how to grow your business with our expert advice.</p>
              </div>
              <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <article className="flex max-w-xl flex-col items-start justify-between">
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime="2020-03-16" className="text-gray-500">
                      Mar 16, 2020
                    </time>
                    <a
                      href="#"
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Marketing
                    </a>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href="#">
                        <span className="absolute inset-0"></span>
                        Boost your conversion rate
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
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
                    <div className="text-sm/6">
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
                className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              ></div>
            </div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                Contact sales
              </h2>
              <p className="mt-2 text-lg/8 text-gray-600">
                Aute magna irure deserunt veniam aliqua magna enim voluptate.
              </p>
            </div>
            <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
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
                  <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
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
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                style={{
                  clipPath:
                    "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                }}
              ></div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm/6 text-gray-900">
                <strong className="font-semibold">DisPlan 2025</strong>
                <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                Join us in Denver from June 7 – 9 to see what's coming next.
              </p>
              <a
                href="#"
                className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Register now <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <div className="flex flex-1 justify-end">
              <button type="button" className="-m-3 p-3 focus-visible:-outline-offset-4">
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
              <h2 className="text-center text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
              <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                Everything you need to deploy your app
              </p>
              <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                <div className="relative lg:row-span-2">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Mobile friendly
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                      </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-4xl"></div>
                </div>
              </div>
            </div>
          </div>
        )

      case "empty-4":
        return (
          <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
              <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      alt=""
                    />
                  </a>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Product
                  </a>
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Features
                  </a>
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Marketplace
                  </a>
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Company
                  </a>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </nav>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
              <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                    Data to enrich your online business
                  </h1>
                  <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt
                    amet fugiat veniam occaecat.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="#"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">
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
          <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
              <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                Choose your DisPlan plan for you
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
              Choose an affordable plan that's packed with the best features for engaging your audience, creating
              customer loyalty, and driving sales.
            </p>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
              <div className="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
                <h3 className="text-base/7 font-semibold text-indigo-600">Hobby</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">$29</span>
                  <span className="text-base text-gray-500">/month</span>
                </p>
                <p className="mt-6 text-base/7 text-gray-600">
                  The perfect plan if you're just getting started with our product.
                </p>
                <a
                  href="#"
                  className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
                >
                  Get started today
                </a>
              </div>
              <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
                <h3 className="text-base/7 font-semibold text-indigo-400">Enterprise</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight text-white">$99</span>
                  <span className="text-base text-gray-400">/month</span>
                </p>
                <p className="mt-6 text-base/7 text-gray-300">Dedicated support and infrastructure for your company.</p>
                <a
                  href="#"
                  className="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10"
                >
                  Get started today
                </a>
              </div>
            </div>
          </div>
        )

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
      default:
        return (
          <div className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {templateId.includes("template")
                ? `Menu Template ${templateId.split("-")[1]}`
                : `Empty Menu ${templateId}`}
            </span>
          </div>
        )
    }
  }

  const renderElement = (element: DisplanCanvasElement) => {
    const isSelected = selectedElement?.id === element.id && !isPreviewMode
    const isDraggedElement = draggedElement === element.id

    // For menu templates, render them as full-width sections
    if (element.element_type.startsWith("menu-")) {
      const templateId = element.element_type.replace("menu-", "")

      return (
        <div
          key={element.id}
          data-element={element.id}
          className={`w-full ${isSelected ? "ring-2 ring-blue-500" : ""} ${isPreviewMode ? "" : "cursor-pointer hover:ring-1 hover:ring-gray-300"}`}
          onClick={(e) => {
            e.stopPropagation()
            if (!isPreviewMode) {
              handleElementClick(element)
            }
          }}
        >
          {renderMenuTemplate(templateId)}
        </div>
      )
    }

    // For other elements (text, buttons), keep the absolute positioning
    const baseClasses = isPreviewMode
      ? "absolute"
      : `absolute cursor-pointer transition-shadow ${
          isSelected ? "ring-2 ring-blue-500" : ""
        } ${isDraggedElement ? "z-50" : ""}`

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isPreviewMode) {
        const newUrl = `/dashboard/apps/displan/editor/${projectId}?page=${element.link_page}`
        router.push(newUrl)
      } else {
        handleElementClick(element)
      }
    }

    if (element.element_type.startsWith("text-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={baseClasses}
          style={{
            left: element.x_position,
            top: element.y_position,
            width: element.width,
            height: element.height,
          }}
          onClick={handleClick}
          onMouseDown={(e: React.MouseEvent) => handleElementMouseDown(element, e)}
        >
          <div className={`displan-${element.element_type} select-none`}>{element.content}</div>
        </div>
      )
    }

    if (element.element_type.startsWith("button-")) {
      return (
        <div
          key={element.id}
          data-element={element.id}
          className={baseClasses}
          style={{
            left: element.x_position,
            top: element.y_position,
            width: element.width,
            height: element.height,
          }}
          onClick={handleClick}
          onMouseDown={(e: React.MouseEvent) => handleElementMouseDown(element, e)}
        >
          <button
            className={`displan-${element.element_type} select-none ${
              isPreviewMode ? "cursor-pointer" : "pointer-events-none"
            }`}
          >
            {element.content}
          </button>
        </div>
      )
    }

    return null
  }

  // Separate menu templates from other elements
  const menuElements = localElements.filter((el) => el.element_type.startsWith("menu-"))
  const otherElements = localElements.filter((el) => !el.element_type.startsWith("menu-"))

  return (
    <div className="flex-1 bg-gray-100 dark:bg-[#1D1D1D] p-8 overflow-hidden relative">
      <div
        ref={canvasRef}
        className="w-full h-full flex items-center justify-center"
        style={{ cursor: getCursor() }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        <div
          data-canvas="true"
          className="bg-white dark:bg-gray-900 shadow-lg relative overflow-y-auto"
          style={{
            width: "1200px",
            height: "800px",
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
        >
          {/* Custom Code Container */}
          <div id="custom-code-container" className="w-full"></div>

          {/* Render menu templates as stacked full-width sections */}
          <div className="w-full">{menuElements.map(renderElement)}</div>

          {/* Render other elements with absolute positioning */}
          {otherElements.map(renderElement)}

          {!isPreviewMode &&
            comments.map((comment, index) => {
              const isNew = index === 0 && newCommentId
              return (
                <div
                  key={comment.id}
                  className={`absolute transition-all duration-500 ${
                    isNew ? "scale-125 bg-blue-500 rounded-full p-1" : "scale-100"
                  }`}
                  style={{ left: comment.x_position, top: comment.y_position }}
                >
                  <MessageCircle
                    className={`w-4 h-4 fill-current ${isNew ? "text-white" : "text-gray-900 dark:text-white"}`}
                  />
                </div>
              )
            })}

          {showCommentInput && (
            <div
              className="absolute z-50"
              style={{
                left: commentPosition.x,
                top: commentPosition.y,
                transform: "translate(-50%, -100%)",
              }}
              onClick={handleCommentInputClick}
            >
              <div className="flex items-center mb-2">
                <MessageCircle className="w-4 h-4 text-gray-900 dark:text-white fill-current mr-2" />
                <div className="bg-gray-900 dark:bg-white rounded-full px-4 py-2 flex items-center shadow-lg">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="bg-transparent text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-48"
                    autoFocus
                  />
                  <button
                    onClick={handleCloseComment}
                    className="ml-2 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    className="ml-2 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isPreviewMode && (
        <BottomToolbar
          currentTool={currentTool}
          onToolChange={onToolChange}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          zoom={zoom}
          onZoomChange={onZoomChange}
          projectId={projectId}
        />
      )}
    </div>
  )
}
