"use client"

import { useState, useEffect } from "react"
import { getWaitlistCount } from "@/app/actions/waitlist"
import { XIcon } from "./icons/x-icon"
import { InstagramIcon } from "./icons/instagram-icon"
import { DiscordIcon } from "./icons/discord-icon"
import { FacebookIcon } from "./icons/facebook-icon"
import { LinkedInIcon } from "./icons/linkedin-icon"
import { Avatar } from "./avatar"
import { SocialIcon } from "./social-icon"
import { WaitlistForm } from "./waitlist-form"
import { EditableTextElement } from "../app/dashboard/apps/displan/templates/editable-text-element"
interface TemplateRendererProps {
  templateId: string
  selectedTemplateElement: string | null
  selectedElements: string[]
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


export function WaitlistSignup(props: TemplateRendererProps) {
  const [waitlistCount, setWaitlistCount] = useState(0)
    const [templateContent, setTemplateContent] = useState<Record<string, string>>({})
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

  const { templateId, projectId, pageSlug } = props

  useEffect(() => {
    getWaitlistCount().then((count) => setWaitlistCount(count + 100))
  }, [])

  const handleSuccess = (count: number) => {
    setWaitlistCount(count + 100)
  }

  return (
    <div className="w-full max-w-xl mx-auto p-8 flex flex-col justify-between min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div>
                               <EditableTextElement
                              elementKey="dfdsafasfafasfasf"
                          defaultContent="Join Our Product Launch Waitlist"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                            >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
            Join Our Product Launch Waitlist
          </h2>
          </EditableTextElement>
        </div>
        <div>
                                         <EditableTextElement
                              elementKey="dfdsafasfafasfasf"
                          defaultContent="Join Our Product Launch Waitlist"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                            >
          <p className="text-lg sm:text-xl mb-8 text-gray-300">
            Be part of something truly extraordinary. Join thousands of others already gaining early access to our
            revolutionary new product.
          </p>
          </EditableTextElement>
        </div>
        <div className="w-full">
          <WaitlistForm onSuccess={handleSuccess} />
        </div>
        <div>
          <div className="flex items-center justify-center mt-8">
            <div className="flex -space-x-2 mr-4">
              <Avatar initials="JD" index={0} />
              <Avatar initials="AS" index={1} />
              <Avatar initials="MK" index={2} />
            </div>
                                                     <EditableTextElement
                              elementKey="dfdsafasfafasfasf"
                          defaultContent="Join Our Product Launch Waitlist"
                      templateId={templateId}
                      templateContent={templateContent}
                      saveContent={saveContent}
                      isPreviewMode={props.isPreviewMode}
                            >
            <p className="text-white font-semibold">{waitlistCount}+ people on the waitlist</p>
            </EditableTextElement>
          </div>
        </div>
      </div>
      <div className="pt-8 flex justify-center space-x-6">
        <SocialIcon
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (formerly Twitter)"
          icon={<XIcon className="w-6 h-6" />}
        />
        <SocialIcon
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          icon={<InstagramIcon className="w-6 h-6" />}
        />
        <SocialIcon
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          icon={<DiscordIcon className="w-6 h-6" />}
        />
        <SocialIcon
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          icon={<FacebookIcon className="w-6 h-6" />}
        />
        <SocialIcon
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          icon={<LinkedInIcon className="w-6 h-6" />}
        />
      </div>
    </div>
  )
}
