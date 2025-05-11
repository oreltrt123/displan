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
            <Link
              href="/dashboard/apps/website-builder"
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
            </Link>

            {/* Placeholder for future apps */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm flex flex-col opacity-60 cursor-not-allowed">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="m9 15 3 3 3-3" />
                </svg>
              </div>

              <h2 className="text-xl font-semibold mb-2">File Manager</h2>
              <p className="text-white/70 text-sm mb-4 flex-grow">
                Coming soon - Organize and manage your project files with ease.
              </p>

              <div className="flex items-center text-white/40 text-sm font-medium">Coming soon</div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm flex flex-col opacity-60 cursor-not-allowed">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-400"
                >
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m8 22 4-10 4 10" />
                  <path d="M12 11V2" />
                </svg>
              </div>

              <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
              <p className="text-white/70 text-sm mb-4 flex-grow">
                Coming soon - Get intelligent suggestions and automate tasks with our AI assistant.
              </p>

              <div className="flex items-center text-white/40 text-sm font-medium">Coming soon</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
