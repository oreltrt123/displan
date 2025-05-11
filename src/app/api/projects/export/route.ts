import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { projectId, format } = body

    if (!projectId || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the project data
    const { data: project, error: projectError } = await supabase
      .from("website_projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found or you don't have access to it" }, { status: 404 })
    }

    // Generate the code based on format
    let code = ""

    if (format === "typescript") {
      code = generateTypeScriptCode(project)
    } else if (format === "javascript") {
      code = generateJavaScriptCode(project)
    } else if (format === "html") {
      code = generateHtmlCode(project)
    } else {
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }

    // Return the generated code
    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error exporting project:", error)
    return NextResponse.json({ error: "Failed to export project" }, { status: 500 })
  }
}

// Helper functions to generate code
function generateTypeScriptCode(project: any): string {
  let code = `// TypeScript export of ${project.name}\n\n`
  code += `import React from 'react';\n\n`
  code += `export default function ${formatComponentName(project.name)}() {\n`
  code += `  return (\n`
  code += `    <div className="container mx-auto">\n`

  // Generate code for each section
  if (project.content && project.content.sections) {
    project.content.sections.forEach((section: any) => {
      code += `      <section className="my-8">\n`
      code += `        <h2 className="text-2xl font-bold mb-4">${section.name}</h2>\n`

      // Generate code for each element in the section
      if (section.elements && section.elements.length) {
        section.elements.forEach((element: any) => {
          code += generateElementCode(element, 8)
        })
      }

      code += `      </section>\n`
    })
  }

  code += `    </div>\n`
  code += `  );\n`
  code += `}\n`

  return code
}

function generateJavaScriptCode(project: any): string {
  // Convert TypeScript code to JavaScript (simplified)
  const tsCode = generateTypeScriptCode(project)
  return tsCode.replace(/: [a-zA-Z<>[\]]+/g, "")
}

function generateHtmlCode(project: any): string {
  let code = `<!DOCTYPE html>\n`
  code += `<html lang="en">\n`
  code += `<head>\n`
  code += `  <meta charset="UTF-8">\n`
  code += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`
  code += `  <title>${project.name}</title>\n`
  code += `  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">\n`
  code += `</head>\n`
  code += `<body>\n`
  code += `  <div class="container mx-auto">\n`

  // Generate HTML for each section
  if (project.content && project.content.sections) {
    project.content.sections.forEach((section: any) => {
      code += `    <section class="my-8">\n`
      code += `      <h2 class="text-2xl font-bold mb-4">${section.name}</h2>\n`

      // Generate HTML for each element in the section
      if (section.elements && section.elements.length) {
        section.elements.forEach((element: any) => {
          code += generateElementHtml(element, 6)
        })
      }

      code += `    </section>\n`
    })
  }

  code += `  </div>\n`
  code += `</body>\n`
  code += `</html>`

  return code
}

function generateElementCode(element: any, indentLevel: number): string {
  const indent = " ".repeat(indentLevel)
  let code = ""

  switch (element.type) {
    case "heading":
      const HeadingTag = `h${element.content?.level || 2}`
      code += `${indent}<${HeadingTag} className="${getStyleClasses(element.style)}">${element.content?.text || "Heading"}</${HeadingTag}>\n`
      break
    case "paragraph":
      code += `${indent}<p className="${getStyleClasses(element.style)}">${element.content?.text || "Paragraph text"}</p>\n`
      break
    case "image":
      code += `${indent}<img src="${element.content?.src || "/placeholder.svg"}" alt="${element.content?.alt || ""}" className="${getStyleClasses(element.style)}" />\n`
      break
    case "button":
      code += `${indent}<button className="${getStyleClasses(element.style)}">${element.content?.buttonText || "Button"}</button>\n`
      break
    case "container":
      code += `${indent}<div className="${getStyleClasses(element.style)}">\n`
      if (element.children && element.children.length) {
        element.children.forEach((child: any) => {
          code += generateElementCode(child, indentLevel + 2)
        })
      }
      code += `${indent}</div>\n`
      break
    default:
      code += `${indent}<div className="${getStyleClasses(element.style)}">${element.content?.text || ""}</div>\n`
  }

  return code
}

function generateElementHtml(element: any, indentLevel: number): string {
  const indent = " ".repeat(indentLevel)
  let code = ""

  switch (element.type) {
    case "heading":
      const HeadingTag = `h${element.content?.level || 2}`
      code += `${indent}<${HeadingTag} class="${getStyleClasses(element.style, true)}">${element.content?.text || "Heading"}</${HeadingTag}>\n`
      break
    case "paragraph":
      code += `${indent}<p class="${getStyleClasses(element.style, true)}">${element.content?.text || "Paragraph text"}</p>\n`
      break
    case "image":
      code += `${indent}<img src="${element.content?.src || "/placeholder.svg"}" alt="${element.content?.alt || ""}" class="${getStyleClasses(element.style, true)}" />\n`
      break
    case "button":
      code += `${indent}<button class="${getStyleClasses(element.style, true)}">${element.content?.buttonText || "Button"}</button>\n`
      break
    case "container":
      code += `${indent}<div class="${getStyleClasses(element.style, true)}">\n`
      if (element.children && element.children.length) {
        element.children.forEach((child: any) => {
          code += generateElementHtml(child, indentLevel + 2)
        })
      }
      code += `${indent}</div>\n`
      break
    default:
      code += `${indent}<div class="${getStyleClasses(element.style, true)}">${element.content?.text || ""}</div>\n`
  }

  return code
}

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

function formatComponentName(name: string): string {
  // Remove non-alphanumeric characters and convert to PascalCase
  return name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}
