// Theme manager utility for applying themes to elements

export type ThemeColors = {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

// Theme color definitions
export const themeColors: Record<string, ThemeColors> = {
  blue: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#93c5fd",
    background: "#dbeafe",
    text: "#1e3a8a",
    border: "#bfdbfe",
  },
  green: {
    primary: "#22c55e",
    secondary: "#4ade80",
    accent: "#86efac",
    background: "#dcfce7",
    text: "#166534",
    border: "#bbf7d0",
  },
  red: {
    primary: "#ef4444",
    secondary: "#f87171",
    accent: "#fca5a5",
    background: "#fee2e2",
    text: "#991b1b",
    border: "#fecaca",
  },
  purple: {
    primary: "#a855f7",
    secondary: "#c084fc",
    accent: "#d8b4fe",
    background: "#f3e8ff",
    text: "#6b21a8",
    border: "#e9d5ff",
  },
  orange: {
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#fdba74",
    background: "#ffedd5",
    text: "#9a3412",
    border: "#fed7aa",
  },
  teal: {
    primary: "#14b8a6",
    secondary: "#2dd4bf",
    accent: "#5eead4",
    background: "#d1faf4",
    text: "#115e59",
    border: "#99f6e4",
  },
  pink: {
    primary: "#ec4899",
    secondary: "#f472b6",
    accent: "#f9a8d4",
    background: "#fce7f3",
    text: "#9d174d",
    border: "#fbcfe8",
  },
  gray: {
    primary: "#4b5563",
    secondary: "#9ca3af",
    accent: "#d1d5db",
    background: "#f3f4f6",
    text: "#1f2937",
    border: "#e5e7eb",
  },
}

// Apply theme to a single element
export function applyThemeToElement(element: any, theme: string): any {
  if (!element || !themeColors[theme]) return element

  const colors = themeColors[theme]
  const updatedElement = { ...element }

  // Apply theme based on element type
  switch (element.type) {
    case "button":
    case "simple-button:sb-1":
    case "simple-button:sb-2":
    case "simple-button:sb-3":
    case "simple-button:sb-4":
      // Update button styles
      updatedElement.style = {
        ...updatedElement.style,
        backgroundColor: colors.primary,
        color: "#ffffff",
        borderColor: colors.primary,
      }
      break

    case "simple-button:sb-5":
    case "simple-button:sb-6":
    case "simple-button:sb-7":
    case "simple-button:sb-8":
      // Update outline button styles
      updatedElement.style = {
        ...updatedElement.style,
        backgroundColor: "transparent",
        color: colors.primary,
        borderColor: colors.primary,
      }
      break

    case "heading":
    case "paragraph":
      // Update text styles
      updatedElement.style = {
        ...updatedElement.style,
        color: colors.text,
      }
      break

    case "simple-card:sc-1":
    case "simple-card:sc-2":
    case "simple-card:sc-3":
    case "simple-card:sc-4":
    case "simple-card:sc-5":
      // Update card styles
      updatedElement.style = {
        ...updatedElement.style,
        borderColor: colors.primary,
      }
      break

    case "simple-card:sc-6":
    case "simple-card:sc-7":
    case "simple-card:sc-8":
    case "simple-card:sc-9":
      // Update soft background card styles
      updatedElement.style = {
        ...updatedElement.style,
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }
      break

    case "simple-header:sh-1":
    case "simple-header:sh-2":
    case "simple-header:sh-3":
    case "simple-header:sh-4":
    case "simple-header:sh-5":
      // Update header styles
      updatedElement.style = {
        ...updatedElement.style,
        backgroundColor: colors.primary,
        color: "#ffffff",
      }
      break

    case "simple-header:sh-6":
    case "simple-header:sh-7":
    case "simple-header:sh-8":
    case "simple-header:sh-9":
      // Update border header styles
      updatedElement.style = {
        ...updatedElement.style,
        borderColor: colors.primary,
        color: colors.primary,
      }
      break

    // Handle other element types
    default:
      // For other elements, just update text and border colors
      if (element.style) {
        updatedElement.style = {
          ...updatedElement.style,
          color: element.style.color ? colors.text : undefined,
          borderColor: element.style.borderColor ? colors.border : undefined,
        }
      }
      break
  }

  // Recursively apply theme to children elements
  if (updatedElement.children && Array.isArray(updatedElement.children)) {
    updatedElement.children = updatedElement.children.map((child: any) => applyThemeToElement(child, theme))
  }

  return updatedElement
}

// Apply theme to all elements in a page
export function applyThemeToPage(elements: any[], theme: string): any[] {
  if (!elements || !Array.isArray(elements)) return []

  return elements.map((element) => applyThemeToElement(element, theme))
}
