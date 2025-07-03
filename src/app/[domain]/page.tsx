import { notFound } from "next/navigation"
import { getPublishedSiteData } from "./lib/get-published-site"
import { PublishedSiteRenderer } from "./components/published-site-renderer"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { FitLogDashboard } from "./fitlog/components/fitlog-dashboard"
import { ThemeProvider } from "./fitlog/components/theme-provider"

interface DomainPageProps {
  params: {
    domain: string
  }
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = params

  console.log("🌐 Domain page called with domain:", domain)

  // Skip processing for the main domain
  if (domain === "www" || domain === "displan") {
    console.log("🚫 Skipping main domain")
    notFound()
  }

  // Handle FitLog app
  if (domain === "fitlog") {
    console.log("🏋️ Loading FitLog app")
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get the current user (using your existing auth system)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("👤 User check:", { user: !!user, error: authError })

    // If no user, show the app anyway but with limited functionality
    if (!user) {
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FitLogDashboard
            user={null}
            userProfile={null}
            todayWorkouts={[]}
            todayMeals={[]}
            activeGoals={[]}
            todayLog={null}
            weeklyTables={[]}
            todayCheckin={null}
          />
        </ThemeProvider>
      )
    }

    // Get today's date consistently
    const today = new Date().toISOString().split("T")[0]

    // Fetch user's fitness data including weekly tables with better error handling
    try {
      const [
        { data: userProfile, error: profileError },
        { data: todayWorkouts, error: workoutsError },
        { data: todayMeals, error: mealsError },
        { data: activeGoals, error: goalsError },
        { data: todayLog, error: logError },
        { data: weeklyTables, error: tablesError },
        { data: todayCheckin, error: checkinError },
      ] = await Promise.all([
        supabase.from("fitlog_profiles").select("*").eq("user_id", user.id).single(),
        supabase
          .from("fitlog_workouts")
          .select("*")
          .eq("user_id", user.id)
          .eq("workout_date", today)
          .order("created_at", { ascending: false }),
        supabase
          .from("fitlog_meals")
          .select("*")
          .eq("user_id", user.id)
          .eq("meal_date", today)
          .order("created_at", { ascending: false }),
        supabase
          .from("fitlog_goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_completed", false)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("fitlog_daily_logs").select("*").eq("user_id", user.id).eq("log_date", today).single(),
        supabase
          .from("fitlog_weekly_tables")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase.from("fitlog_daily_checkins").select("*").eq("user_id", user.id).eq("checkin_date", today).single(),
      ])

      // Log any errors for debugging
      if (profileError && profileError.code !== "PGRST116") console.log("Profile error:", profileError)
      if (workoutsError) console.log("Workouts error:", workoutsError)
      if (mealsError) console.log("Meals error:", mealsError)
      if (goalsError) console.log("Goals error:", goalsError)
      if (logError && logError.code !== "PGRST116") console.log("Log error:", logError)
      if (tablesError) console.log("Tables error:", tablesError)
      if (checkinError && checkinError.code !== "PGRST116") console.log("Checkin error:", checkinError)

      // Create default profile if none exists
      let finalUserProfile = userProfile
      if (!userProfile && !profileError) {
        console.log("Creating default profile for user")
        const { data: newProfile } = await supabase
          .from("fitlog_profiles")
          .insert({
            user_id: user.id,
            daily_calorie_target: 2000,
            daily_protein_target: 150,
            daily_carb_target: 200,
            daily_fat_target: 70,
            daily_workout_minutes: 60,
          })
          .select()
          .single()

        finalUserProfile = newProfile
      }

      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FitLogDashboard
            user={user}
            userProfile={finalUserProfile}
            todayWorkouts={todayWorkouts || []}
            todayMeals={todayMeals || []}
            activeGoals={activeGoals || []}
            todayLog={todayLog}
            weeklyTables={weeklyTables || []}
            todayCheckin={todayCheckin}
          />
        </ThemeProvider>
      )
    } catch (error) {
      console.error("Error loading FitLog data:", error)
      // Return with empty data if there's an error
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FitLogDashboard
            user={user}
            userProfile={null}
            todayWorkouts={[]}
            todayMeals={[]}
            activeGoals={[]}
            todayLog={null}
            weeklyTables={[]}
            todayCheckin={null}
          />
        </ThemeProvider>
      )
    }
  }

  // Handle docs domain (example for future)
  if (domain === "docs") {
    console.log("📚 Loading Docs app")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">DisPlan Docs</h1>
          <p>Documentation will be here</p>
        </div>
      </div>
    )
  }

  // MAIN WEBSITE BUILDER LOGIC - This is where your published sites are handled
  console.log("🎯 Processing website builder domain:", domain)

  try {
    const siteData = await getPublishedSiteData(domain)

    console.log("📊 Site data received:", {
      found: !!siteData,
      elementsCount: siteData?.elements?.length || 0,
      siteName: siteData?.name,
    })

    if (!siteData) {
      console.log("❌ No site data found, returning 404")
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Not Found</h1>
            <p className="text-gray-600 mb-4">The site "{domain}" could not be found.</p>
            <p className="text-sm text-gray-500">Make sure the site is published and the subdomain is correct.</p>
          </div>
        </div>
      )
    }
            
    console.log("✅ Rendering PublishedSiteRenderer with data")
    return <div style={{overflow: "hidden",}}>
      <PublishedSiteRenderer siteData={siteData} />
    </div>
  } catch (error) {
    console.error("💥 Error in domain page:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">Something went wrong while loading this site.</p>
          <p className="text-sm text-gray-500">Please try again later.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: DomainPageProps) {
  const { domain } = params

  // Skip processing for the main domain
  if (domain === "www" || domain === "displan") {
    return {
      title: "DisPlan",
      description: "Build and publish websites easily",
    }
  }

  // Handle special app domains metadata
  if (domain === "fitlog") {
    return {
      title: "FitLog - Fitness Tracker by DisPlan",
      description: "Track your workouts, nutrition, and fitness goals with AI-powered coaching",
      openGraph: {
        title: "FitLog - Fitness Tracker",
        description: "Track your workouts, nutrition, and fitness goals with AI-powered coaching",
      },
    }
  }

  if (domain === "docs") {
    return {
      title: "DisPlan Documentation",
      description: "Learn how to build amazing websites with DisPlan",
    }
  }

  // WEBSITE BUILDER metadata logic
  try {
    const siteData = await getPublishedSiteData(domain)

    if (!siteData) {
      return {
        title: "Site Not Found",
        description: "The requested site could not be found.",
      }
    }

    const title = siteData.name || `${domain} - Built with DisPlan`
    return {
      title: title,
      description: siteData.description || `A website built with DisPlan`,
      openGraph: {
        title: title,
        description: siteData.description || `A website built with DisPlan`,
        images: siteData.social_preview_url ? [siteData.social_preview_url] : [],
      },
      icons: {
        icon: siteData.favicon_light_url || "/favicon.ico",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "DisPlan Site",
      description: "A website built with DisPlan",
    }
  }
}
