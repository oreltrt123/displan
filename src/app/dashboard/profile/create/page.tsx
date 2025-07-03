"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../../supabase/client"
import {
  User,
  MapPin,
  Briefcase,
  Heart,
  ChevronDown,
  LinkIcon,
  Sparkles,
  Bold,
  Italic,
  Type,
  Loader2,
} from "lucide-react"
import countries from "@/data/countries"
import Link from "next/link"
import "@/styles/sidebar_settings_editor.css"
import "@/app/dashboard/apps/website-builder/designer/styles/button.css"

export default function CreateProfileEnhancedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [isGeneratingUsernames, setIsGeneratingUsernames] = useState(false)
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
  const [showUsernameSuggestions, setShowUsernameSuggestions] = useState(false)

  // Bio editor states
  const [bioText, setBioText] = useState("")
  const [bioFontSize, setBioFontSize] = useState("medium")
  const [bioIsBold, setBioIsBold] = useState(false)
  const [bioIsItalic, setBioIsItalic] = useState(false)
  const bioRef = useRef<HTMLTextAreaElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    bio: "",
    bio_font_size: "medium",
    bio_is_bold: false,
    bio_is_italic: false,
    occupation: "",
    interests: "",
    linkedin_url: "",
    facebook_url: "",
    tiktok_url: "",
    youtube_url: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          router.push("/sign-in")
          return
        }

        setUser(data.user)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single()

        if (existingProfile) router.push("/profile/edit")
      } catch (err) {
        setError("Failed to verify authentication")
      }
    }

    checkAuth()
  }, [router, supabase])

  // AI-powered username generation
  const generateUsernameVariations = async (name: string) => {
    if (!name.trim()) return

    setIsGeneratingUsernames(true)
    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"

      const prompt = `Generate 5 creative username variations for the name "${name}". 
      
      Create usernames that are:
      - Based on the name "${name}"
      - Include creative combinations with numbers, letters, and symbols
      - Modern and appealing
      - Between 4-15 characters
      - Suitable for social media profiles
      
      Examples of good variations:
      - Add numbers: ${name}123, ${name}2024
      - Add underscores: ${name}_official, the_${name}
      - Add prefixes/suffixes: i${name}, ${name}pro, ${name}x
      - Creative combinations: ${name}dev, ${name}creative
      
      Return ONLY a JSON array of 5 usernames, like: ["username1", "username2", "username3", "username4", "username5"]`

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      const data = await response.json()
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (aiResponse) {
        try {
          // Extract JSON array from response
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            const usernames = JSON.parse(jsonMatch[0])
            setSuggestedUsernames(usernames)
            setShowUsernameSuggestions(true)
          } else {
            // Fallback manual generation
            generateFallbackUsernames(name)
          }
        } catch (parseError) {
          generateFallbackUsernames(name)
        }
      } else {
        generateFallbackUsernames(name)
      }
    } catch (error) {
      console.error("Error generating usernames:", error)
      generateFallbackUsernames(name)
    } finally {
      setIsGeneratingUsernames(false)
    }
  }

  const generateFallbackUsernames = (name: string) => {
    const baseName = name.toLowerCase().replace(/\s+/g, "")
    const variations = [
      `${baseName}${Math.floor(Math.random() * 999) + 1}`,
      `${baseName}_official`,
      `the_${baseName}`,
      `${baseName}pro`,
      `i${baseName}`,
    ]
    setSuggestedUsernames(variations)
    setShowUsernameSuggestions(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Generate username suggestions when name changes
    if (name === "name" && value.trim().length > 2) {
      generateUsernameVariations(value.trim())
    }
  }

  const handleUsernameSelect = (username: string) => {
    setFormData((prev) => ({ ...prev, username }))
    setShowUsernameSuggestions(false)
  }

  // Bio editor functions
  const updateBioFormatting = () => {
    setFormData((prev) => ({
      ...prev,
      bio: bioText,
      bio_font_size: bioFontSize,
      bio_is_bold: bioIsBold,
      bio_is_italic: bioIsItalic,
    }))
  }

  useEffect(() => {
    updateBioFormatting()
  }, [bioText, bioFontSize, bioIsBold, bioIsItalic])

  const getBioStyle = () => {
    const fontSize = bioFontSize === "small" ? "14px" : bioFontSize === "large" ? "18px" : "16px"
    return {
      fontSize,
      fontWeight: bioIsBold ? "bold" : "normal",
      fontStyle: bioIsItalic ? "italic" : "normal",
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!user) throw new Error("You must be logged in to create a profile")

      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: formData.name,
        username: formData.username,
        location: formData.location,
        bio: formData.bio,
        bio_font_size: formData.bio_font_size,
        bio_is_bold: formData.bio_is_bold,
        bio_is_italic: formData.bio_is_italic,
        occupation: formData.occupation,
        interests: formData.interests,
        linkedin_url: formData.linkedin_url,
        facebook_url: formData.facebook_url,
        tiktok_url: formData.tiktok_url,
        youtube_url: formData.youtube_url,
        created_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({ ...prev, location: country }))
    setShowCountryDropdown(false)
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen text-white bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/80">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-white/50" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>
            </div>

            {/* Username with AI Suggestions */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white/80 flex items-center gap-2">
                Username
                {isGeneratingUsernames && <Loader2 size={14} className="animate-spin" />}
                <Sparkles size={14} className="text-purple-400" />
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/50 text-sm">@</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="flex h-9 w-full items-center justify-between pl-8 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>

              {/* AI Username Suggestions */}
              {showUsernameSuggestions && suggestedUsernames.length > 0 && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-purple-400 mb-2 flex items-center gap-1">
                    <Sparkles size={12} />
                    AI-Generated Username Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedUsernames.map((username, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleUsernameSelect(username)}
                        className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-full text-sm text-purple-300 transition-colors"
                      >
                        @{username}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2 relative">
              <label htmlFor="location" className="block text-sm font-medium text-white/80">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-white/50" />
                </div>
                <div
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er cursor-pointer"
                >
                  <span className="countrySSrsr text-muted-foreground">{formData.location || "Select a country"}</span>
                  <ChevronDown size={16} className="text-white/50" />
                </div>
              </div>

              {showCountryDropdown && (
                <div className="menu_container_dsgasegagwgasgwgdsfsfe23sf">
                  {countries.map((country) => (
                    <div
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className="menu_container2323232323rer33_itemsfawfw"
                    >
                      {country}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <label htmlFor="occupation" className="block text-sm font-medium text-white/80">
                Occupation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-white/50" />
                </div>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Your occupation"
                  className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <label htmlFor="interests" className="block text-sm font-medium text-white/80">
                Interests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Heart size={16} className="text-white/50" />
                </div>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Programming, Design, Music, etc."
                  className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/90">Social Media Links</h3>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-white/80">
                  LinkedIn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-blue-400" />
                  </div>
                  <input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <label htmlFor="facebook_url" className="block text-sm font-medium text-white/80">
                  Facebook
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-blue-600" />
                  </div>
                  <input
                    id="facebook_url"
                    name="facebook_url"
                    type="url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourprofile"
                    className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div className="space-y-2">
                <label htmlFor="tiktok_url" className="block text-sm font-medium text-white/80">
                  TikTok
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-pink-400" />
                  </div>
                  <input
                    id="tiktok_url"
                    name="tiktok_url"
                    type="url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@yourprofile"
                    className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <label htmlFor="youtube_url" className="block text-sm font-medium text-white/80">
                  YouTube
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-red-500" />
                  </div>
                  <input
                    id="youtube_url"
                    name="youtube_url"
                    type="url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@yourprofile"
                    className="flex h-9 w-full items-center justify-between pl-10 pr-3 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Bio Editor */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-white/80">
                Bio
              </label>

              {/* Bio Formatting Controls */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-1">
                  <Type size={14} className="text-white/50" />
                  <select
                    value={bioFontSize}
                    onChange={(e) => setBioFontSize(e.target.value)}
                    className="bg-transparent text-xs border border-white/20 rounded px-2 py-1"
                  >
                    <option value="small" className="bg-black">
                      Small
                    </option>
                    <option value="medium" className="bg-black">
                      Medium
                    </option>
                    <option value="large" className="bg-black">
                      Large
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setBioIsBold(!bioIsBold)}
                  className={`p-1 rounded ${bioIsBold ? "bg-white/20" : "bg-white/5"} hover:bg-white/15 transition-colors`}
                >
                  <Bold size={14} className="text-white/70" />
                </button>

                <button
                  type="button"
                  onClick={() => setBioIsItalic(!bioIsItalic)}
                  className={`p-1 rounded ${bioIsItalic ? "bg-white/20" : "bg-white/5"} hover:bg-white/15 transition-colors`}
                >
                  <Italic size={14} className="text-white/70" />
                </button>
              </div>

              <textarea
                ref={bioRef}
                id="bio"
                name="bio"
                rows={4}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Tell us about yourself..."
                style={getBioStyle()}
                className="h-[98%] mt-2 font-mono overflow-hidden flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er"
              />

              {/* Bio Preview */}
              {bioText && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/50 mb-2">Preview:</div>
                  <div style={getBioStyle()} className="text-white/80">
                    {bioText}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 text-base bg-white font-semibold rounded-full text-black hover:bg-opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Profile"}
              </button>
              <Link
                href="/dashboard"
                className="px-5 py-3 text-base bg-white bg-opacity-10 font-semibold rounded-full text-white hover:bg-opacity-20 transition-opacity"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
