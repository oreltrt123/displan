"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, CheckCircle, Clock, Target, Utensils, Dumbbell } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DailyCheckinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: any
  existingCheckin?: any
  userId: string
  onSuccess?: () => void
}

export function DailyCheckinDialog({
  open,
  onOpenChange,
  plan,
  existingCheckin,
  userId,
  onSuccess,
}: DailyCheckinDialogProps) {
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [formData, setFormData] = useState({
    morning_completed: false,
    afternoon_completed: false,
    evening_completed: false,
    workout_completed: false,
    nutrition_completed: false,
    goals_completed: [] as string[],
    overall_satisfaction: 5,
    challenges_faced: "",
    wins_of_the_day: "",
    notes: "",
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (existingCheckin) {
      setFormData({
        morning_completed: existingCheckin.morning_completed || false,
        afternoon_completed: existingCheckin.afternoon_completed || false,
        evening_completed: existingCheckin.evening_completed || false,
        workout_completed: existingCheckin.workout_completed || false,
        nutrition_completed: existingCheckin.nutrition_completed || false,
        goals_completed: existingCheckin.goals_completed || [],
        overall_satisfaction: existingCheckin.overall_satisfaction || 5,
        challenges_faced: existingCheckin.challenges_faced || "",
        wins_of_the_day: existingCheckin.wins_of_the_day || "",
        notes: existingCheckin.notes || "",
      })
    }
  }, [existingCheckin])

  const generateAIFeedback = async (checkinData: any) => {
    setAiLoading(true)
    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      const completedActivities = [
        checkinData.morning_completed,
        checkinData.afternoon_completed,
        checkinData.evening_completed,
        checkinData.workout_completed,
        checkinData.nutrition_completed,
      ].filter(Boolean).length

      const totalActivities = [
        plan.morning_plan,
        plan.afternoon_plan,
        plan.evening_plan,
        plan.workout_plan,
        plan.nutrition_plan,
      ].filter(Boolean).length

      const systemPrompt = `You are FitLog AI Coach, built by DisPlan. Provide personalized feedback for this daily check-in.

DAILY PLAN:
- Morning Plan: ${plan.morning_plan || "None"}
- Afternoon Plan: ${plan.afternoon_plan || "None"}
- Evening Plan: ${plan.evening_plan || "None"}
- Workout Plan: ${plan.workout_plan || "None"}
- Nutrition Plan: ${plan.nutrition_plan || "None"}
- Goals: ${plan.goals_for_day?.join(", ") || "None"}

CHECK-IN RESULTS:
- Activities Completed: ${completedActivities}/${totalActivities}
- Morning Completed: ${checkinData.morning_completed}
- Afternoon Completed: ${checkinData.afternoon_completed}
- Evening Completed: ${checkinData.evening_completed}
- Workout Completed: ${checkinData.workout_completed}
- Nutrition Completed: ${checkinData.nutrition_completed}
- Goals Completed: ${checkinData.goals_completed.join(", ") || "None"}
- Overall Satisfaction: ${checkinData.overall_satisfaction}/10
- Challenges: ${checkinData.challenges_faced || "None mentioned"}
- Wins: ${checkinData.wins_of_the_day || "None mentioned"}
- Notes: ${checkinData.notes || "None"}

Provide encouraging, specific feedback (2-3 sentences) that:
1. Acknowledges their progress and effort
2. Addresses any challenges they faced
3. Celebrates their wins
4. Offers constructive suggestions for tomorrow
5. Maintains a positive, motivational tone

Keep it personal and actionable.`

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
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
      const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text

      return (
        feedback ||
        "Great job on your daily check-in! Keep up the excellent work and stay consistent with your fitness journey. Every step forward is progress worth celebrating! 💪"
      )
    } catch (error) {
      console.error("Error generating AI feedback:", error)
      return "Excellent work on completing your daily check-in! Your dedication to tracking your progress shows real commitment to your fitness goals. Keep it up! 🌟"
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate AI feedback
      const aiFeedback = await generateAIFeedback(formData)

      const checkinData = {
        user_id: userId,
        daily_plan_id: plan.id,
        checkin_date: plan.plan_date,
        ...formData,
        ai_feedback: aiFeedback,
      }

      let error
      if (existingCheckin) {
        // Update existing check-in
        const result = await supabase.from("fitlog_daily_checkins").update(checkinData).eq("id", existingCheckin.id)
        error = result.error
      } else {
        // Create new check-in
        const result = await supabase.from("fitlog_daily_checkins").insert(checkinData)
        error = result.error
      }

      if (error) throw error

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error saving check-in:", error)
      alert("Error saving check-in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][plan.day_of_week]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Daily Check-in: {dayName}
          </DialogTitle>
          <DialogDescription>{new Date(plan.plan_date).toLocaleDateString()} • How did your day go?</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Today's Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.morning_plan && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Morning</p>
                    <p className="text-sm text-muted-foreground">{plan.morning_plan}</p>
                  </div>
                  <Checkbox
                    checked={formData.morning_completed}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, morning_completed: !!checked }))}
                  />
                </div>
              )}

              {plan.afternoon_plan && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Afternoon</p>
                    <p className="text-sm text-muted-foreground">{plan.afternoon_plan}</p>
                  </div>
                  <Checkbox
                    checked={formData.afternoon_completed}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, afternoon_completed: !!checked }))}
                  />
                </div>
              )}

              {plan.evening_plan && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Evening</p>
                    <p className="text-sm text-muted-foreground">{plan.evening_plan}</p>
                  </div>
                  <Checkbox
                    checked={formData.evening_completed}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, evening_completed: !!checked }))}
                  />
                </div>
              )}

              {plan.workout_plan && (
                <div className="flex items-start gap-2">
                  <Dumbbell className="w-4 h-4 mt-0.5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Workout</p>
                    <p className="text-sm text-muted-foreground">{plan.workout_plan}</p>
                  </div>
                  <Checkbox
                    checked={formData.workout_completed}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, workout_completed: !!checked }))}
                  />
                </div>
              )}

              {plan.nutrition_plan && (
                <div className="flex items-start gap-2">
                  <Utensils className="w-4 h-4 mt-0.5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nutrition</p>
                    <p className="text-sm text-muted-foreground">{plan.nutrition_plan}</p>
                  </div>
                  <Checkbox
                    checked={formData.nutrition_completed}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, nutrition_completed: !!checked }))}
                  />
                </div>
              )}

              {plan.goals_for_day?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <p className="text-sm font-medium">Daily Goals</p>
                  </div>
                  {plan.goals_for_day.map((goal: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 ml-6">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{goal}</p>
                      </div>
                      <Checkbox
                        checked={formData.goals_completed.includes(goal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              goals_completed: [...prev.goals_completed, goal],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              goals_completed: prev.goals_completed.filter((g) => g !== goal),
                            }))
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Satisfaction Rating */}
          <div className="space-y-3">
            <Label>Overall Satisfaction: {formData.overall_satisfaction}/10</Label>
            <Slider
              value={[formData.overall_satisfaction]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, overall_satisfaction: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Reflection Questions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wins">🎉 What were your wins today?</Label>
              <Textarea
                id="wins"
                value={formData.wins_of_the_day}
                onChange={(e) => setFormData((prev) => ({ ...prev, wins_of_the_day: e.target.value }))}
                placeholder="Celebrate your achievements, no matter how small..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges">🤔 What challenges did you face?</Label>
              <Textarea
                id="challenges"
                value={formData.challenges_faced}
                onChange={(e) => setFormData((prev) => ({ ...prev, challenges_faced: e.target.value }))}
                placeholder="What made today difficult? How can you improve tomorrow?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">📝 Additional notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any other thoughts about your day..."
                rows={3}
              />
            </div>
          </div>

          {/* Show existing AI feedback if available */}
          {existingCheckin?.ai_feedback && (
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5 text-purple-500" />
                  AI Coach Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 dark:text-purple-200">{existingCheckin.ai_feedback}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || aiLoading}>
              {loading
                ? "Saving..."
                : aiLoading
                  ? "Generating AI feedback..."
                  : existingCheckin
                    ? "Update Check-in"
                    : "Complete Check-in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
