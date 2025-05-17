"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import type { ElementType, Section } from "../types"

interface PreviewRendererProps {
  sections: Section[]
  canvasBackground: string
}

export function PreviewRenderer({ sections, canvasBackground }: PreviewRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize animations when component mounts
  useEffect(() => {
    if (!containerRef.current) return

    // Find all elements with animation data
    const animatedElements = containerRef.current.querySelectorAll("[data-animation]")

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute("data-animation")
      if (!animationType) return

      // Apply animations based on type
      switch (animationType) {
        case "fade-in":
          element.classList.add("animate-fade-in")
          break
        case "slide-in":
          element.classList.add("animate-slide-in")
          break
        case "bounce":
          element.classList.add("animate-bounce")
          break
        case "pulse":
          element.classList.add("animate-pulse")
          break
        case "spin":
          element.classList.add("animate-spin")
          break
      }
    })

    // Set up click handlers for interactive elements
    const buttons = containerRef.current.querySelectorAll("button")
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault() // Prevent default but allow the click effect
        button.classList.add("button-clicked")
        setTimeout(() => {
          button.classList.remove("button-clicked")
        }, 200)
      })
    })

    const links = containerRef.current.querySelectorAll("a")
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault() // Prevent navigation but allow the click effect
      })
    })
  }, [sections])

  const renderElement = (element: ElementType) => {
    const style: React.CSSProperties = {
      position: element.style.x !== undefined ? "absolute" : "relative",
      left: element.style.x,
      top: element.style.y,
      width: element.style.width,
      height: element.style.height,
      color: element.style.color,
      backgroundColor: element.style.backgroundColor,
      padding: element.style.padding,
      margin: element.style.margin,
      borderRadius: element.style.borderRadius,
      fontWeight: element.style.fontWeight,
      fontSize: element.style.fontSize,
      textAlign: element.style.textAlign as any,
      overflow: "hidden", // Prevent content from overflowing
      transition: "all 0.3s ease",
    }

    // Add animation data attribute if element has animations
    const animationProps = element.transitions
      ? {
          "data-animation": element.transitions.type || "fade-in",
        }
      : {}

    switch (element.type) {
      case "heading":
        const HeadingTag = `h${element.content?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag style={style} className="element-preview" {...animationProps}>
            {element.content?.text || "Heading"}
          </HeadingTag>
        )

      case "paragraph":
        return (
          <p style={style} className="element-preview" {...animationProps}>
            {element.content?.text || "Paragraph text"}
          </p>
        )

      case "image":
        return (
          <img
            src={element.content?.src || "/placeholder.svg"}
            alt={element.content?.alt || ""}
            style={style}
            className="element-preview"
            {...animationProps}
          />
        )

      case "button":
        return (
          <button style={style} className="element-preview hover:opacity-80 active:scale-95" {...animationProps}>
            {element.content?.buttonText || "Button"}
          </button>
        )

      case "container":
        return (
          <div style={style} className="element-preview" {...animationProps}>
            {element.children?.map((child, index) => (
              <div key={index}>{renderElement(child)}</div>
            ))}
          </div>
        )

      default:
        return (
          <div style={style} className="element-preview" {...animationProps}>
            {element.content?.text || ""}
          </div>
        )
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto" style={{ backgroundColor: canvasBackground }}>
      {sections.map((section) => (
        <div key={section.id} className="relative mb-8">
          {section.elements.map((element) => (
            <div key={element.id}>{renderElement(element)}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
