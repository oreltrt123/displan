import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { projectId, content } = await request.json()

    if (!projectId || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get the published site record
    const { data: publishedSite, error: siteError } = await supabase
      .from("published_sites")
      .select("site_name")
      .eq("project_id", projectId)
      .single()

    if (siteError || !publishedSite) {
      return NextResponse.json({ message: "Site not published yet" }, { status: 404 })
    }

    // Generate updated HTML
    const html = generateHtml(content, publishedSite.site_name, true)

    // Update the HTML in the published sites table
    const { error: updateError } = await supabase
      .from("published_sites")
      .update({
        html_content: html,
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", projectId)

    if (updateError) {
      console.error("Error updating published site:", updateError)
      return NextResponse.json({ message: "Failed to update site" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Site updated successfully",
    })
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Function to generate HTML
function generateHtml(content: any, siteName: string, includeLogo = true): string {
  // Get site settings
  const settings = content.settings || {
    siteName: siteName,
    favicon: "",
    theme: {
      primaryColor: "#0066cc",
      secondaryColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
  }

  // Start building the HTML
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.siteName}</title>
  ${settings.favicon ? `<link rel="icon" href="${settings.favicon}" />` : ""}
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      font-family: ${settings.theme.fontFamily || "Arial, sans-serif"};
    }
    :root {
      --primary-color: ${settings.theme.primaryColor || "#0066cc"};
      --secondary-color: ${settings.theme.secondaryColor || "#f5f5f5"};
    }
    .primary-color { color: var(--primary-color); }
    .primary-bg { background-color: var(--primary-color); }
    .secondary-color { color: var(--secondary-color); }
    .secondary-bg { background-color: var(--secondary-color); }
    .displan-footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.75rem;
      color: #666;
      margin-top: 2rem;
      border-top: 1px solid #eee;
    }
    .displan-footer a {
      color: #0066cc;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .displan-footer img {
      height: 20px;
      vertical-align: middle;
      margin-right: 0.25rem;
    }
  </style>
</head>
<body>
  <div class="container mx-auto px-4">
`

  // Get the pages
  const pages = content.pages || []
  const mainPage = pages.length > 0 ? pages[0] : null

  // If we have a main page, use its sections
  if (mainPage && mainPage.sections && mainPage.sections.length > 0) {
    // Get the sections for the main page
    const pageSections = mainPage.sections
      .map((sectionId: string) => content.sections.find((section: any) => section.id === sectionId))
      .filter(Boolean)

    // Generate HTML for each section
    pageSections.forEach((section: any) => {
      if (!section) return

      html += `    <section class="my-8">
      <div class="relative">
`

      // Generate HTML for each element in the section
      if (section.elements && section.elements.length) {
        section.elements.forEach((element: any) => {
          html += generateElementHtml(element, 8)
        })
      }

      html += `      </div>
    </section>
`
    })
  } else {
    // Fallback to all sections if no pages defined
    content.sections.forEach((section: any) => {
      html += `    <section class="my-8">
      <div class="relative">
`

      // Generate HTML for each element in the section
      if (section.elements && section.elements.length) {
        section.elements.forEach((element: any) => {
          html += generateElementHtml(element, 8)
        })
      }

      html += `      </div>
    </section>
`
    })
  }

  // Add the Displan logo footer if requested
  if (includeLogo) {
    html += `    <footer class="displan-footer">
      <a href="https://www.displan.design" target="_blank" rel="noopener noreferrer">
        <img src="https://www.displan.design/logo.png" alt="Displan" /> 
        Built with Displan
      </a>
    </footer>
`
  }

  html += `  </div>
</body>
</html>`

  return html
}

// Generate HTML for a single element
function generateElementHtml(element: any, indentLevel: number): string {
  const indent = " ".repeat(indentLevel)
  let code = ""

  // Position styles
  const positionStyle =
    element.style.x !== undefined && element.style.y !== undefined
      ? `position: absolute; left: ${element.style.x}px; top: ${element.style.y}px;`
      : ""

  // Size styles
  const sizeStyle =
    element.style.width || element.style.height
      ? `${element.style.width ? `width: ${element.style.width};` : ""} ${element.style.height ? `height: ${element.style.height};` : ""}`
      : ""

  // Combined inline style
  const inlineStyle = positionStyle || sizeStyle ? ` style="${positionStyle} ${sizeStyle}"` : ""

  switch (element.type) {
    case "heading":
      const HeadingTag = `h${element.content?.level || 2}`
      code += `${indent}<${HeadingTag} class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || "Heading"}</${HeadingTag}>\n`
      break
    case "paragraph":
      code += `${indent}<p class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || "Paragraph text"}</p>\n`
      break
    case "image":
      code += `${indent}<img src="${element.content?.src || "/placeholder.svg"}" alt="${element.content?.alt || ""}" class="${getStyleClasses(element.style, true)}"${inlineStyle} />\n`
      break
    case "button":
      code += `${indent}<button class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.buttonText || "Button"}</button>\n`
      break
    case "container":
      code += `${indent}<div class="${getStyleClasses(element.style, true)}"${inlineStyle}>\n`
      if (element.children && element.children.length) {
        element.children.forEach((child: any) => {
          code += generateElementHtml(child, indentLevel + 2)
        })
      }
      code += `${indent}</div>\n`
      break
    default:
      code += `${indent}<div class="${getStyleClasses(element.style, true)}"${inlineStyle}>${element.content?.text || ""}</div>\n`
  }

  return code
}

// Get style classes
function getStyleClasses(style: Record<string, any> | undefined, isHtml = false): string {
  if (!style) return ""

  const classes = []

  // Map some common style properties to Tailwind classes
  if (style.color) classes.push(`text-${style.color}`)
  if (style.backgroundColor) classes.push(`bg-${style.backgroundColor}`)
  if (style.fontSize) classes.push(`text-${style.fontSize}`)
  if (style.fontWeight) classes.push(`font-${style.fontWeight}`)
  if (style.textAlign) classes.push(`text-${style.textAlign}`)
  if (style.padding) classes.push(`p-${style.padding}`)
  if (style.margin) classes.push(`m-${style.margin}`)
  if (style.borderRadius) classes.push(`rounded-${style.borderRadius}`)

  return classes.join(" ")
}
