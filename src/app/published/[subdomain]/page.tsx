import { notFound } from "next/navigation"
import { PublishedSiteRenderer } from "./components/published-site-renderer"
import { getPublishedSiteData } from "./lib/get-published-site"

interface PublishedSitePageProps {
  params: {
    subdomain: string
  }
}

export default async function PublishedSitePage({ params }: PublishedSitePageProps) {
  const { subdomain } = params

  // Get the published site data
  const siteData = await getPublishedSiteData(subdomain)

  if (!siteData) {
    notFound()
  }

  return <PublishedSiteRenderer siteData={siteData} />
}

export async function generateMetadata({ params }: PublishedSitePageProps) {
  const { subdomain } = params
  const siteData = await getPublishedSiteData(subdomain)

  if (!siteData) {
    return {
      title: "Site Not Found",
      description: "The requested site could not be found.",
    }
  }

  return {
    title: siteData.name || `${subdomain} - Built with DisPlan`,
    description: siteData.description || `A website built with DisPlan`,
    openGraph: {
      title: siteData.name || `${subdomain} - Built with DisPlan`,
      description: siteData.description || `A website built with DisPlan`,
      images: siteData.social_preview_url ? [siteData.social_preview_url] : [],
    },
    icons: {
      icon: siteData.favicon_light_url || "/favicon.ico",
    },
  }
}
