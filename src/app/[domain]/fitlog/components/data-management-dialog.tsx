"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, AlertTriangle, Download, RotateCcw } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DataManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function DataManagementDialog({ open, onOpenChange, userId, onSuccess }: DataManagementDialogProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  const supabase = createClientComponentClient()

  // Load data statistics when dialog opens
  React.useEffect(() => {
    if (open && userId) {
      loadDataStats()
    }
  }, [open, userId])

  const loadDataStats = async () => {
    try {
      const [workouts, meals, goals, logs, tables, checkins] = await Promise.all([
        supabase.from("fitlog_workouts").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("fitlog_meals").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("fitlog_goals").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("fitlog_daily_logs").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("fitlog_weekly_tables").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("fitlog_daily_checkins").select("id", { count: "exact" }).eq("user_id", userId),
      ])

      setStats({
        workouts: workouts.count || 0,
        meals: meals.count || 0,
        goals: goals.count || 0,
        logs: logs.count || 0,
        tables: tables.count || 0,
        checkins: checkins.count || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const deleteDataType = async (dataType: string) => {
    if (!confirm(`Are you sure you want to delete ALL ${dataType}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      let tableName = ""
      switch (dataType) {
        case "workouts":
          tableName = "fitlog_workouts"
          break
        case "meals":
          tableName = "fitlog_meals"
          break
        case "goals":
          tableName = "fitlog_goals"
          break
        case "logs":
          tableName = "fitlog_daily_logs"
          break
        case "tables":
          tableName = "fitlog_weekly_tables"
          break
        case "checkins":
          tableName = "fitlog_daily_checkins"
          break
        default:
          throw new Error("Invalid data type")
      }

      const { error } = await supabase.from(tableName).delete().eq("user_id", userId)

      if (error) throw error

      await loadDataStats()
      onSuccess?.()
    } catch (error) {
      console.error(`Error deleting ${dataType}:`, error)
      alert(`Error deleting ${dataType}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const deleteAllData = async () => {
    if (
      !confirm(
        "⚠️ DANGER: This will delete ALL your FitLog data including workouts, meals, goals, logs, tables, and check-ins. This action cannot be undone. Are you absolutely sure?",
      )
    ) {
      return
    }

    if (!confirm("Last chance! Type 'DELETE ALL' to confirm you want to delete everything.")) {
      return
    }

    setLoading(true)
    try {
      // Delete in order to respect foreign key constraints
      await Promise.all([
        supabase.from("fitlog_daily_checkins").delete().eq("user_id", userId),
        supabase
          .from("fitlog_daily_plans")
          .delete()
          .eq("weekly_table_id", "IN", "(SELECT id FROM fitlog_weekly_tables WHERE user_id = '" + userId + "')"),
        supabase
          .from("fitlog_workout_exercises")
          .delete()
          .eq("workout_id", "IN", "(SELECT id FROM fitlog_workouts WHERE user_id = '" + userId + "')"),
      ])

      await Promise.all([
        supabase.from("fitlog_workouts").delete().eq("user_id", userId),
        supabase.from("fitlog_meals").delete().eq("user_id", userId),
        supabase.from("fitlog_goals").delete().eq("user_id", userId),
        supabase.from("fitlog_daily_logs").delete().eq("user_id", userId),
        supabase.from("fitlog_weekly_tables").delete().eq("user_id", userId),
      ])

      await loadDataStats()
      onSuccess?.()
      alert("All data has been successfully deleted.")
    } catch (error) {
      console.error("Error deleting all data:", error)
      alert("Error deleting data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    setLoading(true)
    try {
      const [workouts, meals, goals, logs, tables, checkins] = await Promise.all([
        supabase.from("fitlog_workouts").select("*").eq("user_id", userId),
        supabase.from("fitlog_meals").select("*").eq("user_id", userId),
        supabase.from("fitlog_goals").select("*").eq("user_id", userId),
        supabase.from("fitlog_daily_logs").select("*").eq("user_id", userId),
        supabase.from("fitlog_weekly_tables").select("*").eq("user_id", userId),
        supabase.from("fitlog_daily_checkins").select("*").eq("user_id", userId),
      ])

      const exportData = {
        exported_at: new Date().toISOString(),
        user_id: userId,
        data: {
          workouts: workouts.data || [],
          meals: meals.data || [],
          goals: goals.data || [],
          daily_logs: logs.data || [],
          weekly_tables: tables.data || [],
          daily_checkins: checkins.data || [],
        },
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fitlog-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Error exporting data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Data Management
          </DialogTitle>
          <DialogDescription>
            Manage your FitLog data - export, delete specific data types, or reset everything.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Overview */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Data Overview</CardTitle>
                <CardDescription>Current data stored in your FitLog account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Workouts:</span>
                    <Badge variant="secondary">{stats.workouts}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Meals:</span>
                    <Badge variant="secondary">{stats.meals}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Goals:</span>
                    <Badge variant="secondary">{stats.goals}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Logs:</span>
                    <Badge variant="secondary">{stats.logs}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Planning Tables:</span>
                    <Badge variant="secondary">{stats.tables}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-ins:</span>
                    <Badge variant="secondary">{stats.checkins}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="w-5 h-5 text-blue-500" />
                Export Data
              </CardTitle>
              <CardDescription>Download all your data as a JSON file for backup or transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <button onClick={exportData} disabled={loading} className="button_rrui1">
                Export All Data
              </button>
            </CardContent>
          </Card>

          {/* Delete Specific Data Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="w-5 h-5 text-orange-500" />
                Delete Specific Data
              </CardTitle>
              <CardDescription>Delete specific types of data while keeping others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("workouts")}
                  disabled={loading || !stats?.workouts}
                  className="justify-start"
                >
                  Delete All Workouts ({stats?.workouts || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("meals")}
                  disabled={loading || !stats?.meals}
                  className="justify-start"
                >
                  Delete All Meals ({stats?.meals || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("goals")}
                  disabled={loading || !stats?.goals}
                  className="justify-start"
                >
                  Delete All Goals ({stats?.goals || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("logs")}
                  disabled={loading || !stats?.logs}
                  className="justify-start"
                >
                  Delete All Daily Logs ({stats?.logs || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("tables")}
                  disabled={loading || !stats?.tables}
                  className="justify-start"
                >
                  Delete All Planning Tables ({stats?.tables || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteDataType("checkins")}
                  disabled={loading || !stats?.checkins}
                  className="justify-start"
                >
                  Delete All Check-ins ({stats?.checkins || 0})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delete All Data */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Permanently delete all your FitLog data. This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={deleteAllData} disabled={loading} className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
