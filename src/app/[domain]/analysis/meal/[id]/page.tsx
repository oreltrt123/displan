import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UtensilsCrossed, Target, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { MealAIAnalysis } from "../../../fitlog/components/meal-ai-analysis"

interface MealAnalysisPageProps {
  params: {
    domain: string
    id: string
  }
}

export default async function MealAnalysisPage({ params }: MealAnalysisPageProps) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in to view meal analysis</h1>
          <Link href="/fitlog" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Fetch meal data
  const { data: meal, error } = await supabase
    .from("fitlog_meals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !meal) {
    notFound()
  }

  // Fetch user's recent meals for comparison
  const { data: recentMeals } = await supabase
    .from("fitlog_meals")
    .select("*")
    .eq("user_id", user.id)
    .order("meal_date", { ascending: false })
    .limit(20)

  // Calculate some basic stats
  const avgCalories = recentMeals?.reduce((sum, m) => sum + (m.calories || 0), 0) / (recentMeals?.length || 1)
  const avgProtein = recentMeals?.reduce((sum, m) => sum + (m.protein_g || 0), 0) / (recentMeals?.length || 1)

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meal Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">Detailed nutritional insights for your meal</p>
          </div>
        </div>

        {/* Meal Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{meal.name}</CardTitle>
                <CardDescription className="mt-2">
                  {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)} •{" "}
                  {new Date(meal.meal_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <Badge variant="secondary">{meal.meal_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <UtensilsCrossed className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                  <p className="text-xl font-bold">{meal.calories}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                  <p className="text-xl font-bold">{meal.protein_g}g</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  C
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
                  <p className="text-xl font-bold">{meal.carbs_g}g</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  F
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                  <p className="text-xl font-bold">{meal.fat_g}g</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Nutritional Comparison
            </CardTitle>
            <CardDescription>How this meal compares to your recent eating patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calories vs Average</span>
                  {meal.calories > avgCalories ? (
                    <Badge
                      variant="default"
                      className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    >
                      Above Average
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Below Average</Badge>
                  )}
                </div>
                <p className="text-lg font-semibold">
                  {meal.calories} vs {Math.round(avgCalories)} avg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {meal.calories > avgCalories ? "+" : ""}
                  {Math.round(meal.calories - avgCalories)} calories
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Protein vs Average</span>
                  {meal.protein_g > avgProtein ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Higher Protein
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Lower Protein</Badge>
                  )}
                </div>
                <p className="text-lg font-semibold">
                  {meal.protein_g}g vs {Math.round(avgProtein)}g avg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {meal.protein_g > avgProtein ? "+" : ""}
                  {Math.round(meal.protein_g - avgProtein)}g protein
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
              AI Nutritional Analysis
            </CardTitle>
            <CardDescription>Personalized insights and recommendations from your AI nutrition coach</CardDescription>
          </CardHeader>
          <CardContent>
            <MealAIAnalysis meal={meal} recentMeals={recentMeals || []} userId={user.id} />
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
            {meal.protein_g < 20 && meal.meal_type !== "snack" && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Protein Tip:</strong> Consider adding more protein to your {meal.meal_type}. Aim for 20-30g of
                  protein per main meal.
                </p>
              </div>
            )}

            {meal.calories > 800 && meal.meal_type !== "dinner" && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Portion Tip:</strong> This meal is quite calorie-dense. Consider smaller portions or splitting
                  it into two meals.
                </p>
              </div>
            )}

            {meal.carbs_g > meal.protein_g * 3 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Balance Tip:</strong> This meal is carb-heavy. Try to balance it with more protein and healthy
                  fats.
                </p>
              </div>
            )}

            {meal.protein_g > avgProtein * 1.5 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Great Choice:</strong> Excellent protein content! This will help with muscle recovery and
                  satiety.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
