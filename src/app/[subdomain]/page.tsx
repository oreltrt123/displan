import { createClient } from "../../../supabase/server"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PublishedSitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params
  const supabase = createClient()

  // Fetch the published website data
  const { data: publishedSite, error } = await supabase
    .from("published_websites")
    .select("*")
    .eq("subdomain", subdomain)
    .eq("status", "active")
    .order("published_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !publishedSite) {
    console.error("Error fetching published site:", error)
    notFound()
  }

  // Add the "Created with Displan" attribution to the HTML
  let htmlContent = publishedSite.html_content

  // Insert the attribution before the closing body tag
  const attributionHtml = `
    <div style="position: fixed; bottom: 10px; right: 10px; background-color: #f8f9fa; padding: 5px 10px; border-radius: 4px; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 1000;">
      <a href="https://displan.design" target="_blank" style="color: #333; text-decoration: none; display: flex; align-items: center;">
        <span>Created with</span>
        <strong style="margin-left: 4px;">Displan</strong>
      </a>
    </div>
  `

  htmlContent = htmlContent.replace("</body>", `${attributionHtml}</body>`)

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
