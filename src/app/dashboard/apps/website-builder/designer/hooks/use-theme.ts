"use client"

import { useState, useEffect } from "react"
import { applyThemeToPage } from "../utils/theme-manager"
import type { ElementType } from "../types"

export function useTheme(initialElements: ElementType[] = []) {
  const [elements, setElements] = useState<ElementType[]>(initialElements)
  const [currentTheme, setCurrentTheme] = useState<string | null>(null)

  // Apply theme to all elements
  const applyTheme = (theme: string) => {
    setCurrentTheme(theme)
    const updatedElements = applyThemeToPage(elements, theme)
    setElements(updatedElements)

    // Save theme preference to localStorage
    localStorage.setItem("website-builder-theme", theme)

    return updatedElements
  }

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("website-builder-theme")
    if (savedTheme && elements.length > 0) {
      applyTheme(savedTheme)
    }
  }, [])

  // Update elements when initialElements change
  useEffect(() => {
    if (initialElements.length > 0) {
      setElements(initialElements)

      // Re-apply current theme if one is set
      if (currentTheme) {
        const updatedElements = applyThemeToPage(initialElements, currentTheme)
        setElements(updatedElements)
      }
    }
  }, [initialElements])

  return {
    elements,
    currentTheme,
    applyTheme,
  }
}
