import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  try {
    const subdomain = params.subdomain
    
    if (!subdomain) {
      console.error("No subdomain provided in params")
      return new Response("Site not found", { status: 404 })
    }
    
    console.log(`Serving site for subdomain: ${subdomain}`)
    
    const supabase = createClient()
    
    // Get the published site from the database
    const { data: site, error } = await supabase
      .from("published_sites")
      .select("html_content")
      .eq("site_name", subdomain)
      .single()
    
    if (error) {
      console.error(`Error fetching site for subdomain ${subdomain}:`, error)
      return new Response("Site not found", { status: 404 })
    }
    
    if (!site || !site.html_content) {
      console.error(`No content found for subdomain ${subdomain}`)
      return new Response("Site content not found", { status: 404 })
    }
    
    // Return the HTML content with the correct content type
    return new Response(site.html_content, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error serving site:", error)
    return new Response("Error serving site", { status: 500 })
  }
}