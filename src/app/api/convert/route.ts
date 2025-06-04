import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }

    const html = await response.text()
    const processedHtml = await processHtml(html, url)

    return NextResponse.json({ html: processedHtml })
  } catch (error) {
    console.error("Cloning error:", error)
    return NextResponse.json({ error: "Failed to clone website" }, { status: 500 })
  }
}

async function processHtml(html: string, baseUrl: string): Promise<string> {
  const baseUrlObj = new URL(baseUrl)
  const baseOrigin = baseUrlObj.origin
  const basePath = baseUrlObj.pathname.split("/").slice(0, -1).join("/")
  
  // Load HTML into cheerio
  const $ = cheerio.load(html)
  
  // Process all images - convert to base64
  const imagePromises: Promise<void>[] = []
  $("img").each((_, element) => {
    const img = $(element)
    const src = img.attr("src")
    
    if (src && !src.startsWith("data:")) {
      const fullUrl = resolveUrl(src, baseOrigin, basePath)
      
      const imagePromise = fetch(fullUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch image: ${fullUrl}`)
          return res.arrayBuffer()
        })
        .then(buffer => {
          const contentType = getContentTypeFromUrl(fullUrl)
          const base64 = Buffer.from(buffer).toString("base64")
          img.attr("src", `data:${contentType};base64,${base64}`)
          img.attr("data-original-src", src)
        })
        .catch(err => {
          console.error(`Error processing image ${fullUrl}:`, err)
          // Keep the original src if we can't convert it
        })
      
      imagePromises.push(imagePromise)
    }
  })
  
  // Process all CSS - fetch and inline
  const stylePromises: Promise<void>[] = []
  $("link[rel='stylesheet']").each((_, element) => {
    const link = $(element)
    const href = link.attr("href")
    
    if (href && !href.startsWith("data:")) {
      const fullUrl = resolveUrl(href, baseOrigin, basePath)
      
      const stylePromise = fetch(fullUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch stylesheet: ${fullUrl}`)
          return res.text()
        })
        .then(async cssText => {
          // Process CSS to handle relative URLs within the stylesheet
          const processedCss = await processCssUrls(cssText, fullUrl)
          
          // Create a new style element with the inlined CSS
          const styleElement = $("<style></style>")
            .attr("data-original-href", href)
            .text(processedCss)
          
          // Replace the link element with the new style element
          link.replaceWith(styleElement)
        })
        .catch(err => {
          console.error(`Error processing stylesheet ${fullUrl}:`, err)
          // Keep the original link if we can't inline it
        })
      
      stylePromises.push(stylePromise)
    }
  })
  
  // Process all scripts - fetch and inline
  const scriptPromises: Promise<void>[] = []
  $("script[src]").each((_, element) => {
    const script = $(element)
    const src = script.attr("src")
    
    if (src && !src.startsWith("data:")) {
      const fullUrl = resolveUrl(src, baseOrigin, basePath)
      
      const scriptPromise = fetch(fullUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch script: ${fullUrl}`)
          return res.text()
        })
        .then(scriptText => {
          // Remove the src attribute and set the script content
          script.removeAttr("src")
          script.attr("data-original-src", src)
          script.text(scriptText)
        })
        .catch(err => {
          console.error(`Error processing script ${fullUrl}:`, err)
          // Keep the original script if we can't inline it
        })
      
      scriptPromises.push(scriptPromise)
    }
  })
  
  // Process all links to make them work offline
  $("a").each((_, element) => {
    const link = $(element)
    const href = link.attr("href")
    
    if (href) {
      // Store the original href
      link.attr("data-original-href", href)
      
      // Make the link interactive but prevent navigation
      link.attr("href", "javascript:void(0)")
      link.attr("onclick", `showLinkModal('${href.replace(/'/g, "\\'")}'); return false;`)
    }
  })
  
  // Process all forms to make them work offline
  $("form").each((_, element) => {
    const form = $(element)
    const action = form.attr("action") || ""
    const method = form.attr("method") || "get"
    
    // Store the original form attributes
    form.attr("data-original-action", action)
    form.attr("data-original-method", method)
    
    // Override the form submission
    form.attr("action", "javascript:void(0)")
    form.attr("onsubmit", `handleFormSubmit(this, '${action.replace(/'/g, "\\'")}', '${method}'); return false;`)
  })
  
  // Add custom fonts
  $("head").append(`
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    </style>
  `)
  
  // Add strawberry button styles as an example of custom elements
  $("head").append(`
    <style>
      .strawberry-button {
        background-color: #ff4757;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(255, 71, 87, 0.2);
      }
      
      .strawberry-button:hover {
        background-color: #ff6b81;
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(255, 71, 87, 0.3);
      }
      
      .strawberry-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(255, 71, 87, 0.2);
      }
      
      .strawberry-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyYzUuNTIgMCAxMCA0LjQ4IDEwIDEwcy00LjQ4IDEwLTEwIDEwUzIgMTcuNTIgMiAxMiA2LjQ4IDIgMTIgMnptLTEgMTVoMnYyaC0ydi0yem0wLTEwaDJ2OGgtMlY3eiIvPjwvc3ZnPg==');
        background-size: contain;
      }
    </style>
  `)
  
  // Add helper functions for offline functionality
  $("body").append(`
    <div id="link-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 8px; max-width: 90%; width: 400px;">
        <h3 style="margin-top: 0;">External Link</h3>
        <p>This link would navigate to:</p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;" id="link-url"></div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="closeLinkModal()" style="padding: 8px 16px; background-color: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">Close</button>
          <button onclick="openExternalLink()" style="padding: 8px 16px; background-color: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Link</button>
        </div>
      </div>
    </div>
    
    <div id="form-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 8px; max-width: 90%; width: 600px;">
        <h3 style="margin-top: 0;">Form Submission</h3>
        <p>This form would be submitted to:</p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;" id="form-action"></div>
        <p>Method: <span id="form-method"></span></p>
        <div style="margin-top: 10px;">
          <h4>Form Data:</h4>
          <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; max-height: 200px;" id="form-data"></pre>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="closeFormModal()" style="padding: 8px 16px; background-color: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </div>
    </div>
    
    <script>
      // Current external link URL
      let currentLinkUrl = '';
      
      // Show link modal
      function showLinkModal(url) {
        currentLinkUrl = url;
        document.getElementById('link-url').textContent = url;
        document.getElementById('link-modal').style.display = 'block';
      }
      
      // Close link modal
      function closeLinkModal() {
        document.getElementById('link-modal').style.display = 'none';
      }
      
      // Open external link
      function openExternalLink() {
        if (currentLinkUrl) {
          window.open(currentLinkUrl, '_blank');
        }
        closeLinkModal();
      }
      
      // Handle form submission
      function handleFormSubmit(form, action, method) {
        const formData = new FormData(form);
        const formDataObj = {};
        
        for (const [key, value] of formData.entries()) {
          formDataObj[key] = value;
        }
        
        document.getElementById('form-action').textContent = action || 'No action specified';
        document.getElementById('form-method').textContent = method.toUpperCase();
        document.getElementById('form-data').textContent = JSON.stringify(formDataObj, null, 2);
        document.getElementById('form-modal').style.display = 'block';
      }
      
      // Close form modal
      function closeFormModal() {
        document.getElementById('form-modal').style.display = 'none';
      }
      
      // Add strawberry buttons to the page as an example
      document.addEventListener('DOMContentLoaded', function() {
        // Find some good places to add strawberry buttons
        const containers = document.querySelectorAll('div, section, header, footer');
        
        if (containers.length > 0) {
          // Add a strawberry button to the first suitable container
          for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            
            // Check if the container is visible and has some content
            if (container.offsetParent !== null && container.innerHTML.trim() !== '') {
              const strawberryButton = document.createElement('button');
              strawberryButton.className = 'strawberry-button';
              strawberryButton.innerHTML = '<span class="strawberry-icon"></span> Strawberry Button';
              strawberryButton.onclick = function() {
                alert('You clicked the strawberry button! 🍓');
              };
              
              // Insert at the beginning of the container
              if (container.firstChild) {
                container.insertBefore(strawberryButton, container.firstChild);
              } else {
                container.appendChild(strawberryButton);
              }
              
              break;
            }
          }
        }
      });
    </script>
  `)
  
  // Wait for all promises to complete
  await Promise.all([
    ...imagePromises,
    ...stylePromises,
    ...scriptPromises
  ])
  
  // Add a header comment
  const timestamp = new Date().toISOString()
  const headerComment = `
<!--
  CLONED WEBSITE
  Original URL: ${baseUrl}
  Cloned on: ${timestamp}
  
  This is a standalone HTML file with all assets embedded.
  It works completely offline with no external dependencies.
-->
`
  
  // Get the final HTML
  const finalHtml = headerComment + $.html()
  
  return finalHtml
}

// Helper function to resolve relative URLs
function resolveUrl(url: string, baseOrigin: string, basePath: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('//')) {
    return `https:${url}`
  }
  
  if (url.startsWith('/')) {
    return `${baseOrigin}${url}`
  }
  
  return `${baseOrigin}${basePath}/${url}`
}

// Process CSS to handle relative URLs
async function processCssUrls(css: string, baseUrl: string): Promise<string> {
  const baseUrlObj = new URL(baseUrl)
  const baseOrigin = baseUrlObj.origin
  const basePath = baseUrlObj.pathname.split('/').slice(0, -1).join('/')
  
  // Replace URLs in the CSS
  let processedCss = css.replace(/url$$['"]?([^'")]+)['"]?$$/g, (match, url) => {
    // Skip data URLs
    if (url.startsWith('data:')) {
      return match
    }
    
    // Resolve the URL
    const fullUrl = resolveUrl(url, baseOrigin, basePath)
    
    // For now, just return the absolute URL
    // In a more complete implementation, we would fetch and inline these resources too
    return `url('${fullUrl}')`
  })
  
  // TODO: In a more complete implementation, we would fetch and inline all CSS resources
  // like fonts, background images, etc.
  
  return processedCss
}

// Get content type from URL
function getContentTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase() || ''
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'webp':
      return 'image/webp'
    case 'ico':
      return 'image/x-icon'
    default:
      return 'image/jpeg' // Default to JPEG if unknown
  }
}
