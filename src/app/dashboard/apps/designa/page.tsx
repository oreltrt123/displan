import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "../../../../../supabase/server"
import type { Design } from "./types/design"

import DashboardNavbar from "./components/dashboard-navbar"
import { DashboardShell } from "./components/dashboard-shell"
import { DashboardHeader } from "./components/dashboard-header"
import { DesignEmptyState } from "./components/design-empty-state"
import { DesignGrid } from "./components/design-grid"
import { DashboardSkeleton } from "./components/dashboard-skeleton"

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <>
      <DashboardNavbar />
      <DashboardShell>
        <DashboardHeader />
        <Suspense fallback={<DashboardSkeleton />}>
          <DesignsContent userId={user.id} />
        </Suspense>
      </DashboardShell>
    </>
  )
}

async function DesignsContent({ userId }: { userId: string }) {
  const supabase = await createClient()

  // Fetch user's designs
  const { data: designs } = await supabase
    .from("designs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!designs || designs.length === 0) {
    return <DesignEmptyState />
  }

  return <DesignGrid designs={designs as Design[]} />
}
