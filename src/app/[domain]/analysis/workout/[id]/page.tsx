import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Flame, Dumbbell, TrendingUp, Target, AlertCircle } from "lucide-react"
import Link from "next/link"
import { WorkoutAIAnalysis } from "../../../fitlog/components/workout-ai-analysis"

interface WorkoutAnalysisPageProps {
  params: {
    domain: string
    id: string
  }
}

export default async function WorkoutAnalysisPage({ params }: WorkoutAnalysisPageProps) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in to view workout analysis</h1>
          <Link href="/fitlog" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Fetch workout data
  const { data: workout, error } = await supabase
    .from("fitlog_workouts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !workout) {
    notFound()
  }

  // Fetch user's recent workouts for comparison
  const { data: recentWorkouts } = await supabase
    .from("fitlog_workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false })
    .limit(10)

  // Calculate some basic stats
  const avgCalories =
    recentWorkouts?.reduce((sum, w) => sum + (w.calories_burned || 0), 0) / (recentWorkouts?.length || 1)
  const avgDuration =
    recentWorkouts?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / (recentWorkouts?.length || 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/fitlog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">Detailed insights for your training session</p>
          </div>
        </div>

        {/* Workout Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{workout.name}</CardTitle>
                <CardDescription className="mt-2">
                  {new Date(workout.workout_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <Badge
                variant={
                  workout.intensity === "high"
                    ? "destructive"
                    : workout.intensity === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {workout.intensity} intensity
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {workout.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{workout.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-xl font-bold">{workout.duration_minutes} min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories Burned</p>
                  <p className="text-xl font-bold">{workout.calories_burned}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Dumbbell className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Intensity</p>
                  <p className="text-xl font-bold capitalize">{workout.intensity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Performance Comparison
            </CardTitle>
            <CardDescription>How this workout compares to your recent sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calories vs Average</span>
                  {workout.calories_burned > avgCalories ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Above Average
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Below Average</Badge>
                  )}
                </div>
                <p className="text-lg font-semibold">
                  {workout.calories_burned} vs {Math.round(avgCalories)} avg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {workout.calories_burned > avgCalories ? "+" : ""}
                  {Math.round(workout.calories_burned - avgCalories)} calories
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration vs Average</span>
                  {workout.duration_minutes > avgDuration ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Longer Session
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Shorter Session</Badge>
                  )}
                </div>
                <p className="text-lg font-semibold">
                  {workout.duration_minutes} vs {Math.round(avgDuration)} min avg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {workout.duration_minutes > avgDuration ? "+" : ""}
                  {Math.round(workout.duration_minutes - avgDuration)} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              AI Coach Analysis
            </CardTitle>
            <CardDescription>Personalized insights and recommendations from your AI fitness coach</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutAIAnalysis workout={workout} recentWorkouts={recentWorkouts || []} userId={user.id} />
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Quick Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workout.intensity === "high" && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Recovery Tip:</strong> After a high-intensity workout, consider a rest day or light activity
                  tomorrow to allow proper recovery.
                </p>
              </div>
            )}

            {workout.duration_minutes < 30 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Duration Tip:</strong> Consider extending your next workout to 30-45 minutes for optimal
                  cardiovascular benefits.
                </p>
              </div>
            )}

            {workout.calories_burned < avgCalories * 0.8 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Intensity Tip:</strong> You might benefit from increasing the intensity of your workouts to
                  burn more calories.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
