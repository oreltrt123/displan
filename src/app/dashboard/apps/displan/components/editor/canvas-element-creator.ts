// Function to create a DOM element on the canvas
export function createCanvasElement(
  elementType: string,
  x: number,
  y: number,
  properties: Record<string, any>,
  canvasElement: HTMLElement,
): HTMLElement {
  // Create the element
  const element = document.createElement("div")

  // Set position
  element.style.position = "absolute"
  element.style.left = `${x}px`
  element.style.top = `${y}px`

  // Set common properties
  if (properties.width) element.style.width = `${properties.width}px`
  if (properties.height) element.style.height = `${properties.height}px`

  // Apply element-specific styling
  switch (elementType) {
    case "button-primary":
      // Create an actual button element
      const button = document.createElement("button")
      button.textContent = properties.content || "Click Me"
      button.style.backgroundColor = properties.background_color || "#3b82f6"
      button.style.color = properties.text_color || "#ffffff"
      button.style.border = "none"
      button.style.borderRadius = properties.border_radius ? `${properties.border_radius}px` : "4px"
      button.style.padding = "8px 16px"
      button.style.cursor = "pointer"
      button.style.fontSize = properties.font_size ? `${properties.font_size}px` : "16px"
      button.style.fontWeight = properties.font_weight || "normal"
      button.style.width = "100%"
      button.style.height = "100%"

      // Add the button to the element
      element.appendChild(button)
      element.dataset.elementType = "button"
      break

    case "text-heading":
      const heading = document.createElement("h2")
      heading.textContent = properties.content || "Heading"
      heading.style.color = properties.text_color || "#000000"
      heading.style.fontSize = properties.font_size ? `${properties.font_size}px` : "24px"
      heading.style.fontWeight = properties.font_weight || "bold"
      heading.style.margin = "0"

      element.appendChild(heading)
      element.dataset.elementType = "heading"
      break

    case "text-paragraph":
      const paragraph = document.createElement("p")
      paragraph.textContent = properties.content || "Text content"
      paragraph.style.color = properties.text_color || "#000000"
      paragraph.style.fontSize = properties.font_size ? `${properties.font_size}px` : "16px"
      paragraph.style.fontWeight = properties.font_weight || "normal"
      paragraph.style.margin = "0"

      element.appendChild(paragraph)
      element.dataset.elementType = "paragraph"
      break

    case "image-basic":
      const image = document.createElement("img")
      image.src = properties.content || "/placeholder.svg"
      image.alt = "Image"
      image.style.width = "100%"
      image.style.height = "100%"
      image.style.objectFit = "cover"

      if (properties.border_radius) {
        image.style.borderRadius = `${properties.border_radius}px`
      }

      element.appendChild(image)
      element.dataset.elementType = "image"
      break

    case "form-contact":
      // Create a contact form
      const form = document.createElement("form")
      form.style.padding = "20px"
      form.style.backgroundColor = properties.background_color || "#ffffff"
      form.style.borderRadius = properties.border_radius ? `${properties.border_radius}px` : "8px"
      form.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"

      // Add form title
      const formTitle = document.createElement("h3")
      formTitle.textContent = properties.content || "Contact Us"
      formTitle.style.marginBottom = "16px"
      formTitle.style.color = properties.text_color || "#000000"
      form.appendChild(formTitle)

      // Add name field
      const nameGroup = document.createElement("div")
      nameGroup.style.marginBottom = "16px"

      const nameLabel = document.createElement("label")
      nameLabel.textContent = "Name"
      nameLabel.style.display = "block"
      nameLabel.style.marginBottom = "4px"
      nameLabel.style.fontSize = "14px"

      const nameInput = document.createElement("input")
      nameInput.type = "text"
      nameInput.placeholder = "Your name"
      nameInput.style.width = "100%"
      nameInput.style.padding = "8px"
      nameInput.style.borderRadius = "4px"
      nameInput.style.border = "1px solid #ddd"

      nameGroup.appendChild(nameLabel)
      nameGroup.appendChild(nameInput)
      form.appendChild(nameGroup)

      // Add email field
      const emailGroup = document.createElement("div")
      emailGroup.style.marginBottom = "16px"

      const emailLabel = document.createElement("label")
      emailLabel.textContent = "Email"
      emailLabel.style.display = "block"
      emailLabel.style.marginBottom = "4px"
      emailLabel.style.fontSize = "14px"

      const emailInput = document.createElement("input")
      emailInput.type = "email"
      emailInput.placeholder = "Your email"
      emailInput.style.width = "100%"
      emailInput.style.padding = "8px"
      emailInput.style.borderRadius = "4px"
      emailInput.style.border = "1px solid #ddd"

      emailGroup.appendChild(emailLabel)
      emailGroup.appendChild(emailInput)
      form.appendChild(emailGroup)

      // Add message field
      const messageGroup = document.createElement("div")
      messageGroup.style.marginBottom = "16px"

      const messageLabel = document.createElement("label")
      messageLabel.textContent = "Message"
      messageLabel.style.display = "block"
      messageLabel.style.marginBottom = "4px"
      messageLabel.style.fontSize = "14px"

      const messageInput = document.createElement("textarea")
      messageInput.placeholder = "Your message"
      messageInput.style.width = "100%"
      messageInput.style.padding = "8px"
      messageInput.style.borderRadius = "4px"
      messageInput.style.border = "1px solid #ddd"
      messageInput.style.minHeight = "100px"
      messageInput.style.resize = "vertical"

      messageGroup.appendChild(messageLabel)
      messageGroup.appendChild(messageInput)
      form.appendChild(messageGroup)

      // Add submit button
      const submitButton = document.createElement("button")
      submitButton.textContent = "Submit"
      submitButton.type = "button" // Prevent actual submission
      submitButton.style.backgroundColor = properties.background_color || "#3b82f6"
      submitButton.style.color = "#ffffff"
      submitButton.style.border = "none"
      submitButton.style.borderRadius = "4px"
      submitButton.style.padding = "8px 16px"
      submitButton.style.cursor = "pointer"
      submitButton.style.fontSize = "16px"

      form.appendChild(submitButton)
      element.appendChild(form)
      element.dataset.elementType = "contact-form"
      break

    // Add more element types as needed

    default:
      // Generic container
      element.textContent = properties.content || ""
      element.style.backgroundColor = properties.background_color || "transparent"
      element.style.color = properties.text_color || "#000000"

      if (properties.border_width) {
        element.style.border = `${properties.border_width}px solid ${properties.border_color || "#000000"}`
      }

      if (properties.border_radius) {
        element.style.borderRadius = `${properties.border_radius}px`
      }

      element.dataset.elementType = "container"
  }

  // Add element to canvas
  canvasElement.appendChild(element)

  // Make element selectable and draggable
  makeElementInteractive(element)

  return element
}

// Make element interactive (selectable, draggable)
function makeElementInteractive(element: HTMLElement): void {
  // Add selection handling
  element.addEventListener("click", (e) => {
    e.stopPropagation()

    // Remove selection from other elements
    document.querySelectorAll(".selected-element").forEach((el) => {
      el.classList.remove("selected-element")
    })

    // Add selection to this element
    element.classList.add("selected-element")

    // Dispatch selection event
    const event = new CustomEvent("displan:element-selected", {
      detail: { element },
    })
    document.dispatchEvent(event)
  })

  // Add drag handling
  let isDragging = false
  let startX = 0
  let startY = 0
  let startLeft = 0
  let startTop = 0

  element.addEventListener("mousedown", (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    startLeft = Number.parseInt(element.style.left) || 0
    startTop = Number.parseInt(element.style.top) || 0

    // Prevent text selection during drag
    e.preventDefault()
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    element.style.left = `${startLeft + deltaX}px`
    element.style.top = `${startTop + deltaY}px`
  })

  document.addEventListener("mouseup", () => {
    isDragging = false
  })
}

// Initialize canvas integration
export function initCanvasElementCreator(): void {
  if (typeof window === "undefined") return

  // Add global function to add element to canvas
  window.addElementToCanvas = (elementType, x, y, properties) => {
    const canvasElement = document.querySelector("[data-canvas]") || document.querySelector(".canvas")

    if (!canvasElement) {
      console.error("Canvas element not found")
      return
    }

    createCanvasElement(elementType, x, y, properties, canvasElement as HTMLElement)
  }

  // Add global function to get canvas dimensions
  window.getCanvasDimensions = () => {
    const canvasElement = document.querySelector("[data-canvas]") || document.querySelector(".canvas")

    if (!canvasElement) {
      return { width: 1200, height: 800, centerX: 600, centerY: 400 }
    }

    const rect = canvasElement.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      centerX: rect.width / 2,
      centerY: rect.height / 2,
    }
  }

  console.log("Canvas element creator initialized")
}

// Initialize on page load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initCanvasElementCreator)
}

// Define global window interface
declare global {
  interface Window {
    addElementToCanvas: (elementType: string, x: number, y: number, properties: Record<string, any>) => void
    getCanvasDimensions: () => { width: number; height: number; centerX: number; centerY: number }
  }
}
