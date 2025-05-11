import { createClient } from "../../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Code, Palette } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"

export default async function WebsiteBuilderPage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access the website builder")
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
          <div>
            <Link href="/dashboard/apps" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft size={16} />
              Back to Apps
            </Link>
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tighter">Website Builder</h1>
              <p className="text-white/70">Choose how you'd like to build your website</p>
            </header>
          </div>

          {/* Options Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Code Option */}
            <Link
              href="/dashboard/apps/website-builder/code"
              className="group bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-8 border border-white/10 shadow-sm flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Code size={32} className="text-blue-400" />
              </div>

              <h2 className="text-2xl font-semibold mb-3">Code Editor</h2>
              <p className="text-white/70 mb-6 flex-grow">
                Build your website with code. Perfect for developers who want complete control over their website's
                structure and functionality.
              </p>

              <div className="px-5 py-3 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition-colors">
                Start Coding
              </div>
            </Link>

            {/* Designer Option */}
            <Link
              href="/dashboard/apps/website-builder/designer"
              className="group bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-8 border border-white/10 shadow-sm flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Palette size={32} className="text-purple-400" />
              </div>

              <h2 className="text-2xl font-semibold mb-3">Visual Designer</h2>
              <p className="text-white/70 mb-6 flex-grow">
                Create your website visually with our drag-and-drop interface. No coding required, perfect for beginners
                and designers.
              </p>

              <div className="px-5 py-3 bg-purple-500 text-white rounded-lg text-center font-medium hover:bg-purple-600 transition-colors">
                Start Designing
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
