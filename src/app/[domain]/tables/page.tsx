import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { TablesManagement } from "../fitlog/components/tables-management"
import "@/styles/sidebar_settings_editor.css"
import "@/styles/button_rrui.css"

export default async function TablesPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in to access Tables</h1>
          <a href="/fitlog" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Fetch user's weekly tables
  const { data: weeklyTables } = await supabase
    .from("fitlog_weekly_tables")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <TablesManagement user={user} initialTables={weeklyTables || []} />
}
