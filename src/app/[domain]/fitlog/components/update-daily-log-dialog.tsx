"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface UpdateDailyLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  currentLog: any
  onSuccess?: () => void
}

export function UpdateDailyLogDialog({ open, onOpenChange, userId, currentLog, onSuccess }: UpdateDailyLogDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weight_kg: "",
    water_glasses: 0,
    sleep_hours: "",
    energy_level: 5,
    mood: "",
    notes: "",
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (currentLog) {
      setFormData({
        weight_kg: currentLog.weight_kg?.toString() || "",
        water_glasses: currentLog.water_glasses || 0,
        sleep_hours: currentLog.sleep_hours?.toString() || "",
        energy_level: currentLog.energy_level || 5,
        mood: currentLog.mood || "",
        notes: currentLog.notes || "",
      })
    }
  }, [currentLog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const logData = {
        user_id: userId,
        log_date: new Date().toISOString().split("T")[0],
        weight_kg: formData.weight_kg ? Number.parseFloat(formData.weight_kg) : null,
        water_glasses: formData.water_glasses,
        sleep_hours: formData.sleep_hours ? Number.parseFloat(formData.sleep_hours) : null,
        energy_level: formData.energy_level,
        mood: formData.mood || null,
        notes: formData.notes || null,
      }

      // Try simple insert first, then update if exists
      const { data: existingLog } = await supabase
        .from("fitlog_daily_logs")
        .select("id")
        .eq("user_id", userId)
        .eq("log_date", logData.log_date)
        .single()

      let error
      if (existingLog) {
        // Update existing log
        const result = await supabase
          .from("fitlog_daily_logs")
          .update(logData)
          .eq("user_id", userId)
          .eq("log_date", logData.log_date)
        error = result.error
      } else {
        // Insert new log
        const result = await supabase.from("fitlog_daily_logs").insert(logData)
        error = result.error
      }

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error updating daily log:", error)
      alert("Error updating daily log. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Daily Log</DialogTitle>
          <DialogDescription>Track your daily metrics and how you're feeling.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight_kg: e.target.value }))}
                placeholder="70.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep (hours)</Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => setFormData((prev) => ({ ...prev, sleep_hours: e.target.value }))}
                placeholder="8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Water Glasses: {formData.water_glasses}</Label>
            <Slider
              value={[formData.water_glasses]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, water_glasses: value[0] }))}
              max={12}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Energy Level: {formData.energy_level}/10</Label>
            <Slider
              value={[formData.energy_level]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, energy_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              value={formData.mood}
              onChange={(e) => setFormData((prev) => ({ ...prev, mood: e.target.value }))}
              placeholder="e.g., Energetic, Tired, Motivated"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling today? Any observations?"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
