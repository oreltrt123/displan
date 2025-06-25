"use client"

import { useState, useEffect } from "react"
import { Loader2, Bot } from "lucide-react"

interface MealAIAnalysisProps {
  meal: any
  recentMeals: any[]
  userId: string
}

export function MealAIAnalysis({ meal, recentMeals, userId }: MealAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateAnalysis()
  }, [meal, recentMeals])

  const generateAnalysis = async () => {
    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      // Calculate some stats for context
      const avgCalories = recentMeals.reduce((sum, m) => sum + (m.calories || 0), 0) / (recentMeals.length || 1)
      const avgProtein = recentMeals.reduce((sum, m) => sum + (m.protein_g || 0), 0) / (recentMeals.length || 1)
      const avgCarbs = recentMeals.reduce((sum, m) => sum + (m.carbs_g || 0), 0) / (recentMeals.length || 1)
      const avgFats = recentMeals.reduce((sum, m) => sum + (m.fat_g || 0), 0) / (recentMeals.length || 1)
      const totalMeals = recentMeals.length

      const systemPrompt = `You are FitLog AI Coach, built by DisPlan. Analyze this specific meal and provide detailed nutritional insights.

MEAL DETAILS:
- Name: ${meal.name}
- Type: ${meal.meal_type}
- Calories: ${meal.calories}
- Protein: ${meal.protein_g}g
- Carbs: ${meal.carbs_g}g
- Fat: ${meal.fat_g}g
- Date: ${meal.meal_date}

USER'S RECENT NUTRITION PATTERNS:
- Total recent meals: ${totalMeals}
- Average calories per meal: ${Math.round(avgCalories)}
- Average protein: ${Math.round(avgProtein)}g
- Average carbs: ${Math.round(avgCarbs)}g
- Average fats: ${Math.round(avgFats)}g
- Recent meal types: ${recentMeals
        .slice(0, 5)
        .map((m) => m.meal_type)
        .join(", ")}

ANALYSIS REQUIREMENTS:
1. Evaluate this meal's nutritional balance and quality
2. Compare macronutrient ratios to optimal ranges
3. Assess how it fits into their overall eating patterns
4. Identify nutritional strengths and areas for improvement
5. Provide specific recommendations for better nutrition
6. Comment on meal timing and portion appropriateness
7. Suggest complementary foods or adjustments

Keep the analysis detailed but concise (3-4 paragraphs). Be encouraging and educational while providing honest nutritional feedback.`

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (reply) {
        setAnalysis(reply)
      } else {
        setAnalysis(
          "This meal looks nutritious! Focus on maintaining a good balance of protein, carbs, and healthy fats. Keep tracking your meals to build healthy eating habits.",
        )
      }
    } catch (error) {
      console.error("Error generating analysis:", error)
      setAnalysis(
        "I'm having trouble generating a detailed analysis right now, but this meal looks good! Keep focusing on balanced nutrition and consistent meal tracking.",
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Analyzing your meal...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Bot className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="prose prose-sm max-w-none">
            {analysis.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
