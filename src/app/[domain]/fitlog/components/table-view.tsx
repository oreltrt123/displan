"use client"

import { useState } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, Target } from "lucide-react"
import { DailyPlanCard } from "./daily-plan-card"
import { DailyCheckinDialog } from "./daily-checkin-dialog"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface TableViewProps {
  user: User
  table: any
  dailyPlans: any[]
  checkins: any[]
}

export function TableView({ user, table, dailyPlans: initialDailyPlans, checkins: initialCheckins }: TableViewProps) {
  const [dailyPlans, setDailyPlans] = useState(initialDailyPlans)
  const [checkins, setCheckins] = useState(initialCheckins)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showCheckinDialog, setShowCheckinDialog] = useState(false)

  const supabase = createClientComponentClient()

  const refreshData = async () => {
    try {
      const [plansResult, checkinsResult] = await Promise.all([
        supabase
          .from("fitlog_daily_plans")
          .select("*")
          .eq("weekly_table_id", table.id)
          .order("plan_date", { ascending: true }),

        supabase
          .from("fitlog_daily_checkins")
          .select("*")
          .eq("user_id", user.id)
          .in(
            "daily_plan_id",
            dailyPlans.map((plan) => plan.id),
          ),
      ])

      setDailyPlans(plansResult.data || [])
      setCheckins(checkinsResult.data || [])
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  const handleCheckinClick = (plan: any) => {
    setSelectedPlan(plan)
    setShowCheckinDialog(true)
  }

  // Calculate progress statistics
  const totalDays = dailyPlans.length
  const completedCheckins = checkins.length
  const progressPercentage = totalDays > 0 ? (completedCheckins / totalDays) * 100 : 0

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = new Date().toISOString().split("T")[0]

  const formatDateConsistently = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{table.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDateConsistently(table.start_date)} - {formatDateConsistently(table.end_date)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <ThemeToggle /> */}
            <Link href="/fitlog">
              <button className="button_rrui">Back to Dashboard</button>
            </Link>
          </div>
        </div>

        {/* Table Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Week Overview
            </CardTitle>
            <CardDescription>{table.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalDays}</p>
                <p className="text-sm text-muted-foreground">Total Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{completedCheckins}</p>
                <p className="text-sm text-muted-foreground">Check-ins Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                <p className="text-sm text-muted-foreground">Week Progress</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Week Completion</span>
                <span>
                  {completedCheckins}/{totalDays} days
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {dailyPlans.map((plan) => {
            const checkin = checkins.find((c) => c.daily_plan_id === plan.id)
            const isToday = plan.plan_date === today
            const isPast = plan.plan_date < today
            const isFuture = plan.plan_date > today

            return (
              <DailyPlanCard
                key={plan.id}
                plan={plan}
                checkin={checkin}
                dayName={dayNames[plan.day_of_week]}
                isToday={isToday}
                isPast={isPast}
                isFuture={isFuture}
                onCheckinClick={() => handleCheckinClick(plan)}
                onEditClick={() => {
                  /* TODO: Implement edit */
                }}
              />
            )
          })}
        </div>

        {/* Daily Check-in Dialog */}
        {selectedPlan && (
          <DailyCheckinDialog
            open={showCheckinDialog}
            onOpenChange={setShowCheckinDialog}
            plan={selectedPlan}
            existingCheckin={checkins.find((c) => c.daily_plan_id === selectedPlan.id)}
            userId={user.id}
            onSuccess={refreshData}
          />
        )}
      </div>
    </div>
  )
}
