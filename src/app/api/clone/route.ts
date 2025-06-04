import { type NextRequest, NextResponse } from "next/server"

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
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }

    const html = await response.text()
    const processedHtml = await processHtml(html, url)

    // Return the HTML directly as text, not JSON
    return new NextResponse(processedHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Cloning error:", error)
    return NextResponse.json({ error: "Failed to clone website" }, { status: 500 })
  }
}

async function processHtml(html: string, baseUrl: string): Promise<string> {
  const baseUrlObj = new URL(baseUrl)
  const baseOrigin = baseUrlObj.origin

  // Process the HTML to make it standalone
  let processedHtml = html

  // Convert all relative URLs to absolute URLs for images
  processedHtml = processedHtml.replace(
    /(<img[^>]*\s+src\s*=\s*["'])([^"']+)(["'][^>]*>)/gi,
    async (match, before, src, after) => {
      if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
        return match
      }

      let fullUrl = src
      if (src.startsWith("/")) {
        fullUrl = baseOrigin + src
      } else {
        fullUrl = new URL(src, baseUrl).href
      }

      // Try to convert image to base64
      try {
        const imageResponse = await fetch(fullUrl)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          const contentType = imageResponse.headers.get("content-type") || "image/jpeg"
          const base64 = Buffer.from(arrayBuffer).toString("base64")
          return `${before}data:${contentType};base64,${base64}${after}`
        }
      } catch (error) {
        console.error(`Failed to fetch image: ${fullUrl}`, error)
      }

      // Fallback to absolute URL if base64 conversion fails
      return `${before}${fullUrl}${after}`
    },
  )

  // Process images synchronously first
  const imageMatches = processedHtml.match(/(<img[^>]*\s+src\s*=\s*["'])([^"']+)(["'][^>]*>)/gi)
  if (imageMatches) {
    for (const match of imageMatches) {
      const srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i)
      if (srcMatch) {
        const src = srcMatch[1]
        if (!src.startsWith("http") && !src.startsWith("//") && !src.startsWith("data:")) {
          let fullUrl = src
          if (src.startsWith("/")) {
            fullUrl = baseOrigin + src
          } else {
            fullUrl = new URL(src, baseUrl).href
          }

          try {
            const imageResponse = await fetch(fullUrl)
            if (imageResponse.ok) {
              const arrayBuffer = await imageResponse.arrayBuffer()
              const contentType = imageResponse.headers.get("content-type") || "image/jpeg"
              const base64 = Buffer.from(arrayBuffer).toString("base64")
              const dataUrl = `data:${contentType};base64,${base64}`
              processedHtml = processedHtml.replace(src, dataUrl)
            } else {
              processedHtml = processedHtml.replace(src, fullUrl)
            }
          } catch (error) {
            console.error(`Failed to fetch image: ${fullUrl}`, error)
            processedHtml = processedHtml.replace(src, fullUrl)
          }
        }
      }
    }
  }

  // Convert relative URLs to absolute URLs for CSS files
  const cssLinkMatches = processedHtml.match(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi)
  if (cssLinkMatches) {
    for (const linkMatch of cssLinkMatches) {
      const hrefMatch = linkMatch.match(/href\s*=\s*["']([^"']+)["']/i)
      if (hrefMatch) {
        const href = hrefMatch[1]
        if (!href.startsWith("http") && !href.startsWith("//")) {
          let fullUrl = href
          if (href.startsWith("/")) {
            fullUrl = baseOrigin + href
          } else {
            fullUrl = new URL(href, baseUrl).href
          }

          try {
            const cssResponse = await fetch(fullUrl)
            if (cssResponse.ok) {
              const cssText = await cssResponse.text()

              // Process CSS to convert relative URLs to absolute
              const processedCss = cssText.replace(/url\s*$$\s*["']?([^"')]+)["']?\s*$$/gi, (cssMatch, cssUrl) => {
                if (cssUrl.startsWith("http") || cssUrl.startsWith("//") || cssUrl.startsWith("data:")) {
                  return cssMatch
                }

                let fullCssUrl = cssUrl
                if (cssUrl.startsWith("/")) {
                  fullCssUrl = baseOrigin + cssUrl
                } else {
                  fullCssUrl = new URL(cssUrl, fullUrl).href
                }

                return `url('${fullCssUrl}')`
              })

              // Replace the link tag with a style tag containing the CSS
              const styleTag = `<style type="text/css">\n/* Inlined from ${href} */\n${processedCss}\n</style>`
              processedHtml = processedHtml.replace(linkMatch, styleTag)
            } else {
              // If we can't fetch the CSS, convert to absolute URL
              processedHtml = processedHtml.replace(href, fullUrl)
            }
          } catch (error) {
            console.error(`Failed to fetch CSS: ${fullUrl}`, error)
            // If we can't fetch the CSS, convert to absolute URL
            processedHtml = processedHtml.replace(href, fullUrl)
          }
        }
      }
    }
  }

  // Convert relative URLs to absolute URLs for JavaScript files
  const scriptMatches = processedHtml.match(/<script[^>]*src\s*=\s*["'][^"']+["'][^>]*>/gi)
  if (scriptMatches) {
    for (const scriptMatch of scriptMatches) {
      const srcMatch = scriptMatch.match(/src\s*=\s*["']([^"']+)["']/i)
      if (srcMatch) {
        const src = srcMatch[1]
        if (!src.startsWith("http") && !src.startsWith("//")) {
          let fullUrl = src
          if (src.startsWith("/")) {
            fullUrl = baseOrigin + src
          } else {
            fullUrl = new URL(src, baseUrl).href
          }

          try {
            const jsResponse = await fetch(fullUrl)
            if (jsResponse.ok) {
              const jsText = await jsResponse.text()

              // Replace the script tag with an inline script
              const inlineScript = scriptMatch
                .replace(/src\s*=\s*["'][^"']+["']/i, "")
                .replace(">", `>\n/* Inlined from ${src} */\n${jsText}\n`)
              processedHtml = processedHtml.replace(scriptMatch, inlineScript)
            } else {
              // If we can't fetch the JS, convert to absolute URL
              processedHtml = processedHtml.replace(src, fullUrl)
            }
          } catch (error) {
            console.error(`Failed to fetch JavaScript: ${fullUrl}`, error)
            // If we can't fetch the JS, convert to absolute URL
            processedHtml = processedHtml.replace(src, fullUrl)
          }
        }
      }
    }
  }

  // Convert other relative URLs to absolute URLs (for href attributes, etc.)
  processedHtml = processedHtml.replace(/href\s*=\s*["']([^"']+)["']/gi, (match, href) => {
    if (
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return match
    }

    let fullUrl = href
    if (href.startsWith("/")) {
      fullUrl = baseOrigin + href
    } else {
      fullUrl = new URL(href, baseUrl).href
    }

    return `href="${fullUrl}"`
  })

  // Convert other src attributes to absolute URLs
  processedHtml = processedHtml.replace(/src\s*=\s*["']([^"']+)["']/gi, (match, src) => {
    if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
      return match
    }

    let fullUrl = src
    if (src.startsWith("/")) {
      fullUrl = baseOrigin + src
    } else {
      fullUrl = new URL(src, baseUrl).href
    }

    return `src="${fullUrl}"`
  })

  // Add a comment at the top indicating this is a cloned file
  const timestamp = new Date().toISOString()
  const header = `<!-- 
  CLONED WEBSITE - EXACT REPLICA
  Original URL: ${baseUrl}
  Cloned on: ${timestamp}
  
  This HTML file is an exact copy of the original website with all assets embedded.
  You can edit this HTML file normally like any other HTML file.
  All images, CSS, and JavaScript have been inlined for offline use.
-->\n`

  return header + processedHtml
}
