import { createClient } from "../../../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Code, Play, Plus, Trash2 } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"

export default async function WebsiteBuilderCodePage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?message=Please sign in to access the code editor")
  }

  const user = session.user

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  // Get user's website projects
  const { data: websites } = await supabase
    .from("website_projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "code")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="w-full min-h-screen text-white bg-background relative">
      <DashboardNavbar hasProfile={hasProfile} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tighter">Code Editor</h1>
              <p className="text-white/70">Build your website with code</p>
            </header>

          {/* Create New Project Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <Link
              href="/dashboard/apps/website-builder/code/new"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              New Project
            </Link>
          </div>

          {/* Projects List */}
          <section className="grid grid-cols-1 gap-4">
            {websites && websites.length > 0 ? (
              websites.map((website) => (
                <div
                  key={website.id}
                  className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-lg">{website.name}</h3>
                    <p className="text-white/70 text-sm">
                      Last edited: {new Date(website.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/apps/website-builder/code/edit/${website.id}`}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                      title="Edit"
                    >
                      <Code size={18} />
                    </Link>
                    <Link
                      href={`/dashboard/apps/website-builder/code/preview/${website.id}`}
                      className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                      title="Preview"
                    >
                      <Play size={18} />
                    </Link>
                    <button
                      className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <Code size={48} className="text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                <p className="text-white/60 mb-6">Create your first website project to get started</p>
                <Link
                  href="/dashboard/apps/website-builder/code/new"
                  className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create Project
                </Link>
              </div>
            )}
          </section>

          {/* Getting Started Section */}
          {/* <section className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Create a project</h3>
                <p className="text-white/70 text-sm">Start by creating a new website project and giving it a name.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Write your code</h3>
                <p className="text-white/70 text-sm">
                  Use our code editor to write HTML, CSS, and JavaScript for your website.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Preview and publish</h3>
                <p className="text-white/70 text-sm">
                  Preview your website and when you're ready, publish it to make it live.
                </p>
              </div>
            </div>
          </section> */}
        </div>
      </main>
    </div>
  )
}
