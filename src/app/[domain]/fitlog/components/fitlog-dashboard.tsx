"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Target,
  Flame,
  Clock,
  Plus,
  Zap,
  Dumbbell,
  UtensilsCrossed,
  Droplets,
  UserIcon,
  LogIn,
  ChevronRight,
  Calendar,
  Trash2,
} from "lucide-react"
import { ServerFitLogAI } from "./server-fitlog-ai"
import { AddWorkoutDialog } from "./add-workout-dialog"
import { AddMealDialog } from "./add-meal-dialog"
import { UpdateDailyLogDialog } from "./update-daily-log-dialog"
import { WeeklyTablesOverview } from "./weekly-tables-overview"
import { DataManagementDialog } from "./data-management-dialog"
import AuthModal from "./auth-modal"
import { ThemeToggle } from "./theme-toggle"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import "@/styles/button_rrui.css"
import "@/styles/sidebar_settings_editor.css"

// Add this helper function at the top level to fix date formatting
const formatDateConsistently = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
}

interface FitLogDashboardProps {
  user: User | null
  userProfile: any
  todayWorkouts: any[]
  todayMeals: any[]
  activeGoals: any[]
  todayLog: any
  weeklyTables?: any[]
  todayCheckin?: any
}

export function FitLogDashboard({
  user: initialUser,
  userProfile: initialUserProfile,
  todayWorkouts: initialTodayWorkouts,
  todayMeals: initialTodayMeals,
  activeGoals: initialActiveGoals,
  todayLog: initialTodayLog,
  weeklyTables: initialWeeklyTables = [],
  todayCheckin: initialTodayCheckin,
}: FitLogDashboardProps) {
  const [user] = useState<User | null>(initialUser)
  const [userProfile, setUserProfile] = useState(initialUserProfile)
  const [todayWorkouts, setTodayWorkouts] = useState(initialTodayWorkouts)
  const [todayMeals, setTodayMeals] = useState(initialTodayMeals)
  const [activeGoals, setActiveGoals] = useState(initialActiveGoals)
  const [todayLog, setTodayLog] = useState(initialTodayLog)
  const [weeklyTables, setWeeklyTables] = useState(initialWeeklyTables)
  const [todayCheckin, setTodayCheckin] = useState(initialTodayCheckin)
  const [isClient, setIsClient] = useState(false)

  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showUpdateLog, setShowUpdateLog] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDataManagement, setShowDataManagement] = useState(false)

  const supabase = createClientComponentClient()

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
    // Load fresh data on client mount
    if (user) {
      refreshData()
    }
  }, [user])

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Refresh the page to get new data
    setTimeout(() => {
      window.location.href = window.location.href
    }, 100)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = window.location.href
  }

  // Enhanced refresh function that updates all state
  const refreshData = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split("T")[0]

      const [profileResult, workoutsResult, mealsResult, goalsResult, logResult, tablesResult, checkinResult] =
        await Promise.all([
          supabase.from("fitlog_profiles").select("*").eq("user_id", user.id).single(),

          supabase
            .from("fitlog_workouts")
            .select("*")
            .eq("user_id", user.id)
            .eq("workout_date", today)
            .order("created_at", { ascending: false }),

          supabase.from("fitlog_meals").select("*").eq("user_id", user.id).eq("meal_date", today),

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

      // Update all state with fresh data
      setUserProfile(profileResult.data)
      setTodayWorkouts(workoutsResult.data || [])
      setTodayMeals(mealsResult.data || [])
      setActiveGoals(goalsResult.data || [])
      setTodayLog(logResult.data)
      setWeeklyTables(tablesResult.data || [])
      setTodayCheckin(checkinResult.data)
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  // Calculate real stats from data
  const totalCaloriesBurned = todayWorkouts.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0)
  const totalWorkoutMinutes = todayWorkouts.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0)
  const totalCaloriesConsumed = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
  const totalProtein = todayMeals.reduce((sum, meal) => sum + (meal.protein_g || 0), 0)
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs_g || 0), 0)
  const totalFats = todayMeals.reduce((sum, meal) => sum + (meal.fat_g || 0), 0)
  const waterGlasses = todayLog?.water_glasses || 0
  const completedGoals = activeGoals.filter((goal) => goal.current_value >= goal.target_value).length

  // Calculate daily targets
  const dailyCalorieTarget = userProfile?.daily_calorie_target || 2000
  const dailyProteinTarget = userProfile?.daily_protein_target || 150
  const dailyCarbTarget = userProfile?.daily_carb_target || 200
  const dailyFatTarget = userProfile?.daily_fat_target || 70
  const dailyWorkoutTarget = userProfile?.daily_workout_minutes || 60
  const dailyWaterTarget = 8

  // Get user display name
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Guest"
  const userEmail = user?.email

  // Don't render until client-side to prevent hydration errors
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                {user ? <UserIcon className="w-6 h-6 text-white" /> : <Dumbbell className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userName}!</h1>
                {user ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</p>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-orange-600 dark:text-orange-400 underline"
                        onClick={() => setShowAuthModal(true)}
                      >
                        Login with Google
                      </Button>{" "}
                      to save your progress
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Ready to crush your fitness goals today?</p>
          </div>
<div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
  {/* <ThemeToggle /> */}
  {!user && (
    <button onClick={() => setShowAuthModal(true)} className="button_rrui">
      Login
    </button>
  )}
  <button onClick={() => setShowAddWorkout(true)} disabled={!user} className="button_rrui">
    Log Workout
  </button>
  <button onClick={() => setShowAddMeal(true)} disabled={!user} className="button_rrui">
    Log Meal
  </button>
  <Link href="/tables">
    <button disabled={!user} className="button_rrui">
      Tables
    </button>
  </Link>
  <button onClick={() => setShowDataManagement(true)} disabled={!user} className="button_rrui">
    Manage Data
  </button>
  <button
    onClick={() => setShowUpdateLog(true)}
    className="button_rrui1"
    disabled={!user}
  >
    Update Log
  </button>
</div>

          </div>

        {/* Quick Stats - Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Calories Burned</p>
                  <p className="text-xs text-black dark:text-white/70">Today</p>
                  <p className="text-2xl font-bold">{totalCaloriesBurned}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Flame className="w-10 h-10 text-black dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Minutes</p>
                  <p className="text-xs text-black dark:text-white/70">Today</p>
                  <p className="text-2xl font-bold">{totalWorkoutMinutes}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Activity className="w-10 h-10 text-black dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Goals Progress</p>
                  <p className="text-xs text-black dark:text-white/70">Active goals</p>
                  <p className="text-2xl font-bold">
                    {completedGoals}/{activeGoals.length}
                  </p>
                </div>
                <div className="p-3 rounded-full">
                  <Target className="w-10 h-10 text-black dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Water Intake</p>
                  <p className="text-xs text-black dark:text-white/70">Glasses today</p>
                  <p className="text-2xl font-bold">{waterGlasses}/8</p>
                </div>
                <div className="p-3 rounded-full">
                  <Droplets className="w-10 h-10 text-black dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Tables Overview */}
            {user && <WeeklyTablesOverview weeklyTables={weeklyTables} todayCheckin={todayCheckin} />}

            {/* Today's Progress - Real Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Today's Progress
                </CardTitle>
                <CardDescription>Your daily fitness achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workout Goal</span>
                    <span>
                      {totalWorkoutMinutes}/{dailyWorkoutTarget} min
                    </span>
                  </div>
                  <Progress value={(totalWorkoutMinutes / dailyWorkoutTarget) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Calories Consumed</span>
                    <span>
                      {totalCaloriesConsumed}/{dailyCalorieTarget}
                    </span>
                  </div>
                  <Progress value={(totalCaloriesConsumed / dailyCalorieTarget) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Water Intake</span>
                    <span>
                      {waterGlasses}/{dailyWaterTarget} glasses
                    </span>
                  </div>
                  <Progress value={(waterGlasses / dailyWaterTarget) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Workouts - Real Data with Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-blue-500" />
                  Today's Workouts
                </CardTitle>
                <CardDescription>Your training sessions today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayWorkouts.length > 0 ? (
                  todayWorkouts.map((workout, index) => (
                    <Link key={index} href={`/analysis/workout/${workout.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                        <div className="space-y-1">
                          <h4 className="font-medium">{workout.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {workout.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {workout.calories_burned} cal
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={workout.intensity === "high" ? "destructive" : "secondary"}>
                            {workout.intensity}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No workouts logged today</p>
                    {user ? (
                      <Button onClick={() => setShowAddWorkout(true)} className="mt-2">
                        Log Your First Workout
                      </Button>
                    ) : (
                      <Button onClick={() => setShowAuthModal(true)} className="mt-2">
                        Login to Start Tracking
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nutrition Overview - Real Data with Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-green-500" />
                  Nutrition Overview
                </CardTitle>
                <CardDescription>Today's nutritional intake</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calories</span>
                      <span>
                        {totalCaloriesConsumed}/{dailyCalorieTarget}
                      </span>
                    </div>
                    <Progress value={(totalCaloriesConsumed / dailyCalorieTarget) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Protein (g)</span>
                      <span>
                        {Math.round(totalProtein)}/{dailyProteinTarget}
                      </span>
                    </div>
                    <Progress value={(totalProtein / dailyProteinTarget) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Carbs (g)</span>
                      <span>
                        {Math.round(totalCarbs)}/{dailyCarbTarget}
                      </span>
                    </div>
                    <Progress value={(totalCarbs / dailyCarbTarget) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fats (g)</span>
                      <span>
                        {Math.round(totalFats)}/{dailyFatTarget}
                      </span>
                    </div>
                    <Progress value={(totalFats / dailyFatTarget) * 100} className="h-2" />
                  </div>
                </div>

                {todayMeals.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Today's Meals</h4>
                    <div className="space-y-2">
                      {todayMeals.map((meal, index) => (
                        <Link key={index} href={`/analysis/meal/${meal.id}`}>
                          <div className="flex justify-between text-sm p-2 rounded hover:bg-accent/50 cursor-pointer group">
                            <span>
                              {meal.name} ({meal.meal_type})
                            </span>
                            <div className="flex items-center gap-2">
                              <span>{meal.calories} cal</span>
                              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            {/* Active Goals - Real Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Active Goals
                </CardTitle>
                <CardDescription>Your current fitness objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeGoals.length > 0 ? (
                  activeGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{goal.title}</span>
                        <span>
                          {goal.current_value}/{goal.target_value} {goal.unit}
                        </span>
                      </div>
                      <Progress value={(goal.current_value / goal.target_value) * 100} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active goals</p>
                    {user ? (
                      <p className="text-xs">Start by logging some workouts!</p>
                    ) : (
                      <Button onClick={() => setShowAuthModal(true)} size="sm" className="mt-2">
                        Login to Set Goals
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Assistant */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  AI Fitness Coach
                </CardTitle>
                <CardDescription>Get personalized guidance and motivation</CardDescription>
              </CardHeader>
              <CardContent>
                <ServerFitLogAI userId={user?.id || null} />
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Dialogs - Only show if user is logged in */}
        {user && (
          <>
            <AddWorkoutDialog
              open={showAddWorkout}
              onOpenChange={setShowAddWorkout}
              userId={user.id}
              onSuccess={refreshData}
            />
            <AddMealDialog open={showAddMeal} onOpenChange={setShowAddMeal} userId={user.id} onSuccess={refreshData} />
            <UpdateDailyLogDialog
              open={showUpdateLog}
              onOpenChange={setShowUpdateLog}
              userId={user.id}
              currentLog={todayLog}
              onSuccess={refreshData}
            />
            <DataManagementDialog
              open={showDataManagement}
              onOpenChange={setShowDataManagement}
              userId={user.id}
              onSuccess={refreshData}
            />
          </>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          redirectUrl={typeof window !== "undefined" ? window.location.href : ""}
        />
      </div>
    </div>
  )
}
