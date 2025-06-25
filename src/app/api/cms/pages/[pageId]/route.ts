import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const collectionSlug = searchParams.get("collection_slug")
    const entrySlug = searchParams.get("entry_slug")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Here you would typically query your database using the enhanced schema
    // For now, returning enhanced mock data that matches the canvas integration
    const mockPageData = {
      page_id: params.pageId,
      project_id: projectId,
      page_title: entrySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Sample Page",
      page_slug: entrySlug,
      page_status: "published",
      collection_name: collectionSlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Collection",
      canvas_elements: [
        {
          id: `title-${params.pageId}`,
          type: "text",
          x: 200,
          y: 100,
          width: 800,
          height: 80,
          content: entrySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Sample Page Title",
          styles: {
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1a1a1a",
            textAlign: "left",
            lineHeight: "1.2",
          },
        },
        {
          id: `featured-image-${params.pageId}`,
          type: "image",
          x: 200,
          y: 220,
          width: 800,
          height: 400,
          src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
          alt: "Featured image",
          styles: {
            objectFit: "cover",
            borderRadius: "8px",
          },
        },
        {
          id: `content-${params.pageId}`,
          type: "rich-text",
          x: 200,
          y: 670,
          width: 800,
          height: 600,
          content: `
            <h2>Welcome to ${entrySlug?.replace(/-/g, " ")}</h2>
            <p>This is a <strong>dynamically generated canvas page</strong> from your CMS content! All the images, videos, text, and other elements you add in the CMS will appear here automatically positioned and styled.</p>
            
            <h3>Key Features</h3>
            <ul>
              <li><strong>Automatic positioning</strong> - Elements are intelligently placed</li>
              <li><em>Rich content support</em> - Images, videos, code blocks, tables</li>
              <li>Responsive design with proper spacing</li>
              <li>Custom styling and themes</li>
            </ul>
            
            <blockquote>
              <p>"Your CMS content becomes beautiful canvas pages automatically!"</p>
            </blockquote>
            
            <p>This content was created in the CMS and is now displaying as a fully functional canvas page with proper positioning, styling, and interactivity.</p>
          `,
          styles: {
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#333333",
          },
        },
        {
          id: `video-${params.pageId}`,
          type: "video",
          x: 200,
          y: 1320,
          width: 800,
          height: 400,
          src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          controls: true,
          styles: {
            borderRadius: "8px",
          },
        },
        {
          id: `code-${params.pageId}`,
          type: "code-block",
          x: 200,
          y: 1770,
          width: 800,
          height: 300,
          language: "javascript",
          code: `// Example: CMS to Canvas Integration
function generateCanvasPage(cmsEntry) {
  const elements = [];
  let yPosition = 100;
  
  // Add title
  elements.push({
    type: "text",
    content: cmsEntry.title,
    x: 200, y: yPosition,
    width: 800, height: 80,
    styles: { fontSize: "32px", fontWeight: "bold" }
  });
  
  // Add media elements
  cmsEntry.media.forEach(media => {
    yPosition += 150;
    elements.push({
      type: media.type,
      src: media.url,
      x: 200, y: yPosition,
      width: 800, height: 400
    });
  });
  
  return elements;
}`,
          title: "Canvas Generation Code",
          showLineNumbers: true,
          theme: "dark",
          styles: {
            borderRadius: "8px",
            border: "1px solid #e1e5e9",
          },
        },
        {
          id: `table-${params.pageId}`,
          type: "table",
          x: 200,
          y: 2120,
          width: 800,
          height: 250,
          tableData: {
            headers: ["Element Type", "Auto Position", "Styling", "Responsive"],
            rows: [
              ["Text", "Yes", "Custom fonts & colors", "Yes"],
              ["Image", "Yes", "Object fit & borders", "Yes"],
              ["Video", "Yes", "Controls & autoplay", "Yes"],
              ["Code Block", "Yes", "Syntax highlighting", "Yes"],
              ["Table", "Yes", "Custom borders", "Yes"],
            ],
          },
          caption: "CMS Element Features",
          styles: {
            borderRadius: "8px",
            border: "1px solid #e1e5e9",
          },
        },
      ],
      canvas_elements_detailed: [
        {
          id: `title-${params.pageId}`,
          type: "text",
          data: {
            content: entrySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Sample Page Title",
            styles: {
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
              textAlign: "left",
              lineHeight: "1.2",
            },
          },
          position: { x: 200, y: 100 },
          size: { width: 800, height: 80 },
          order: 1,
        },
        {
          id: `featured-image-${params.pageId}`,
          type: "image",
          data: {
            src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
            alt: "Featured image",
            styles: {
              objectFit: "cover",
              borderRadius: "8px",
            },
          },
          position: { x: 200, y: 220 },
          size: { width: 800, height: 400 },
          order: 2,
        },
      ],
      entry_data: {
        id: `entry-${params.pageId}`,
        title: entrySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Sample Page",
        content: "Rich HTML content from CMS",
        excerpt: "This is a sample CMS page demonstrating canvas integration",
        featured_image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
        date: new Date().toISOString().split("T")[0],
        reading_time: 5,
        word_count: 350,
        tags: ["cms", "canvas", "integration"],
        categories: ["Technology", "Development"],
      },
    }

    return NextResponse.json(mockPageData)
  } catch (error) {
    console.error("Error fetching CMS page data:", error)
    return NextResponse.json({ error: "Failed to fetch page data" }, { status: 500 })
  }
}
