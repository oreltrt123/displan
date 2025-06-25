"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface WeeklyTablesOverviewProps {
  weeklyTables: any[]
  todayCheckin?: any
}

export function WeeklyTablesOverview({ weeklyTables, todayCheckin }: WeeklyTablesOverviewProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Weekly Planning Tables
            </CardTitle>
            <CardDescription>Your active planning tables and today's progress</CardDescription>
          </div>
          <Link href="/tables">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Table
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Check-in Status */}
        {todayCheckin ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-800 dark:text-green-200">Today's Check-in Complete</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Satisfaction: {todayCheckin.overall_satisfaction}/10 • Completed{" "}
              {
                [
                  todayCheckin.morning_completed,
                  todayCheckin.afternoon_completed,
                  todayCheckin.evening_completed,
                  todayCheckin.workout_completed,
                  todayCheckin.nutrition_completed,
                ].filter(Boolean).length
              }
              /5 activities
            </p>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-orange-800 dark:text-orange-200">Daily Check-in Pending</span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Don't forget to check in on your daily progress!
            </p>
          </div>
        )}

        {/* Active Tables */}
        {weeklyTables.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Recent Tables</h4>
            {weeklyTables.map((table, index) => {
              const startDate = new Date(table.start_date)
              const endDate = new Date(table.end_date)
              const isCurrentWeek = today >= table.start_date && today <= table.end_date

              return (
                <Link key={index} href={`/tables/${table.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                    <div className="space-y-1">
                      <h5 className="font-medium">{table.name}</h5>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDateConsistently(table.start_date)} - {formatDateConsistently(table.end_date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentWeek && <Badge variant="default">Current Week</Badge>}
                      <Badge variant="secondary">
                        {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No planning tables created yet</p>
            <Link href="/tables">
              <Button>Create Your First Table</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
