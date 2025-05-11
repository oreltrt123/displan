// This service handles the export functionality for the website builder

// Types for export formats
export type ExportFormat = "typescript" | "javascript" | "html"

// Interface for project content
export interface ProjectContent {
  sections: any[]
  globalStyles: Record<string, any>
}

// Interface for project data
export interface ProjectData {
  id: string
  name: string
  content: ProjectContent
}

/**
 * Generates code based on the project data and selected format
 */
export const generateCode = (project: ProjectData, format: ExportFormat): string => {
  switch (format) {
    case "typescript":
      return generateTypeScriptCode(project)
    case "javascript":
      return generateJavaScriptCode(project)
    case "html":
      return generateHtmlCode(project)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

/**
 * Downloads the generated code as a file
 */
export const downloadCode = (project: ProjectData, format: ExportFormat): void => {
  const code = generateCode(project, format)
  const fileName = getFileName(project.name, format)
  const blob = new Blob([code], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Uploads the generated code as a repository project
 */
export const uploadAsRepository = async (
  project: ProjectData,
  format: ExportFormat,
  userId: string,
): Promise<{ success: boolean; projectId?: string; error?: string }> => {
  try {
    // Generate the code
    const code = generateCode(project, format)

    // Create a new repository project
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${project.name}-export`,
        description: `Exported from Website Builder: ${project.name}`,
        visibility: "private",
        owner_id: userId,
        files: generateProjectFiles(project, format),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create repository project")
    }

    const data = await response.json()
    return { success: true, projectId: data.id }
  } catch (error) {
    console.error("Error uploading as repository:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Helper functions

/**
 * Generates TypeScript code for the project
 */
const generateTypeScriptCode = (project: ProjectData): string => {
  // This is a simplified implementation
  // In a real application, you would generate actual TypeScript code based on the project structure

  let code = `// TypeScript export of ${project.name}\n\n`
  code += `import React from 'react';\n\n`
  code += `export default function ${formatComponentName(project.name)}() {\n`
  code += `  return (\n`
  code += `    <div className="container mx-auto">\n`

  // Generate code for each section
  project.content.sections.forEach((section) => {
    code += `      <section className="my-8">\n`
    code += `        <h2 className="text-2xl font-bold mb-4">${section.name}</h2>\n`

    // Generate code for each element in the section
    section.elements.forEach((element) => {
      code += generateElementCode(element, 8)
    })

    code += `      </section>\n`
  })

  code += `    </div>\n`
  code += `  );\n`
  code += `}\n`

  return code
}

/**
 * Generates JavaScript code for the project
 */
const generateJavaScriptCode = (project: ProjectData): string => {
  // Convert TypeScript code to JavaScript (simplified)
  const tsCode = generateTypeScriptCode(project)
  return tsCode.replace(/: [a-zA-Z<>[\]]+/g, "")
}

/**
 * Generates HTML code for the project
 */
const generateHtmlCode = (project: ProjectData): string => {
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
  project.content.sections.forEach((section) => {
    code += `    <section class="my-8">\n`
    code += `      <h2 class="text-2xl font-bold mb-4">${section.name}</h2>\n`

    // Generate HTML for each element in the section
    section.elements.forEach((element) => {
      code += generateElementHtml(element, 6)
    })

    code += `    </section>\n`
  })

  code += `  </div>\n`
  code += `</body>\n`
  code += `</html>`

  return code
}

/**
 * Generates code for a single element
 */
const generateElementCode = (element: any, indentLevel: number): string => {
  const indent = " ".repeat(indentLevel)
  let code = ""

  switch (element.type) {
    case "heading":
      const HeadingTag = `h${element.content.level || 2}`
      code += `${indent}<${HeadingTag} className="${getStyleClasses(element.style)}">${element.content.text || "Heading"}</${HeadingTag}>\n`
      break
    case "paragraph":
      code += `${indent}<p className="${getStyleClasses(element.style)}">${element.content.text || "Paragraph text"}</p>\n`
      break
    case "image":
      code += `${indent}<img src="${element.content.src || "/placeholder.svg"}" alt="${element.content.alt || ""}" className="${getStyleClasses(element.style)}" />\n`
      break
    case "button":
      code += `${indent}<button className="${getStyleClasses(element.style)}">${element.content.buttonText || "Button"}</button>\n`
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

/**
 * Generates HTML for a single element
 */
const generateElementHtml = (element: any, indentLevel: number): string => {
  const indent = " ".repeat(indentLevel)
  let code = ""

  switch (element.type) {
    case "heading":
      const HeadingTag = `h${element.content.level || 2}`
      code += `${indent}<${HeadingTag} class="${getStyleClasses(element.style, true)}">${element.content.text || "Heading"}</${HeadingTag}>\n`
      break
    case "paragraph":
      code += `${indent}<p class="${getStyleClasses(element.style, true)}">${element.content.text || "Paragraph text"}</p>\n`
      break
    case "image":
      code += `${indent}<img src="${element.content.src || "/placeholder.svg"}" alt="${element.content.alt || ""}" class="${getStyleClasses(element.style, true)}" />\n`
      break
    case "button":
      code += `${indent}<button class="${getStyleClasses(element.style, true)}">${element.content.buttonText || "Button"}</button>\n`
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

/**
 * Converts style object to className string
 */
const getStyleClasses = (style: Record<string, any>, isHtml = false): string => {
  // This is a simplified implementation
  // In a real application, you would convert style properties to appropriate Tailwind classes

  const classAttr = isHtml ? "class" : "className"

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

/**
 * Formats project name as a valid component name
 */
const formatComponentName = (name: string): string => {
  // Remove non-alphanumeric characters and convert to PascalCase
  return name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

/**
 * Gets the appropriate file name based on format
 */
const getFileName = (projectName: string, format: ExportFormat): string => {
  const sanitizedName = projectName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

  switch (format) {
    case "typescript":
      return `${sanitizedName}.tsx`
    case "javascript":
      return `${sanitizedName}.jsx`
    case "html":
      return `${sanitizedName}.html`
    default:
      return `${sanitizedName}.txt`
  }
}

/**
 * Generates files for the repository project
 */
const generateProjectFiles = (project: ProjectData, format: ExportFormat): Array<{ name: string; content: string }> => {
  const files = []

  switch (format) {
    case "typescript":
      // Add main component file
      files.push({
        name: `${formatComponentName(project.name)}.tsx`,
        content: generateTypeScriptCode(project),
      })

      // Add package.json
      files.push({
        name: "package.json",
        content: JSON.stringify(
          {
            name: project.name.toLowerCase().replace(/\s+/g, "-"),
            version: "1.0.0",
            private: true,
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              next: "^13.4.0",
              typescript: "^5.0.0",
            },
          },
          null,
          2,
        ),
      })

      // Add tsconfig.json
      files.push({
        name: "tsconfig.json",
        content: JSON.stringify(
          {
            compilerOptions: {
              target: "es5",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              strict: true,
              forceConsistentCasingInFileNames: true,
              noEmit: true,
              esModuleInterop: true,
              module: "esnext",
              moduleResolution: "node",
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: "preserve",
              incremental: true,
            },
            include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
            exclude: ["node_modules"],
          },
          null,
          2,
        ),
      })

      // Add README.md
      files.push({
        name: "README.md",
        content: `# ${project.name}\n\nThis project was exported from the Website Builder.\n\n## Getting Started\n\n1. Install dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n2. Run the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n3. Open [http://localhost:3000](http://localhost:3000) in your browser.\n`,
      })
      break

    case "javascript":
      // Add main component file
      files.push({
        name: `${formatComponentName(project.name)}.jsx`,
        content: generateJavaScriptCode(project),
      })

      // Add package.json
      files.push({
        name: "package.json",
        content: JSON.stringify(
          {
            name: project.name.toLowerCase().replace(/\s+/g, "-"),
            version: "1.0.0",
            private: true,
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              next: "^13.4.0",
            },
          },
          null,
          2,
        ),
      })

      // Add README.md
      files.push({
        name: "README.md",
        content: `# ${project.name}\n\nThis project was exported from the Website Builder.\n\n## Getting Started\n\n1. Install dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n2. Run the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n3. Open [http://localhost:3000](http://localhost:3000) in your browser.\n`,
      })
      break

    case "html":
      // Add HTML file
      files.push({
        name: "index.html",
        content: generateHtmlCode(project),
      })

      // Add README.md
      files.push({
        name: "README.md",
        content: `# ${project.name}\n\nThis project was exported from the Website Builder as a static HTML file.\n\n## Getting Started\n\nSimply open the index.html file in your browser to view the website.\n`,
      })
      break
  }

  return files
}
