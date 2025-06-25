"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function AddMealDialog({ open, onOpenChange, userId, onSuccess }: AddMealDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    meal_type: "breakfast",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fat_g: "",
  })

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("fitlog_meals").insert({
        user_id: userId,
        name: formData.name,
        meal_type: formData.meal_type,
        calories: Number.parseInt(formData.calories),
        protein_g: Number.parseFloat(formData.protein_g) || 0,
        carbs_g: Number.parseFloat(formData.carbs_g) || 0,
        fat_g: Number.parseFloat(formData.fat_g) || 0,
        meal_date: new Date().toISOString().split("T")[0],
      })

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      setFormData({
        name: "",
        meal_type: "breakfast",
        calories: "",
        protein_g: "",
        carbs_g: "",
        fat_g: "",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding meal:", error)
      alert("Error adding meal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Meal</DialogTitle>
          <DialogDescription>Add a meal to track your nutrition.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name</Label>
            <input
              id="meal-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Chicken Salad, Protein Smoothie"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select
              value={formData.meal_type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, meal_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <input
              id="calories"
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value }))}
              placeholder="350"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <input
                id="protein"
                type="number"
                step="0.1"
                value={formData.protein_g}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                onChange={(e) => setFormData((prev) => ({ ...prev, protein_g: e.target.value }))}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <input
                id="carbs"
                type="number"
                step="0.1"
                value={formData.carbs_g}
                onChange={(e) => setFormData((prev) => ({ ...prev, carbs_g: e.target.value }))}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <input
                id="fat"
                type="number"
                step="0.1"
                value={formData.fat_g}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                onChange={(e) => setFormData((prev) => ({ ...prev, fat_g: e.target.value }))}
                placeholder="15"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" className="button_rrui" onClick={() => onOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="button_rrui1">
              {loading ? "Adding..." : "Add Meal"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
