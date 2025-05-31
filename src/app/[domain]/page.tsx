import { notFound } from "next/navigation"
import { getPublishedSiteData } from "./lib/get-published-site"
import { PublishedSiteRenderer } from "./components/published-site-renderer"

interface DomainPageProps {
  params: {
    domain: string
  }
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = params

  // Skip processing for the main domain
  if (domain === "www" || domain === "displan") {
    notFound()
  }

  // Get the published site data
  const siteData = await getPublishedSiteData(domain)

  if (!siteData) {
    notFound()
  }

  return <PublishedSiteRenderer siteData={siteData} />
}

export async function generateMetadata({ params }: DomainPageProps) {
  const { domain } = params

  // Skip processing for the main domain
  if (domain === "www" || domain === "displan") {
    return {
      title: "DisPlan",
      description: "Build and publish websites easily",
    }
  }

  const siteData = await getPublishedSiteData(domain)

  if (!siteData) {
    return {
      title: "Site Not Found",
      description: "The requested site could not be found.",
    }
  }

  // Use the project name as the title
  const title = siteData.name || `${domain} - Built with DisPlan`

  return {
    title: title,
    description: siteData.description || `A website built with DisPlan`,
    openGraph: {
      title: title,
      description: siteData.description || `A website built with DisPlan`,
      images: siteData.social_preview_url ? [siteData.social_preview_url] : [],
    },
    icons: {
      icon: siteData.favicon_light_url || "/favicon.ico",
    },
  }
}
