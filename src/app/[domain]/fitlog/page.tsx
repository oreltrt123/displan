import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { FitLogDashboard } from "./components/fitlog-dashboard"

interface PageProps {
  params: {
    domain: string
  }
}

export default async function DomainPage({ params }: PageProps) {
  const { domain } = params

  // Check if this is the fitlog subdomain
  if (domain !== "fitlog") {
    return notFound()
  }

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please log in to access FitLog</h1>
          <p className="text-gray-600">You need to be logged in to your DisPlan account to use FitLog.</p>
          <a
            href="https://displan.design/login"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login to DisPlan
          </a>
        </div>
      </div>
    )
  }

  // Fetch user's fitness data
  const [
    { data: userProfile },
    { data: todayWorkouts },
    { data: todayMeals },
    { data: activeGoals },
    { data: todayLog },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),

    supabase
      .from("workouts")
      .select(`
        *,
        workout_exercises (
          *,
          exercises (name, category)
        )
      `)
      .eq("user_id", user.id)
      .eq("workout_date", new Date().toISOString().split("T")[0])
      .order("created_at", { ascending: false }),

    supabase.from("meals").select("*").eq("user_id", user.id).eq("meal_date", new Date().toISOString().split("T")[0]),

    supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_completed", false)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", new Date().toISOString().split("T")[0])
      .single(),
  ])

  return (
    <FitLogDashboard
      user={user}
      userProfile={userProfile}
      todayWorkouts={todayWorkouts || []}
      todayMeals={todayMeals || []}
      activeGoals={activeGoals || []}
      todayLog={todayLog}
    />
  )
}
