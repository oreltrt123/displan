import { createClient } from "../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Layout, ArrowRight } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"

export default async function AppsPage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access the apps")
  }

  const user = session.user

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <DashboardNavbar hasProfile={hasProfile} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tighter">Apps</h1>
            <p className="text-white/70">Discover powerful tools to enhance your productivity and creativity</p>
          </header>

          {/* Apps Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Website Builder Card */}
     
            <a
              href="/dashboard/apps/website-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-6 border border-white/10 shadow-sm flex flex-col h-full"
            >
              
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Layout size={24} className="text-blue-400" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Website Builder</h2>
              <p className="text-white/70 text-sm mb-4 flex-grow">
                Create beautiful websites with our intuitive builder. Choose between code or visual design.
              </p>

              <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                Get started <ArrowRight size={16} className="ml-1" />
              </div>
            </a>
          </section>
        </div>
      </main>
    </div>
  )
}
