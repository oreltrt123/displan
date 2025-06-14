"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { EditableTemplateElement, TextEditingState } from "../types/canvas-types"
import { EditableTextElement } from "./editable-text-element"
import { ResizableImageElement } from "./resizable-image-element"
import { ImageUploadModal } from "../components/image-upload-modal"
import "@/styles/sidebar_settings_editor.css"

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

                <div className="mx-auto max-w-2xl text-center top-[30px] relative">
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
                </div>

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
                          placeholder="jane@framer.com"
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
