"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Edit, MessageSquare, Target, Utensils, Dumbbell } from "lucide-react"

interface DailyPlanCardProps {
  plan: any
  checkin?: any
  dayName: string
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  onCheckinClick: () => void
  onEditClick: () => void
}

export function DailyPlanCard({
  plan,
  checkin,
  dayName,
  isToday,
  isPast,
  isFuture,
  onCheckinClick,
  onEditClick,
}: DailyPlanCardProps) {
  const hasContent =
    plan.morning_plan ||
    plan.afternoon_plan ||
    plan.evening_plan ||
    plan.workout_plan ||
    plan.nutrition_plan ||
    plan.goals_for_day?.length > 0

  const completedActivities = checkin
    ? [
        checkin.morning_completed,
        checkin.afternoon_completed,
        checkin.evening_completed,
        checkin.workout_completed,
        checkin.nutrition_completed,
      ].filter(Boolean).length
    : 0

  const totalActivities = [
    plan.morning_plan,
    plan.afternoon_plan,
    plan.evening_plan,
    plan.workout_plan,
    plan.nutrition_plan,
  ].filter(Boolean).length

  const formatDateConsistently = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  return (
    <Card className={`${isToday ? "ring-2 ring-blue-500" : ""} ${checkin ? "bg-green-50 dark:bg-green-900/10" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {dayName}
              {isToday && <Badge variant="default">Today</Badge>}
              {checkin && <CheckCircle className="w-5 h-5 text-green-500" />}
            </CardTitle>
            <CardDescription>{formatDateConsistently(plan.plan_date)}</CardDescription>
          </div>
          <Badge
            variant={
              plan.priority_level === "high"
                ? "destructive"
                : plan.priority_level === "medium"
                  ? "default"
                  : "secondary"
            }
          >
            {plan.priority_level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Content Preview */}
        {hasContent ? (
          <div className="space-y-3">
            {plan.morning_plan && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Morning</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{plan.morning_plan}</p>
                </div>
              </div>
            )}

            {plan.workout_plan && (
              <div className="flex items-start gap-2">
                <Dumbbell className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Workout</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{plan.workout_plan}</p>
                </div>
              </div>
            )}

            {plan.nutrition_plan && (
              <div className="flex items-start gap-2">
                <Utensils className="w-4 h-4 mt-0.5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Nutrition</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{plan.nutrition_plan}</p>
                </div>
              </div>
            )}

            {plan.goals_for_day?.length > 0 && (
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 mt-0.5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Goals</p>
                  <p className="text-xs text-muted-foreground">{plan.goals_for_day.length} goals set</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No plans set for this day</p>
          </div>
        )}

        {/* Progress */}
        {checkin && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed Activities</span>
              <span>
                {completedActivities}/{totalActivities}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: totalActivities > 0 ? `${(completedActivities / totalActivities) * 100}%` : "0%" }}
              />
            </div>
            {checkin.overall_satisfaction && (
              <p className="text-xs text-muted-foreground">Satisfaction: {checkin.overall_satisfaction}/10</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(isToday || isPast) && (
            <button onClick={onCheckinClick} className="button_rrui1">
              {checkin ? "View Check-in" : "Daily Check-in"}
            </button>
          )}
          {/* <Button onClick={onEditClick} size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}
