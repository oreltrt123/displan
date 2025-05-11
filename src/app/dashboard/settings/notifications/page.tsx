"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../../../../supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface NotificationSettings {
  email_notifications: boolean
  project_updates: boolean
  security_alerts: boolean
  marketing_emails: boolean
  team_activity: boolean
}

export default function NotificationsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    project_updates: true,
    security_alerts: true,
    marketing_emails: false,
    team_activity: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadNotificationSettings() {
      try {
        setIsLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data } = await supabase.from("notification_settings").select("*").eq("user_id", user.id).single()

          if (data) {
            setSettings({
              email_notifications: data.email_notifications,
              project_updates: data.project_updates,
              security_alerts: data.security_alerts,
              marketing_emails: data.marketing_emails,
              team_activity: data.team_activity,
            })
          }
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotificationSettings()
  }, [supabase])

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("notification_settings").upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error saving notification settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Loading notification settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">Configure how you receive notifications from DisPlan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage the emails you want to receive when activity happens on DisPlan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email_notifications" className="flex flex-col space-y-1">
              <span>Email notifications</span>
              <span className="text-xs font-normal text-muted-foreground">Receive all notifications via email.</span>
            </Label>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={() => handleToggle("email_notifications")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="project_updates" className="flex flex-col space-y-1">
              <span>Project updates</span>
              <span className="text-xs font-normal text-muted-foreground">
                Get notified when a project is updated or completed.
              </span>
            </Label>
            <Switch
              id="project_updates"
              checked={settings.project_updates}
              onCheckedChange={() => handleToggle("project_updates")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="security_alerts" className="flex flex-col space-y-1">
              <span>Security alerts</span>
              <span className="text-xs font-normal text-muted-foreground">
                Get notified about security events like password changes.
              </span>
            </Label>
            <Switch
              id="security_alerts"
              checked={settings.security_alerts}
              onCheckedChange={() => handleToggle("security_alerts")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing_emails" className="flex flex-col space-y-1">
              <span>Marketing emails</span>
              <span className="text-xs font-normal text-muted-foreground">
                Receive emails about new features and promotions.
              </span>
            </Label>
            <Switch
              id="marketing_emails"
              checked={settings.marketing_emails}
              onCheckedChange={() => handleToggle("marketing_emails")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="team_activity" className="flex flex-col space-y-1">
              <span>Team activity</span>
              <span className="text-xs font-normal text-muted-foreground">
                Get notified when team members make changes.
              </span>
            </Label>
            <Switch
              id="team_activity"
              checked={settings.team_activity}
              onCheckedChange={() => handleToggle("team_activity")}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Notification Settings"}
      </Button>
    </div>
  )
}
