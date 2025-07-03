"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  displan_project_designer_css_get_project_settings,
  displan_project_designer_css_update_project_settings,
  displan_project_designer_css_delete_project,
} from "../../../../lib/actions/displan-project-settings-actions"
import {
  Loader2,
  CheckCircle,
  Trash2,
  ExternalLink,
  Database,
  Key,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Check,
  Zap,
} from "lucide-react"
import "@/styles/sidebar_settings_editor.css"
import "../../../../../website-builder/designer/styles/button.css"

interface SupabaseProject {
  id: string
  name: string
  organization_id: string
  created_at: string
  status: string
}

interface FirebaseProject {
  projectId: string
  displayName: string
  projectNumber: string
  state: string
}

interface APIKeyConfig {
  id: string
  provider: "supabase" | "firebase"
  projectId: string
  projectName: string
  config: {
    // Supabase
    url?: string
    anonKey?: string
    serviceKey?: string
    // Firebase
    apiKey?: string
    authDomain?: string
    projectId?: string
    storageBucket?: string
    messagingSenderId?: string
    appId?: string
  }
  isConnected: boolean
  createdAt: string
}

export default function GeneralSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  // Original settings state
  const [settings, setSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    published_url: "",
    is_published: false,
  })

  const [originalSettings, setOriginalSettings] = useState({
    name: "",
    description: "",
    custom_url: "",
    published_url: "",
    is_published: false,
  })

  // API Keys state
  const [apiKeys, setApiKeys] = useState<APIKeyConfig[]>([])
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<"supabase" | "firebase" | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [supabaseProjects, setSupabaseProjects] = useState<SupabaseProject[]>([])
  const [firebaseProjects, setFirebaseProjects] = useState<FirebaseProject[]>([])
  const [showProjects, setShowProjects] = useState(false)
  const [showManualConfig, setShowManualConfig] = useState(false)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Manual configuration state
  const [manualConfig, setManualConfig] = useState({
    provider: "supabase" as "supabase" | "firebase",
    projectName: "",
    supabase: {
      url: "",
      anonKey: "",
      serviceKey: "",
    },
    firebase: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    },
  })

  // Loading and UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [activeTab, setActiveTab] = useState<"general" | "api-keys">("general")
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSettings()
    loadApiKeys()
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [projectId])

  const loadSettings = async () => {
    setIsLoading(true)
    const result = await displan_project_designer_css_get_project_settings(projectId)
    if (result.success && result.data) {
      const projectData = {
        name: result.data.name || "",
        description: result.data.description || "",
        custom_url: result.data.custom_url || "",
        published_url: result.data.published_url || "",
        is_published: result.data.is_published || false,
      }
      setSettings(projectData)
      setOriginalSettings(projectData)
    } else {
      console.error("Failed to load settings:", result.error)
      setSaveMessage("Failed to load project settings")
    }
    setIsLoading(false)
  }

  const loadApiKeys = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/api-keys`)
      if (response.ok) {
        const result = await response.json()
        setApiKeys(result.apiKeys || [])
      }
    } catch (error) {
      console.error("Failed to load API keys:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")
    try {
      const result = await displan_project_designer_css_update_project_settings(projectId, {
        name: settings.name,
        description: settings.description,
        custom_url: settings.custom_url,
      })
      if (result.success) {
        setOriginalSettings(settings)
        setSaveMessage("Settings saved successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        console.error("Save failed:", result.error)
        setSaveMessage(`Failed to save: ${result.error}`)
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveMessage("An error occurred while saving")
    }
    setIsSaving(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  // API Keys functions
  const handleConnectProvider = async (provider: "supabase" | "firebase") => {
    setSelectedProvider(provider)
    setIsConnecting(true)

    try {
      if (provider === "supabase") {
        // Connect to Supabase OAuth
        const response = await fetch("/api/auth/supabase/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        })

        if (response.ok) {
          const result = await response.json()
          if (result.authUrl) {
            // Redirect to Supabase OAuth
            window.location.href = result.authUrl
          }
        }
      } else if (provider === "firebase") {
        // Connect to Firebase OAuth
        const response = await fetch("/api/auth/firebase/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        })

        if (response.ok) {
          const result = await response.json()
          if (result.authUrl) {
            // Redirect to Firebase OAuth
            window.location.href = result.authUrl
          }
        }
      }
    } catch (error) {
      console.error(`Failed to connect to ${provider}:`, error)
      setSaveMessage(`Failed to connect to ${provider}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const loadProviderProjects = async (provider: "supabase" | "firebase") => {
    try {
      const response = await fetch(`/api/auth/${provider}/projects`)
      if (response.ok) {
        const result = await response.json()
        if (provider === "supabase") {
          setSupabaseProjects(result.projects || [])
        } else {
          setFirebaseProjects(result.projects || [])
        }
        setShowProjects(true)
      }
    } catch (error) {
      console.error(`Failed to load ${provider} projects:`, error)
    }
  }

  const handleSelectProject = async (provider: "supabase" | "firebase", project: any) => {
    try {
      const response = await fetch("/api/projects/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          provider,
          externalProjectId: provider === "supabase" ? project.id : project.projectId,
          projectName: provider === "supabase" ? project.name : project.displayName,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setApiKeys((prev) => [...prev, result.apiKey])
        setShowApiKeyModal(false)
        setShowProjects(false)
        setSaveMessage(`${provider} project connected successfully!`)
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (error) {
      console.error(`Failed to connect ${provider} project:`, error)
      setSaveMessage(`Failed to connect ${provider} project`)
    }
  }

  const handleCreateNewProject = async (provider: "supabase" | "firebase") => {
    try {
      const response = await fetch(`/api/auth/${provider}/create-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          name: `${settings.name || "My Project"} - ${provider}`,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Refresh projects list
        await loadProviderProjects(provider)
        setSaveMessage(`New ${provider} project created successfully!`)
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (error) {
      console.error(`Failed to create ${provider} project:`, error)
      setSaveMessage(`Failed to create ${provider} project`)
    }
  }

  const handleManualSave = async () => {
    try {
      const config = manualConfig.provider === "supabase" ? manualConfig.supabase : manualConfig.firebase

      const response = await fetch("/api/projects/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          provider: manualConfig.provider,
          projectName: manualConfig.projectName,
          config,
          isManual: true,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setApiKeys((prev) => [...prev, result.apiKey])
        setShowManualConfig(false)
        setShowApiKeyModal(false)
        setSaveMessage(`${manualConfig.provider} configuration saved successfully!`)
        setTimeout(() => setSaveMessage(""), 3000)

        // Reset manual config
        setManualConfig({
          provider: "supabase",
          projectName: "",
          supabase: { url: "", anonKey: "", serviceKey: "" },
          firebase: { apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" },
        })
      }
    } catch (error) {
      console.error("Failed to save manual configuration:", error)
      setSaveMessage("Failed to save configuration")
    }
  }

  const handleDeleteApiKey = async (apiKeyId: string) => {
    if (confirm("Are you sure you want to delete this API key configuration?")) {
      try {
        const response = await fetch(`/api/projects/api-keys/${apiKeyId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setApiKeys((prev) => prev.filter((key) => key.id !== apiKeyId))
          setSaveMessage("API key deleted successfully!")
          setTimeout(() => setSaveMessage(""), 3000)
        }
      } catch (error) {
        console.error("Failed to delete API key:", error)
        setSaveMessage("Failed to delete API key")
      }
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)
    try {
      console.log("Attempting to delete project:", projectId)
      const result = await displan_project_designer_css_delete_project(projectId)
      if (result.success) {
        console.log("Project deleted successfully")
        setTimeout(() => {
          setShowDeleteModal(false)
          setIsDeleting(false)
          setShowNotification(true)
          setTimeout(() => {
            router.push("/dashboard/apps/displan")
          }, 1000)
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        }, 1000)
      } else {
        console.error("Delete failed:", result.error)
        alert(`Failed to delete project: ${result.error}`)
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Unexpected error deleting project:", error)
      alert(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsDeleting(false)
    }
  }

  const handleOpenLivesite = () => {
    if (settings.published_url) {
      window.open(settings.published_url, "_blank")
    }
  }

  const hasChanges =
    JSON.stringify({
      name: settings.name,
      description: settings.description,
      custom_url: settings.custom_url,
    }) !==
    JSON.stringify({
      name: originalSettings.name,
      description: originalSettings.description,
      custom_url: originalSettings.custom_url,
    })

  // Render API Key Modal
  const renderApiKeyModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowApiKeyModal(false)}></div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add API Key Configuration</h3>
            <button onClick={() => setShowApiKeyModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {!showProjects && !showManualConfig && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Choose how you want to configure your backend:</p>
              </div>

              {/* Supabase Option */}
              <div className="border rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  <Database className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h4 className="text-lg font-semibold">Supabase</h4>
                    <p className="text-sm text-gray-600">Open source Firebase alternative</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConnectProvider("supabase")}
                    disabled={isConnecting}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isConnecting && selectedProvider === "supabase" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Connect with Supabase
                  </button>
                  <button
                    onClick={() => {
                      setManualConfig((prev) => ({ ...prev, provider: "supabase" }))
                      setShowManualConfig(true)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Manual Setup
                  </button>
                </div>
              </div>

              {/* Firebase Option */}
              <div className="border rounded-lg p-6 hover:border-orange-500 transition-colors">
                <div className="flex items-center mb-4">
                  <Database className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h4 className="text-lg font-semibold">Firebase</h4>
                    <p className="text-sm text-gray-600">Google's mobile and web app platform</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConnectProvider("firebase")}
                    disabled={isConnecting}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isConnecting && selectedProvider === "firebase" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Connect with Firebase
                  </button>
                  <button
                    onClick={() => {
                      setManualConfig((prev) => ({ ...prev, provider: "firebase" }))
                      setShowManualConfig(true)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Manual Setup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects Selection */}
          {showProjects && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Select {selectedProvider} Project</h4>
                <button onClick={() => setShowProjects(false)} className="text-gray-500 hover:text-gray-700">
                  ← Back
                </button>
              </div>

              <div className="space-y-3">
                {/* Create New Project Option */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <button
                    onClick={() => handleCreateNewProject(selectedProvider!)}
                    className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New {selectedProvider} Project
                  </button>
                </div>

                {/* Existing Projects */}
                {selectedProvider === "supabase" &&
                  supabaseProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{project.name}</h5>
                          <p className="text-sm text-gray-600">ID: {project.id}</p>
                          <p className="text-sm text-gray-600">Status: {project.status}</p>
                        </div>
                        <button
                          onClick={() => handleSelectProject("supabase", project)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}

                {selectedProvider === "firebase" &&
                  firebaseProjects.map((project) => (
                    <div
                      key={project.projectId}
                      className="border rounded-lg p-4 hover:border-orange-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{project.displayName}</h5>
                          <p className="text-sm text-gray-600">ID: {project.projectId}</p>
                          <p className="text-sm text-gray-600">State: {project.state}</p>
                        </div>
                        <button
                          onClick={() => handleSelectProject("firebase", project)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Manual Configuration */}
          {showManualConfig && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Manual {manualConfig.provider} Configuration</h4>
                <button onClick={() => setShowManualConfig(false)} className="text-gray-500 hover:text-gray-700">
                  ← Back
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={manualConfig.projectName}
                    onChange={(e) => setManualConfig((prev) => ({ ...prev, projectName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Project"
                  />
                </div>

                {manualConfig.provider === "supabase" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Supabase URL</label>
                      <input
                        type="url"
                        value={manualConfig.supabase.url}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            supabase: { ...prev.supabase, url: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Anon Key</label>
                      <div className="relative">
                        <input
                          type={showPasswords["supabase-anon"] ? "text" : "password"}
                          value={manualConfig.supabase.anonKey}
                          onChange={(e) =>
                            setManualConfig((prev) => ({
                              ...prev,
                              supabase: { ...prev.supabase, anonKey: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("supabase-anon")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords["supabase-anon"] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(manualConfig.supabase.anonKey, "supabase-anon")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {copiedField === "supabase-anon" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Role Key</label>
                      <div className="relative">
                        <input
                          type={showPasswords["supabase-service"] ? "text" : "password"}
                          value={manualConfig.supabase.serviceKey}
                          onChange={(e) =>
                            setManualConfig((prev) => ({
                              ...prev,
                              supabase: { ...prev.supabase, serviceKey: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("supabase-service")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords["supabase-service"] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(manualConfig.supabase.serviceKey, "supabase-service")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {copiedField === "supabase-service" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {manualConfig.provider === "firebase" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <div className="relative">
                        <input
                          type={showPasswords["firebase-api"] ? "text" : "password"}
                          value={manualConfig.firebase.apiKey}
                          onChange={(e) =>
                            setManualConfig((prev) => ({
                              ...prev,
                              firebase: { ...prev.firebase, apiKey: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="AIzaSyC..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("firebase-api")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords["firebase-api"] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(manualConfig.firebase.apiKey, "firebase-api")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {copiedField === "firebase-api" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Auth Domain</label>
                      <input
                        type="text"
                        value={manualConfig.firebase.authDomain}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            firebase: { ...prev.firebase, authDomain: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your-project.firebaseapp.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Project ID</label>
                      <input
                        type="text"
                        value={manualConfig.firebase.projectId}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            firebase: { ...prev.firebase, projectId: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your-project-id"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Storage Bucket</label>
                      <input
                        type="text"
                        value={manualConfig.firebase.storageBucket}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            firebase: { ...prev.firebase, storageBucket: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your-project.appspot.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Messaging Sender ID</label>
                      <input
                        type="text"
                        value={manualConfig.firebase.messagingSenderId}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            firebase: { ...prev.firebase, messagingSenderId: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">App ID</label>
                      <input
                        type="text"
                        value={manualConfig.firebase.appId}
                        onChange={(e) =>
                          setManualConfig((prev) => ({
                            ...prev,
                            firebase: { ...prev.firebase, appId: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1:123456789:web:abcdef123456"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleManualSave}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowManualConfig(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Delete confirmation modal
  const renderDeleteModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={!isDeleting ? closeDeleteModal : undefined}
        ></div>
        <div className="bg_13_fsdf_delete relative z-10">
          <div className="">
            <h3 className="settings_nav_section_title122323">Delete Project</h3>
          </div>
          <hr className="fsdfadsgesgdg121" />
          <div className="space-y-4">
            {isDeleting ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="Text_span_css_codecss">Deleting project...</span>
              </div>
            ) : (
              <>
                <span className="Text_span_css_codecss1212">
                  This action is permanent and cannot be undone. The project and all its contents, including files and
                  data, will be permanently deleted.
                </span>
                <div className="flex space-x-3">
                  <button onClick={closeDeleteModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                    Cancel
                  </button>
                  <button onClick={handleDeleteProject} className="button_edit_projectsfdafgfwf12_dfdd_delete">
                    Delete Project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Success notification
  const renderNotification = () => {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-up">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-white dark:text-black">Project successfully deleted</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading project settings...</div>
      </div>
    )
  }

  return (
    <>
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-black rounded-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("api-keys")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "api-keys"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Key className="h-4 w-4 inline mr-2" />
              API Keys
            </button>
          </nav>
        </div>
      </div>

    

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div className="bg-white dark:bg-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="titl2_d2m1313 dark:text-white">API Keys & Backend Configuration</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Connect your project to Supabase or Firebase for authentication and database functionality.
              </p>
            </div>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="button_edit_project_r22232_Bu flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </button>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No API configurations yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect to Supabase or Firebase to enable authentication and database features.
                </p>
                <button onClick={() => setShowApiKeyModal(true)} className="button_edit_project_r22232_Bu">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Configuration
                </button>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Database
                        className={`h-8 w-8 mr-3 ${apiKey.provider === "supabase" ? "text-green-600" : "text-orange-600"}`}
                      />
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{apiKey.provider}</h3>
                        <p className="text-sm text-gray-600">{apiKey.projectName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          apiKey.isConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {apiKey.isConnected ? "Connected" : "Manual"}
                      </span>
                      <button
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {apiKey.provider === "supabase" && (
                      <>
                        <div>
                          <label className="block text-gray-600 mb-1">Project URL</label>
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">
                              {apiKey.config.url || "Not configured"}
                            </code>
                            {apiKey.config.url && (
                              <button
                                onClick={() => copyToClipboard(apiKey.config.url!, `${apiKey.id}-url`)}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                              >
                                {copiedField === `${apiKey.id}-url` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Anon Key</label>
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">
                              {apiKey.config.anonKey ? "••••••••••••••••" : "Not configured"}
                            </code>
                            {apiKey.config.anonKey && (
                              <button
                                onClick={() => copyToClipboard(apiKey.config.anonKey!, `${apiKey.id}-anon`)}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                              >
                                {copiedField === `${apiKey.id}-anon` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {apiKey.provider === "firebase" && (
                      <>
                        <div>
                          <label className="block text-gray-600 mb-1">Project ID</label>
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">
                              {apiKey.config.projectId || "Not configured"}
                            </code>
                            {apiKey.config.projectId && (
                              <button
                                onClick={() => copyToClipboard(apiKey.config.projectId!, `${apiKey.id}-project`)}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                              >
                                {copiedField === `${apiKey.id}-project` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Auth Domain</label>
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">
                              {apiKey.config.authDomain || "Not configured"}
                            </code>
                            {apiKey.config.authDomain && (
                              <button
                                onClick={() => copyToClipboard(apiKey.config.authDomain!, `${apiKey.id}-auth`)}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                              >
                                {copiedField === `${apiKey.id}-auth` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      <span>ID: {apiKey.projectId}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Integration Status */}
          {apiKeys.length > 0 && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Backend Integration Active</h3>
              </div>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Your project is now connected to {apiKeys.map((key) => key.provider).join(" and ")}. Authentication
                templates will automatically use these configurations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-blue-800 dark:text-blue-200">User registration enabled</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-blue-800 dark:text-blue-200">User authentication enabled</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-blue-800 dark:text-blue-200">Database integration ready</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-blue-800 dark:text-blue-200">Real-time features available</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showApiKeyModal && renderApiKeyModal()}
      {showDeleteModal && renderDeleteModal()}
      {showNotification && renderNotification()}
    </>
  )
}
