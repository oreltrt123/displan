export interface KnowledgeEntry {
  keywords: string[]
  response: string
}

export const displanKnowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["displan", "website builder", "platform"],
    response:
      "Displan is a powerful website builder platform that allows users to create professional websites with an intuitive drag-and-drop interface. It features a canvas-based editor where you can add various elements like text, buttons, images, and pre-designed templates. The platform is designed to be user-friendly while offering advanced customization options for more experienced users.",
  },
  {
    keywords: ["add element", "create element", "new element"],
    response:
      "To add elements to your canvas in Displan, you can either use the Elements panel in the left sidebar or ask me to create them for you. For example, you can say 'Add a red button with rounded corners' or 'Create a heading that says Welcome'. I'll create the element and add it to your current canvas.",
  },
  {
    keywords: ["button", "create button", "add button"],
    response:
      "Buttons are interactive elements that users can click to perform actions. In Displan, you can create buttons with various styles, colors, and sizes. You can customize properties like background color, text color, border radius, and animations. To add a button, you can ask me something like 'Add a blue button with rounded corners that says Submit'.",
  },
  {
    keywords: ["text", "heading", "paragraph", "add text"],
    response:
      "Text elements are essential for conveying information on your website. In Displan, you can add different types of text elements like headings, paragraphs, and labels. You can customize properties like font size, color, weight, and alignment. To add text, you can ask me something like 'Add a large heading that says Welcome to my Website' or 'Create a paragraph with gray text'.",
  },
  {
    keywords: ["image", "picture", "photo", "add image"],
    response:
      "Images help make your website visually appealing. In Displan, you can add image elements and customize their size, border, and other properties. You can upload your own images or use placeholder images. To add an image, you can ask me something like 'Add an image placeholder 300x200' or 'Create an image with rounded corners'.",
  },
  {
    keywords: ["template", "section", "component", "add template"],
    response:
      "Templates are pre-designed sections that you can add to your website. Displan offers various templates for common website sections like headers, heroes, features, testimonials, pricing, and more. You can customize these templates to match your brand. To add a template, you can ask me something like 'Add a hero section template' or 'Create a pricing section'.",
  },
  {
    keywords: ["style", "design", "customize", "appearance"],
    response:
      "Styling elements in Displan is easy. You can customize properties like colors, fonts, borders, shadows, and more. Each element has its own set of customizable properties that you can adjust in the Properties panel on the right sidebar. You can also ask me to create elements with specific styles, like 'Add a button with blue background and white text'.",
  },
  {
    keywords: ["animation", "animate", "motion", "transition"],
    response:
      "Animations can make your website more engaging. Displan supports various animations like fade in, slide in, bounce, zoom, rotate, and more. You can add animations to any element by selecting it and choosing an animation from the Properties panel. You can also ask me to create elements with specific animations, like 'Add a heading with fade in animation'.",
  },
  {
    keywords: ["responsive", "mobile", "tablet", "desktop"],
    response:
      "Displan creates responsive websites that look great on all devices. Elements automatically adjust to different screen sizes, but you can also customize how they appear on specific devices. You can preview your website in different device modes using the device selector in the toolbar. For best results, use relative units and flexible layouts when positioning elements.",
  },
  {
    keywords: ["save", "publish", "export", "download"],
    response:
      "To save your work in Displan, click the Save button in the top bar. Your changes will be automatically saved to your project. To publish your website, click the Publish button in the top right corner. This will make your website live and accessible to others. You can also export your project as HTML/CSS/JS files for hosting elsewhere.",
  },
  {
    keywords: ["page", "create page", "add page", "new page"],
    response:
      "In Displan, you can create multiple pages for your website. To create a new page, click the '+' button next to 'Pages' in the left sidebar, then select 'New Page' and enter a name. You can also create folders to organize your pages. Each page has its own canvas where you can add and arrange elements independently.",
  },
  {
    keywords: ["comment", "feedback", "note", "add comment"],
    response:
      "Comments are useful for collaboration and leaving notes for yourself or team members. To add a comment in Displan, select the Comment tool from the toolbar, then click anywhere on the canvas where you want to add the comment. Type your message and press Enter. Comments are visible to all project collaborators but won't appear on the published website.",
  },
  {
    keywords: ["preview", "view", "test", "preview mode"],
    response:
      "To preview your website as visitors will see it, click the Eye icon in the top bar to enter Preview mode. In this mode, you can interact with buttons and links as they would work on the live site. To exit Preview mode, click the Eye icon again. Preview mode is useful for testing your website's functionality before publishing.",
  },
  {
    keywords: ["zoom", "scale", "resize", "zoom in", "zoom out"],
    response:
      "You can zoom in and out of the canvas to focus on details or get a broader view of your layout. Use the zoom controls in the bottom toolbar to adjust the zoom level. You can also use keyboard shortcuts: Ctrl/Cmd + '+' to zoom in, Ctrl/Cmd + '-' to zoom out, and Ctrl/Cmd + '0' to reset zoom to 100%.",
  },
  {
    keywords: ["dark mode", "light mode", "theme", "toggle dark mode"],
    response:
      "Displan supports both light and dark modes for the editor interface. You can toggle between them by clicking the sun/moon icon in the bottom toolbar. This only affects the editor interface, not your website. To create a dark mode for your website, you'll need to add appropriate styles to your elements.",
  },
  {
    keywords: ["help", "tutorial", "guide", "documentation"],
    response:
      "For help with using Displan, you can ask me specific questions about features or functionality. I can guide you through various tasks and provide tips for creating better websites. You can also check the official documentation by clicking the Help icon in the bottom toolbar.",
  },
]
