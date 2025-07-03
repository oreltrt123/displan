"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Save, Database, Key, Globe } from "lucide-react"

interface SupabaseConfigSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedElement?: any
}

export function SupabaseConfigSidebar({ isOpen, onClose, selectedElement }: SupabaseConfigSidebarProps) {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [supabaseServiceKey, setSupabaseServiceKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved credentials
    const savedUrl = localStorage.getItem("user_supabase_url") || ""
    const savedAnonKey = localStorage.getItem("user_supabase_anon_key") || ""
    const savedServiceKey = localStorage.getItem("user_supabase_service_key") || ""

    setSupabaseUrl(savedUrl)
    setSupabaseAnonKey(savedAnonKey)
    setSupabaseServiceKey(savedServiceKey)
  }, [isOpen])

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    try {
      // Save to localStorage
      localStorage.setItem("user_supabase_url", supabaseUrl)
      localStorage.setItem("user_supabase_anon_key", supabaseAnonKey)
      localStorage.setItem("user_supabase_service_key", supabaseServiceKey)

      // Test connection
      if (supabaseUrl && supabaseAnonKey) {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to connect to Supabase")
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving Supabase config:", error)
      alert("Error connecting to Supabase. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSupabaseUrl("")
    setSupabaseAnonKey("")
    setSupabaseServiceKey("")
    localStorage.removeItem("user_supabase_url")
    localStorage.removeItem("user_supabase_anon_key")
    localStorage.removeItem("user_supabase_service_key")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Configuration
          </SheetTitle>
          <SheetDescription>
            Configure your Supabase server credentials to enable authentication and database features.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {selectedElement && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2">Selected Element</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Element Type: {selectedElement.type || "Unknown"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Element ID: {selectedElement.id || "Unknown"}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Supabase URL
              </Label>
              <Input
                id="supabase-url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">Your Supabase project URL</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-anon-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Supabase Anon Key
              </Label>
              <Textarea
                id="supabase-anon-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">Your Supabase anonymous/public key</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-service-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Supabase Service Role Key
              </Label>
              <Textarea
                id="supabase-service-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseServiceKey}
                onChange={(e) => setSupabaseServiceKey(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">Your Supabase service role key (for admin operations)</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading || !supabaseUrl || !supabaseAnonKey} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : saved ? "Saved!" : "Save Configuration"}
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to get your Supabase credentials:</h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Go to your Supabase dashboard</li>
              <li>Select your project</li>
              <li>Go to Settings → API</li>
              <li>Copy the Project URL and API keys</li>
            </ol>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
