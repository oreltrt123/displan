import { createClient } from "../../../supabase/server"
import { redirect } from "next/navigation"
import { UserCircle } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar1"
import DashboardSidebar from "@/components/dashboard-sidebar"
import Link from "next/link"

export default async function Dashboard() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access the dashboard")
  }

  const user = session.user

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  // Get user's projects
  const { data: projects = [] } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <DashboardSidebar projects={projects || []} userEmail={user.email || ""} profile={profile} userId={user.id} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <DashboardNavbar hasProfile={hasProfile} />

        <div className="container mx-auto px-6 py-8">
          {/* User Profile Section */}
          <section className="bg-white dark:bg-background border rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <UserCircle size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                {profile && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Member since {formatDate(profile.created_at)}
                  </div>
                )}
              </div>
              <div className="ml-auto">
                {!hasProfile && (
                  <Link
                    href="/dashboard/profile/create"
                    className="new_site_button"
                      >
                    Create Profile
                  </Link>
                )}
                {hasProfile && (
                  <Link
                    href={`/dashboard/profile/${user.id}`}
                    className="new_site_button"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
