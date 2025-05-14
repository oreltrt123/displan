import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"

export async function GET(request: Request, { params }: { params: { subdomain: string } }) {
  try {
    const subdomain = params.subdomain

    if (!subdomain) {
      return NextResponse.json({ message: "Subdomain not provided" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the published site from the database
    const { data: site, error } = await supabase
      .from("published_sites")
      .select("html_content")
      .eq("site_name", subdomain)
      .single()

    if (error) {
      console.error("Error fetching site:", error)
      return NextResponse.json({ message: "Site not found" }, { status: 404 })
    }

    if (!site) {
      return NextResponse.json({ message: "Site not found" }, { status: 404 })
    }

    // Return the HTML content with the correct content type
    return new NextResponse(site.html_content, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error serving site:", error)
    return NextResponse.json({ message: "Error serving site" }, { status: 500 })
  }
}
