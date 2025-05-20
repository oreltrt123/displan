import { createClient } from "../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Layout, ArrowRight } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"
import "./styles/apps.css"
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
    <div className="w-full min-h-screen text-white bg-background relative">
      <DashboardNavbar hasProfile={hasProfile} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tighter">Apps</h1> 
          </header>

          {/* Apps Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Website Builder Card */}
            <div className="app-card">
              <div className="app-card-content">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Layout size={24} className="text-blue-400" />
                </div>

                <h2 className="app-title">Website Builder Design</h2>
                <p className="app-description">
                  Create beautiful websites with our intuitive builder. Choose between code or visual design.
                </p>

                <div className="app-actions">
                  <Link href="/dashboard/apps/website-builder/designer" className="app-learn-more">
                    Get started <ArrowRight size={16} className="ml-1" />
                  </Link>
                  <Link href="/dashboard/apps/builder" className="app-open-button">
                    Open
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Website Builder Card */}
            <div className="app-card">
              <div className="app-card-content">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Layout size={24} className="text-blue-400" />
                </div>

                <h2 className="app-title">Website Builder Code</h2>
                <p className="app-description">
                  Create beautiful websites with our intuitive builder. Choose between code or visual design.
                </p>

                <div className="app-actions">
                  <Link href="/dashboard/apps/website-builder/code" className="app-learn-more">
                    Get started <ArrowRight size={16} className="ml-1" />
                  </Link>
                  <Link href="/dashboard/apps/builder" className="app-open-button">
                    Open
                  </Link>
                </div>
              </div>
            </div>
          </section>
           <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Website Builder Card */}
            <div className="app-card">
              <div className="app-card-content">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Layout size={24} className="text-blue-400" />
                </div>

                <h2 className="app-title">Website SassCanvas</h2>
                <p className="app-description">
                  Create stunning images with AI and many other templates.
                </p>

                <div className="app-actions">
                  <Link href="/dashboard/apps/designa" className="app-learn-more">
                    Get started <ArrowRight size={16} className="ml-1" />
                  </Link>
                  {/* <Link href="/dashboard/apps/sasscanvas" className="app-open-button">
                    Open
                  </Link> */}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
