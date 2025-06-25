import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { TableView } from "../../fitlog/components/table-view"
import "@/styles/button_rrui.css"

interface TablePageProps {
  params: {
    domain: string
    id: string
  }
}

export default async function TablePage({ params }: TablePageProps) {
  const { domain, id } = params

  if (domain !== "fitlog") {
    notFound()
  }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in to view tables</h1>
          <a href="/fitlog" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Fetch table data
  const { data: table, error: tableError } = await supabase
    .from("fitlog_weekly_tables")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (tableError || !table) {
    notFound()
  }

  // Fetch daily plans for this table
  const { data: dailyPlans } = await supabase
    .from("fitlog_daily_plans")
    .select("*")
    .eq("weekly_table_id", id)
    .order("plan_date", { ascending: true })

  // Fetch check-ins for this table
  const { data: checkins } = await supabase
    .from("fitlog_daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .in("daily_plan_id", dailyPlans?.map((plan) => plan.id) || [])

  return <TableView user={user} table={table} dailyPlans={dailyPlans || []} checkins={checkins || []} />
}
