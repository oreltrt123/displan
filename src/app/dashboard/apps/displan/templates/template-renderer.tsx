"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { EditableTemplateElement, TextEditingState } from "../types/canvas-types"
import { EditableTextElement } from "./editable-text-element"
import { ResizableImageElement } from "./resizable-image-element"
import { ImageUploadModal } from "../components/image-upload-modal"
import "@/styles/sidebar_settings_editor.css"
import "@/styles/template/template_11.css"
import "@/styles/template/template_14.css"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Mountain, Sun, Moon } from "lucide-react"

interface TemplateRendererProps {
  templateId: string
  selectedTemplateElement: string | null
  selectedElements: string[]
  textEditingState: TextEditingState
  editableElements: Map<string, EditableTemplateElement>
  isPreviewMode: boolean
  getStableElementId: (templateId: string, elementKey: string) => string
  onTemplateElementClick: (elementId: string, elementType: string, content: string, event: React.MouseEvent) => void
  onTemplateElementDoubleClick: (elementId: string, content: string, event: React.MouseEvent) => void
  onTextChange: (elementId: string, newContent: string) => void
  onTextEditKeyDown: (e: React.KeyboardEvent, elementId: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
  projectId: string
  pageSlug: string
}

export function TemplateRenderer(props: TemplateRendererProps) {
  const { templateId, projectId, pageSlug } = props
  const [templateContent, setTemplateContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [imageUploadModal, setImageUploadModal] = useState<{
    isOpen: boolean
    elementKey: string
    elementId: string
  }>({
    isOpen: false,
    elementKey: "",
    elementId: "",
  })

  // Load template content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/template-canvas-v232?projectId=${projectId}&pageSlug=${pageSlug}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.content) {
            setTemplateContent(result.data.content)
            console.log("Loaded template content:", result.data.content)
          }
        }
      } catch (error) {
        console.error("Error loading template content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [projectId, pageSlug])

  // Save content to server
  const saveContent = async (elementKey: string, content: string) => {
    try {
      const response = await fetch("/api/template-canvas-v232", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          projectId,
          pageSlug,
          templateId,
          elementKey,
          content,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Content saved:", result)

        // Update local state
        setTemplateContent((prev) => ({
          ...prev,
          [`${templateId}_${elementKey}`]: content,
        }))
      }
    } catch (error) {
      console.error("Error saving content:", error)
    }
  }

  // Handle image selection from repository
  const handleImageSelect = async (elementKey: string, imageUrl: string) => {
    console.log("Image selected:", elementKey, imageUrl)

    // Save the new image URL
    await saveContent(elementKey, imageUrl)

    // Force re-render by updating local state immediately
    setTemplateContent((prev) => ({
      ...prev,
      [`${templateId}_${elementKey}`]: imageUrl,
    }))

    // Close modal
    setImageUploadModal({ isOpen: false, elementKey: "", elementId: "" })
  }

  // Helper function for non-editable elements (images, etc.)
  const createDraggableElement = (
    elementKey: string,
    elementType: string,
    content: string,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
  ) => {
    const elementId = props.getStableElementId(templateId, elementKey)
    const isSelected = props.selectedTemplateElement === elementId || props.selectedElements.includes(elementId)

    return (
      <div
        key={elementKey}
        data-template-element={elementId}
        className={`template-draggable-element ${isSelected ? "template-element-selected" : ""} ${className || ""}`}
        style={{
          position: "relative",
          cursor: props.isPreviewMode ? "default" : "move",
          outline: isSelected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          ...style,
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!props.isPreviewMode) {
            props.onTemplateElementClick(elementId, elementType, content, e)
          }
        }}
      >
        {children}
        {!props.isPreviewMode && isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none" />
        )}
      </div>
    )
  }

  // Enhanced image element with resize and upload functionality
  const createResizableImageElement = (
    elementKey: string,
    elementType: string,
    defaultSrc: string,
    className?: string,
    alt?: string,
  ) => {
    const elementId = props.getStableElementId(templateId, elementKey)
    const currentSrc = templateContent[`${templateId}_${elementKey}`] || defaultSrc

    console.log("Rendering image element:", elementKey, "with src:", currentSrc)

    return (
      <ResizableImageElement
        key={`${elementKey}-${currentSrc}`} // Force re-render when src changes
        elementId={elementId}
        elementKey={elementKey}
        templateId={templateId}
        src={currentSrc}
        alt={alt || ""}
        className={className}
        isSelected={props.selectedTemplateElement === elementId || props.selectedElements.includes(elementId)}
        isPreviewMode={props.isPreviewMode}
        projectId={projectId}
        pageSlug={pageSlug}
        onImageClick={(e) => {
          if (!props.isPreviewMode) {
            console.log("Image clicked:", elementId)
            props.onTemplateElementClick(elementId, elementType, currentSrc, e)
          }
        }}
        onImageDoubleClick={(e) => {
          if (!props.isPreviewMode) {
            console.log("Image double-clicked:", elementId)
            e.stopPropagation()
            setImageUploadModal({
              isOpen: true,
              elementKey,
              elementId,
            })
          }
        }}
        onImageChange={(newSrc) => {
          console.log("Image changed:", elementKey, newSrc)
          saveContent(elementKey, newSrc)
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading template...</div>
      </div>
    )
  }

  return (
    <>
      {/* Image Upload Modal */}
      {imageUploadModal.isOpen && (
        <ImageUploadModal
          isOpen={imageUploadModal.isOpen}
          onClose={() => setImageUploadModal({ isOpen: false, elementKey: "", elementId: "" })}
          onImageSelect={(imageUrl) => handleImageSelect(imageUploadModal.elementKey, imageUrl)}
          projectId={projectId}
        />
      )}

      {/* Template Content */}
      {(() => {
        switch (templateId) {
          case "template-1":
            return (
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                  <div className="max-w-xl">
                    <EditableTextElement
                      elementKey="title"
                      defaultContent="Meet our leadership"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                        Meet our leadership
                      </h2>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="description"
                      defaultContent="We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-lg/8 text-gray-600">
                        We're a dynamic group of individuals who are passionate about what we do and dedicated to
                        delivering the best results for our clients.
                      </p>
                    </EditableTextElement>
                  </div>

                  <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                    <li>
                      <div className="flex items-center gap-x-6">
                        {createResizableImageElement(
                          "avatar",
                          "image-profile",
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          "size-[35px] rounded-full",
                          "Profile avatar",
                        )}

                        <div>
                          <EditableTextElement
                            elementKey="name"
                            defaultContent="Test Name"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">Test Name</h3>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="role"
                            defaultContent="Co-Founder / CEO"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="text-sm/6 font-semibold text-indigo-600">Co-Founder / CEO</p>
                          </EditableTextElement>
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
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                  {createResizableImageElement(
                    "logo",
                    "image-logo",
                    "/logo_light_mode.png",
                    "mx-auto h-12",
                    "Company logo",
                  )}

                  <figure className="mt-10">
                    <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                      <EditableTextElement
                        elementKey="quote"
                        defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <p>
                          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa
                          sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                        </p>
                      </EditableTextElement>
                    </blockquote>

                    <figcaption className="mt-10">
                      {createResizableImageElement(
                        "testimonial-avatar",
                        "image-avatar",
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                        "mx-auto size-10 rounded-full",
                        "Testimonial avatar",
                      )}

                      <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                        <EditableTextElement
                          elementKey="testimonial-name"
                          defaultContent="Test Name"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <div className="font-semibold text-gray-900">Test Name</div>
                        </EditableTextElement>

                        <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                          <circle cx="1" cy="1" r="1" />
                        </svg>

                        <EditableTextElement
                          elementKey="testimonial-title"
                          defaultContent="CEO of Workcation"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <div className="text-gray-600">CEO of Workcation</div>
                        </EditableTextElement>
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
                    <EditableTextElement
                      elementKey="blog-title"
                      defaultContent="From the blog"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                        From the blog
                      </h2>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="blog-subtitle"
                      defaultContent="Learn how to grow your business with our expert advice."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-2"
                    >
                      <p className="text-lg/8 text-gray-600">Learn how to grow your business with our expert advice.</p>
                    </EditableTextElement>
                  </div>

                  <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    <article className="flex max-w-xl flex-col items-start justify-between">
                      <div className="flex items-center gap-x-4 text-xs">
                        <EditableTextElement
                          elementKey="article-date"
                          defaultContent="Mar 16, 2020"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <time dateTime="2020-03-16" className="text-gray-500">
                            Mar 16, 2020
                          </time>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="article-category"
                          defaultContent="Marketing"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a
                            href="#"
                            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                          >
                            Marketing
                          </a>
                        </EditableTextElement>
                      </div>

                      <div className="group relative">
                        <EditableTextElement
                          elementKey="article-title"
                          defaultContent="Boost your conversion rate"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          className="mt-3"
                        >
                          <h3 className="text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                            <a href="#">
                              <span className="absolute inset-0" />
                              Boost your conversion rate
                            </a>
                          </h3>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="article-excerpt"
                          defaultContent="Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta."
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          className="mt-5"
                        >
                          <p className="line-clamp-3 text-sm/6 text-gray-600">
                            Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid
                            explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel.
                            Iusto corrupti dicta.
                          </p>
                        </EditableTextElement>
                      </div>

                      <div className="relative mt-8 flex items-center gap-x-4">
                        {createResizableImageElement(
                          "author-avatar",
                          "image-author",
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          "size-10 rounded-full bg-gray-50",
                          "Author avatar",
                        )}

                        <div className="text-sm/6">
                          <EditableTextElement
                            elementKey="author-name"
                            defaultContent="Test Name"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="font-semibold text-gray-900">
                              <a href="#">
                                <span className="absolute inset-0" />
                                Test Name
                              </a>
                            </p>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="author-role"
                            defaultContent="Co-Founder / CTO"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="text-gray-600">Co-Founder / CTO</p>
                          </EditableTextElement>
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
                  />
                </div>

                {/* <div className="mx-auto max-w-2xl text-center top-[30px] relative">
                  <EditableTextElement
                    elementKey="contact-title"
                    defaultContent="Contact sales"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                      Contact sales
                    </h2>
                  </EditableTextElement>
                </div> */}

                <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    {/* Full Name Input */}
                    <div>
                      <EditableTextElement
                        elementKey="name-label"
                        defaultContent="Name"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <label htmlFor="full-name" className="block text-sm/6 font-semibold text-[#888888f1]">
                          Name
                        </label>
                      </EditableTextElement>
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

                    {/* Email Input */}
                    <div>
                      <EditableTextElement
                        elementKey="email-label"
                        defaultContent="Email"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <label htmlFor="email" className="block text-sm/6 font-semibold text-[#888888f1]">
                          Email
                        </label>
                      </EditableTextElement>
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

                  {/* Message Input */}
                  <div className="mt-6 sm:col-span-2">
                    <EditableTextElement
                      elementKey="message-label"
                      defaultContent="Message"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <label htmlFor="message" className="block text-sm/6 font-semibold text-[#888888f1]">
                        Message
                      </label>
                    </EditableTextElement>
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

                  {/* Submit Button */}
                  <div className="mt-10">
                    <EditableTextElement
                      elementKey="submit-button"
                      defaultContent="Submit"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <button type="submit" className="rhdrthdrfhdrhdfhrhh">
                        Submit
                      </button>
                    </EditableTextElement>
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
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <EditableTextElement
                    elementKey="announcement-text"
                    defaultContent="DisPlan 2025 - Join us in Denver from June 7 – 9 to see what's coming next."
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <p className="text-sm/6 text-gray-900">
                      <strong className="font-semibold">DisPlan 2025</strong>
                      <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      Join us in Denver from June 7 – 9 to see what's coming next.
                    </p>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="register-button"
                    defaultContent="Register now"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <a
                      href="#"
                      className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      Register now <span aria-hidden="true">→</span>
                    </a>
                  </EditableTextElement>
                </div>

                <div className="flex flex-1 justify-end">
                  <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                    <span className="sr-only">Dismiss</span>
                    <svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )

          case "empty-3":
            return (
              <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <EditableTextElement
                    elementKey="deploy-subtitle"
                    defaultContent="Deploy faster"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <h2 className="text-center text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="deploy-title"
                    defaultContent="Everything you need to deploy your app"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                    className="mx-auto mt-2 max-w-lg text-center"
                  >
                    <p className="text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                      Everything you need to deploy your app
                    </p>
                  </EditableTextElement>

                  <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:row-span-2">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                        <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                          <EditableTextElement
                            elementKey="feature-title"
                            defaultContent="Mobile friendly"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-2"
                          >
                            <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                              Mobile friendly
                            </p>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="feature-description"
                            defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-2 max-w-lg"
                          >
                            <p className="text-sm/6 text-gray-600 max-lg:text-center">
                              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            </p>
                          </EditableTextElement>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem]" />
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
                      {createResizableImageElement(
                        "header-logo",
                        "image-logo",
                        "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600",
                        "h-8 w-auto",
                        "Company logo",
                      )}
                    </div>

                    <div className="hidden lg:flex lg:gap-x-12">
                      <EditableTextElement
                        elementKey="nav-product"
                        defaultContent="Product"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Product
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-features"
                        defaultContent="Features"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Features
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-marketplace"
                        defaultContent="Marketplace"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Marketplace
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-company"
                        defaultContent="Company"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Company
                        </a>
                      </EditableTextElement>
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                      <EditableTextElement
                        elementKey="login-button"
                        defaultContent="Log in"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Log in <span aria-hidden="true">→</span>
                        </a>
                      </EditableTextElement>
                    </div>
                  </nav>
                </header>

                <div className="relative isolate px-6 pt-14 lg:px-8">
                  <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                      <EditableTextElement
                        elementKey="hero-title"
                        defaultContent="Data to enrich your online business"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                          Data to enrich your online business
                        </h1>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="hero-description"
                        defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat."
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                        className="mt-8"
                      >
                        <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit
                          sunt amet fugiat veniam occaecat.
                        </p>
                      </EditableTextElement>

                      <div className="mt-10 flex items-center justify-center gap-x-6">
                        <EditableTextElement
                          elementKey="cta-primary"
                          defaultContent="Get started"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a
                            href="#"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Get started
                          </a>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="cta-secondary"
                          defaultContent="Learn more"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#" className="text-sm/6 font-semibold text-gray-900">
                            Learn more <span aria-hidden="true">→</span>
                          </a>
                        </EditableTextElement>
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
                  <EditableTextElement
                    elementKey="pricing-subtitle"
                    defaultContent="Pricing"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="pricing-title"
                    defaultContent="Choose your DisPlan plan for you"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                    className="mt-2"
                  >
                    <p className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                      Choose your DisPlan plan for you
                    </p>
                  </EditableTextElement>
                </div>

                <EditableTextElement
                  elementKey="pricing-description"
                  defaultContent="Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                  className="mx-auto mt-6 max-w-2xl text-center"
                >
                  <p className="text-lg font-semibold text-pretty text-gray-600 sm:text-xl/8">
                    Choose an affordable plan that's packed with the best features for engaging your audience, creating
                    customer loyalty, and driving sales.
                  </p>
                </EditableTextElement>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                  <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
                    <EditableTextElement
                      elementKey="plan1-name"
                      defaultContent="Hobby"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h3 className="text-base/7 font-semibold text-indigo-600">Hobby</h3>
                    </EditableTextElement>

                    <p className="mt-4 flex items-baseline gap-x-2">
                      <EditableTextElement
                        elementKey="plan1-price"
                        defaultContent="$29"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">$29</span>
                      </EditableTextElement>
                      <EditableTextElement
                        elementKey="plan1-price-month"
                        defaultContent="/month"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-base text-gray-500">/month</span>
                      </EditableTextElement>
                    </p>

                    <EditableTextElement
                      elementKey="plan1-description"
                      defaultContent="The perfect plan if you're just getting started with our product."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-base/7 text-gray-600">
                        The perfect plan if you're just getting started with our product.
                      </p>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="plan1-cta"
                      defaultContent="Get started today"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <a
                        href="#"
                        className="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get started today
                      </a>
                    </EditableTextElement>
                  </div>

                  <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
                    <EditableTextElement
                      elementKey="plan2-name"
                      defaultContent="Enterprise"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h3 className="text-base/7 font-semibold text-indigo-400">Enterprise</h3>
                    </EditableTextElement>

                    <p className="mt-4 flex items-baseline gap-x-2">
                      <EditableTextElement
                        elementKey="plan2-price"
                        defaultContent="$99"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-5xl font-semibold tracking-tight text-white">$99</span>
                      </EditableTextElement>
                      <EditableTextElement
                        elementKey="plan2-price-month"
                        defaultContent="/month"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-base text-indigo-200">/month</span>
                      </EditableTextElement>
                    </p>

                    <EditableTextElement
                      elementKey="plan2-description"
                      defaultContent="Dedicated support and infrastructure for your company."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-base/7 text-indigo-200">
                        Dedicated support and infrastructure for your company.
                      </p>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="plan2-cta"
                      defaultContent="Get started today"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <a
                        href="#"
                        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Get started today
                      </a>
                    </EditableTextElement>
                  </div>
                </div>
              </div>
            )

          case "empty-6":
            return (
              <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <section>
                  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                      <div className="md:col-span-1">
                        <div className="max-w-lg md:max-w-none">
                          <EditableTextElement
                            elementKey="Lorem-cta"
                            defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-8 block sm:mt-10"
                          >
                            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </h2>
                          </EditableTextElement>
                          <EditableTextElement
                            elementKey="ipsum6-cta"
                            defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur doloremque saepe architecto maiores repudiandae amet perferendis repellendus, reprehenderit voluptas sequi."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-8 block sm:mt-10"
                          >
                            <p className="mt-4 text-gray-700">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur doloremque saepe
                              architecto maiores repudiandae amet perferendis repellendus, reprehenderit voluptas sequi.
                            </p>
                          </EditableTextElement>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        {createResizableImageElement(
                          "hero-image",
                          "image-hero",
                          "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          "rounded w-full",
                          "Hero image",
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )
          case "template_11":
            return (
<div>
                <div data-animation="default" className="navbar_component w-nav" data-easing2="ease" fs-scrolldisable-element="smart-nav" data-easing="ease" data-collapse="medium" data-w-id="c406ca79-d8dd-ac01-84ae-a3099c215e05" role="banner" data-duration="400">
      <div className="navbar_container">
        <a href="#" className="navbar_logo-link w-nav-brand">
                                    <EditableTextElement
                            elementKey="navbar_logo1"
                            defaultContent="Dirtny"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
          <div className="navbar_logo">Dirtny</div>
          </EditableTextElement>
        </a>
      <nav role="navigation" className="navbar_menu is-page-height-tablet w-nav-menu">
  <div className="navbar_menu-links">
    <EditableTextElement
      elementKey="navbar_link1"
      defaultContent="Our mission"
      templateId={templateId}
      templateContent={templateContent}
      saveContent={saveContent}
      isPreviewMode={props.isPreviewMode}
    >
      <a href="#mission" className="navbar_link w-nav-link">Our mission</a>
    </EditableTextElement>

    <EditableTextElement
      elementKey="navbar_link2"
      defaultContent="Empower"
      templateId={templateId}
      templateContent={templateContent}
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
      <a href="#empower" className="navbar_link w-nav-link">Empower</a> 
    </EditableTextElement> 

    <EditableTextElement 
      elementKey="navbar_link3" 
      defaultContent="The team" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
      <a href="#team" className="navbar_link w-nav-link">The team</a> 
    </EditableTextElement> 

    <EditableTextElement 
      elementKey="navbar_link4" 
      defaultContent="Our impact" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
      <a href="#stats" className="navbar_link w-nav-link">Our impact</a> 
    </EditableTextElement> 
  </div> 
      <EditableTextElement 
      elementKey="navbar_link5" 
      defaultContent="Donate" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
                      <a data-wf--button--variant="full-blue" href="#stats" className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block">
                      <div>Donate</div>
                    </a>
                     </EditableTextElement> 
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
                          <EditableTextElement 
      elementKey="navbar_link6" 
      defaultContent="Dirtny" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
                    <h1 className="hero-title">Dirtny</h1>
                    </EditableTextElement> 
                  </div>
                </div>
              </div>
              <div className="hero_visuals">
                          {createResizableImageElement(
                          "hero-image",
                          "image-hero",
                          "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          "rounded w-full",
                          "Hero image",
                        )}
                {/* <div className="noise is-hero"></div>
                <div className="dark_gradient"></div> */}
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
         <EditableTextElement 
      elementKey="navbar_link7" 
      defaultContent="Our Mission Our mission is to empower creators and changemakers by providing a platform that connects their visions with generous supporters. We believe that every story deserves to be told and every dream deserves a chance to flourish." 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
                <h2 animation-element="text-fade-in"><span className="text-style-tagline margin-right margin-xlarge">Our Mission</span>Our mission is to empower creators and changemakers by providing a platform that connects their visions with generous supporters. We believe that every story deserves to be told and every dream deserves a chance to flourish.</h2>
                </EditableTextElement> 
                <div className="margin-top margin-medium">
                  <div className="button-group">
                             <EditableTextElement 
      elementKey="navbar_link8" 
      defaultContent="Our impact" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
                    <a data-wf--button--variant="full-blue" href="#stats" className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block">
                      <div>Our impact</div>
                    </a>
                    </EditableTextElement> 
                    <a href="#" className="button is-link is-icon w-inline-block">
                                                   <EditableTextElement 
      elementKey="navbar_link9" 
      defaultContent="Donate" 
      templateId={templateId} 
      templateContent={templateContent} 
      saveContent={saveContent} 
      isPreviewMode={props.isPreviewMode} 
    > 
                      <div>Donate</div>
                                          </EditableTextElement> 
                      <div className="icon-embed-xxsmall w-embed"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3L11 8L6 13" stroke="CurrentColor" stroke-width="1.5"></path>
                        </svg></div>
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
            )
          case "template_12":
            return (
              <div>
                 <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset="1" stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>

          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <EditableTextElement
              elementKey="navbar_link20"
              defaultContent="Boost your productivity. Start using our app today."
              templateId={templateId}
              templateContent={templateContent}
              saveContent={saveContent}
              isPreviewMode={props.isPreviewMode}
            >
              <div className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Boost your productivity. Start using our app today.
              </div>
            </EditableTextElement>

            <EditableTextElement
              elementKey="navbar_link21"
              defaultContent="Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla."
              templateId={templateId}
              templateContent={templateContent}
              saveContent={saveContent}
              isPreviewMode={props.isPreviewMode}
            >
              <p className="mt-6 text-lg/8 text-pretty text-gray-300">
                Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla.
              </p>
            </EditableTextElement>

            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <EditableTextElement
                elementKey="navbar_link22"
                defaultContent="Get started"
                templateId={templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <a
                  href="#"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <div>Get started</div>
                </a>
              </EditableTextElement>

              <EditableTextElement
                elementKey="navbar_link23"
                defaultContent="Learn more"
                templateId={templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <a href="#" className="text-sm/6 font-semibold text-white">
                  <div>
                    Learn more <span aria-hidden="true">→</span>
                  </div>
                </a>
              </EditableTextElement>
            </div>
          </div>

          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              className="absolute top-0 left-0 w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              alt="App screenshot"
              width="1824"
              height="1080"
            />
          </div>
        </div>
      </div>
    </div>
            <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <EditableTextElement
          elementKey="navbar_link10"
          defaultContent="Deploy faster"
          templateId={templateId}
          templateContent={templateContent}
          saveContent={saveContent}
          isPreviewMode={props.isPreviewMode}
        >
          <h2 className="text-center text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
        </EditableTextElement>

        <EditableTextElement
          elementKey="navbar_link11"
          defaultContent="Everything you need to deploy your app"
          templateId={templateId}
          templateContent={templateContent}
          saveContent={saveContent}
          isPreviewMode={props.isPreviewMode}
        >
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
            Everything you need to deploy your app
          </p>
        </EditableTextElement>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Mobile Friendly */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <EditableTextElement
                  elementKey="navbar_link12"
                  defaultContent="Mobile friendly"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Mobile friendly</p>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="navbar_link13"
                  defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                  </p>
                </EditableTextElement>
              </div>
              <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-4xl"></div>
          </div>

          {/* Performance */}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <EditableTextElement
                  elementKey="navbar_link14"
                  defaultContent="Performance"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="navbar_link15"
                  defaultContent="Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
                  </p>
                </EditableTextElement>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-t-4xl"></div>
          </div>

          {/* Security */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <EditableTextElement
                  elementKey="navbar_link16"
                  defaultContent="Security"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="navbar_link17"
                  defaultContent="Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
                  </p>
                </EditableTextElement>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5"></div>
          </div>

          {/* Powerful APIs */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <EditableTextElement
                  elementKey="navbar_link18"
                  defaultContent="Powerful APIs"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Powerful APIs</p>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="navbar_link19"
                  defaultContent="Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
                  </p>
                </EditableTextElement>
              </div>
              <div className="relative min-h-120 w-full grow">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                        NotificationSetting.jsx
                      </div>
                      <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14">
                    {/* Your code example here */}
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
          </div>
        </div>
      </div>
    </div>
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
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {["Product", "Features", "Marketplace", "Company"].map((text, index) => (
              <EditableTextElement
                key={index}
                elementKey={`navbar_link${24 + index}`}
                defaultContent={text}
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  {text}
                </a>
              </EditableTextElement>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <EditableTextElement
              elementKey="navbar_link28"
              defaultContent="Log in"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
            >
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </EditableTextElement>
          </div>
        </nav>

        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                <span className="sr-only">Close menu</span>
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {["Product", "Features", "Marketplace", "Company"].map((text, index) => (
                    <EditableTextElement
                      key={index}
                      elementKey={`navbar_link${29 + index}`}
                      defaultContent={text}
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                    >
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {text}
                      </a>
                    </EditableTextElement>
                  ))}
                </div>
                <div className="py-6">
                  <EditableTextElement
                    elementKey="navbar_link33"
                    defaultContent="Log in"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}   
                  >
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </a>
                  </EditableTextElement>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Top background blur graphic */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <EditableTextElement
                elementKey="navbar_link34"
                defaultContent="Announcing our next round of funding."
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <div>
                  Announcing our next round of funding.{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    <span className="absolute inset-0" aria-hidden="true"></span>Read more{" "}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </EditableTextElement>
            </div>
          </div>

          <div className="text-center">
            <EditableTextElement
              elementKey="navbar_link35"
              defaultContent="Data to enrich your online business"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
            >
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                Data to enrich your online business
              </h1>
            </EditableTextElement>

            <EditableTextElement
              elementKey="navbar_link36"
              defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat."
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
            >
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
              </p>
            </EditableTextElement>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <EditableTextElement
                elementKey="navbar_link37"
                defaultContent="Get started"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              </EditableTextElement>

              <EditableTextElement
                elementKey="navbar_link38"
                defaultContent="Learn more"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </EditableTextElement>
            </div>
          </div>
        </div>

        {/* Bottom background blur graphic */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </div>
     <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            Everything you need to deploy your app
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
            Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {/* Item 1 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                  </svg>
                </div>
                Push to deploy
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa
              </dd>
            </div>

            {/* Item 2 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                SSL certificates
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.
              </dd>
            </div>

            {/* Item 3 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                Simple queues
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.
              </dd>
            </div>

            {/* Item 4 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                  </svg>
                </div>
                Advanced security
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </div>
              </div>
            )
              case "template_13":
            return (
              <div>
                  <div id="home" className="relative overflow-hidden bg-blue-600 pt-[120px] md:pt-[130px] lg:pt-[160px]">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4">
            <div className="hero-content mx-auto max-w-[780px] text-center">
              <EditableTextElement
                elementKey="hero_title15"
                defaultContent="Open-Source Web Template for SaaS, Startup, Apps, and More"
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  Open-Source Web Template for SaaS, Startup, Apps, and More
                </h1>
              </EditableTextElement>
              <EditableTextElement
                elementKey="hero_description16"
                defaultContent="Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap, Tailwind and React NextJS."
                templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
              >
                <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                  Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap, Tailwind and
                  React NextJS.
                </p>
              </EditableTextElement>
              <ul className="flex flex-wrap items-center justify-center gap-5 mb-10">
                <li>
                  <EditableTextElement
                    elementKey="hero_button17"
                    defaultContent="Download Now"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
                    <Button className="bg-white text-black hover:bg-gray-100">Download Now</Button>
                  </EditableTextElement>
                </li>
                <li>
                  <EditableTextElement
                    elementKey="hero_button18"
                    defaultContent="Star on Github"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
                    <Button
                      variant="outline"
                      className="bg-white/20 text-white border-none hover:text-black"
                    >
                      Star on Github
                    </Button>
                  </EditableTextElement>
                </li>
              </ul>
              <div>
                <EditableTextElement
                  elementKey="hero_tech_title19"
                  defaultContent="Built with latest technology"
                  templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                >
                  <p className="mb-4 text-base font-medium text-center text-white">Built with latest technology</p>
                </EditableTextElement>
              </div>
            </div>
          </div>

          <div className="w-full px-4">
            <div className="relative z-10 mx-auto max-w-[845px] mt-16">
            </div>
          </div>
        </div>
      </div>
    </div>
              </div>
            )
                          case "template_14":
            return (
            <main>
             <div className="container">
           <div className="card">
      <div className="content">
        <div className="asfasfawfgagwgwg">
        {createResizableImageElement(
        "hero-image",
        "image-hero",
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        "rounded w-full",
        "Hero image",
        )}
        </div>
                          <EditableTextElement
                    elementKey="asfasfawfgagwgwg1"
                    defaultContent="Jessica Randall"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <h1 className="title">Jessica Randall</h1>
        </EditableTextElement>
                                  <EditableTextElement
                    elementKey="asfasfawfgagwgwg2"
                    defaultContent="London, United Kingdom"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <h2 className="location">London, United Kingdom</h2>
        </EditableTextElement>
                                          <EditableTextElement
                    elementKey="asfasfawfgagwgwg3"
                defaultContent="&quot;Front-end developer and avid reader.&quot;"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <h2 className="description">"Front-end developer and avid reader."</h2>
        </EditableTextElement>
      </div>
            <div className="social">
               <EditableTextElement
                    elementKey="asfasfawfgagwgwg4"
                defaultContent="GitHub"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <a className="safafwfawfrewr3434" href="https://www.github.com">GitHub</a>
        </EditableTextElement>
                                                  <EditableTextElement
                    elementKey="asfasfawfgagwgwg5"
                defaultContent="Frontend Mentor"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
                    
        <a className="safafwfawfrewr3434" href="www.frontendmentor.io">Frontend Mentor</a>
        </EditableTextElement>
                                                  <EditableTextElement
                    elementKey="asfasfawfgagwgwg6"
                defaultContent="LinkedIn"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <a className="safafwfawfrewr3434">LinkedIn</a>
                            </EditableTextElement>
                                                  <EditableTextElement
                    elementKey="asfasfawfgagwgwg7"
                defaultContent="Twitter"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <a className="safafwfawfrewr3434">Twitter</a>
        </EditableTextElement>
                                                  <EditableTextElement
                    elementKey="asfasfawfgagwgwg8"
                defaultContent="Instagram"
                    templateId={props.templateId}
                templateContent={templateContent}
                saveContent={saveContent}
                isPreviewMode={props.isPreviewMode}
                  >
        <a className="safafwfawfrewr3434">Instagram</a>
        </EditableTextElement>
      </div>
            </div>
           </div>
           </main>
            )
          default:
            return (
              <div className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {templateId.includes("template") ? `Template ${templateId.split("-")[1]}` : `Empty ${templateId}`}
                </span>
              </div>
            )
        }
      })()}
    </>
  )
}
