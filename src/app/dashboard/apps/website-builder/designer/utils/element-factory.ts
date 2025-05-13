import type { ElementType } from "../types"

export function createNewElement(type: string): ElementType {
  const id = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // Default position for new elements
  const defaultPosition = {
    x: 20,
    y: 20,
  }

  // Common element structure
  const baseElement: ElementType = {
    id,
    type,
    content: {},
    style: {
      ...defaultPosition,
    },
  }

  // Customize based on element type
  switch (type) {
    case "heading":
      return {
        ...baseElement,
        content: {
          text: "Heading",
          level: "h2",
        },
        style: {
          ...baseElement.style,
          fontWeight: "bold",
          fontSize: "24px",
          color: "#333333",
        },
      }

    case "paragraph":
      return {
        ...baseElement,
        content: {
          text: "This is a paragraph of text. Click to edit this text.",
        },
        style: {
          ...baseElement.style,
          fontSize: "16px",
          color: "#666666",
          width: "80%",
        },
      }

    case "image":
      return {
        ...baseElement,
        content: {
          src: "/placeholder.svg?height=300&width=500",
          alt: "Image description",
        },
        style: {
          ...baseElement.style,
          width: "300px",
          height: "auto",
        },
      }

    case "button":
      return {
        ...baseElement,
        content: {
          buttonText: "Click Me",
          href: "#",
        },
        style: {
          ...baseElement.style,
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: "medium",
        },
      }

    case "divider":
      return {
        ...baseElement,
        style: {
          ...baseElement.style,
          width: "100%",
          height: "1px",
          backgroundColor: "#e5e7eb",
          margin: "20px 0",
        },
      }

    case "spacer":
      return {
        ...baseElement,
        content: {
          height: "50px",
        },
        style: {
          ...baseElement.style,
          width: "100%",
          height: "50px",
        },
      }

    case "container":
      return {
        ...baseElement,
        content: {
          children: [],
        },
        style: {
          ...baseElement.style,
          width: "100%",
          minHeight: "100px",
          padding: "20px",
          border: "1px dashed #e5e7eb",
          borderRadius: "4px",
        },
      }

    case "list":
      return {
        ...baseElement,
        content: {
          items: ["Item 1", "Item 2", "Item 3"],
        },
        style: {
          ...baseElement.style,
          width: "80%",
        },
      }

    case "icon":
      return {
        ...baseElement,
        content: {
          iconName: "zap",
        },
        style: {
          ...baseElement.style,
          color: "#3b82f6",
          fontSize: "24px",
        },
      }

    case "video":
      return {
        ...baseElement,
        content: {
          videoUrl: "",
          title: "Video",
        },
        style: {
          ...baseElement.style,
          width: "560px",
          height: "315px",
        },
      }

    case "hero":
      return {
        ...baseElement,
        content: {
          heading: "Welcome to My Website",
          subheading: "This is a hero section with a call to action",
          buttonText: "Learn More",
          buttonLink: "#",
          src: "/placeholder.svg?height=600&width=1200",
          alt: "Hero Image",
        },
        style: {
          ...baseElement.style,
          width: "100%",
          height: "500px",
          backgroundColor: "#f9fafb",
          textColor: "#111827",
          alignment: "center",
        },
      }

    case "features":
      return {
        ...baseElement,
        content: {
          heading: "Features",
          features: [
            { title: "Feature 1", description: "Description of feature 1", icon: "zap" },
            { title: "Feature 2", description: "Description of feature 2", icon: "shield" },
            { title: "Feature 3", description: "Description of feature 3", icon: "globe" },
          ],
        },
        style: {
          ...baseElement.style,
          width: "100%",
        },
      }

    case "testimonials":
      return {
        ...baseElement,
        content: {
          heading: "What Our Clients Say",
          testimonials: [
            { quote: "This is an amazing product!", author: "John Doe", company: "ABC Corp" },
            { quote: "Highly recommended!", author: "Jane Smith", company: "XYZ Inc" },
          ],
        },
        style: {
          ...baseElement.style,
          width: "100%",
        },
      }

    case "footer":
      return {
        ...baseElement,
        content: {
          copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
          showSocial: true,
          socialLinks: [
            { platform: "twitter", link: "#" },
            { platform: "facebook", link: "#" },
            { platform: "instagram", link: "#" },
          ],
        },
        style: {
          ...baseElement.style,
          width: "100%",
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          padding: "40px 20px",
        },
      }

    case "header":
      return {
        ...baseElement,
        content: {
          title: "Website Title",
          subtitle: "Tagline or subtitle",
          showNav: true,
          navItems: [
            { label: "Home", link: "#" },
            { label: "About", link: "#" },
            { label: "Services", link: "#" },
            { label: "Contact", link: "#" },
          ],
        },
        style: {
          ...baseElement.style,
          width: "100%",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          padding: "20px",
        },
      }

    // Cyber elements
    case "cyber-button:cb-1":
    case "cyber-button:cb-2":
    case "cyber-button:cb-3":
    case "cyber-button:cb-4":
    case "cyber-button:cb-5":
    case "cyber-button:cb-6":
    case "cyber-button:cb-7":
    case "cyber-button:cb-8":
    case "cyber-button:cb-9":
    case "cyber-button:cb-10":
      return {
        ...baseElement,
        type,
        content: {
          buttonText: "Cyber Button",
          href: "#",
        },
        style: {
          ...baseElement.style,
          width: "200px",
        },
      }

    // Simple elements
    case "simple-button:sb-1":
    case "simple-button:sb-2":
    case "simple-button:sb-3":
    case "simple-button:sb-4":
    case "simple-button:sb-5":
    case "simple-button:sb-6":
    case "simple-button:sb-7":
    case "simple-button:sb-8":
    case "simple-button:sb-9":
    case "simple-button:sb-10":
      return {
        ...baseElement,
        type,
        content: {
          buttonText: "Simple Button",
          href: "#",
        },
        style: {
          ...baseElement.style,
          width: "200px",
        },
      }

    case "simple-card:sc-1":
    case "simple-card:sc-2":
    case "simple-card:sc-3":
    case "simple-card:sc-4":
    case "simple-card:sc-5":
    case "simple-card:sc-6":
    case "simple-card:sc-7":
    case "simple-card:sc-8":
    case "simple-card:sc-9":
    case "simple-card:sc-10":
      return {
        ...baseElement,
        type,
        content: {
          title: "Simple Card",
          text: "This is a clean, modern card with simple design elements.",
        },
        style: {
          ...baseElement.style,
          width: "300px",
        },
      }

    case "simple-header:sh-1":
    case "simple-header:sh-2":
    case "simple-header:sh-3":
    case "simple-header:sh-4":
    case "simple-header:sh-5":
    case "simple-header:sh-6":
    case "simple-header:sh-7":
    case "simple-header:sh-8":
    case "simple-header:sh-9":
    case "simple-header:sh-10":
      return {
        ...baseElement,
        type,
        content: {
          text: "SIMPLE HEADER",
        },
        style: {
          ...baseElement.style,
          width: "100%",
        },
      }

    case "cyber-card:cc-1":
    case "cyber-card:cc-2":
    case "cyber-card:cc-3":
    case "cyber-card:cc-4":
    case "cyber-card:cc-5":
    case "cyber-card:cc-6":
    case "cyber-card:cc-7":
    case "cyber-card:cc-8":
    case "cyber-card:cc-9":
    case "cyber-card:cc-10":
      return {
        ...baseElement,
        type,
        content: {
          title: "Cyber Card",
          text: "This is a cyber-styled card with futuristic design elements.",
        },
        style: {
          ...baseElement.style,
          width: "300px",
        },
      }

    case "cyber-header:ch-1":
    case "cyber-header:ch-2":
    case "cyber-header:ch-3":
    case "cyber-header:ch-4":
    case "cyber-header:ch-5":
    case "cyber-header:ch-6":
    case "cyber-header:ch-7":
    case "cyber-header:ch-8":
    case "cyber-header:ch-9":
    case "cyber-header:ch-10":
      return {
        ...baseElement,
        type,
        content: {
          text: "CYBER HEADER",
        },
        style: {
          ...baseElement.style,
          width: "100%",
        },
      }

    case "cyber-grid:cg-1":
    case "cyber-grid:cg-2":
    case "cyber-grid:cg-3":
    case "cyber-grid:cg-4":
    case "cyber-grid:cg-5":
    case "cyber-grid:cg-6":
    case "cyber-grid:cg-7":
    case "cyber-grid:cg-8":
    case "cyber-grid:cg-9":
    case "cyber-grid:cg-10":
      return {
        ...baseElement,
        type,
        content: {
          items: ["Grid 1", "Grid 2", "Grid 3", "Grid 4"],
        },
        style: {
          ...baseElement.style,
          width: "400px",
          height: "200px",
        },
      }

    case "cyber-code":
      return {
        ...baseElement,
        content: {
          code: `function init() {\n  console.log("System online");\n  return true;\n}`,
        },
        style: {
          ...baseElement.style,
          width: "400px",
        },
      }

    case "cyber-server":
      return {
        ...baseElement,
        content: {
          name: "MAIN-SERVER",
          status: "ONLINE",
        },
        style: {
          ...baseElement.style,
          width: "350px",
        },
      }

    case "cyber-network":
      return {
        ...baseElement,
        style: {
          ...baseElement.style,
          width: "400px",
        },
      }

    case "cyber-security":
      return {
        ...baseElement,
        style: {
          ...baseElement.style,
          width: "350px",
        },
      }

    default:
      return baseElement
  }
}
