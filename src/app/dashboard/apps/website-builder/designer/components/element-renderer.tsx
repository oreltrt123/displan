"use client"

import React, { type CSSProperties, useState, useEffect, useRef } from "react"
import type { ElementType } from "../types"
import { Play, Pause, Facebook, Twitter, Instagram, Linkedin, Youtube, Zap, Shield, Terminal, Cpu, Code, Server, Globe, Lock, Trash2, Type, VideoIcon as Animation, Palette, Move, Database, User, CheckCircle, Star, ChevronDown, Check, Flower } from 'lucide-react'
import { AnimationPanel } from "./animation-panel"
import { FontsPanel } from "./fonts-panel"
import { ColorPicker } from "./color-picker"
import { useDragDrop } from "./drag-drop-context"
import * as BlogElements from "./blog-elements"
import {
  renderSearch,
  renderCard,
  renderForm,
  renderGallery,
  renderSlider,
  renderTabFilter as renderAdditionalTabFilter,
  renderNewsletterBox as renderAdditionalNewsletterBox,
  renderSocialFollow as renderAdditionalSocialFollow,
  renderCta,
  renderFaq,
  renderPricing,
  renderStats,
  renderTeam,
  renderTestimonials,
  renderFeatures,
} from "./additional-elements"

interface ElementRendererProps {
  element: ElementType
  isEditing: boolean
  isSelected: boolean
  onClick?: () => void
  onDelete?: (id: string) => void
  onUpdateElement?: (id: string, updates: Partial<ElementType>) => void
  onPositionChange?: (elementId: string, x: number, y: number) => void
}

export function ElementRenderer({
  element,
  isEditing,
  isSelected,
  onClick,
  onDelete,
  onUpdateElement,
  onPositionChange,
}: ElementRendererProps) {
  // Create a deep copy of the style and cast it to CSSProperties
  const styleCopy = { ...element.style } as CSSProperties
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAnimationPanel, setShowAnimationPanel] = useState(false)
  const [showFontsPanel, setShowFontsPanel] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [animationClass, setAnimationClass] = useState("")
  const elementRef = useRef<HTMLDivElement>(null)

  // For accordion items
  const [openAccordionItem, setOpenAccordionItem] = useState<number | null>(null)

  // For announcement dismissal
  const [isDismissed, setIsDismissed] = useState(false)

  // For slider
  const [activeSlide, setActiveSlide] = useState(0)
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null)

  // For tab filter
  const [activeFilter, setActiveFilter] = useState("")

  // For author carousel
  const [activeAuthor, setActiveAuthor] = useState(0)

  // For category popular
  const [currentTab, setCurrentTab] = useState(0)

  // Dragging state
  const [position, setPosition] = useState({ x: element.style?.x || 0, y: element.style?.y || 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 })
  const { registerDropTarget, unregisterDropTarget, showGrid, snapToGrid } = useDragDrop()

  // Register as drop target
  useEffect(() => {
    if (elementRef.current) {
      registerDropTarget(element.id, elementRef)
    }
    return () => {
      unregisterDropTarget(element.id)
    }
  }, [element.id, registerDropTarget, unregisterDropTarget])

  // Initialize position from element style
  useEffect(() => {
    if (element.style?.x !== undefined && element.style?.y !== undefined) {
      setPosition({ x: element.style.x, y: element.style.y })
    }
  }, [element.style?.x, element.style?.y])

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button

    e.stopPropagation()
    e.preventDefault()

    setIsDragging(true)
    setInitialMousePos({ x: e.clientX, y: e.clientY })

    // Add global event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    // Prevent text selection during drag
    document.body.style.userSelect = "none"
    elementRef.current?.classList.add("dragging")
  }

  // Handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    // Calculate new position
    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y

    const newX = position.x + deltaX
    const newY = position.y + deltaY

    // Apply new position directly to the element for immediate visual feedback
    if (elementRef.current) {
      const snappedPos = showGrid ? snapToGrid({ x: newX, y: newY }) : { x: newX, y: newY }
      elementRef.current.style.left = `${snappedPos.x}px`
      elementRef.current.style.top = `${snappedPos.y}px`
    }
  }

  // Handle mouse up to end dragging
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return

    setIsDragging(false)

    // Calculate final position
    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y

    const newX = position.x + deltaX
    const newY = position.y + deltaY

    // Apply snapping if grid is enabled
    const finalPosition = showGrid ? snapToGrid({ x: newX, y: newY }) : { x: newX, y: newY }

    // Update state
    setPosition(finalPosition)

    // Update parent component with new position (safe call)
    if (typeof onPositionChange === "function") {
      onPositionChange(element.id, finalPosition.x, finalPosition.y)
    }

    // Update element style with new position
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          x: finalPosition.x,
          y: finalPosition.y,
        },
      })
    }

    // Remove event listeners
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)

    // Restore text selection
    document.body.style.userSelect = ""
    elementRef.current?.classList.remove("dragging")
  }

  // Apply transitions if they exist
  if (element.transitions) {
    styleCopy.transition = element.transitions
      .map((t) => `${t.property} ${t.duration}ms ${t.timingFunction} ${t.delay}ms`)
      .join(", ")
  }

  // Apply font family if it exists
  if (element.style?.fontFamily) {
    styleCopy.fontFamily = element.style.fontFamily
  }

  // Parse the element type to extract the base type and design ID
  const parseElementTypeAndDesign = () => {
    // Check if the type contains a design ID
    if (typeof element.type === "string" && element.type.includes(":")) {
      const [baseType, designId] = element.type.split(":")
      return { baseType, designId }
    }
    return { baseType: element.type, designId: null }
  }

  const { baseType, designId } = parseElementTypeAndDesign()

  // Load Google Fonts when font family changes
  useEffect(() => {
    if (element.style?.fontFamily && !document.querySelector(`link[href*="${element.style.fontFamily}"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${element.style.fontFamily.replace(/ /g, "+")}&display=swap`
      document.head.appendChild(link)
    }
  }, [element.style?.fontFamily])

  // Apply animation class based on element transitions
  useEffect(() => {
    if (!isEditing && element.transitions && element.transitions.length > 0) {
      const animation = element.transitions[0].animation
      if (animation) {
        setAnimationClass(getAnimationClass(animation))

        // If we're in preview mode, apply the animation
        if (elementRef.current) {
          elementRef.current.style.opacity = "0"
          setTimeout(() => {
            if (elementRef.current) {
              elementRef.current.style.opacity = "1"
              elementRef.current.className = `${elementRef.current.className} ${getAnimationClass(animation)}`
            }
          }, 100)
        }
      }
    } else {
      setAnimationClass("")
    }
  }, [element.transitions, isEditing])

  // Slider autoplay effect
  useEffect(() => {
    if (baseType === "slider" && element.content?.autoplay && !isEditing) {
      const interval = element.content.interval || 5000

      const autoplayTimer = setInterval(() => {
        const slides = element.content?.slides || []
        if (slides.length > 0) {
          setActiveSlide((prev) => (prev + 1) % slides.length)
        }
      }, interval)

      setAutoplayInterval(autoplayTimer)

      return () => {
        if (autoplayInterval) {
          clearInterval(autoplayInterval)
        }
      }
    }
  }, [baseType, element.content?.autoplay, element.content?.interval, isEditing, autoplayInterval])

  // Get CSS animation class based on animation type
  const getAnimationClass = (animationType: string): string => {
    switch (animationType) {
      case "fade-in":
        return "animate-fade-in"
      case "slide-up":
        return "animate-slide-up"
      case "slide-down":
        return "animate-slide-down"
      case "slide-left":
        return "animate-slide-left"
      case "slide-right":
        return "animate-slide-right"
      case "zoom-in":
        return "animate-zoom-in"
      case "zoom-out":
        return "animate-zoom-out"
      case "bounce":
        return "animate-bounce"
      case "pulse":
        return "animate-pulse"
      case "flip":
        return "animate-flip"
      case "shake":
        return "animate-shake"
      case "rotate":
        return "animate-rotate"
      default:
        return ""
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Delete clicked for element:", element.id)
    // Immediately delete without confirmation
    if (onDelete) {
      onDelete(element.id)
    }
  }

  const handleAnimationClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAnimationPanel(true)
    setShowFontsPanel(false)
    setShowColorPicker(false)
  }

  const handleFontsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowFontsPanel(true)
    setShowAnimationPanel(false)
    setShowColorPicker(false)
  }

  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowColorPicker(true)
    setShowAnimationPanel(false)
    setShowFontsPanel(false)
  }

  const handleApplyAnimation = (animationType: string) => {
    console.log("Applying animation:", animationType, "to element:", element.id)
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        transitions: [
          {
            property: "all",
            duration: 500,
            timingFunction: "ease",
            delay: 0,
            animation: animationType,
          },
        ],
      })

      // Apply animation immediately for preview
      if (elementRef.current) {
        elementRef.current.className = `${elementRef.current.className.replace(/animate-[a-z-]+/g, "")} ${getAnimationClass(animationType)}`
      }
    }
    setShowAnimationPanel(false)
  }

  const handleApplyFont = (fontFamily: string) => {
    console.log("Applying font:", fontFamily, "to element:", element.id)
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          fontFamily,
        },
      })

      // Load the font immediately
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}&display=swap`
      document.head.appendChild(link)
    }
    setShowFontsPanel(false)
  }

  const handleApplyColor = (color: string) => {
    console.log("Applying text color:", color, "to element:", element.id)
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          color,
        },
      })
    }
    setShowColorPicker(false)
  }

  const handleApplyBackgroundColor = (color: string) => {
    console.log("Applying background color:", color, "to element:", element.id)
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          backgroundColor: color,
        },
      })
    }
    setShowColorPicker(false)
  }

  const toggleAccordionItem = (index: number) => {
    setOpenAccordionItem(openAccordionItem === index ? null : index)
  }

  const renderElement = () => {
    // First check for cyber elements
    if (typeof baseType === 'string' && baseType.startsWith("cyber-")) {
      if (baseType === "cyber-button") {
        return renderCyberButton(designId)
      } else if (baseType === "cyber-card") {
        return renderCyberCard(designId)
      } else if (baseType === "cyber-header") {
        return renderCyberHeader(designId)
      } else if (baseType === "cyber-grid") {
        return renderCyberGrid(designId)
      } else if (baseType === "cyber-code") {
        return renderCyberCode(designId)
      } else if (baseType === "cyber-server") {
        return renderCyberServer(designId)
      } else if (baseType === "cyber-network") {
        return renderCyberNetwork(designId)
      } else if (baseType === "cyber-security") {
        return renderCyberSecurity(designId)
      } else if (baseType === "simple-button") {
        return renderSimpleButton(designId)
      } else if (baseType === "simple-card") {
        return renderSimpleCard(designId)
      } else if (baseType === "simple-header") {
        return renderSimpleHeader(designId)
      }
    }

    // Then check for blog elements
    if (typeof baseType === 'string') {
      switch (baseType) {
        case "mega-menu":
          return BlogElements.renderMegaMenu(element)

        case "announcement":
          return BlogElements.renderAnnouncement(element, isDismissed, setIsDismissed)

        case "slider":
          if (element.content?.customSlider) {
            return renderSlider(element)
          }
          return BlogElements.renderSlider(element, activeSlide, setActiveSlide)

        case "particles":
          return BlogElements.renderParticles(element)

        case "scroll-indicator":
          return BlogElements.renderScrollIndicator(element, getIconComponent)

        case "featured-grid":
          return BlogElements.renderFeaturedGrid(element)

        case "call-to-action":
          return BlogElements.renderCallToAction(element)

        case "pill-carousel":
          return BlogElements.renderPillCarousel(element)

        case "topic-highlights":
          return BlogElements.renderTopicHighlights(element)

        case "tab-filter":
          if (element.content?.customFilter) {
            return renderAdditionalTabFilter(element)
          }
          return BlogElements.renderTabFilter(element, activeFilter, setActiveFilter)

        case "article-grid":
          return BlogElements.renderArticleGrid(element)

        case "author-carousel":
          return BlogElements.renderAuthorCarousel(element, activeAuthor, setActiveAuthor)

        case "category-cards":
          return BlogElements.renderCategoryCards(element, getIconComponent)

        case "tag-cloud":
          return BlogElements.renderTagCloud(element)

        case "category-popular":
          return BlogElements.renderCategoryPopular(element, currentTab, setCurrentTab)

        case "stats-counter":
          return BlogElements.renderStatsCounter(element)

        case "newsletter-box":
          if (element.content?.customNewsletter) {
            return renderAdditionalNewsletterBox(element)
          }
          return BlogElements.renderNewsletterBox(element)

        case "social-follow":
          if (element.content?.customSocial) {
            return renderAdditionalSocialFollow(element)
          }
          return BlogElements.renderSocialFollow(element)

        case "back-to-top":
          return BlogElements.renderBackToTop(element, getIconComponent)

        case "search":
          return renderSearch(element)

        case "card":
          return renderCard(element)

        case "form":
          return renderForm(element)

        case "gallery":
          return renderGallery(element)

        case "cta":
          return renderCta(element)

        case "faq":
          return renderFaq(element)

        case "pricing":
          return renderPricing(element)

        case "stats":
          return renderStats(element)

        case "team":
          return renderTeam(element)

        case "testimonials-grid":
          return renderTestimonials(element)

        case "features-grid":
          return renderFeatures(element)
      }
    }

    // Then check for standard elements
    if (typeof baseType === 'string') {
      switch (baseType) {
        case "heading":
          // FIX: Ensure we're using a valid HTML tag name, not a number
          const headingLevel = element.content?.level || 2
          // Convert the heading level to a valid tag name
          const tagName = typeof headingLevel === 'number' ? `h${headingLevel}` : (typeof headingLevel === 'string' ? headingLevel : 'h2')
          return React.createElement(tagName, { style: styleCopy }, element.content?.text || "Heading")

        case "paragraph":
          return <p style={styleCopy}>{element.content?.text || "Paragraph text"}</p>

        case "image":
          return (
            <img
              src={element.content?.src || "/placeholder.svg?height=300&width=500"}
              alt={element.content?.alt || ""}
              style={styleCopy}
            />
          )

        case "button":
          return (
            <a
              href={isEditing ? "#" : element.content?.href || "#"}
              style={styleCopy}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {element.content?.buttonText || "Button"}
            </a>
          )

        case "divider":
          return <hr style={styleCopy} />

        case "container":
          return (
            <div
              style={{ ...styleCopy, minHeight: "100px" } as CSSProperties}
              className="p-4 border border-dashed border-gray-300 rounded-lg"
            >
              {Array.isArray(element.content?.children)
                ? element.content.children.map((child: ElementType) => (
                    <ElementRenderer
                      key={child.id}
                      element={child}
                      isEditing={isEditing}
                      isSelected={false}
                      onDelete={onDelete}
                      onUpdateElement={onUpdateElement}
                    />
                  ))
                : element.content?.text || "Container"}
            </div>
          )

        case "spacer":
          return <div style={{ ...styleCopy, height: element.content?.height || "50px" } as CSSProperties} />

        case "list":
          return (
            <ul style={styleCopy} className="list-disc pl-5">
              {Array.isArray(element.content?.items) ? (
                element.content.items.map((item, index) => <li key={index}>{String(item)}</li>)
              ) : (
                <>
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </>
              )}
            </ul>
          )

        case "columns":
          // Ensure columns is an array before mapping
          const columns = Array.isArray(element.content?.columns) ? element.content.columns : []

          return (
            <div style={styleCopy} className="grid grid-cols-2 gap-4">
              {columns.length > 0 ? (
                columns.map((column, index) => (
                  <div key={index} className="border border-dashed border-gray-300 p-4 rounded-lg">
                    {Array.isArray(column.children)
                      ? column.children.map((child: ElementType) => (
                          <ElementRenderer
                            key={child.id}
                            element={child}
                            isEditing={isEditing}
                            isSelected={false}
                            onDelete={onDelete}
                            onUpdateElement={onUpdateElement}
                          />
                        ))
                      : `Column ${index + 1}`}
                  </div>
                ))
              ) : (
                <>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Column 1</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Column 2</div>
                </>
              )}
            </div>
          )

        case "grid":
          // Ensure cells is an array before mapping
          const cells = Array.isArray(element.content?.cells) ? element.content.cells : []

          return (
            <div style={styleCopy} className="grid grid-cols-3 gap-4">
              {cells.length > 0 ? (
                cells.map((cell, index) => (
                  <div key={index} className="border border-dashed border-gray-300 p-4 rounded-lg">
                    {Array.isArray(cell.children)
                      ? cell.children.map((child: ElementType) => (
                          <ElementRenderer
                            key={child.id}
                            element={child}
                            isEditing={isEditing}
                            isSelected={false}
                            onDelete={onDelete}
                            onUpdateElement={onUpdateElement}
                          />
                        ))
                      : `Cell ${index + 1}`}
                  </div>
                ))
              ) : (
                <>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 1</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 2</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 3</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 4</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 5</div>
                  <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 6</div>
                </>
              )}
            </div>
          )

        case "video":
          return (
            <div style={styleCopy} className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {element.content?.videoUrl ? (
                  <iframe
                    src={element.content.videoUrl}
                    title={element.content?.title || "Video"}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        {isPlaying ? (
                          <Pause className="h-12 w-12 cursor-pointer" onClick={() => setIsPlaying(false)} />
                        ) : (
                          <Play className="h-12 w-12 cursor-pointer" onClick={() => setIsPlaying(true)} />
                        )}
                      </div>
                      <p>{element.content?.title || "Video placeholder"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )

        case "icon":
          const IconComponent = getIconComponent(element.content?.iconName || "facebook")
          return (
            <div style={styleCopy} className="flex justify-center">
              <IconComponent className="h-8 w-8" />
            </div>
          )

        case "hero":
          return (
            <div
              style={
                {
                  ...styleCopy,
                  backgroundColor: element.style?.backgroundColor || "#f5f5f5",
                  color: element.style?.textColor || "#333333",
                  height: element.style?.height || "500px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: element.style?.alignment || "center",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                } as CSSProperties
              }
              className="rounded-lg"
            >
              {element.content?.src && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={element.content.src || "/placeholder.svg"}
                    alt={element.content?.alt || ""}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>
              )}
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{element.content?.heading || "Hero Heading"}</h1>
                <p className="text-xl mb-6">{element.content?.subheading || "Hero subheading text goes here"}</p>
                {element.content?.buttonText && (
                  <a
                    href={isEditing ? "#" : element.content?.buttonLink || "#"}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {element.content.buttonText}
                  </a>
                )}
              </div>
            </div>
          )

        case "hero-form":
          return (
            <div style={styleCopy} className="hero-form">
              <input
                type="email"
                placeholder={element.content?.placeholder || "Enter your email..."}
                className="hero-input"
              />
              <button className="hero-button">{element.content?.buttonText || "Subscribe"}</button>
            </div>
          )

        case "hero-mockups":
          return (
            <div style={styleCopy} className="hero-mockups">
              <img
                src={element.content?.desktopSrc || "/placeholder.svg?height=400&width=600"}
                alt="Desktop mockup"
                className="desktop-mockup"
              />
              <img
                src={element.content?.mobileSrc || "/placeholder.svg?height=500&width=250"}
                alt="Mobile mockup"
                className="mobile-mockup"
              />
            </div>
          )

        case "features":
          const features = Array.isArray(element.content?.features)
            ? element.content.features
            : [
                { title: "Feature 1", description: "Description of feature 1", icon: "zap" },
                { title: "Feature 2", description: "Description of feature 2", icon: "shield" },
                { title: "Feature 3", description: "Description of feature 3", icon: "globe" },
              ]

          return (
            <div style={styleCopy} className="py-12">
              {element.content?.heading && (
                <h2 className="text-3xl font-bold text-center mb-12">{element.content.heading}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const FeatureIcon = getIconComponent(feature.icon || "zap")
                  return (
                    <div key={index} className="text-center p-6 rounded-lg">
                      {feature.src ? (
                        <img
                          src={feature.src || "/placeholder.svg"}
                          alt={feature.title}
                          className="w-16 h-16 mx-auto mb-4"
                        />
                      ) : (
                        <div className="flex justify-center mb-4">
                          <FeatureIcon className="h-12 w-12 text-blue-500" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )

        case "testimonials":
          const testimonials = Array.isArray(element.content?.testimonials)
            ? element.content.testimonials
            : [
                { quote: "This is an amazing product!", author: "John Doe", company: "ABC Corp" },
                { quote: "Highly recommended!", author: "Jane Smith", company: "XYZ Inc" },
              ]

          return (
            <div style={styleCopy} className="py-12">
              {element.content?.heading && (
                <h2 className="text-3xl font-bold text-center mb-12">{element.content.heading}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      {testimonial.src && (
                        <img
                          src={testimonial.src || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        {testimonial.company && <p className="text-gray-600 text-sm">{testimonial.company}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )

        case "footer":
          const socialLinks = Array.isArray(element.content?.socialLinks) ? element.content.socialLinks : []

          return (
            <footer
              style={
                {
                  ...styleCopy,
                  backgroundColor: element.style?.backgroundColor || "#333333",
                  color: element.style?.textColor || "#ffffff",
                  padding: element.style?.padding || "40px 20px",
                } as CSSProperties
              }
            >
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <p>{element.content?.copyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>
                    {element.content?.address && <p className="mt-2">{element.content.address}</p>}
                    {element.content?.phone && <p className="mt-1">{element.content.phone}</p>}
                    {element.content?.email && <p className="mt-1">{element.content.email}</p>}
                  </div>
                  {element.content?.showSocial && socialLinks.length > 0 && (
                    <div className="flex space-x-4">
                      {socialLinks.map((link, index) => {
                        const SocialIcon = getIconComponent(link.platform || "facebook")
                        return (
                          <a
                            key={index}
                            href={isEditing ? "#" : link.link || "#"}
                            className="text-white hover:text-gray-300 transition-colors"
                          >
                            <SocialIcon className="h-6 w-6" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          )

        case "header":
          const navItems = Array.isArray(element.content?.navItems) ? element.content.navItems : []

          return (
            <header
              style={
                {
                  ...styleCopy,
                  backgroundColor: element.style?.backgroundColor || "#ffffff",
                  color: element.style?.textColor || "#000000",
                  padding: element.style?.padding || "20px",
                } as CSSProperties
              }
            >
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl font-bold">{element.content?.title || "Website Title"}</h1>
                    {element.content?.subtitle && <p className="text-sm">{element.content.subtitle}</p>}
                  </div>
                  {element.content?.showNav && navItems.length > 0 && (
                    <nav>
                      <ul className="flex space-x-6">
                        {navItems.map((item, index) => (
                          <li key={index}>
                            <a href={isEditing ? "#" : item.link || "#"} className="hover:underline">
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            </header>
          )

        // NEW ELEMENT TYPES
        case "badge":
          return renderBadge()

        case "feature-card":
          return renderFeatureCard()

        case "testimonial-card":
          return renderTestimonialCard()

        case "pricing-cards":
          return renderPricingCards()

        case "accordion":
          return renderAccordion()

        case "navbar":
          return renderNavbar()

        case "modern-button":
          return renderModernButton()

        default:
          console.error(`Unknown element type: ${element.type} (baseType: ${baseType}, designId: ${designId})`)
          return (
            <div className="p-4 border border-red-500 text-red-500">
              Unknown element type: {String(element.type)}
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify({ baseType, designId, content: element.content }, null, 2)}
              </pre>
            </div>
          )
      }
    }

    // If baseType is not a string or is undefined, return a fallback
    return (
      <div className="p-4 border border-red-500 text-red-500">
        Invalid element type: {String(element.type)}
      </div>
    );
  }

  // NEW ELEMENT RENDERERS

  // Modern Button Renderer
  function renderModernButton() {
    const buttonText = element.content?.buttonText || "Button"
    const buttonLink = element.content?.buttonLink || "#"

    return (
      <a href={isEditing ? "#" : buttonLink} className="modern-button">
        {buttonText}
      </a>
    )
  }

  // Navbar Renderer
  function renderNavbar() {
    const logo = element.content?.logo || { text: "frankie", icon: "flower" }
    const navItems = element.content?.navItems || [
      { label: "Home", link: "#" },
      { label: "Features", link: "#" },
      { label: "Pricing", link: "#" },
      { label: "Blog", link: "#" },
    ]
    const ctaButton = element.content?.ctaButton || { text: "Get the Template", link: "#" }

    const LogoIcon = getIconComponent(logo.icon || "flower")

    return (
      <nav
        style={{
          ...styleCopy,
          backgroundColor: element.style?.backgroundColor || "#121212",
          color: element.style?.textColor || "#ffffff",
        }}
        className="navbar"
      >
        <div className="navbar-logo">
          <LogoIcon className="icon h-5 w-5" />
          <span>{logo.text}</span>
        </div>

        <div className="navbar-links">
          {navItems.map((item, index) => (
            <a key={index} href={isEditing ? "#" : item.link} className="navbar-link">
              {item.label}
            </a>
          ))}
        </div>

        <a href={isEditing ? "#" : ctaButton.link} className="navbar-cta">
          {ctaButton.text}
        </a>
      </nav>
    )
  }

  // Badge Renderer
  function renderBadge() {
    const text = element.content?.text || "Badge"
    const variant = element.content?.variant || "light"

    let badgeClasses = "badge"

    if (variant === "light") {
      badgeClasses += " badge-light"
    } else if (variant === "dark") {
      badgeClasses += " badge-dark"
    } else if (variant === "primary") {
      badgeClasses += " badge-primary"
    } else if (variant === "custom") {
      badgeClasses += " badge-custom"
    }

    return (
      <div style={styleCopy} className="flex justify-center">
        <span className={badgeClasses}>{text}</span>
      </div>
    )
  }

  // Feature Card Renderer
  function renderFeatureCard() {
    const title = element.content?.title || "Feature"
    const text = element.content?.text || "Feature description"
    const iconName = element.content?.icon || "zap"
    const buttonText = element.content?.buttonText
    const buttonLink = element.content?.buttonLink || "#"
    const mockupSrc = element.content?.mockupSrc || "/placeholder.svg?height=300&width=400"
    const mockupAlt = element.content?.mockupAlt || "Feature mockup"
    const queryExamples = element.content?.queryExamples || []

    const IconComponent = getIconComponent(iconName)

    return (
      <div style={styleCopy} className="feature-card">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="feature-header">
              <div className="feature-icon-wrapper">
                <IconComponent className="feature-icon h-6 w-6" />
              </div>
              <h3 className="feature-title">{title}</h3>
            </div>

            <div className="feature-content">
              <p className="feature-text">{text}</p>

              {buttonText && (
                <a href={isEditing ? "#" : buttonLink} className="feature-button">
                  {buttonText}
                </a>
              )}

              {queryExamples.length > 0 && (
                <div className="feature-queries">
                  {queryExamples.map((query, index) => (
                    <div key={index} className="feature-query">
                      {query}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <img src={mockupSrc || "/placeholder.svg"} alt={mockupAlt} className="feature-image" />
          </div>
        </div>
      </div>
    )
  }

  // Testimonial Card Renderer
  function renderTestimonialCard() {
    const quote = element.content?.quote || "This is a testimonial quote."
    const author = element.content?.author || "John Doe"
    const position = element.content?.position || "CEO"
    const avatarSrc = element.content?.avatarSrc || "/placeholder.svg?height=100&width=100"
    const rating = element.content?.rating || 5

    return (
      <div style={styleCopy} className="testimonial-card">
        <p className="testimonial-quote">{quote}</p>

        <div className="testimonial-author">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <img src={avatarSrc || "/placeholder.svg"} alt={author} className="testimonial-avatar" />
          </div>

          <div className="testimonial-info">
            <h4 className="testimonial-name">{author}</h4>
            <p className="testimonial-position">{position}</p>
          </div>
        </div>

        {rating > 0 && (
          <div className="testimonial-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="rating-star w-4 h-4"
                fill={i < rating ? "#FFC107" : "#E5E7EB"}
                color={i < rating ? "#FFC107" : "#E5E7EB"}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Pricing Cards Renderer
  function renderPricingCards() {
    const plans = element.content?.plans || [
      {
        name: "Basic",
        price: "$9.99",
        period: "per month",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        buttonText: "Choose Plan",
        buttonLink: "#",
        popular: false,
      },
    ]

    return (
      <div style={styleCopy} className="pricing-container">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
            {plan.popular && plan.badge && <div className="pricing-badge">✦ {plan.badge}</div>}

            <div className={`${plan.popular && plan.badge ? "mt-6" : ""}`}>
              <h3 className="pricing-name">{plan.name}</h3>
            </div>

            <div>
              <span className="pricing-price">{plan.price}</span>
              <span className="pricing-period">/{plan.period}</span>
            </div>

            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i} className="pricing-feature">
                  <Check className="pricing-feature-icon h-4 w-4" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a href={isEditing ? "#" : plan.buttonLink} className="pricing-button">
              {plan.buttonText || "Get Started"}
            </a>
          </div>
        ))}
      </div>
    )
  }

  // Accordion Renderer
  function renderAccordion() {
    const items = element.content?.items || [
      { question: "Question 1", answer: "Answer 1" },
      { question: "Question 2", answer: "Answer 2" },
    ]

    return (
      <div style={styleCopy} className="accordion">
        {items.map((item, index) => (
          <div key={index} className={`accordion-item ${openAccordionItem === index ? "open" : ""}`}>
            <button className="accordion-button" onClick={() => toggleAccordionItem(index)}>
              <h3>{item.question}</h3>
              <ChevronDown className="accordion-icon w-5 h-5" />
            </button>

            <div className="accordion-content">
              <p className="accordion-answer">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Helper function to get icon component
  function getIconComponent(iconName: string) {
    switch (iconName?.toLowerCase()) {
      case "facebook":
        return Facebook
      case "twitter":
        return Twitter
      case "instagram":
        return Instagram
      case "linkedin":
        return Linkedin
      case "youtube":
        return Youtube
      case "zap":
        return Zap
      case "shield":
        return Shield
      case "terminal":
        return Terminal
      case "cpu":
        return Cpu
      case "code":
        return Code
      case "server":
        return Server
      case "globe":
        return Globe
      case "lock":
        return Lock
      case "database":
        return Database
      case "user":
        return User
      case "check-circle":
        return CheckCircle
      case "flower":
        return Flower
      default:
        return Facebook
    }
  }

  // Cyber Button Renderer
  function renderCyberButton(designId: string | null) {
    const buttonText = element.content?.buttonText || "Cyber Button"

    switch (designId) {
      case "cb-1": // Neon Glow
        return (
          <button className="w-full px-4 py-2 bg-black border-2 border-purple-500 text-purple-500 hover:text-white hover:bg-purple-900 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-2": // Digital Pulse
        return (
          <button className="w-full px-4 py-2 bg-blue-900 border border-blue-400 text-blue-400 hover:text-white hover:border-blue-300 hover:shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-3": // Tech Edge
        return (
          <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-300 hover:from-cyan-600 hover:to-blue-600 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-4": // Matrix
        return (
          <button className="w-full px-4 py-2 bg-black border border-green-500 text-green-500 font-mono hover:bg-green-900/30 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-300">
            &lt;{buttonText}&gt;
          </button>
        )
      case "cb-5": // Hologram
        return (
          <button className="w-full px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-6": // Circuit
        return (
          <button className="w-full px-4 py-2 bg-gray-900 border-t-2 border-l-2 border-purple-500 text-purple-400 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-7": // Laser
        return (
          <button className="w-full px-4 py-2 bg-red-900/50 border-b-2 border-red-500 text-red-400 hover:bg-red-800 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-8": // Synthwave
        return (
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-800 to-pink-500 text-white border border-purple-300 hover:from-purple-900 hover:to-pink-600 hover:shadow-[0_0_15px_rgba(216,180,254,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-9": // Digital Rain
        return (
          <button className="w-full px-4 py-2 bg-black border-r-2 border-green-400 text-green-400 font-mono hover:bg-green-900/20 hover:shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-10": // Wireframe
        return (
          <button className="w-full px-4 py-2 bg-transparent border border-dashed border-white text-white hover:bg-white/10 hover:border-solid hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      default:
        return (
          <button className="w-full px-4 py-2 bg-black border-2 border-purple-500 text-purple-500 hover:bg-purple-900 transition-colors">
            {buttonText}
          </button>
        )
    }
  }

  // Simple Button Renderer
  function renderSimpleButton(designId: string | null) {
    const buttonText = element.content?.buttonText || "Simple Button"

    switch (designId) {
      case "sb-1": // Flat Blue
        return (
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-2": // Flat Green
        return (
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-3": // Flat Red
        return (
          <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-4": // Flat Purple
        return (
          <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-5": // Outline Blue
        return (
          <button className="w-full px-4 py-2 bg-transparent border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-6": // Outline Green
        return (
          <button className="w-full px-4 py-2 bg-transparent border-2 border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-7": // Outline Red
        return (
          <button className="w-full px-4 py-2 bg-transparent border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-8": // Outline Purple
        return (
          <button className="w-full px-4 py-2 bg-transparent border-2 border-purple-500 text-purple-500 rounded-md hover:bg-purple-50 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-9": // Soft Blue
        return (
          <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
            {buttonText}
          </button>
        )
      case "sb-10": // Soft Green
        return (
          <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
            {buttonText}
          </button>
        )
      default:
        return (
          <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
            {buttonText}
          </button>
        )
    }
  }

  // Simple Card Renderer
  function renderSimpleCard(designId: string | null) {
    const cardTitle = element.content?.title || "Simple Card"
    const cardText = element.content?.text || "This is a clean, modern card with simple design elements."

    switch (designId) {
      case "sc-1": // White Card with Shadow
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
      case "sc-2": // Blue Accent
        return (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
      case "sc-3": // Green Accent
        return (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
      case "sc-4": // Red Accent
        return (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
      case "sc-5": // Purple Accent
        return (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
      case "sc-6": // Soft Blue Background
        return (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold mb-2 text-blue-800">{cardTitle}</h3>
            <p className="text-blue-700">{cardText}</p>
          </div>
        )
      case "sc-7": // Soft Green Background
        return (
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-xl font-semibold mb-2 text-green-800">{cardTitle}</h3>
            <p className="text-green-700">{cardText}</p>
          </div>
        )
      case "sc-8": // Soft Red Background
        return (
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="text-xl font-semibold mb-2 text-red-800">{cardTitle}</h3>
            <p className="text-red-700">{cardText}</p>
          </div>
        )
      case "sc-9": // Soft Purple Background
        return (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-2 text-purple-800">{cardTitle}</h3>
            <p className="text-purple-700">{cardText}</p>
          </div>
        )
      case "sc-10": // Dark Card
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">{cardTitle}</h3>
            <p className="text-gray-300">{cardText}</p>
          </div>
        )
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{cardTitle}</h3>
            <p className="text-gray-600">{cardText}</p>
          </div>
        )
    }
  }

  // Simple Header Renderer
  function renderSimpleHeader(designId: string | null) {
    const headerText = element.content?.text || "SIMPLE HEADER"

    switch (designId) {
      case "sh-1": // Blue Header
        return (
          <div className="bg-blue-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-2": // Green Header
        return (
          <div className="bg-green-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-3": // Red Header
        return (
          <div className="bg-red-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-4": // Purple Header
        return (
          <div className="bg-purple-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-5": // Gray Header
        return (
          <div className="bg-gray-800 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-6": // White Header with Blue Border
        return (
          <div className="bg-white text-blue-600 font-bold p-4 border-b-2 border-blue-500">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-7": // White Header with Green Border
        return (
          <div className="bg-white text-green-600 font-bold p-4 border-b-2 border-green-500">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-8": // White Header with Red Border
        return (
          <div className="bg-white text-red-600 font-bold p-4 border-b-2 border-red-500">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-9": // White Header with Purple Border
        return (
          <div className="bg-white text-purple-600 font-bold p-4 border-b-2 border-purple-500">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "sh-10": // Gradient Header
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      default:
        return (
          <div className="bg-white text-gray-800 font-bold p-4 border-b border-gray-200">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
    }
  }

  // Cyber Card Renderer
  function renderCyberCard(designId: string | null) {
    const cardTitle = element.content?.title || "Cyber Card"
    const cardText = element.content?.text || "This is a cyber-styled card with futuristic design elements."

    switch (designId) {
      case "cc-1": // Holographic
        return (
          <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border border-purple-400 p-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <h3 className="text-purple-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-blue-200 text-sm">{cardText}</p>
          </div>
        )
      case "cc-2": // Neon Frame
        return (
          <div className="bg-gray-900 border-2 border-cyan-500 p-4 rounded shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <h3 className="text-cyan-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-3": // Digital
        return (
          <div className="bg-black border border-green-500 p-4 rounded shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            <h3 className="text-green-500 font-mono font-bold mb-2">&gt; {cardTitle}</h3>
            <p className="text-green-400 font-mono text-sm">{cardText}</p>
          </div>
        )
      case "cc-4": // Tech Panel
        return (
          <div className="bg-gray-800 border-t-4 border-blue-500 p-4 rounded">
            <h3 className="text-blue-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-5": // Cyberdeck
        return (
          <div className="bg-gray-900 border-l-4 border-purple-500 p-4">
            <h3 className="text-purple-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-6": // Glitch
        return (
          <div className="bg-black border border-red-500 p-4 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <h3 className="text-red-500 font-bold mb-2">{cardTitle}</h3>
            <p className="text-red-400 text-sm">{cardText}</p>
          </div>
        )
      case "cc-7": // Circuit Board
        return (
          <div className="bg-gray-900 bg-[url('/placeholder.svg?height=100&width=100')] bg-opacity-10 border border-green-400 p-4 rounded">
            <h3 className="text-green-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-8": // Neural Net
        return (
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b-2 border-blue-400 p-4 rounded-t">
            <h3 className="text-blue-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-9": // Datastream
        return (
          <div className="bg-gray-900 border-r-4 border-cyan-400 p-4">
            <h3 className="text-cyan-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-10": // Quantum
        return (
          <div className="bg-black/80 backdrop-blur-sm border border-white/30 p-4 rounded shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h3 className="text-white font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 border-2 border-purple-500 p-4 rounded">
            <h3 className="text-purple-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
    }
  }

  // Cyber Header Renderer
  function renderCyberHeader(designId: string | null) {
    const headerText = element.content?.text || "CYBER HEADER"

    switch (designId) {
      case "ch-1": // Command Line
        return (
          <div className="bg-black text-green-500 font-mono border-b border-green-500 p-4">
            <h2 className="text-xl">&gt; {headerText}</h2>
          </div>
        )
      case "ch-2": // Neon Glow
        return (
          <div className="bg-gray-900 text-cyan-400 font-bold border border-cyan-500 p-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-3": // Digital Readout
        return (
          <div className="bg-blue-900 text-white font-mono border-l-4 border-blue-400 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-4": // Cyberpunk
        return (
          <div className="bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-5": // Glitch Text
        return (
          <div className="bg-black text-red-500 border-t border-red-500 p-4">
            <h2 className="text-xl font-bold">{headerText}</h2>
          </div>
        )
      case "ch-6": // Hologram Title
        return (
          <div className="bg-transparent text-cyan-400 font-bold border border-cyan-400/50 p-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-7": // Neural
        return (
          <div className="bg-gray-900 text-purple-400 font-bold border-b-2 border-purple-500 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-8": // Tech Spec
        return (
          <div className="bg-gray-800 text-white font-mono border-l-2 border-r-2 border-yellow-400 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-9": // System Alert
        return (
          <div className="bg-red-900/50 text-white font-bold border-t-2 border-b-2 border-red-500 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-10": // Data Terminal
        return (
          <div className="bg-black text-blue-400 font-mono border border-blue-500/50 p-4">
            <h2 className="text-xl">&lt;{headerText}&gt;</h2>
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 text-cyan-400 font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
    }
  }

  // Cyber Grid Renderer
  function renderCyberGrid(designId: string | null) {
    // Create grid items with default content
    const gridItems = Array(4)
      .fill(null)
      .map((_, index) => element.content?.items?.[index] || `Grid ${index + 1}`)

    switch (designId) {
      case "cg-1": // Neon Grid
        return (
          <div className="bg-gray-900 gap-1 p-1 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-purple-900/50 p-2 text-purple-300 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-2": // Digital Matrix
        return (
          <div className="bg-black gap-2 p-2 border border-green-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-3": // Tech Panels
        return (
          <div className="bg-gray-800 gap-3 p-2 border-t-2 border-blue-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 text-blue-400 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-4": // Holographic Display
        return (
          <div className="bg-blue-900/50 gap-1 p-1 border border-cyan-400 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-5": // Circuit Board
        return (
          <div className="bg-green-900/20 gap-2 p-1 border border-green-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-green-900/30 p-1 text-green-400 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-6": // Data Blocks
        return (
          <div className="bg-gray-900 gap-1 p-1 border-b-2 border-purple-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-800 p-2 text-purple-300 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-7": // Neural Network
        return (
          <div className="bg-purple-900/30 gap-2 p-2 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-purple-800/50 p-2 text-purple-300 text-xs rounded-full">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-8": // Quantum Cells
        return (
          <div className="bg-black gap-1 p-1 border border-blue-500 grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-blue-900/30 p-2 text-blue-400 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-9": // System Modules
        return (
          <div className="bg-gray-800 gap-3 p-2 border-l-2 border-cyan-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">
                {String(item)}
              </div>
            ))}
          </div>
        )
      case "cg-10": // Virtual Reality
        return (
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 gap-2 p-2 border border-white/30 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 gap-2 p-2 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-800 p-2 text-purple-300 text-xs">
                {String(item)}
              </div>
            ))}
          </div>
        )
    }
  }

  // Cyber Code Renderer
  function renderCyberCode(designId: string | null) {
    const codeText = element.content?.code || `function init() {\n  console.log("System online");\n  return true;\n}`

    return (
      <div className="bg-gray-900 border border-green-500 rounded overflow-hidden">
        <div className="bg-black px-4 py-2 border-b border-green-500 flex justify-between items-center">
          <span className="text-green-500 font-mono text-sm">system.js</span>
          <Code className="h-4 w-4 text-green-500" />
        </div>
        <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
          <code>{codeText}</code>
        </pre>
      </div>
    )
  }

  // Cyber Server Renderer
  function renderCyberServer(designId: string | null) {
    const serverName = element.content?.name || "MAIN-SERVER"
    const serverStatus = element.content?.status || "ONLINE"

    return (
      <div className="bg-gray-900 border border-blue-500 rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-mono font-bold">{serverName}</span>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-mono ${
              serverStatus === "ONLINE" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
            }`}
          >
            {serverStatus}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">CPU</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">MEMORY</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-purple-500 w-1/2"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">STORAGE</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 w-2/3"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">NETWORK</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-green-500 w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cyber Network Renderer
  function renderCyberNetwork(designId: string | null) {
    return (
      <div className="bg-gray-900 border border-cyan-500 rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-cyan-400 font-bold">NETWORK STATUS</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((node) => (
            <div key={node} className="relative">
              <div
                className={`h-16 rounded flex items-center justify-center ${
                  node % 3 === 0
                    ? "bg-red-900/30 border border-red-500"
                    : node % 2 === 0
                      ? "bg-green-900/30 border border-green-500"
                      : "bg-blue-900/30 border border-blue-500"
                }`}
              >
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span
                  className={`text-xs font-mono ${
                    node % 3 === 0 ? "text-red-400" : node % 2 === 0 ? "text-green-400" : "text-blue-400"
                  }`}
                >
                  NODE-{node}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Cyber Security Renderer
  function renderCyberSecurity(designId: string | null) {
    return (
      <div className="bg-gray-900 border border-yellow-500 rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-bold">SECURITY ALERT</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-gray-300">Unauthorized access attempt detected.</span>
          </div>
          <div className="flex items-center">
            <Terminal className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-300">Firewall status: Active.</span>
          </div>
          <div className="flex items-center">
            <Cpu className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-300">System integrity check: Passed.</span>
          </div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div
        ref={elementRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: isSelected ? 10 : isDragging ? 100 : 1,
          transition: isDragging ? "none" : "box-shadow 0.2s ease",
          boxShadow: isSelected ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
          width: element.style?.width,
          height: element.style?.height,
          cursor: isDragging ? "grabbing" : "default",
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
        className={`
          element-wrapper relative group 
          ${isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:outline hover:outline-gray-200"}
          ${baseType === "container" ? "p-4 border border-dashed border-gray-300" : ""}
          ${isDragging ? "dragging" : ""}
          ${showGrid ? "with-grid" : ""}
        `}
        data-element-type={baseType}
        data-element-id={element.id}
      >
        {renderElement()}

        {/* Drag handle */}
        <div
          className="absolute -top-6 left-0 bg-white shadow-sm rounded-md p-1 cursor-move z-30 opacity-0 group-hover:opacity-100 hover:opacity-100"
          onMouseDown={handleMouseDown}
        >
          <Move className="h-4 w-4 text-gray-500" />
        </div>

        {isSelected && (
          <>
            <div className="absolute -top-3 -left-3 bg-primary text-white text-xs px-1 rounded">
              {baseType}
              {designId ? `:${designId}` : ""}
            </div>

            {/* Element control buttons */}
            <div className="absolute -top-3 right-3 flex space-x-2">
              {/* Animation button */}
              <button
                onClick={handleAnimationClick}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 shadow-md"
                title="Add Animation"
              >
                <Animation className="h-4 w-4" />
              </button>

              {/* Color button */}
              <button
                onClick={handleColorClick}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-1 shadow-md"
                title="Change Colors"
              >
                <Palette className="h-4 w-4" />
              </button>

              {/* Fonts button - only for text elements */}
              {(baseType === "heading" || baseType === "paragraph") && (
                <button
                  onClick={handleFontsClick}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1 shadow-md"
                  title="Change Font"
                >
                  <Type className="h-4 w-4" />
                </button>
              )}

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                title="Delete Element"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Animation panel */}
            {showAnimationPanel && (
              <AnimationPanel
                onClose={() => setShowAnimationPanel(false)}
                onApply={handleApplyAnimation}
                position={{ top: "-3px", right: "80px" }}
              />
            )}

            {/* Fonts panel */}
            {showFontsPanel && (
              <FontsPanel
                onClose={() => setShowFontsPanel(false)}
                onApply={handleApplyFont}
                position={{ top: "-3px", right: "80px" }}
              />
            )}

            {/* Color picker */}
            {showColorPicker && (
              <ColorPicker
                onClose={() => setShowColorPicker(false)}
                onApplyTextColor={handleApplyColor}
                onApplyBackgroundColor={handleApplyBackgroundColor}
                position={{ top: "-3px", right: "80px" }}
              />
            )}

            {/* Resize handles */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-bl-sm cursor-se-resize z-20" />
          </>
        )}
      </div>
    )
  }

  return (
    <div ref={elementRef} className={animationClass}>
      {renderElement()}
    </div>
  )
}