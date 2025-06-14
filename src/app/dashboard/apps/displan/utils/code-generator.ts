"use client"

interface CanvasElement {
  id: string
  type: string
  content?: string
  styles?: any
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  src?: string
  alt?: string
  href?: string
  [key: string]: any
}

interface GenerateOptions {
  elements: CanvasElement[]
  canvasWidth: number
  canvasHeight: number
  projectId: string
}

export class CodeGenerator {
  private elements: CanvasElement[] = []
  private canvasWidth = 1200
  private canvasHeight = 800
  private projectId = "project"

  async generateAllFormats(options: GenerateOptions) {
    this.elements = options.elements || []
    this.canvasWidth = options.canvasWidth || 1200
    this.canvasHeight = options.canvasHeight || 800
    this.projectId = options.projectId || "project"

    console.log("🏗️ Generating code for:", {
      elements: this.elements.length,
      canvasSize: `${this.canvasWidth}x${this.canvasHeight}`,
      projectId: this.projectId,
    })

    // If no elements, generate empty template
    if (this.elements.length === 0) {
      return this.generateEmptyTemplate()
    }

    return {
      html: this.generateHTML(),
      css: this.generateCSS(),
      react: this.generateReact(),
      typescript: this.generateTypeScript(),
      javascript: this.generateJavaScript(),
      vue: this.generateVue(),
      angular: this.generateAngular(),
    }
  }

  private generateEmptyTemplate() {
    const emptyMessage = "<!-- Add elements to your canvas to generate code -->"
    const emptyCSS = `/* Add elements to your canvas to generate styles */
.canvas-container {
    position: relative;
    width: ${this.canvasWidth}px;
    height: ${this.canvasHeight}px;
    margin: 0 auto;
    background: #ffffff;
    border: 2px dashed #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.canvas-container::before {
    content: "Your canvas is empty. Add some elements to generate code!";
    font-size: 18px;
    text-align: center;
}`

    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.projectId}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="canvas-container">
        ${emptyMessage}
    </div>
</body>
</html>`,
      css: emptyCSS,
      react: `import React from 'react';
import './styles.css';

const ${this.toPascalCase(this.projectId)}Component = () => {
  return (
    <div className="canvas-container">
      {/* Add elements to your canvas to generate code */}
    </div>
  );
};

export default ${this.toPascalCase(this.projectId)}Component;`,
      typescript: `import React from 'react';
import './styles.css';

interface ${this.toPascalCase(this.projectId)}Props {
  className?: string;
  style?: React.CSSProperties;
}

const ${this.toPascalCase(this.projectId)}Component: React.FC<${this.toPascalCase(this.projectId)}Props> = ({ 
  className = '', 
  style = {} 
}) => {
  return (
    <div className={\`canvas-container \${className}\`} style={style}>
      {/* Add elements to your canvas to generate code */}
    </div>
  );
};

export default ${this.toPascalCase(this.projectId)}Component;`,
      javascript: `// Generated JavaScript for ${this.projectId}
class ${this.toPascalCase(this.projectId)}Component {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    this.container.innerHTML = \`
      <div class="canvas-container">
        <!-- Add elements to your canvas to generate code -->
      </div>
    \`;
  }
}

// Usage: new ${this.toPascalCase(this.projectId)}Component('app');`,
      vue: `<template>
  <div class="canvas-container">
    <!-- Add elements to your canvas to generate code -->
  </div>
</template>

<script>
export default {
  name: '${this.toPascalCase(this.projectId)}Component',
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
${emptyCSS}
</style>`,
      angular: `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${this.toKebabCase(this.projectId)}',
  template: \`
    <div class="canvas-container" [ngClass]="className">
      <!-- Add elements to your canvas to generate code -->
    </div>
  \`,
  styleUrls: ['./styles.css']
})
export class ${this.toPascalCase(this.projectId)}Component {
  @Input() className: string = '';
}`,
    }
  }

  private generateHTML(): string {
    const elementsHTML = this.elements.map((element) => this.elementToHTML(element)).join("\n    ")

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.projectId}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="canvas-container">
        ${elementsHTML}
    </div>
</body>
</html>`
  }

  private generateCSS(): string {
    let css = `/* Generated CSS for ${this.projectId} */
.canvas-container {
    position: relative;
    width: ${this.canvasWidth}px;
    height: ${this.canvasHeight}px;
    margin: 0 auto;
    background: #ffffff;
    overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
    .canvas-container {
        width: 100%;
        height: auto;
        min-height: 100vh;
    }
    
    .element {
        position: relative !important;
        left: auto !important;
        top: auto !important;
        margin: 10px;
    }
}

`

    this.elements.forEach((element) => {
      css += this.generateElementCSS(element)
    })

    return css
  }

  private generateReact(): string {
    const elementsJSX = this.elements.map((element) => this.elementToReact(element)).join("\n      ")

    return `import React from 'react';
import './styles.css';

const ${this.toPascalCase(this.projectId)}Component = () => {
  return (
    <div className="canvas-container">
      ${elementsJSX}
    </div>
  );
};

export default ${this.toPascalCase(this.projectId)}Component;`
  }

  private generateTypeScript(): string {
    const elementsJSX = this.elements.map((element) => this.elementToReact(element)).join("\n      ")

    return `import React from 'react';
import './styles.css';

interface ${this.toPascalCase(this.projectId)}Props {
  className?: string;
  style?: React.CSSProperties;
}

const ${this.toPascalCase(this.projectId)}Component: React.FC<${this.toPascalCase(this.projectId)}Props> = ({ 
  className = '', 
  style = {} 
}) => {
  return (
    <div className={\`canvas-container \${className}\`} style={style}>
      ${elementsJSX}
    </div>
  );
};

export default ${this.toPascalCase(this.projectId)}Component;`
  }

  private generateJavaScript(): string {
    const elementsJS = this.elements.map((element) => this.elementToJS(element)).join("\n    ")

    return `// Generated JavaScript for ${this.projectId}
class ${this.toPascalCase(this.projectId)}Component {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    this.container.innerHTML = \`
      <div class="canvas-container">
        ${elementsJS}
      </div>
    \`;
    
    this.attachEventListeners();
  }
  
  attachEventListeners() {
    // Add event listeners for interactive elements
    const buttons = this.container.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        console.log('Button clicked:', e.target.textContent);
      });
    });
  }
}

// Usage: new ${this.toPascalCase(this.projectId)}Component('app');`
  }

  private generateVue(): string {
    const elementsVue = this.elements.map((element) => this.elementToVue(element)).join("\n      ")

    return `<template>
  <div class="canvas-container">
    ${elementsVue}
  </div>
</template>

<script>
export default {
  name: '${this.toPascalCase(this.projectId)}Component',
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(event) {
      console.log('Element clicked:', event.target);
    }
  }
}
</script>

<style scoped>
${this.generateCSS()}
</style>`
  }

  private generateAngular(): string {
    const elementsAngular = this.elements.map((element) => this.elementToAngular(element)).join("\n      ")

    return `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${this.toKebabCase(this.projectId)}',
  template: \`
    <div class="canvas-container" [ngClass]="className">
      ${elementsAngular}
    </div>
  \`,
  styleUrls: ['./styles.css']
})
export class ${this.toPascalCase(this.projectId)}Component {
  @Input() className: string = '';
  
  handleClick(event: Event) {
    console.log('Element clicked:', event.target);
  }
}`
  }

  private elementToHTML(element: CanvasElement): string {
    const id = `element-${element.id}`
    const className = `element element-${element.type}`

    switch (element.type) {
      case "text":
        return `<div id="${id}" class="${className}">${this.escapeHtml(element.content || "Text")}</div>`
      case "button":
        return `<button id="${id}" class="${className}">${this.escapeHtml(element.content || "Button")}</button>`
      case "image":
        return `<img id="${id}" class="${className}" src="${element.src || "/placeholder.jpg"}" alt="${this.escapeHtml(element.alt || "Image")}" />`
      case "link":
        return `<a id="${id}" class="${className}" href="${element.href || "#"}">${this.escapeHtml(element.content || "Link")}</a>`
      default:
        return `<div id="${id}" class="${className}">${this.escapeHtml(element.content || "")}</div>`
    }
  }

  private elementToReact(element: CanvasElement): string {
    const className = `element element-${element.type}`

    switch (element.type) {
      case "text":
        return `<div className="${className}">${element.content || "Text"}</div>`
      case "button":
        return `<button className="${className}" onClick={() => console.log('Button clicked')}>${element.content || "Button"}</button>`
      case "image":
        return `<img className="${className}" src="${element.src || "/placeholder.jpg"}" alt="${element.alt || "Image"}" />`
      case "link":
        return `<a className="${className}" href="${element.href || "#"}">${element.content || "Link"}</a>`
      default:
        return `<div className="${className}">${element.content || ""}</div>`
    }
  }

  private elementToJS(element: CanvasElement): string {
    const className = `element element-${element.type}`

    switch (element.type) {
      case "text":
        return `<div class="${className}">${this.escapeHtml(element.content || "Text")}</div>`
      case "button":
        return `<button class="${className}">${this.escapeHtml(element.content || "Button")}</button>`
      case "image":
        return `<img class="${className}" src="${element.src || "/placeholder.jpg"}" alt="${this.escapeHtml(element.alt || "Image")}" />`
      case "link":
        return `<a class="${className}" href="${element.href || "#"}">${this.escapeHtml(element.content || "Link")}</a>`
      default:
        return `<div class="${className}">${this.escapeHtml(element.content || "")}</div>`
    }
  }

  private elementToVue(element: CanvasElement): string {
    const className = `element element-${element.type}`

    switch (element.type) {
      case "text":
        return `<div class="${className}">{{ '${element.content || "Text"}' }}</div>`
      case "button":
        return `<button class="${className}" @click="handleClick">${element.content || "Button"}</button>`
      case "image":
        return `<img class="${className}" src="${element.src || "/placeholder.jpg"}" alt="${element.alt || "Image"}" />`
      case "link":
        return `<a class="${className}" href="${element.href || "#"}">${element.content || "Link"}</a>`
      default:
        return `<div class="${className}">${element.content || ""}</div>`
    }
  }

  private elementToAngular(element: CanvasElement): string {
    const className = `element element-${element.type}`

    switch (element.type) {
      case "text":
        return `<div class="${className}">${element.content || "Text"}</div>`
      case "button":
        return `<button class="${className}" (click)="handleClick($event)">${element.content || "Button"}</button>`
      case "image":
        return `<img class="${className}" src="${element.src || "/placeholder.jpg"}" alt="${element.alt || "Image"}" />`
      case "link":
        return `<a class="${className}" href="${element.href || "#"}">${element.content || "Link"}</a>`
      default:
        return `<div class="${className}">${element.content || ""}</div>`
    }
  }

  private generateElementCSS(element: CanvasElement): string {
    const selector = `#element-${element.id}`
    const position = element.position || { x: 0, y: 0 }
    const size = element.size || { width: 100, height: 50 }
    const styles = element.styles || {}

    let css = `${selector} {
    position: absolute;
    left: ${position.x}px;
    top: ${position.y}px;
    width: ${size.width}px;
    height: ${size.height}px;`

    // Add custom styles
    Object.entries(styles).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      css += `\n    ${cssKey}: ${value};`
    })

    // Add default styles based on element type
    switch (element.type) {
      case "text":
        css += `\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    word-wrap: break-word;`
        break
      case "button":
        css += `\n    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;`
        break
      case "image":
        css += `\n    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);`
        break
      case "link":
        css += `\n    color: #007bff;
    text-decoration: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;`
        break
    }

    css += "\n}\n\n"

    // Add hover states
    if (element.type === "button") {
      css += `${selector}:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}\n\n`
    }

    if (element.type === "link") {
      css += `${selector}:hover {
    color: #0056b3;
    text-decoration: underline;
}\n\n`
    }

    return css
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[-_])(\w)/g, (_, char) => char.toUpperCase())
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")
  }
}
