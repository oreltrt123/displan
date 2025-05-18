"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../../supabase/client"
import { User, MapPin, Briefcase, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card_account"
import "../../apps/website-builder/designer/styles/button.css"
interface ProfileData {
  name: string
  location: string
  bio: string
  occupation: string
  interests: string
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    location: "",
    bio: "",
    occupation: "",
    interests: "",
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/sign-in")
          return
        }

        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setFormData({
            name: data.name || "",
            location: data.location || "",
            bio: data.bio || "",
            occupation: data.occupation || "",
            interests: data.interests || "",
          })
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to update your profile")
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          location: formData.location,
          bio: formData.bio,
          occupation: formData.occupation,
          interests: formData.interests,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account information and how others see you on the platform.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/20 border border-destructive/50 text-destructive p-4 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name 
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-1 input_field22323A"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 input_field22323A"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="occupation" className="text-sm font-medium">
                Occupation
              </label>
              <div className="relative">
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="pl-10 input_field22323A"
                  placeholder="Your occupation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="interests" className="text-sm font-medium">
                Interests
              </label>
              <div className="relative">
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleChange}
                  className="pl-10 input_field22323A"
                  placeholder="Programming, Design, Music, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                className="simple_box"
                onChange={handleChange}
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
          <button type="submit" className="button_edit_project_r2" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </Card>
      </form>
    </div>
  )
}
