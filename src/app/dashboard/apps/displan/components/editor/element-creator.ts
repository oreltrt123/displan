// Types for element creation
export interface ElementRequest {
  type: "button" | "text" | "heading" | "image" | "container" | "contact" | "form" | "input"
  content?: string
  style?: {
    backgroundColor?: string
    textColor?: string
    borderWidth?: number
    borderColor?: string
    borderRadius?: number
    width?: number
    height?: number
    fontSize?: number
    fontWeight?: string | number
    animation?: string
  }
}

export interface ElementSpec {
  elementType: string
  content: string
  backgroundColor?: string
  textColor?: string
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  width?: number
  height?: number
  fontSize?: number
  fontWeight?: string | number
  animation?: string
}

// Color mapping for common color names
const colorMap: Record<string, string> = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  black: "#000000",
  white: "#ffffff",
  gray: "#808080",
  grey: "#808080",
  brown: "#a52a2a",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  teal: "#008080",
  violet: "#ee82ee",
  turquoise: "#40e0d0",
  silver: "#c0c0c0",
  gold: "#ffd700",
  beige: "#f5f5dc",
  transparent: "transparent",
}

// Animation mapping
const animationMap: Record<string, string> = {
  fade: "fadeIn",
  fadein: "fadeIn",
  slide: "slideInRight",
  slidein: "slideInRight",
  slideright: "slideInRight",
  slideleft: "slideInLeft",
  slideup: "slideInUp",
  slidedown: "slideInDown",
  bounce: "bounceIn",
  bouncein: "bounceIn",
  zoom: "zoomIn",
  zoomin: "zoomIn",
  rotate: "rotateIn",
  rotatein: "rotateIn",
  flip: "flipInX",
  flipx: "flipInX",
  flipy: "flipInY",
  pulse: "pulse",
}

// Parse natural language request into structured element request
export function parseElementRequest(request: string): ElementRequest | null {
  const lowerRequest = request.toLowerCase()

  // Determine element type
  let type: ElementRequest["type"] = "text" // Default

  if (lowerRequest.includes("button")) {
    type = "button"
  } else if (lowerRequest.includes("heading") || lowerRequest.includes("title") || lowerRequest.includes("header")) {
    type = "heading"
  } else if (lowerRequest.includes("image") || lowerRequest.includes("picture") || lowerRequest.includes("photo")) {
    type = "image"
  } else if (lowerRequest.includes("container") || lowerRequest.includes("box") || lowerRequest.includes("section")) {
    type = "container"
  } else if (lowerRequest.includes("contact") && (lowerRequest.includes("form") || lowerRequest.includes("us"))) {
    type = "contact"
  } else if (lowerRequest.includes("form")) {
    type = "form"
  } else if (lowerRequest.includes("input") || lowerRequest.includes("field") || lowerRequest.includes("textbox")) {
    type = "input"
  }

  // Extract content
  let content = ""

  // For buttons and text, look for content after "says" or "with text" or "that says"
  const contentMatches = request.match(/(?:says|with text|that says|reading|displays?|shows?)\s+["']?([^"']+)["']?/i)
  if (contentMatches && contentMatches[1]) {
    content = contentMatches[1].trim()
  } else {
    // Try to find content between quotes
    const quoteMatches = request.match(/["']([^"']+)["']/i)
    if (quoteMatches && quoteMatches[1]) {
      content = quoteMatches[1].trim()
    }
  }

  // If still no content, use default based on type
  if (!content) {
    switch (type) {
      case "button":
        content = "Click Me"
        break
      case "heading":
        content = "Heading"
        break
      case "text":
        content = "Text content"
        break
      case "image":
        content = "/placeholder.svg"
        break
      case "container":
        content = ""
        break
      case "contact":
        content = "Contact Us"
        break
      case "form":
        content = "Form"
        break
      case "input":
        content = "Input field"
        break
    }
  }

  // Extract style properties
  const style: ElementRequest["style"] = {}

  // Background color
  for (const [colorName, colorValue] of Object.entries(colorMap)) {
    if (lowerRequest.includes(`${colorName} background`) || lowerRequest.includes(`background ${colorName}`)) {
      style.backgroundColor = colorValue
      break
    }
  }

  // Text color
  for (const [colorName, colorValue] of Object.entries(colorMap)) {
    if (lowerRequest.includes(`${colorName} text`) || lowerRequest.includes(`text ${colorName}`)) {
      style.textColor = colorValue
      break
    }
  }

  // Border
  const borderWidthMatch = lowerRequest.match(/border(?:\s+width)?\s+(\d+)(?:px)?/i)
  if (borderWidthMatch && borderWidthMatch[1]) {
    style.borderWidth = Number.parseInt(borderWidthMatch[1], 10)
  } else if (lowerRequest.includes("border")) {
    style.borderWidth = 1 // Default border width
  }

  // Border color
  for (const [colorName, colorValue] of Object.entries(colorMap)) {
    if (lowerRequest.includes(`${colorName} border`) || lowerRequest.includes(`border ${colorName}`)) {
      style.borderColor = colorValue
      break
    }
  }

  // Border radius
  const borderRadiusMatch = lowerRequest.match(/(?:border\s+)?radius\s+(\d+)(?:px)?/i)
  if (borderRadiusMatch && borderRadiusMatch[1]) {
    style.borderRadius = Number.parseInt(borderRadiusMatch[1], 10)
  } else if (lowerRequest.includes("rounded")) {
    style.borderRadius = 8 // Default rounded corners
  }

  // Width
  const widthMatch = lowerRequest.match(/width\s+(\d+)(?:px)?/i)
  if (widthMatch && widthMatch[1]) {
    style.width = Number.parseInt(widthMatch[1], 10)
  }

  // Height
  const heightMatch = lowerRequest.match(/height\s+(\d+)(?:px)?/i)
  if (heightMatch && heightMatch[1]) {
    style.height = Number.parseInt(heightMatch[1], 10)
  }

  // Font size
  const fontSizeMatch = lowerRequest.match(/(?:font\s+)?size\s+(\d+)(?:px)?/i)
  if (fontSizeMatch && fontSizeMatch[1]) {
    style.fontSize = Number.parseInt(fontSizeMatch[1], 10)
  } else {
    // Set default font sizes based on element type
    if (type === "heading") {
      style.fontSize = 24
    } else if (type === "button") {
      style.fontSize = 16
    }
  }

  // Font weight
  if (lowerRequest.includes("bold")) {
    style.fontWeight = "bold"
  } else if (lowerRequest.includes("light")) {
    style.fontWeight = 300
  }

  // Animation
  for (const [animName, animValue] of Object.entries(animationMap)) {
    if (lowerRequest.includes(`${animName} animation`) || lowerRequest.includes(`animation ${animName}`)) {
      style.animation = animValue
      break
    }
  }

  return { type, content, style }
}

// Create element specification from parsed request
export function createElementFromRequest(request: ElementRequest): ElementSpec {
  // Map element type to actual element type used in the canvas
  let elementType = ""
  switch (request.type) {
    case "button":
      elementType = "button-primary"
      break
    case "heading":
      elementType = "text-heading"
      break
    case "text":
      elementType = "text-paragraph"
      break
    case "image":
      elementType = "image-basic"
      break
    case "container":
      elementType = "container-basic"
      break
    case "contact":
      elementType = "form-contact"
      break
    case "form":
      elementType = "form-basic"
      break
    case "input":
      elementType = "form-input"
      break
  }

  // Create element specification
  const spec: ElementSpec = {
    elementType,
    content: request.content || "",
  }

  // Add style properties if they exist
  if (request.style) {
    if (request.style.backgroundColor) spec.backgroundColor = request.style.backgroundColor
    if (request.style.textColor) spec.textColor = request.style.textColor
    if (request.style.borderWidth) spec.borderWidth = request.style.borderWidth
    if (request.style.borderColor) spec.borderColor = request.style.borderColor
    if (request.style.borderRadius) spec.borderRadius = request.style.borderRadius
    if (request.style.width) spec.width = request.style.width
    if (request.style.height) spec.height = request.style.height
    if (request.style.fontSize) spec.fontSize = request.style.fontSize
    if (request.style.fontWeight) spec.fontWeight = request.style.fontWeight
    if (request.style.animation) spec.animation = request.style.animation
  }

  // Set default values for missing properties based on element type
  if (elementType === "button-primary") {
    if (!spec.backgroundColor) spec.backgroundColor = "#3b82f6" // Default blue
    if (!spec.textColor) spec.textColor = "#ffffff" // White text
    if (!spec.borderRadius && spec.borderRadius !== 0) spec.borderRadius = 4
    if (!spec.width) spec.width = 120
    if (!spec.height) spec.height = 40
  } else if (elementType === "text-heading") {
    if (!spec.fontSize) spec.fontSize = 24
    if (!spec.fontWeight) spec.fontWeight = "bold"
  } else if (elementType === "text-paragraph") {
    if (!spec.fontSize) spec.fontSize = 16
  } else if (elementType === "image-basic") {
    if (!spec.width) spec.width = 300
    if (!spec.height) spec.height = 200
    if (spec.content === "Text content") spec.content = "/placeholder.svg"
  } else if (elementType === "container-basic") {
    if (!spec.backgroundColor) spec.backgroundColor = "#f9fafb" // Light gray
    if (!spec.width) spec.width = 400
    if (!spec.height) spec.height = 300
    if (!spec.borderRadius && spec.borderRadius !== 0) spec.borderRadius = 8
  } else if (elementType === "form-contact") {
    if (!spec.backgroundColor) spec.backgroundColor = "#ffffff" // White
    if (!spec.width) spec.width = 400
    if (!spec.height) spec.height = 450
    if (!spec.borderRadius && spec.borderRadius !== 0) spec.borderRadius = 8
  } else if (elementType === "form-basic") {
    if (!spec.backgroundColor) spec.backgroundColor = "#ffffff" // White
    if (!spec.width) spec.width = 400
    if (!spec.height) spec.height = 300
    if (!spec.borderRadius && spec.borderRadius !== 0) spec.borderRadius = 8
  } else if (elementType === "form-input") {
    if (!spec.width) spec.width = 300
    if (!spec.height) spec.height = 40
    if (!spec.borderRadius && spec.borderRadius !== 0) spec.borderRadius = 4
    if (!spec.borderWidth) spec.borderWidth = 1
    if (!spec.borderColor) spec.borderColor = "#d1d5db" // Gray border
  }

  return spec
}
