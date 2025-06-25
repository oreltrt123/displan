"use client"

import { useState, useEffect } from "react"
import { Loader2, Bot } from "lucide-react"

interface WorkoutAIAnalysisProps {
  workout: any
  recentWorkouts: any[]
  userId: string
}

export function WorkoutAIAnalysis({ workout, recentWorkouts, userId }: WorkoutAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateAnalysis()
  }, [workout, recentWorkouts])

  const generateAnalysis = async () => {
    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      // Calculate some stats for context
      const avgCalories =
        recentWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0) / (recentWorkouts.length || 1)
      const avgDuration =
        recentWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / (recentWorkouts.length || 1)
      const totalWorkouts = recentWorkouts.length

      const systemPrompt = `You are FitLog AI Coach, built by DisPlan. Analyze this specific workout and provide detailed insights.

WORKOUT DETAILS:
- Name: ${workout.name}
- Duration: ${workout.duration_minutes} minutes
- Calories Burned: ${workout.calories_burned}
- Intensity: ${workout.intensity}
- Date: ${workout.workout_date}
- Description: ${workout.description || "No description provided"}

USER'S RECENT PERFORMANCE:
- Total recent workouts: ${totalWorkouts}
- Average calories per workout: ${Math.round(avgCalories)}
- Average duration: ${Math.round(avgDuration)} minutes
- Recent workout names: ${recentWorkouts
        .slice(0, 5)
        .map((w) => w.name)
        .join(", ")}

ANALYSIS REQUIREMENTS:
1. Evaluate this specific workout's effectiveness
2. Compare it to their recent performance trends
3. Identify strengths and areas for improvement
4. Provide specific, actionable recommendations
5. Comment on workout intensity and duration appropriateness
6. Suggest next steps for their fitness journey

Keep the analysis detailed but concise (3-4 paragraphs). Be encouraging and motivational while providing honest feedback.`

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
          "Great workout! Your consistency is paying off. Keep focusing on maintaining good form and gradually increasing intensity as you build strength and endurance.",
        )
      }
    } catch (error) {
      console.error("Error generating analysis:", error)
      setAnalysis(
        "I'm having trouble generating a detailed analysis right now, but this workout looks solid! Keep up the great work and stay consistent with your training.",
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Analyzing your workout...</span>
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
