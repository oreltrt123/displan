"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { EditableTemplateElement, TextEditingState } from "../types/canvas-types"
import { EditableTextElement } from "./editable-text-element"
import { ResizableImageElement } from "./resizable-image-element"
import { ImageUploadModal } from "../components/image-upload-modal"
import "@/styles/sidebar_settings_editor.css"
import "@/styles/template/template_11.css"
import "@/styles/template/template_14.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WaitlistSignup } from "@/components/waitlist-signup"
import { InView } from "@/components/ui/in-view"
import { motion } from "framer-motion"
import { SocialLinks } from "@/components/ui/social-links"
import { AIVoiceInput } from "@/components/ui/ai-voice-input"
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"
import { stagger, useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import GooeyNav from '@/components/ui/gooeynav'
import GlassIcons from '@/components/ui/GlassIcons'
import {
  FiFileText,
  FiBook,
  FiHeart,
  FiCloud,
  FiEdit,
  FiBarChart2
} from 'react-icons/fi';
import "@/styles/gabi_css_template.css"

interface TemplateRendererProps {
  templateId: string
  selectedTemplateElement: string | null
  selectedElements: string[]
  textEditingState: TextEditingState
  editableElements: Map<string, EditableTemplateElement>
  isPreviewMode: boolean
  getStableElementId: (templateId: string, elementKey: string) => string
  onTemplateElementClick: (elementId: string, elementType: string, content: string, event: React.MouseEvent) => void
  onTemplateElementDoubleClick: (elementId: string, content: string, event: React.MouseEvent) => void
  onTextChange: (elementId: string, newContent: string) => void
  onTextEditKeyDown: (e: React.KeyboardEvent, elementId: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
  projectId: string
  pageSlug: string
}

// Separate component for editable form elements to avoid hooks issues
interface EditableFormElementProps {
  elementKey: string
  defaultContent: string
  templateId: string
  templateContent: Record<string, string>
  saveContent: (elementKey: string, content: string) => Promise<void>
  isPreviewMode: boolean
  type?: "input" | "textarea" | "button"
  placeholder?: string
  className?: string
}

function EditableFormElement({
  elementKey,
  defaultContent,
  templateId,
  templateContent,
  saveContent,
  isPreviewMode,
  type = "input",
  placeholder,
  className = "",
}: EditableFormElementProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(defaultContent)

  const fullKey = `${templateId}_${elementKey}`
  const currentContent = templateContent[fullKey] || defaultContent

  useEffect(() => {
    setContent(currentContent)
  }, [currentContent])

  const handleSave = async () => {
    await saveContent(elementKey, content)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setContent(currentContent)
    setIsEditing(false)
  }

  if (isPreviewMode) {
    if (type === "button") {
      return (
        <button className={className} type="button">
          {currentContent}
        </button>
      )
    } else if (type === "textarea") {
      return <textarea className={className} placeholder={currentContent} readOnly />
    } else {
      return <input className={className} placeholder={currentContent} readOnly />
    }
  }

  if (isEditing) {
    return (
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${className} border-2 border-blue-500`}
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSave()
              } else if (e.key === "Escape") {
                handleCancel()
              }
            }}
          />
        ) : (
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${className} border-2 border-blue-500`}
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSave()
              } else if (e.key === "Escape") {
                handleCancel()
              }
            }}
          />
        )}
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Press Enter to save, Esc to cancel
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${className} ${!isPreviewMode ? "cursor-pointer hover:ring-2 hover:ring-blue-300 relative group" : ""}`}
      onClick={() => !isPreviewMode && setIsEditing(true)}
    >
      {type === "button" ? (
        <button type="button" className="w-full h-full">
          {currentContent}
        </button>
      ) : type === "textarea" ? (
        <textarea placeholder={currentContent} readOnly />
      ) : (
        <input placeholder={currentContent} readOnly />
      )}
      {!isPreviewMode && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  )
}

export function TemplateRenderer(props: TemplateRendererProps) {
  const { templateId, projectId, pageSlug } = props

  const [templateContent, setTemplateContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [imageUploadModal, setImageUploadModal] = useState<{
    isOpen: boolean
    elementKey: string
    elementId: string
  }>({
    isOpen: false,
    elementKey: "",
    elementId: "",
  })

  // Login/Auth state for template_17
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showConfig, setShowConfig] = useState(false)

  const socials = [
    {
      name: "Instagram",
      image: "https://link-hover-lndev.vercel.app/instagram.png",
    },
    {
      name: "LinkedIn",
      image: "https://link-hover-lndev.vercel.app/linkedin.png",
    },
    {
      name: "Spotify",
      image: "https://link-hover-lndev.vercel.app/spotify.png",
    },
    {
      name: "TikTok",
      image: "https://link-hover-lndev.vercel.app/tiktok.png",
    },
  ]

  const [recordings, setRecordings] = useState<{ duration: number; timestamp: Date }[]>([])

  const handleStop = (duration: number) => {
    setRecordings((prev) => [...prev.slice(-4), { duration, timestamp: new Date() }])
  }

  // Load template content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/template-canvas-v232?projectId=${projectId}&pageSlug=${pageSlug}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.content) {
            setTemplateContent(result.data.content)
            console.log("Loaded template content:", result.data.content)
          }
        }
      } catch (error) {
        console.error("Error loading template content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [projectId, pageSlug])

  // Load saved Supabase config for template_17
  useEffect(() => {
    if (templateId === "template_17") {
      const savedUrl = localStorage.getItem("user_supabase_url") || ""
      const savedKey = localStorage.getItem("user_supabase_anon_key") || ""
      setSupabaseUrl(savedUrl)
      setSupabaseKey(savedKey)
    }
  }, [templateId])

  const testimonials = [
    {
      text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Briana Patton",
      role: "Operations Manager",
    },
    {
      text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Bilal Ahmed",
      role: "IT Manager",
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Saman Malik",
      role: "Customer Support Lead",
    },
    {
      text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Omar Raza",
      role: "CEO",
    },
    {
      text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Zainab Hussain",
      role: "Project Manager",
    },
    {
      text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      name: "Aliza Khan",
      role: "Business Analyst",
    },
    {
      text: "Our business functions improved with a user-friendly design and positive customer feedback.",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      name: "Farhan Siddiqui",
      role: "Marketing Director",
    },
    {
      text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Sana Sheikh",
      role: "Sales Manager",
    },
    {
      text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      name: "Hassan Ali",
      role: "E-commerce Manager",
    },
  ]
const items = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];
const items_glass = [
  { icon: <FiFileText />, color: 'blue', label: 'Files' },
  { icon: <FiBook />, color: 'purple', label: 'Books' },
  { icon: <FiHeart />, color: 'red', label: 'Health' },
  { icon: <FiCloud />, color: 'indigo', label: 'Weather' },
  { icon: <FiEdit />, color: 'orange', label: 'Notes' },
  { icon: <FiBarChart2 />, color: 'green', label: 'Stats' },
]
  const firstColumn = testimonials.slice(0, 3)
  const secondColumn = testimonials.slice(3, 6)
  const thirdColumn = testimonials.slice(6, 9)

  // Save content to server
  const saveContent = async (elementKey: string, content: string) => {
    try {
      const response = await fetch("/api/template-canvas-v232", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          projectId,
          pageSlug,
          templateId,
          elementKey,
          content,
        }),
      })
      if (response.ok) {
        const result = await response.json()
        console.log("Content saved:", result)
        // Update local state
        setTemplateContent((prev) => ({
          ...prev,
          [`${templateId}_${elementKey}`]: content,
        }))
      }
    } catch (error) {
      console.error("Error saving content:", error)
    }
  }

  // Handle image selection from repository
  const handleImageSelect = async (elementKey: string, imageUrl: string) => {
    console.log("Image selected:", elementKey, imageUrl)
    // Save the new image URL
    await saveContent(elementKey, imageUrl)
    // Force re-render by updating local state immediately
    setTemplateContent((prev) => ({
      ...prev,
      [`${templateId}_${elementKey}`]: imageUrl,
    }))
    // Close modal
    setImageUploadModal({ isOpen: false, elementKey: "", elementId: "" })
  }

  // Helper function for non-editable elements (images, etc.)
  const createDraggableElement = (
    elementKey: string,
    elementType: string,
    content: string,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
  ) => {
    const elementId = props.getStableElementId(templateId, elementKey)
    const isSelected = props.selectedTemplateElement === elementId || props.selectedElements.includes(elementId)

    return (
      <div
        key={elementKey}
        data-template-element={elementId}
        className={`template-draggable-element ${isSelected ? "template-element-selected" : ""} ${className || ""}`}
        style={{
          position: "relative",
          cursor: props.isPreviewMode ? "default" : "move",
          outline: isSelected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          ...style,
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!props.isPreviewMode) {
            props.onTemplateElementClick(elementId, elementType, content, e)
          }
        }}
      >
        {children}
        {!props.isPreviewMode && isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none" />
        )}
      </div>
    )
  }

  // Enhanced image element with resize and upload functionality
  const createResizableImageElement = (
    elementKey: string,
    elementType: string,
    defaultSrc: string,
    className?: string,
    alt?: string,
  ) => {
    const elementId = props.getStableElementId(templateId, elementKey)
    const currentSrc = templateContent[`${templateId}_${elementKey}`] || defaultSrc

    console.log("Rendering image element:", elementKey, "with src:", currentSrc)

    return (
      <ResizableImageElement
        key={`${elementKey}-${currentSrc}`} // Force re-render when src changes
        elementId={elementId}
        elementKey={elementKey}
        templateId={templateId}
        src={currentSrc}
        alt={alt || ""}
        className={className}
        isSelected={props.selectedTemplateElement === elementId || props.selectedElements.includes(elementId)}
        isPreviewMode={props.isPreviewMode}
        projectId={projectId}
        pageSlug={pageSlug}
        onImageClick={(e) => {
          if (!props.isPreviewMode) {
            console.log("Image clicked:", elementId)
            props.onTemplateElementClick(elementId, elementType, currentSrc, e)
          }
        }}
        onImageDoubleClick={(e) => {
          if (!props.isPreviewMode) {
            console.log("Image double-clicked:", elementId)
            e.stopPropagation()
            setImageUploadModal({
              isOpen: true,
              elementKey,
              elementId,
            })
          }
        }}
        onImageChange={(newSrc) => {
          console.log("Image changed:", elementKey, newSrc)
          saveContent(elementKey, newSrc)
        }}
      />
    )
  }

  // Auth functions for template_17
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!supabaseUrl || !supabaseKey) {
        setError("Please configure your Supabase credentials first")
        setLoading(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        setUser(data.user)
        localStorage.setItem("user_email", email)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error
        setUser(data.user)
        localStorage.setItem("user_email", email)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.auth.signOut()
      }
      setUser(null)
      setEmail("")
      setPassword("")
      localStorage.removeItem("user_email")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSaveConfig = () => {
    localStorage.setItem("user_supabase_url", supabaseUrl)
    localStorage.setItem("user_supabase_anon_key", supabaseKey)
    setShowConfig(false)
  }

  const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows`
  const wordsArray = words.split(" ")

  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (!scope.current) return

    animate(
      "span",
      {
        opacity: 1,
        filter: "blur(0px)",
      },
      {
        duration: 2,
        delay: stagger(0.2),
      },
    )
  }, [scope, animate])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading template...</div>
      </div>
    )
  }

  return (
    <>
      {/* Image Upload Modal */}
      {imageUploadModal.isOpen && (
        <ImageUploadModal
          isOpen={imageUploadModal.isOpen}
          onClose={() => setImageUploadModal({ isOpen: false, elementKey: "", elementId: "" })}
          onImageSelect={(imageUrl) => handleImageSelect(imageUploadModal.elementKey, imageUrl)}
          projectId={projectId}
        />
      )}

      {/* Template Content */}
      {(() => {
        switch (templateId) {
          case "template_17":
            return (
    <div className="flex min-h-screen">
      {/* Left side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          {!user ? (
            <div>
              <div className="text-center mb-8">
                <EditableTextElement
                  elementKey="auth_title"
                  defaultContent="Welcome Back"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <h2 className="text-[32px] font-medium text-black leading-[48px] mb-1">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="auth_subtitle"
                  defaultContent="Sign in to your account"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="text-[16px] font-medium text-black leading-[24px] mb-10">
                    {isLogin ? "Sign in to your account" : "Create a new account to get started"}
                  </p>
                </EditableTextElement>
              </div>

              {!showConfig ? (
                <form onSubmit={handleAuth} className="w-full">
                  <div className="mb-5">
                    <label className="text-[14px] font-medium text-black leading-[21px]" htmlFor="email">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22] mt-1"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="text-[14px] font-medium text-black leading-[21px]" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22] mt-1"
                    />
                  </div>

                  {error && (
                    <div className="p-3 text-sm rounded-md bg-red-500/20 text-red-600 border border-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[32px] text-[13px] font-bold bg-[#3a5b22] text-white border border-[#3a5b22] rounded-[10px] transition-colors duration-200 focus:outline-none hover:bg-[#2d4419]"
                  >
                    {loading ? "Loading..." : isLogin ? "Sign in" : "Create account"}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[14px] font-medium text-[#0f3cde] hover:underline"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>

                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfig(true)}
                      className="text-[10px] font-medium text-gray-500 hover:text-gray-700"
                    >
                      Configure Supabase Settings
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Supabase Configuration</h3>
                    <p className="text-sm text-gray-600">Enter your Supabase project credentials</p>
                  </div>

                  <div>
                    <label htmlFor="supabase-url">Supabase URL</label>
                    <input
                      id="supabase-url"
                      type="url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-[#d9d9d9] rounded-[10px] text-[10px] placeholder:text-[#d9d9d9]"
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>

                  <div>
                    <label htmlFor="supabase-key">Supabase Anon Key</label>
                    <input
                      id="supabase-key"
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-[#d9d9d9] rounded-[10px] text-[10px] placeholder:text-[#d9d9d9]"
                      placeholder="Your anon key"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveConfig}
                      className="flex-1 h-[32px] text-[13px] font-bold bg-[#3a5b22] text-white border border-[#3a5b22] rounded-[10px] hover:bg-[#2d4419]"
                    >
                      Save Configuration
                    </button>
                    <button
                      onClick={() => setShowConfig(false)}
                      className="flex-1 h-[32px] text-[13px] font-bold border border-gray-300 text-gray-700 bg-white rounded-[10px] hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">How to get your credentials:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Go to your Supabase dashboard</li>
                      <li>Select your project</li>
                      <li>Go to Settings → API</li>
                      <li>Copy the Project URL and anon/public key</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <EditableTextElement
                  elementKey="welcome_title"
                  defaultContent="Welcome!"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
                </EditableTextElement>
                <EditableTextElement
                  elementKey="welcome_subtitle"
                  defaultContent="You are successfully logged in"
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                >
                  <p className="mt-2 text-sm text-gray-600">You are successfully logged in</p>
                </EditableTextElement>
              </div>

              <div className="space-y-4">
                <div className="bg-[#8888881A] p-4 rounded-md">
                  <p className="text-sm text-gray-600">Logged in as:</p>
                  <p className="font-medium text-gray-900">{user?.email || email}</p>
                </div>

                <div className="bg-[#8888881A] p-4 rounded-md">
                  <p className="text-sm text-gray-600">User ID:</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{user?.id || "N/A"}</p>
                </div>

                <div className="bg-[#8888881A] p-4 rounded-md">
                  <p className="text-sm text-gray-600">Supabase URL:</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{supabaseUrl || "Not configured"}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full geswgsegdsgdgeg bg-green-100 text-green-600"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/img_chrislee70l1tdai6rmunsplash_2.png"
          alt="Monstera plant"
          className="absolute inset-0 h-full w-full object-cover rounded-tl-[45px] rounded-br-[45px]"
        />
      </div>
    </div>
            )

          case "template-1":
            return (
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                  <div className="max-w-xl">
                    <EditableTextElement
                      elementKey="title"
                      defaultContent="Meet our leadership"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                        Meet our leadership
                      </h2>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="description"
                      defaultContent="We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-lg/8 text-gray-600">
                        We're a dynamic group of individuals who are passionate about what we do and dedicated to
                        delivering the best results for our clients.
                      </p>
                    </EditableTextElement>
                  </div>

                  <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                    <li>
                      <div className="flex items-center gap-x-6">
                        {createResizableImageElement(
                          "avatar",
                          "image-profile",
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          "size-[35px] rounded-full",
                          "Profile avatar",
                        )}

                        <div>
                          <EditableTextElement
                            elementKey="name"
                            defaultContent="Test Name"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">Test Name</h3>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="role"
                            defaultContent="Co-Founder / CEO"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="text-sm/6 font-semibold text-indigo-600">Co-Founder / CEO</p>
                          </EditableTextElement>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )

          case "template-2":
            return (
              <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />

                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                  {createResizableImageElement(
                    "logo",
                    "image-logo",
                    "/logo_light_mode.png",
                    "mx-auto h-12",
                    "Company logo",
                  )}

                  <figure className="mt-10">
                    <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                      <EditableTextElement
                        elementKey="quote"
                        defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <p>
                          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa
                          sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                        </p>
                      </EditableTextElement>
                    </blockquote>

                    <figcaption className="mt-10">
                      {createResizableImageElement(
                        "testimonial-avatar",
                        "image-avatar",
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                        "mx-auto size-10 rounded-full",
                        "Testimonial avatar",
                      )}

                      <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                        <EditableTextElement
                          elementKey="testimonial-name"
                          defaultContent="Test Name"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <div className="font-semibold text-gray-900">Test Name</div>
                        </EditableTextElement>

                        <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                          <circle cx="1" cy="1" r="1" />
                        </svg>

                        <EditableTextElement
                          elementKey="testimonial-title"
                          defaultContent="CEO of Workcation"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <div className="text-gray-600">CEO of Workcation</div>
                        </EditableTextElement>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </section>
            )

          case "empty-0":
            return (
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl lg:mx-0">
                    <EditableTextElement
                      elementKey="blog-title"
                      defaultContent="From the blog"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                        From the blog
                      </h2>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="blog-subtitle"
                      defaultContent="Learn how to grow your business with our expert advice."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-2"
                    >
                      <p className="text-lg/8 text-gray-600">Learn how to grow your business with our expert advice.</p>
                    </EditableTextElement>
                  </div>

                  <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    <article className="flex max-w-xl flex-col items-start justify-between">
                      <div className="flex items-center gap-x-4 text-xs">
                        <EditableTextElement
                          elementKey="article-date"
                          defaultContent="Mar 16, 2020"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <time dateTime="2020-03-16" className="text-gray-500">
                            Mar 16, 2020
                          </time>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="article-category"
                          defaultContent="Marketing"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a
                            href="#"
                            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                          >
                            Marketing
                          </a>
                        </EditableTextElement>
                      </div>

                      <div className="group relative">
                        <EditableTextElement
                          elementKey="article-title"
                          defaultContent="Boost your conversion rate"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          className="mt-3"
                        >
                          <h3 className="text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                            <a href="#">
                              <span className="absolute inset-0" />
                              Boost your conversion rate
                            </a>
                          </h3>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="article-excerpt"
                          defaultContent="Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta."
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          className="mt-5"
                        >
                          <p className="line-clamp-3 text-sm/6 text-gray-600">
                            Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid
                            explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel.
                            Iusto corrupti dicta.
                          </p>
                        </EditableTextElement>
                      </div>

                      <div className="relative mt-8 flex items-center gap-x-4">
                        {createResizableImageElement(
                          "author-avatar",
                          "image-author",
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          "size-10 rounded-full bg-gray-50",
                          "Author avatar",
                        )}

                        <div className="text-sm/6">
                          <EditableTextElement
                            elementKey="author-name"
                            defaultContent="Test Name"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="font-semibold text-gray-900">
                              <a href="#">
                                <span className="absolute inset-0" />
                                Test Name
                              </a>
                            </p>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="author-role"
                            defaultContent="Co-Founder / CTO"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="text-gray-600">Co-Founder / CTO</p>
                          </EditableTextElement>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            )

          case "empty-1":
            return (
              <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div
                  className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                  aria-hidden="true"
                >
                  <div
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                    style={{
                      clipPath:
                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                  />
                </div>

                <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    {/* Full Name Input */}
                    <div>
                      <EditableTextElement
                        elementKey="name-label"
                        defaultContent="Name"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <label htmlFor="full-name" className="block text-sm/6 font-semibold text-[#888888f1]">
                          Name
                        </label>
                      </EditableTextElement>

                      <div className="mt-2.5">
                        <EditableFormElement
                          elementKey="name-input"
                          defaultContent="Jane Smith"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          type="input"
                          placeholder="Jane Smith"
                          className="r2552esf25_252trewt3eSearchr w-[100%]"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <EditableTextElement
                        elementKey="email-label"
                        defaultContent="Email"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <label htmlFor="email" className="block text-sm/6 font-semibold text-[#888888f1]">
                          Email
                        </label>
                      </EditableTextElement>

                      <div className="mt-2.5">
                        <EditableFormElement
                          elementKey="email-input"
                          defaultContent="jane@displan.com"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                          type="input"
                          placeholder="jane@displan.com"
                          className="r2552esf25_252trewt3eSearchr w-[100%]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="mt-6 sm:col-span-2">
                    <EditableTextElement
                      elementKey="message-label"
                      defaultContent="Message"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <label htmlFor="message" className="block text-sm/6 font-semibold text-[#888888f1]">
                        Message
                      </label>
                    </EditableTextElement>

                    <div className="mt-2.5">
                      <EditableFormElement
                        elementKey="message-input"
                        defaultContent="Your message..."
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                        type="textarea"
                        placeholder="Your message..."
                        className="r2552esf25_252trewt3eSearchr w-[100%]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-10">
                    <EditableFormElement
                      elementKey="submit-button"
                      defaultContent="Submit"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      type="button"
                      className="rhdrthdrfhdrhdfhrhh"
                    />
                  </div>
                </form>
              </div>
            )

          case "empty-2":
            return (
              <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                <div
                  className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                  aria-hidden="true"
                >
                  <div
                    className="aspect-[577/310] w-[36.125rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                    style={{
                      clipPath:
                        "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <EditableTextElement
                    elementKey="announcement-text"
                    defaultContent="DisPlan 2025 - Join us in Denver from June 7 – 9 to see what's coming next."
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <p className="text-sm/6 text-gray-900">
                      <strong className="font-semibold">DisPlan 2025</strong>
                      <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      Join us in Denver from June 7 – 9 to see what's coming next.
                    </p>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="register-button"
                    defaultContent="Register now"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <a
                      href="#"
                      className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      Register now <span aria-hidden="true">→</span>
                    </a>
                  </EditableTextElement>
                </div>

                <div className="flex flex-1 justify-end">
                  <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                    <span className="sr-only">Dismiss</span>
                    <svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )

          case "empty-3":
            return (
              <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <EditableTextElement
                    elementKey="deploy-subtitle"
                    defaultContent="Deploy faster"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <h2 className="text-center text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="deploy-title"
                    defaultContent="Everything you need to deploy your app"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                    className="mx-auto mt-2 max-w-lg text-center"
                  >
                    <p className="text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                      Everything you need to deploy your app
                    </p>
                  </EditableTextElement>

                  <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:row-span-2">
                      <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />

                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                        <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                          <EditableTextElement
                            elementKey="feature-title"
                            defaultContent="Mobile friendly"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-2"
                          >
                            <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                              Mobile friendly
                            </p>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="feature-description"
                            defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-2 max-w-lg"
                          >
                            <p className="text-sm/6 text-gray-600 max-lg:text-center">
                              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            </p>
                          </EditableTextElement>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem]" />
                    </div>
                  </div>
                </div>
              </div>
            )

          case "empty-4":
            return (
              <div className="bg-white">
                <header className="absolute inset-x-0 top-0 z-50">
                  <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                      {createResizableImageElement(
                        "header-logo",
                        "image-logo",
                        "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600",
                        "h-8 w-auto",
                        "Company logo",
                      )}
                    </div>

                    <div className="hidden lg:flex lg:gap-x-12">
                      <EditableTextElement
                        elementKey="nav-product"
                        defaultContent="Product"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Product
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-features"
                        defaultContent="Features"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Features
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-marketplace"
                        defaultContent="Marketplace"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Marketplace
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="nav-company"
                        defaultContent="Company"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Company
                        </a>
                      </EditableTextElement>
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                      <EditableTextElement
                        elementKey="login-button"
                        defaultContent="Log in"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">
                          Log in <span aria-hidden="true">→</span>
                        </a>
                      </EditableTextElement>
                    </div>
                  </nav>
                </header>

                <div className="relative isolate px-6 pt-14 lg:px-8">
                  <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                      <EditableTextElement
                        elementKey="hero-title"
                        defaultContent="Data to enrich your online business"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                          Data to enrich your online business
                        </h1>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="hero-description"
                        defaultContent="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat."
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                        className="mt-8"
                      >
                        <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit
                          sunt amet fugiat veniam occaecat.
                        </p>
                      </EditableTextElement>

                      <div className="mt-10 flex items-center justify-center gap-x-6">
                        <EditableTextElement
                          elementKey="cta-primary"
                          defaultContent="Get started"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a
                            href="#"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Get started
                          </a>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="cta-secondary"
                          defaultContent="Learn more"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#" className="text-sm/6 font-semibold text-gray-900">
                            Learn more <span aria-hidden="true">→</span>
                          </a>
                        </EditableTextElement>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )

          case "empty-5":
            return (
              <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                  <EditableTextElement
                    elementKey="pricing-subtitle"
                    defaultContent="Pricing"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                  >
                    <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
                  </EditableTextElement>

                  <EditableTextElement
                    elementKey="pricing-title"
                    defaultContent="Choose your DisPlan plan for you"
                    templateId={templateId}
                    templateContent={templateContent}
                    saveContent={saveContent}
                    isPreviewMode={props.isPreviewMode}
                    className="mt-2"
                  >
                    <p className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                      Choose your DisPlan plan for you
                    </p>
                  </EditableTextElement>
                </div>

                <EditableTextElement
                  elementKey="pricing-description"
                  defaultContent="Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
                  templateId={templateId}
                  templateContent={templateContent}
                  saveContent={saveContent}
                  isPreviewMode={props.isPreviewMode}
                  className="mx-auto mt-6 max-w-2xl text-center"
                >
                  <p className="text-lg font-semibold text-pretty text-gray-600 sm:text-xl/8">
                    Choose an affordable plan that's packed with the best features for engaging your audience, creating
                    customer loyalty, and driving sales.
                  </p>
                </EditableTextElement>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                  <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
                    <EditableTextElement
                      elementKey="plan1-name"
                      defaultContent="Hobby"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h3 className="text-base/7 font-semibold text-indigo-600">Hobby</h3>
                    </EditableTextElement>

                    <p className="mt-4 flex items-baseline gap-x-2">
                      <EditableTextElement
                        elementKey="plan1-price"
                        defaultContent="$29"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">$29</span>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="plan1-price-month"
                        defaultContent="/month"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-base text-gray-500">/month</span>
                      </EditableTextElement>
                    </p>

                    <EditableTextElement
                      elementKey="plan1-description"
                      defaultContent="The perfect plan if you're just getting started with our product."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-base/7 text-gray-600">
                        The perfect plan if you're just getting started with our product.
                      </p>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="plan1-cta"
                      defaultContent="Get started today"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <a
                        href="#"
                        className="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get started today
                      </a>
                    </EditableTextElement>
                  </div>

                  <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
                    <EditableTextElement
                      elementKey="plan2-name"
                      defaultContent="Enterprise"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                    >
                      <h3 className="text-base/7 font-semibold text-indigo-400">Enterprise</h3>
                    </EditableTextElement>

                    <p className="mt-4 flex items-baseline gap-x-2">
                      <EditableTextElement
                        elementKey="plan2-price"
                        defaultContent="$99"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-5xl font-semibold tracking-tight text-white">$99</span>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="plan2-price-month"
                        defaultContent="/month"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <span className="text-base text-indigo-200">/month</span>
                      </EditableTextElement>
                    </p>

                    <EditableTextElement
                      elementKey="plan2-description"
                      defaultContent="Dedicated support and infrastructure for your company."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-6"
                    >
                      <p className="text-base/7 text-indigo-200">
                        Dedicated support and infrastructure for your company.
                      </p>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="plan2-cta"
                      defaultContent="Get started today"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <a
                        href="#"
                        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Get started today
                      </a>
                    </EditableTextElement>
                  </div>
                </div>
              </div>
            )

          case "empty-6":
            return (
              <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <section>
                  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                      <div className="md:col-span-1">
                        <div className="max-w-lg md:max-w-none">
                          <EditableTextElement
                            elementKey="Lorem-cta"
                            defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-8 block sm:mt-10"
                          >
                            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </h2>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="ipsum6-cta"
                            defaultContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur doloremque saepe architecto maiores repudiandae amet perferendis repellendus, reprehenderit voluptas sequi."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                            className="mt-8 block sm:mt-10"
                          >
                            <p className="mt-4 text-gray-700">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur doloremque saepe
                              architecto maiores repudiandae amet perferendis repellendus, reprehenderit voluptas sequi.
                            </p>
                          </EditableTextElement>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        {createResizableImageElement(
                          "hero-image",
                          "image-hero",
                          "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          "rounded w-full",
                          "Hero image",
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )

          case "empty-8":
            return (
              <main className="relative flex min-h-screen w-full items-start justify-center px-4 py-10 md:items-center">
                <SocialLinks socials={socials} />
              </main>
            )

          case "empty-9":
            return (
              <section className="grid place-content-center gap-2 bg-background w-full h-screen text-black">
                {[
                  { href: "https://x.com", label: "Twitter" },
                  { href: "https://linkedin.com", label: "Linkedin" },
                  { href: "https://github.com", label: "Github" },
                  { href: "https://instagram.com", label: "Instagram" },
                ].map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="group text-primary relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
                    style={{ lineHeight: 0.75 }}
                  >
                    <div className="flex">
                      {label.split("").map((letter, i) => (
                        <span
                          key={`top-${i}`}
                          className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
                          style={{ transitionDelay: `${i * 25}ms` }}
                        >
                          {letter}
                        </span>
                      ))}
                    </div>

                    <div className="absolute inset-0 flex">
                      {label.split("").map((letter, i) => (
                        <span
                          key={`bottom-${i}`}
                          className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
                          style={{ transitionDelay: `${i * 25}ms` }}
                        >
                          {letter}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </section>
            )

          case "empty-10":
            return (
              <section className="bg-background my-20 relative">
                <div className="container z-10 mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
                  >
                    <div className="flex justify-center">
                      <EditableTextElement
                        elementKey="Testimonials-cta"
                        defaultContent="Testimonials"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                        className="mt-8 block sm:mt-10"
                      >
                        <div className="border py-1 px-4 rounded-lg">Testimonials</div>
                      </EditableTextElement>
                    </div>

                    <EditableTextElement
                      elementKey="Testimonials-cta2"
                      defaultContent="What our users say"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
                        What our users say
                      </h2>
                    </EditableTextElement>

                    <EditableTextElement
                      elementKey="Testimonials-cta3"
                      defaultContent="See what our customers have to say about us."
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                      className="mt-8 block sm:mt-10"
                    >
                      <p className="text-center mt-5 opacity-75">See what our customers have to say about us.</p>
                    </EditableTextElement>
                  </motion.div>

                  <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                  </div>
                </div>
              </section>
            )

          case "empty-11":
            return (
              <div className="space-y-8">
                <div className="space-y-4">
                  <AIVoiceInput onStart={() => console.log("Recording started")} onStop={handleStop} />
                </div>
              </div>
            )

          case "empty-13":
            return (
              <div className={cn("font-bold")}>
                <div className="mt-4">
                  <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
                    <motion.div ref={scope}>
                      {wordsArray.map((word, idx) => (
                        <motion.span
                          key={word + idx}
                          className="dark:text-white text-black opacity-0"
                          style={{ filter: "blur(10px)" }}
                        >
                          {word}{" "}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            )

          case "template_11":
            return (
              <div>
                <div
                  data-animation="default"
                  className="navbar_component w-nav"
                  data-easing2="ease"
                  fs-scrolldisable-element="smart-nav"
                  data-easing="ease"
                  data-collapse="medium"
                  data-w-id="c406ca79-d8dd-ac01-84ae-a3099c215e05"
                  role="banner"
                  data-duration="400"
                >
                  <div className="navbar_container">
                    <a href="#" className="navbar_logo-link w-nav-brand">
                      <EditableTextElement
                        elementKey="navbar_logo1"
                        defaultContent="Dirtny"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <div className="navbar_logo">Dirtny</div>
                      </EditableTextElement>
                    </a>

                    <nav role="navigation" className="navbar_menu is-page-height-tablet w-nav-menu">
                      <div className="navbar_menu-links">
                        <EditableTextElement
                          elementKey="navbar_link1"
                          defaultContent="Our mission"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#mission" className="navbar_link w-nav-link">
                            Our mission
                          </a>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="navbar_link2"
                          defaultContent="Empower"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#empower" className="navbar_link w-nav-link">
                            Empower
                          </a>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="navbar_link3"
                          defaultContent="The team"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#team" className="navbar_link w-nav-link">
                            The team
                          </a>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="navbar_link4"
                          defaultContent="Our impact"
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <a href="#stats" className="navbar_link w-nav-link">
                            Our impact
                          </a>
                        </EditableTextElement>
                      </div>

                      <EditableTextElement
                        elementKey="navbar_link5"
                        defaultContent="Donate"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a
                          data-wf--button--variant="full-blue"
                          href="#stats"
                          className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block"
                        >
                          <div>Donate</div>
                        </a>
                      </EditableTextElement>
                    </nav>

                    <div className="navbar_menu-button w-nav-button">
                      <div className="menu-icon1">
                        <div className="menu-icon1_line-top"></div>
                        <div className="menu-icon1_line-middle">
                          <div className="menu-icon1_line-middle-inner"></div>
                        </div>
                        <div className="menu-icon1_line-bottom"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <main className="main-wrapper">
                  <br />

                  <header className="section_hero">
                    <div className="padding-global">
                      <div className="container-large is--100">
                        <div className="hero_content">
                          <div className="padding-global">
                            <div className="margin-bottom margin-medium">
                              <div className="_2col_grid z-index-2">
                                <EditableTextElement
                                  elementKey="navbar_link6"
                                  defaultContent="Dirtny"
                                  templateId={templateId}
                                  templateContent={templateContent}
                                  saveContent={saveContent}
                                  isPreviewMode={props.isPreviewMode}
                                >
                                  <h1 className="hero-title">Dirtny</h1>
                                </EditableTextElement>
                              </div>
                            </div>
                          </div>

                          <div className="hero_visuals">
                            {createResizableImageElement(
                              "hero-image",
                              "image-hero",
                              "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              "rounded w-full",
                              "Hero image",
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  <section id="mission" animation-container="text-fade-in" className="section_mission">
                    <div className="padding-global">
                      <div className="container-small">
                        <div className="padding-section-large">
                          <div className="mission_component">
                            <EditableTextElement
                              elementKey="navbar_link7"
                              defaultContent="Our Mission Our mission is to empower creators and changemakers by providing a platform that connects their visions with generous supporters. We believe that every story deserves to be told and every dream deserves a chance to flourish."
                              templateId={templateId}
                              templateContent={templateContent}
                              saveContent={saveContent}
                              isPreviewMode={props.isPreviewMode}
                            >
                              <h2 animation-element="text-fade-in">
                                <span className="text-style-tagline margin-right margin-xlarge">Our Mission</span>Our
                                mission is to empower creators and changemakers by providing a platform that connects
                                their visions with generous supporters. We believe that every story deserves to be told
                                and every dream deserves a chance to flourish.
                              </h2>
                            </EditableTextElement>

                            <div className="margin-top margin-medium">
                              <div className="button-group">
                                <EditableTextElement
                                  elementKey="navbar_link8"
                                  defaultContent="Our impact"
                                  templateId={templateId}
                                  templateContent={templateContent}
                                  saveContent={saveContent}
                                  isPreviewMode={props.isPreviewMode}
                                >
                                  <a
                                    data-wf--button--variant="full-blue"
                                    href="#stats"
                                    className="btn w-variant-d9024a16-90fa-fc58-90af-f47fb0e08ad7 w-inline-block"
                                  >
                                    <div>Our impact</div>
                                  </a>
                                </EditableTextElement>

                                <a href="#" className="button is-link is-icon w-inline-block">
                                  <EditableTextElement
                                    elementKey="navbar_link9"
                                    defaultContent="Donate"
                                    templateId={templateId}
                                    templateContent={templateContent}
                                    saveContent={saveContent}
                                    isPreviewMode={props.isPreviewMode}
                                  >
                                    <div>Donate</div>
                                  </EditableTextElement>

                                  <div className="icon-embed-xxsmall w-embed">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M6 3L11 8L6 13" stroke="CurrentColor" strokeWidth="1.5"></path>
                                    </svg>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </main>
              </div>
            )

          case "template_12":
            return (
              <div>
                <div className="bg-white">
                  <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                      <svg
                        viewBox="0 0 1024 1024"
                        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:translate-x-1/2 lg:translate-y-0"
                        aria-hidden="true"
                      >
                        <circle
                          cx="512"
                          cy="512"
                          r="512"
                          fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                          fillOpacity="0.7"
                        />

                        <defs>
                          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                            <stop stopColor="#7775D6" />
                            <stop offset="1" stopColor="#E935C1" />
                          </radialGradient>
                        </defs>
                      </svg>

                      <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                        <EditableTextElement
                          elementKey="navbar_link20"
                          defaultContent="Boost your productivity. Start using our app today."
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <div className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                            Boost your productivity. Start using our app today.
                          </div>
                        </EditableTextElement>

                        <EditableTextElement
                          elementKey="navbar_link21"
                          defaultContent="Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla."
                          templateId={templateId}
                          templateContent={templateContent}
                          saveContent={saveContent}
                          isPreviewMode={props.isPreviewMode}
                        >
                          <p className="mt-6 text-lg/8 text-pretty text-gray-300">
                            Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing
                            sagittis vel nulla.
                          </p>
                        </EditableTextElement>

                        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                          <EditableTextElement
                            elementKey="navbar_link22"
                            defaultContent="Get started"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <a
                              href="#"
                              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              <div>Get started</div>
                            </a>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="navbar_link23"
                            defaultContent="Learn more"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <a href="#" className="text-sm/6 font-semibold text-white">
                              <div>
                                Learn more <span aria-hidden="true">→</span>
                              </div>
                            </a>
                          </EditableTextElement>
                        </div>
                      </div>

                      <div className="relative mt-16 h-80 lg:mt-8">
                        <img
                          className="absolute top-0 left-0 w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                          src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                          alt="App screenshot"
                          width="1824"
                          height="1080"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )

          case "template_13":
            return (
              <div>
                <div id="home" className="relative overflow-hidden bg-blue-600 pt-[120px] md:pt-[130px] lg:pt-[160px]">
                  <div className="container px-4 mx-auto">
                    <div className="flex flex-wrap items-center -mx-4">
                      <div className="w-full px-4">
                        <div className="hero-content mx-auto max-w-[780px] text-center">
                          <EditableTextElement
                            elementKey="hero_title15"
                            defaultContent="Open-Source Web Template for SaaS, Startup, Apps, and More"
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                              Open-Source Web Template for SaaS, Startup, Apps, and More
                            </h1>
                          </EditableTextElement>

                          <EditableTextElement
                            elementKey="hero_description16"
                            defaultContent="Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap, Tailwind and React NextJS."
                            templateId={templateId}
                            templateContent={templateContent}
                            saveContent={saveContent}
                            isPreviewMode={props.isPreviewMode}
                          >
                            <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                              Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap,
                              Tailwind and React NextJS.
                            </p>
                          </EditableTextElement>

                          <ul className="flex flex-wrap items-center justify-center gap-5 mb-10">
                            <li>
                              <EditableTextElement
                                elementKey="hero_button17"
                                defaultContent="Download Now"
                                templateId={templateId}
                                templateContent={templateContent}
                                saveContent={saveContent}
                                isPreviewMode={props.isPreviewMode}
                              >
                                <Button className="bg-white text-black hover:bg-gray-100">Download Now</Button>
                              </EditableTextElement>
                            </li>

                            <li>
                              <EditableTextElement
                                elementKey="hero_button18"
                                defaultContent="Star on Github"
                                templateId={templateId}
                                templateContent={templateContent}
                                saveContent={saveContent}
                                isPreviewMode={props.isPreviewMode}
                              >
                                <Button
                                  variant="outline"
                                  className="bg-white/20 text-white border-none hover:text-black"
                                >
                                  Star on Github
                                </Button>
                              </EditableTextElement>
                            </li>
                          </ul>

                          <div>
                            <EditableTextElement
                              elementKey="hero_tech_title19"
                              defaultContent="Built with latest technology"
                              templateId={templateId}
                              templateContent={templateContent}
                              saveContent={saveContent}
                              isPreviewMode={props.isPreviewMode}
                            >
                              <p className="mb-4 text-base font-medium text-center text-white">
                                Built with latest technology
                              </p>
                            </EditableTextElement>
                          </div>
                        </div>
                      </div>

                      <div className="w-full px-4">
                        <div className="relative z-10 mx-auto max-w-[845px] mt-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )

          case "template_14":
            return (
              <main>
                <div className="container">
                  <div className="card">
                    <div className="content">
                      <div className="asfasfawfgagwgwg">
                        {createResizableImageElement(
                          "hero-image",
                          "image-hero",
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          "rounded w-full",
                          "Hero image",
                        )}
                      </div>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg1"
                        defaultContent="Jessica Randall"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <h1 className="title">Jessica Randall</h1>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg2"
                        defaultContent="London, United Kingdom"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <h2 className="location">London, United Kingdom</h2>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg3"
                        defaultContent="&quot;Front-end developer and avid reader.&quot;"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <h2 className="description">"Front-end developer and avid reader."</h2>
                      </EditableTextElement>
                    </div>

                    <div className="social">
                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg4"
                        defaultContent="GitHub"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a className="safafwfawfrewr3434" href="https://www.github.com">
                          GitHub
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg5"
                        defaultContent="Frontend Mentor"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a className="safafwfawfrewr3434" href="www.frontendmentor.io">
                          Frontend Mentor
                        </a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg6"
                        defaultContent="LinkedIn"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a className="safafwfawfrewr3434">LinkedIn</a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg7"
                        defaultContent="Twitter"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a className="safafwfawfrewr3434">Twitter</a>
                      </EditableTextElement>

                      <EditableTextElement
                        elementKey="asfasfawfgagwgwg8"
                        defaultContent="Instagram"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
                        <a className="safafwfawfrewr3434">Instagram</a>
                      </EditableTextElement>
                    </div>
                  </div>
                </div>
              </main>
            )

          case "template_15":
            return (
              <main
                className="min-h-screen flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at center, #1E40AF, #000000)",
                }}
              >
                <style jsx global>
                  {backgroundStyle}
                </style>

                <div className="bg-pattern"></div>

                <div className="content w-full">
                  <WaitlistSignup />
                </div>
              </main>
            )

          case "template_16":
            return (
              <div className="h-[80vh] w-full overflow-y-auto overflow-x-hidden">
                <div className="mb-[50vh] mt-[50vh] py-12 text-center text-sm">Scroll down</div>

                <div className="flex h-[1200px] items-end justify-center pb-12">
                  <InView
                    viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.09 },
                      },
                    }}
                  >
                    <div className="columns-2 gap-4 px-8 sm:columns-3">
                      {[
                        "https://images.beta.cosmos.so/e5ebb6f8-8202-40ec-bc70-976f81153501?format=jpeg",
                        "https://images.beta.cosmos.so/1b6f1bee-1b4c-4035-9e93-c93ef4d445e1?format=jpeg",
                        "https://images.beta.cosmos.so/9968a6cf-d7f6-4ec9-a56d-ac4eef3f8689?format=jpeg",
                        "https://images.beta.cosmos.so/4b88a39c-c657-4911-b843-b473237e83b5?format=jpeg",
                        "https://images.beta.cosmos.so/86af92c0-064d-4801-b7ed-232535b03328?format=jpeg",
                        "https://images.beta.cosmos.so/399e2a4a-e118-4aaf-9c7e-155ed18f6556?format=jpeg",
                        "https://images.beta.cosmos.so/6ff16bc9-dc94-4549-a057-673a603ce203?format=jpeg",
                        "https://images.beta.cosmos.so/d67c3185-4480-4408-8f9d-1cbf541e5d91?format=jpeg",
                        "https://images.beta.cosmos.so/a7b19274-3370-4080-b734-e8ac268d8c8e.?format=jpeg",
                        "https://images.beta.cosmos.so/551daf0d-77e8-472c-9324-468fed15a0ba?format=jpeg",
                      ].map((imgSrc, index) => {
                        return (
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                              visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
                            }}
                            key={index}
                            className="mb-4"
                          >
                            <img
                              src={imgSrc || "/placeholder.svg"}
                              alt={`Image placeholder from cosmos.so, index:${index}`}
                              className="size-full rounded-lg object-contain"
                            />
                          </motion.div>
                        )
                      })}
                    </div>
                  </InView>
                </div>
              </div>
            )
          case "empty-14":
            return (
<div style={{ height: '600px', position: 'relative' }}>
  <GooeyNav
    items={items}
    particleCount={15}
    particleDistances={[90, 10]}
    particleR={100}
    initialActiveIndex={0}
    animationTime={600}
    timeVariance={300}
    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
  />
</div>
            )
          case "empty-15":
            return (
<div style={{ height: '600px', position: 'relative' }}>
  <GlassIcons items_glass={items_glass} className="custom-class"/>
</div>
            )
                      case "template_19":
            return (
    <header>
                            <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI"
                        defaultContent="Logo"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
      <h1>Logo</h1>
      </EditableTextElement>
      <input type="checkbox" id="menu-toggle" hidden />
                                  <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu"
                        defaultContent="MENU"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
      <label id="menu">MENU</label>
</EditableTextElement>
      <nav>

          <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu1"
                        defaultContent="HOME"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
        <a href="#" className="links" id="home">HOME</a>
        </EditableTextElement>
                                                  <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu2"
                        defaultContent="CONTANT"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
        <a href="#" className="links" id="contant">CONTANT</a>
        </EditableTextElement>
                                                  <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu3"
                        defaultContent="ABOUT"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
        <a href="#" className="links" id="about">ABOUT</a>
        </EditableTextElement>
                                                  <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu4"
                        defaultContent="SKILLS"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
        <a href="#" className="links" id="skills">SKILLS</a>
        </EditableTextElement>
                                                  <EditableTextElement
                        elementKey="asfasfawfgagwgwg8_GABI_menu5"
                        defaultContent="EXPERIENCE"
                        templateId={templateId}
                        templateContent={templateContent}
                        saveContent={saveContent}
                        isPreviewMode={props.isPreviewMode}
                      >
        <a href="#" className="links" id="experience">EXPERIENCE</a>
        </EditableTextElement>
      </nav>
    </header>

            )
          default:
            return (
              <div className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {templateId.includes("template") ? `Template ${templateId.split("-")[1]}` : `Empty ${templateId}`}
                </span>
              </div>
            )
        }
      })()}
    </>
  )
}

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }
`
