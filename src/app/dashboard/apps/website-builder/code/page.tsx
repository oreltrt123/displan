import { createClient } from "../../../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Code, Play, Plus, Trash2 } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"
import "../../website-builder/designer/styles/button.css"

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
            <header className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-black dark:text-white link_button dsafafwf">
            <img src="/logo_light_mode.png" alt="Logo" className="dark:hidden" />
            <img src="/logo_dark_mode.png" alt="Logo" className="hidden dark:block" />
          </Link>

            {/* Create Project Button */}
            <Link href="/dashboard/apps/website-builder/code/new">
            <button
              className="button_edit_project_r222SDS"
              >
             Create Project
            </button>
            </Link>
          </div>
        </div>
      </header>
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tighter">Code Editor</h1>
              <p className="text-white/70">Build your website with code</p>
            </header>

          {/* Projects List */}
          <section className="rounded-lg bg-background p-4 hover:shadow-md transition-shadow">
            {websites && websites.length > 0 ? (
              websites.map((website) => (
                <div
                  key={website.id}
                  className="space-y-2 _dddddd1_project"
                >
                                      <Link
                      href={`/dashboard/apps/website-builder/code/edit/${website.id}`}
                      title="Edit"
                    >
                        <div className="thumbnailContainerDark ">
                      </div>
                      </Link>
                    <h3 className="text-sm Text_css_project_simple1">{website.name}</h3>
                    <p className="Text_css_project_simple_p1">
                      Last edited: {new Date(website.updated_at).toLocaleDateString()}
                    </p>
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
