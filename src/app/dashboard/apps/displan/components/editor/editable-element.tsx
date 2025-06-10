"use client"

import type React from "react"
import { Edit2 } from "lucide-react"
import type { EditableTemplateElement, TextEditingState } from "../../types/canvas-types"

interface EditableElementProps {
  children: React.ReactNode
  templateId: string
  elementKey: string
  elementType: string
  content: string
  className?: string
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
}

export function EditableElement({
  children,
  templateId,
  elementKey,
  elementType,
  content,
  className = "",
  selectedTemplateElement,
  selectedElements,
  textEditingState,
  editableElements,
  isPreviewMode,
  getStableElementId,
  onTemplateElementClick,
  onTemplateElementDoubleClick,
  onTextChange,
  onTextEditKeyDown,
  editInputRef,
}: EditableElementProps) {
  const elementId = getStableElementId(templateId, elementKey)
  const isSelected = selectedTemplateElement === elementId || selectedElements.includes(elementId)
  const isEditing = textEditingState.isActive && textEditingState.elementId === elementId
  const editableElement = editableElements.get(elementId)

  return (
    <div
      data-template-element={elementId}
      className={`template-element-editable ${
        isSelected ? "template-element-selected" : ""
      } ${isEditing ? "template-element-editing" : ""} ${className}`}
      onClick={(e) => onTemplateElementClick(elementId, elementType, content, e)}
      onDoubleClick={(e) => elementType.startsWith("text-") && onTemplateElementDoubleClick(elementId, content, e)}
    >
      {isEditing && editableElement && elementType.startsWith("text-") ? (
        <input
          ref={editInputRef}
          type="text"
          value={editableElement.content}
          onChange={(e) => onTextChange(elementId, e.target.value)}
          onKeyDown={(e) => onTextEditKeyDown(e, elementId)}
          className="edit-input"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={(e) => e.target.select()}
        />
      ) : (
        <div className="relative">
          {children}
          {!isPreviewMode && !isEditing && (
            <Edit2 className="absolute top-0 right-0 w-3 h-3 opacity-50 transform translate-x-1 -translate-y-1" />
          )}
        </div>
      )}
    </div>
  )
}
