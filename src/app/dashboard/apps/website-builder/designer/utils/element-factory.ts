import type { ElementType } from "../types"

export function createNewElement(type: string): ElementType {
  const id = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // Parse the type to extract base type and design ID
  let baseType = type
  let designId = null

  if (type.includes(":")) {
    const parts = type.split(":")
    baseType = parts[0]
    designId = parts[1]
  }

  // Create the element with the appropriate type
  const element: ElementType = {
    id,
    name: getElementName(baseType),
    type: type, // Keep the original type with design ID if present
    content: {},
    style: {},
  }

  // Initialize content and style based on element type
  switch (baseType) {
    case "heading":
      element.content = {
        text: "New Heading",
        level: "h2",
      }
      element.style = {
        color: "#333333",
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "1rem",
      }
      break

    case "paragraph":
      element.content = {
        text: "This is a new paragraph. Edit this text to add your content.",
      }
      element.style = {
        color: "#666666",
        fontSize: "1rem",
        lineHeight: "1.6",
        marginBottom: "1rem",
      }
      break

    case "image":
      element.content = {
        src: "/placeholder.svg?height=300&width=500",
        alt: "Image description",
      }
      element.style = {
        width: "100%",
        maxWidth: "500px",
        marginBottom: "1rem",
        borderRadius: "4px",
      }
      break

    case "button":
      element.content = {
        buttonText: "Click Me",
        href: "#",
      }
      element.style = {
        backgroundColor: "#6c63ff",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        display: "inline-block",
      }
      break

    case "divider":
      element.content = {}
      element.style = {
        borderTop: "1px solid #e5e7eb",
        marginTop: "2rem",
        marginBottom: "2rem",
      }
      break

    case "container":
      element.content = {
        text: "Container",
      }
      element.style = {
        backgroundColor: "#f9fafb",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "spacer":
      element.content = {
        height: "50px",
      }
      element.style = {
        width: "100%",
      }
      break

    case "columns":
      element.content = {
        columns: 2,
      }
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "list":
      element.content = {
        items: ["Item 1", "Item 2", "Item 3"],
        listType: "ul",
      }
      element.style = {
        marginBottom: "1rem",
      }
      break

    case "video":
      element.content = {
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      }
      element.style = {
        width: "100%",
        aspectRatio: "16/9",
        marginBottom: "1.5rem",
        borderRadius: "4px",
      }
      break

    case "icon":
      element.content = {
        icon: "facebook",
        link: "#",
      }
      element.style = {
        color: "#6c63ff",
        fontSize: "2rem",
        marginBottom: "1rem",
      }
      break

    // Cyber elements
    case "cyber-button":
      element.content = {
        buttonText: "Cyber Button",
      }

      // Apply specific styles based on design ID
      if (designId) {
        applyCyberButtonDesign(element, designId)
      } else {
        // Default cyber button style
        element.style = {
          width: "100%",
          padding: "0.75rem 1.5rem",
          backgroundColor: "black",
          color: "#8b5cf6",
          border: "2px solid #8b5cf6",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "inline-block",
          transition: "all 0.3s ease",
        }
      }
      break

    case "cyber-card":
      element.content = {
        title: "Cyber Card",
        text: "This is a cyber-styled card with futuristic design elements.",
      }

      // Apply specific styles based on design ID
      if (designId) {
        applyCyberCardDesign(element, designId)
      } else {
        // Default cyber card style
        element.style = {
          backgroundColor: "#1f2937",
          border: "2px solid #8b5cf6",
          borderRadius: "4px",
          padding: "1.5rem",
          color: "#e5e7eb",
          marginBottom: "1.5rem",
        }
      }
      break

    case "cyber-header":
      element.content = {
        text: "CYBER HEADER",
      }

      // Apply specific styles based on design ID
      if (designId) {
        applyCyberHeaderDesign(element, designId)
      } else {
        // Default cyber header style
        element.style = {
          backgroundColor: "#111827",
          color: "#06b6d4",
          fontWeight: "bold",
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "1.5rem",
        }
      }
      break

    case "cyber-grid":
      element.content = {
        items: ["Grid 1", "Grid 2", "Grid 3", "Grid 4"],
      }

      // Apply specific styles based on design ID
      if (designId) {
        applyCyberGridDesign(element, designId)
      } else {
        // Default cyber grid style
        element.style = {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "0.5rem",
          backgroundColor: "#1f2937",
          border: "1px solid #8b5cf6",
          padding: "0.5rem",
          marginBottom: "1.5rem",
        }
      }
      break

    case "cyber-code":
      element.content = {
        code: 'function init() {\n  console.log("System online");\n  return true;\n}',
      }

      element.style = {
        backgroundColor: "#1f2937",
        border: "1px solid #22c55e",
        borderRadius: "4px",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }
      break

    case "cyber-server":
      element.content = {
        name: "MAIN-SERVER",
        status: "ONLINE",
      }

      element.style = {
        backgroundColor: "#1f2937",
        border: "1px solid #3b82f6",
        borderRadius: "4px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "cyber-network":
      element.content = {
        nodes: ["NODE-1", "NODE-2", "NODE-3", "NODE-4", "NODE-5", "NODE-6"],
      }

      element.style = {
        backgroundColor: "#1f2937",
        border: "1px solid #06b6d4",
        borderRadius: "4px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "cyber-security":
      element.content = {
        status: "ACTIVE",
      }

      element.style = {
        backgroundColor: "#1f2937",
        border: "1px solid #ef4444",
        borderRadius: "4px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    default:
      element.name = "Unknown Element"
      element.type = "paragraph"
      element.content = {
        text: `Unknown element type: ${type}`,
      }
      element.style = {
        color: "#ef4444",
        fontSize: "1rem",
        marginBottom: "1rem",
        padding: "0.5rem",
        border: "1px solid #ef4444",
        borderRadius: "4px",
      }
  }

  return element
}

// Helper function to get element name
function getElementName(type: string): string {
  switch (type) {
    case "heading":
      return "Heading"
    case "paragraph":
      return "Paragraph"
    case "image":
      return "Image"
    case "button":
      return "Button"
    case "divider":
      return "Divider"
    case "container":
      return "Container"
    case "spacer":
      return "Spacer"
    case "columns":
      return "Columns"
    case "list":
      return "List"
    case "video":
      return "Video"
    case "icon":
      return "Icon"
    case "cyber-button":
      return "Cyber Button"
    case "cyber-card":
      return "Cyber Card"
    case "cyber-header":
      return "Cyber Header"
    case "cyber-grid":
      return "Cyber Grid"
    case "cyber-code":
      return "Cyber Code"
    case "cyber-server":
      return "Cyber Server"
    case "cyber-network":
      return "Cyber Network"
    case "cyber-security":
      return "Cyber Security"
    default:
      return "Unknown Element"
  }
}

// Apply specific design to cyber button
function applyCyberButtonDesign(element: ElementType, designId: string): void {
  switch (designId) {
    case "cb-1": // Neon Glow
      element.content.buttonText = element.content.buttonText || "Neon Glow"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "black",
        color: "#8b5cf6",
        border: "2px solid #8b5cf6",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-2": // Digital Pulse
      element.content.buttonText = element.content.buttonText || "Digital Pulse"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#1e3a8a",
        color: "#60a5fa",
        border: "1px solid #60a5fa",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-3": // Tech Edge
      element.content.buttonText = element.content.buttonText || "Tech Edge"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        background: "linear-gradient(to right, #06b6d4, #3b82f6)",
        color: "white",
        border: "1px solid #06b6d4",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-4": // Matrix
      element.content.buttonText = element.content.buttonText || "Matrix"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "black",
        color: "#22c55e",
        border: "1px solid #22c55e",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-5": // Hologram
      element.content.buttonText = element.content.buttonText || "Hologram"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "transparent",
        color: "#22d3ee",
        border: "1px solid #22d3ee",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-6": // Circuit
      element.content.buttonText = element.content.buttonText || "Circuit"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#1f2937",
        color: "#a78bfa",
        borderTop: "2px solid #a78bfa",
        borderLeft: "2px solid #a78bfa",
        borderRight: "none",
        borderBottom: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-7": // Laser
      element.content.buttonText = element.content.buttonText || "Laser"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "rgba(185, 28, 28, 0.5)",
        color: "#f87171",
        borderBottom: "2px solid #ef4444",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-8": // Synthwave
      element.content.buttonText = element.content.buttonText || "Synthwave"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        background: "linear-gradient(to right, #7e22ce, #ec4899)",
        color: "white",
        border: "1px solid #d8b4fe",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-9": // Digital Rain
      element.content.buttonText = element.content.buttonText || "Digital Rain"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "black",
        color: "#4ade80",
        borderRight: "2px solid #4ade80",
        borderLeft: "none",
        borderTop: "none",
        borderBottom: "none",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    case "cb-10": // Wireframe
      element.content.buttonText = element.content.buttonText || "Wireframe"
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "transparent",
        color: "white",
        border: "1px dashed white",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
      break

    default:
      // Default cyber button style
      element.style = {
        width: "100%",
        padding: "0.75rem 1.5rem",
        backgroundColor: "black",
        color: "#8b5cf6",
        border: "2px solid #8b5cf6",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.3s ease",
      }
  }
}

// Apply specific design to cyber card
function applyCyberCardDesign(element: ElementType, designId: string): void {
  switch (designId) {
    case "cc-1": // Holographic
      element.content.title = element.content.title || "Holographic Card"
      element.style = {
        background: "linear-gradient(to bottom right, rgba(109, 40, 217, 0.8), rgba(30, 58, 138, 0.8))",
        border: "1px solid #a78bfa",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)",
        marginBottom: "1.5rem",
      }
      break

    case "cc-2": // Neon Frame
      element.content.title = element.content.title || "Neon Frame"
      element.style = {
        backgroundColor: "#1f2937",
        border: "2px solid #06b6d4",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
        marginBottom: "1.5rem",
      }
      break

    case "cc-3": // Digital
      element.content.title = element.content.title || "Digital Card"
      element.style = {
        backgroundColor: "black",
        border: "1px solid #22c55e",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)",
        marginBottom: "1.5rem",
      }
      break

    case "cc-4": // Tech Panel
      element.content.title = element.content.title || "Tech Panel"
      element.style = {
        backgroundColor: "#1f2937",
        borderTop: "4px solid #3b82f6",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "cc-5": // Cyberdeck
      element.content.title = element.content.title || "Cyberdeck"
      element.style = {
        backgroundColor: "#1f2937",
        borderLeft: "4px solid #8b5cf6",
        padding: "1rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "cc-6": // Glitch
      element.content.title = element.content.title || "Glitch Card"
      element.style = {
        backgroundColor: "black",
        border: "1px solid #ef4444",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
        marginBottom: "1.5rem",
      }
      break

    case "cc-7": // Circuit Board
      element.content.title = element.content.title || "Circuit Board"
      element.style = {
        backgroundColor: "#1f2937",
        backgroundImage: "url('/placeholder.svg?height=100&width=100')",
        backgroundOpacity: "0.1",
        border: "1px solid #4ade80",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "cc-8": // Neural Net
      element.content.title = element.content.title || "Neural Net"
      element.style = {
        background: "linear-gradient(to right, #1e3a8a, #7e22ce)",
        borderBottom: "2px solid #60a5fa",
        borderRadius: "4px 4px 0 0",
        padding: "1rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "cc-9": // Datastream
      element.content.title = element.content.title || "Datastream"
      element.style = {
        backgroundColor: "#1f2937",
        borderRight: "4px solid #22d3ee",
        padding: "1rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
      break

    case "cc-10": // Quantum
      element.content.title = element.content.title || "Quantum"
      element.style = {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "4px",
        padding: "1rem",
        color: "#e5e7eb",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
        marginBottom: "1.5rem",
      }
      break

    default:
      // Default cyber card style
      element.style = {
        backgroundColor: "#1f2937",
        border: "2px solid #8b5cf6",
        borderRadius: "4px",
        padding: "1.5rem",
        color: "#e5e7eb",
        marginBottom: "1.5rem",
      }
  }
}

// Apply specific design to cyber header
function applyCyberHeaderDesign(element: ElementType, designId: string): void {
  switch (designId) {
    case "ch-1": // Command Line
      element.content.text = element.content.text || "SYSTEM_HEADER"
      element.style = {
        backgroundColor: "black",
        color: "#22c55e",
        fontFamily: "monospace",
        borderBottom: "1px solid #22c55e",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-2": // Neon Title
      element.content.text = element.content.text || "NEON INTERFACE"
      element.style = {
        backgroundColor: "#1f2937",
        color: "#06b6d4",
        fontWeight: "bold",
        padding: "1rem",
        boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)",
        marginBottom: "1.5rem",
      }
      break

    case "ch-3": // Digital Readout
      element.content.text = element.content.text || "DIGITAL READOUT"
      element.style = {
        backgroundColor: "#1e3a8a",
        color: "white",
        fontFamily: "monospace",
        borderLeft: "4px solid #60a5fa",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-4": // Cyberpunk
      element.content.text = element.content.text || "CYBERPUNK 2077"
      element.style = {
        background: "linear-gradient(to right, #7e22ce, #ec4899)",
        color: "white",
        fontWeight: "bold",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-5": // Glitch Text
      element.content.text = element.content.text || "ERR0R_SYST3M"
      element.style = {
        backgroundColor: "black",
        color: "#ef4444",
        borderTop: "1px solid #ef4444",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-6": // Hologram Title
      element.content.text = element.content.text || "HOLOGRAPHIC DISPLAY"
      element.style = {
        backgroundColor: "transparent",
        color: "#06b6d4",
        fontWeight: "bold",
        border: "1px solid rgba(6, 182, 212, 0.5)",
        padding: "1rem",
        boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)",
        marginBottom: "1.5rem",
      }
      break

    case "ch-7": // Neural
      element.content.text = element.content.text || "NEURAL INTERFACE"
      element.style = {
        backgroundColor: "#1f2937",
        color: "#a78bfa",
        fontWeight: "bold",
        borderBottom: "2px solid #8b5cf6",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-8": // Tech Spec
      element.content.text = element.content.text || "TECH SPECIFICATIONS"
      element.style = {
        backgroundColor: "#1f2937",
        color: "white",
        fontFamily: "monospace",
        borderLeft: "2px solid #facc15",
        borderRight: "2px solid #facc15",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-9": // System Alert
      element.content.text = element.content.text || "SYSTEM ALERT"
      element.style = {
        backgroundColor: "rgba(185, 28, 28, 0.5)",
        color: "white",
        fontWeight: "bold",
        borderTop: "2px solid #ef4444",
        borderBottom: "2px solid #ef4444",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    case "ch-10": // Data Terminal
      element.content.text = element.content.text || "<DATA_TERMINAL>"
      element.style = {
        backgroundColor: "black",
        color: "#60a5fa",
        fontFamily: "monospace",
        border: "1px solid rgba(59, 130, 246, 0.5)",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
      break

    default:
      // Default cyber header style
      element.style = {
        backgroundColor: "#1f2937",
        color: "#06b6d4",
        fontWeight: "bold",
        padding: "1rem",
        marginBottom: "1.5rem",
      }
  }
}

// Apply specific design to cyber grid
function applyCyberGridDesign(element: ElementType, designId: string): void {
  switch (designId) {
    case "cg-1": // Neon Grid
      element.content.items = element.content.items || ["Grid 1", "Grid 2", "Grid 3", "Grid 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.25rem",
        backgroundColor: "#1f2937",
        border: "1px solid #8b5cf6",
        padding: "0.25rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-2": // Digital Matrix
      element.content.items = element.content.items || ["01", "10", "11", "00"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.5rem",
        backgroundColor: "black",
        border: "1px solid #22c55e",
        padding: "0.5rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-3": // Tech Panels
      element.content.items = element.content.items || ["Panel A", "Panel B", "Panel C", "Panel D"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.75rem",
        backgroundColor: "#1f2937",
        borderTop: "2px solid #60a5fa",
        padding: "0.5rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-4": // Holographic Display
      element.content.items = element.content.items || ["Holo 1", "Holo 2", "Holo 3", "Holo 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.25rem",
        backgroundColor: "rgba(30, 58, 138, 0.5)",
        border: "1px solid #22d3ee",
        padding: "0.25rem",
        boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)",
        marginBottom: "1.5rem",
      }
      break

    case "cg-5": // Circuit Board
      element.content.items = element.content.items || ["C1", "C2", "C3", "C4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.5rem",
        backgroundColor: "rgba(6, 78, 59, 0.2)",
        border: "1px solid #4ade80",
        padding: "0.25rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-6": // Data Blocks
      element.content.items = element.content.items || ["Data 1", "Data 2", "Data 3", "Data 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.25rem",
        backgroundColor: "#1f2937",
        borderBottom: "2px solid #a78bfa",
        padding: "0.25rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-7": // Neural Network
      element.content.items = element.content.items || ["Node 1", "Node 2", "Node 3", "Node 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.5rem",
        backgroundColor: "rgba(126, 34, 206, 0.3)",
        border: "1px solid #8b5cf6",
        padding: "0.5rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-8": // Quantum Cells
      element.content.items = element.content.items || ["Q1", "Q2", "Q3", "Q4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.25rem",
        backgroundColor: "black",
        border: "1px solid #3b82f6",
        padding: "0.25rem",
        boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        marginBottom: "1.5rem",
      }
      break

    case "cg-9": // System Modules
      element.content.items = element.content.items || ["Mod 1", "Mod 2", "Mod 3", "Mod 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.75rem",
        backgroundColor: "#1f2937",
        borderLeft: "2px solid #06b6d4",
        padding: "0.5rem",
        marginBottom: "1.5rem",
      }
      break

    case "cg-10": // Virtual Reality
      element.content.items = element.content.items || ["VR 1", "VR 2", "VR 3", "VR 4"]
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.5rem",
        background: "linear-gradient(to bottom right, rgba(30, 58, 138, 0.5), rgba(126, 34, 206, 0.5))",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        padding: "0.5rem",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
        marginBottom: "1.5rem",
      }
      break

    default:
      // Default cyber grid style
      element.style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "0.5rem",
        backgroundColor: "#1f2937",
        border: "1px solid #8b5cf6",
        padding: "0.5rem",
        marginBottom: "1.5rem",
      }
  }
}
