"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface CreateTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function CreateTableDialog({ open, onOpenChange, userId, onSuccess }: CreateTableDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  })

  const supabase = createClientComponentClient()

  // Set default dates (current week)
  React.useEffect(() => {
    if (open) {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday

      setFormData((prev) => ({
        ...prev,
        start_date: startOfWeek.toISOString().split("T")[0],
        end_date: endOfWeek.toISOString().split("T")[0],
      }))
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create the weekly table
      const { data: tableData, error: tableError } = await supabase
        .from("fitlog_weekly_tables")
        .insert({
          user_id: userId,
          name: formData.name,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_active: true,
        })
        .select()
        .single()

      if (tableError) throw tableError

      // Create daily plans for each day of the week
      const startDate = new Date(formData.start_date)
      const dailyPlans = []

      for (let i = 0; i < 7; i++) {
        const planDate = new Date(startDate)
        planDate.setDate(startDate.getDate() + i)

        dailyPlans.push({
          weekly_table_id: tableData.id,
          day_of_week: planDate.getDay(),
          plan_date: planDate.toISOString().split("T")[0],
          morning_plan: "",
          afternoon_plan: "",
          evening_plan: "",
          workout_plan: "",
          nutrition_plan: "",
          goals_for_day: [],
          priority_level: "medium",
        })
      }

      const { error: plansError } = await supabase.from("fitlog_daily_plans").insert(dailyPlans)

      if (plansError) throw plansError

      // Reset form
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating table:", error)
      alert("Error creating table. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Weekly Planning Table</DialogTitle>
          <DialogDescription>
            Create a new weekly table to plan your fitness activities, goals, and daily routines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Table Name</Label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Week 1 - Building Habits, Marathon Training Week 3"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the focus or theme of this week..."
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" className="button_rrui" onClick={() => onOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" className="button_rrui1" disabled={loading}>
              {loading ? "Creating..." : "Create Table"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
