"use client"

import { useParams } from "next/navigation"
import { DeploymentSection } from "@/components/deployment-section"

export default function DomainsSettingsPage() {
  const params = useParams()
  const projectId = params.id as string

  return <DeploymentSection projectId={projectId} currentSubdomain={""} isPublished={false} />
}
