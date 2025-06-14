"use client"

import React, { useState, useRef, useEffect } from "react"

interface EditableTextElementProps {
  elementKey: string
  defaultContent: string
  templateId: string
  templateContent: Record<string, string>
  saveContent: (elementKey: string, content: string) => Promise<void>
  isPreviewMode: boolean
  children: React.ReactNode
  className?: string
}

export function EditableTextElement({
  elementKey,
  defaultContent,
  templateId,
  templateContent,
  saveContent,
  isPreviewMode,
  children,
  className = "",
}: EditableTextElementProps) {
  const contentKey = `${templateId}_${elementKey}`
  const currentContent = templateContent[contentKey] || defaultContent
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(currentContent)

  useEffect(() => {
    setEditValue(currentContent)
  }, [currentContent])

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation()
      setIsEditing(true)
      setEditValue(currentContent)
    }
  }

  const handleSave = async () => {
    if (editValue.trim() !== currentContent) {
      await saveContent(elementKey, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      setEditValue(currentContent)
      setIsEditing(false)
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  // Auto-focus and auto-grow textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      autoResize()
    }
  }, [isEditing])

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  if (isEditing) {
    return (
      <div className={className} style={{ position: "relative" }}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
            autoResize()
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="input_r3334re226re232"
style={{
  fontSize: "inherit",
  fontWeight: "inherit",
  fontFamily: "inherit",
  color: "inherit",
  textAlign: "left", // override any inherited alignment
  lineHeight: "inherit",
  resize: "none",
  overflow: "hidden",
  width: "100%",
}}

          rows={1}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <div
      className={className}
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: isPreviewMode ? "default" : "pointer",
        position: "relative",
      }}
      title={isPreviewMode ? "" : "Double-click to edit"}
    >
      {React.cloneElement(children as React.ReactElement, {
        children: currentContent,
      })}
      {!isPreviewMode && <div className="absolute inset-0 hover:bg-blue-100 hover:bg-opacity-20 transition-colors" />}
    </div>
  )
}
