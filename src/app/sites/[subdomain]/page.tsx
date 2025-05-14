import { notFound } from "next/navigation"
import { createClient } from "../../../../supabase/server"

export default async function SubdomainSite({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params

  if (!subdomain) {
    return notFound()
  }

  const supabase = createClient()

  // Check if the site exists
  const { data: site, error } = await supabase
    .from("published_sites")
    .select("site_name")
    .eq("site_name", subdomain)
    .single()

  if (error || !site) {
    return notFound()
  }

  // This page should not normally be rendered
  // The middleware should rewrite to the API route
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Site Loading...</h1>
      <p>If you continue to see this page, please contact support.</p>
    </div>
  )
}
