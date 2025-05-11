"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "../../../../../supabase/client"
import { Check, Monitor, Moon, Sun } from "lucide-react"

const themeColors = [
  { name: "Light default", value: "light-default", light: true },
  { name: "Dark default", value: "dark-default", light: false },
  { name: "Light blue", value: "light-blue", light: true },
  { name: "Dark blue", value: "dark-blue", light: false },
  { name: "Light green", value: "light-green", light: true },
  { name: "Dark green", value: "dark-green", light: false },
  { name: "Light purple", value: "light-purple", light: true },
  { name: "Dark purple", value: "dark-purple", light: false },
]

export default function AppearancePage() {
  const { theme, setTheme } = useTheme()
  const [themeColor, setThemeColor] = useState("default")
  const supabase = createClient()

  useEffect(() => {
    async function loadThemePreferences() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data } = await supabase.from("user_preferences").select("theme_color").eq("user_id", user.id).single()

          if (data?.theme_color) {
            setThemeColor(data.theme_color)
          }
        }
      } catch (error) {
        console.error("Error loading theme preferences:", error)
      }
    }

    loadThemePreferences()
  }, [supabase])

  const saveThemeColor = async (color: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("user_preferences").upsert({
          user_id: user.id,
          theme_color: color,
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error saving theme color:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">Customize how DisPlan looks on your device.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Mode</CardTitle>
          <CardDescription>
            Choose how DisPlan looks to you. Select a single theme, or sync with your system and automatically switch
            between day and night themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "system" ? "border-primary" : ""}`}
                onClick={() => setTheme("system")}
              >
                <Monitor size={16} />
                <span>System</span>
                {theme === "system" && <Check size={16} className="ml-2" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "light" ? "border-primary" : ""}`}
                onClick={() => setTheme("light")}
              >
                <Sun size={16} />
                <span>Light</span>
                {theme === "light" && <Check size={16} className="ml-2" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "dark" ? "border-primary" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <Moon size={16} />
                <span>Dark</span>
                {theme === "dark" && <Check size={16} className="ml-2" />}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Light theme</div>
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="h-2 w-[80%] rounded bg-muted"></div>
                    <div className="h-2 w-[60%] rounded bg-muted"></div>
                    <div className="h-2 w-[70%] rounded bg-muted"></div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                    <div className="h-2 w-[50%] rounded bg-muted"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  This theme will be active when your system is set to "light mode".
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Dark theme</div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="h-2 w-[80%] rounded bg-slate-800"></div>
                    <div className="h-2 w-[60%] rounded bg-slate-800"></div>
                    <div className="h-2 w-[70%] rounded bg-slate-800"></div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                    <div className="h-2 w-[50%] rounded bg-slate-800"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  This theme will be active when your system is set to "dark mode".
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>Choose a color theme for your interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {themeColors.map((color) => (
              <button
                key={color.value}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
                  themeColor === color.value ? "border-primary" : "border-muted"
                } ${color.light ? "bg-white" : "bg-slate-950"}`}
                onClick={() => {
                  setThemeColor(color.value)
                  saveThemeColor(color.value)
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  {themeColor === color.value && <Check size={12} className="text-primary-foreground" />}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
