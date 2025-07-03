"use client"

import { Button } from "@/components/ui/button"

export const getButtonComponent = (styleId: string, content?: string, isPreviewMode = false) => {
  const buttonContent = content || getDefaultButtonContent(styleId)

  switch (styleId) {
    case "primary":
      return (
        <Button
          className={`${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </Button>
      )

    case "secondary":
      return (
        <Button
          className={`${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
          variant="secondary"
        >
          {buttonContent}
        </Button>
      )

    case "outline":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-outline ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "text":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-text ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "rounded":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-rounded ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "icon":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-icon ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "gradient":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-gradient ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "large":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-large ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "small":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-small ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    case "pill":
      return (
        <button
          className={`px-4 py-2 rounded displan-button-pill ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}
        >
          {buttonContent}
        </button>
      )

    default:
      return (
        <button className={`px-4 py-2 rounded ${isPreviewMode ? "cursor-pointer" : "pointer-events-none"}`}>
          {buttonContent}
        </button>
      )
  }
}

export const getDefaultButtonContent = (styleId: string): string => {
  switch (styleId) {
    case "primary":
      return "Borders are cool"
    case "secondary":
      return "Secondary Button"
    case "outline":
      return "Outline Button"
    case "text":
      return "Text Button"
    case "rounded":
      return "Glitch"
    case "icon":
      return "Icon Button"
    case "gradient":
      return "Gradient Button"
    case "large":
      return "Large Button"
    case "small":
      return "Small Button"
    case "pill":
      return "Pill Button"
    default:
      return "Button"
  }
}
