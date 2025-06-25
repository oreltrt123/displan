"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import "@/styles/sidebar_settings_editor.css"

interface AddWorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function AddWorkoutDialog({ open, onOpenChange, userId, onSuccess }: AddWorkoutDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_minutes: "",
    calories_burned: "",
    intensity: "medium",
  })

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("fitlog_workouts").insert({
        user_id: userId,
        name: formData.name,
        description: formData.description,
        duration_minutes: Number.parseInt(formData.duration_minutes),
        calories_burned: Number.parseInt(formData.calories_burned),
        intensity: formData.intensity,
        workout_date: new Date().toISOString().split("T")[0],
      })

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        duration_minutes: "",
        calories_burned: "",
        intensity: "medium",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding workout:", error)
      alert("Error adding workout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Workout</DialogTitle>
          <DialogDescription>Add a new workout to track your progress.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name</Label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning Run, Upper Body Strength"
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
              placeholder="Describe your workout..."
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration_minutes: e.target.value }))}
                placeholder="30"
                required
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned</Label>
              <input
                id="calories"
                type="number"
                value={formData.calories_burned}
                onChange={(e) => setFormData((prev) => ({ ...prev, calories_burned: e.target.value }))}
                placeholder="250"
                required
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <Select
              value={formData.intensity}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, intensity: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => onOpenChange(false)} className="button_rrui">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="button_rrui1">
              {loading ? "Adding..." : "Add Workout"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
