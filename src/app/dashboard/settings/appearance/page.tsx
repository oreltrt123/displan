"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card_account"
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
        <CardContent>
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

        </CardContent>
      </Card>
    </div>
  )
}
