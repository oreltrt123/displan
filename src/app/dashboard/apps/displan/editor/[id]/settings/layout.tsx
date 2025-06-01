"use client"

import type React from "react"
import { SettingsSidebar } from "../../..//components/editor/settings-sidebar"
import { TopBar } from "../../../components/editor/top-bar"
import { useState } from "react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleTogglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const handleSaveCanvas = async () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="settings-layout">
      <TopBar
        isPreviewMode={isPreviewMode}
        onTogglePreview={handleTogglePreviewMode}
        onSave={handleSaveCanvas}
        isSaving={isSaving}
      />
      <div className="settings-container">
        <SettingsSidebar />
        <div className="settings-main">
          <div className="settings-content">
            <div className="settings-content-inner">{children}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-layout {
          min-height: 100vh;
          background-color: rgba(136, 136, 136, 0.1);
        }
        
        .dark .settings-layout {
          background-color: #111827;
        }
        
        .settings-container {
          display: flex;
          height: calc(100vh - 64px);
        }
        
        .settings-main {
          flex: 1;
          overflow: auto;
          min-width: 0;
        }
        
        .settings-content {
          max-width: 64rem;
          margin: 0 auto;
          padding: 1.5rem;
        }
        
        .settings-content-inner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .settings-container {
            flex-direction: column;
            height: auto;
            min-height: calc(100vh - 64px);
          }
          
          .settings-content {
            padding: 1rem;
          }
          
          .settings-content-inner {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
