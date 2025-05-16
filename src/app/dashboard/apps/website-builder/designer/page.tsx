import { createClient } from "../../../../../../supabase/server"
import { redirect } from "next/navigation"
import DashboardNavbar from "@/components/dashboard-navbar"
import WebsiteGrid from "./components/website-grid"
import "./styles/button.css"

export default async function WebsiteBuilderDesignerPage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access the visual designer")
  }

  const user = session.user

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  // Check if user has premium subscription
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  const isPremiumUser = !!subscription

  // Get user's website projects
  const { data: websites = [] } = await supabase
    .from("website_projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "designer")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get username from profile
  const username = profile?.username || user.email?.split("@")[0] || "User"

  return (
    <div className="w-full min-h-screen bg-background text-gray-900 dark:text-gray-100">
      <DashboardNavbar hasProfile={hasProfile} />

      <main className="w-full pt-6">
        <div className="container mx-auto px-4">
          <WebsiteGrid websites={websites || []} username={username} isPremiumUser={isPremiumUser} />
        </div>
      </main>
    </div>
  )
}
