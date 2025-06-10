"use client"

import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import type {
  EditableTemplateElement,
  SelectionBox,
  ContextMenu,
  CanvasBackground,
  TextEditingState,
  ResizeData,
} from "../types/canvas-types"
import { DisplanCanvasElement } from '../lib/types/displan-canvas-types'

export function useCanvasState() {
  const searchParams = useSearchParams()
  const currentPageId = searchParams?.get("page") || "main"

  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 })
  const [commentMessage, setCommentMessage] = useState("")
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newCommentId, setNewCommentId] = useState<string>("")
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [localElements, setLocalElements] = useState<DisplanCanvasElement[]>([])
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedTemplateElement, setSelectedTemplateElement] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [resizeHandle, setResizeHandle] = useState<"left" | "right" | "top-left" | "top-right" | null>(null)
  const [resizeStartData, setResizeStartData] = useState<ResizeData | null>(null)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [editableElements, setEditableElements] = useState<Map<string, EditableTemplateElement>>(new Map())
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
  const [elementStableIds, setElementStableIds] = useState<Map<string, string>>(new Map())
  const [userSessionId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, visible: false })
  const [showBackgroundModal, setShowBackgroundModal] = useState(false)
  const [canvasBackground, setCanvasBackground] = useState<CanvasBackground>({ type: "color", value: "#ffffff" })
  const [isSelecting, setIsSelecting] = useState(false)
  const [textEditingState, setTextEditingState] = useState<TextEditingState>({
    elementId: null,
    isActive: false,
    shouldFocus: false,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const textEditTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  return {
    // State
    currentPageId,
    showCommentInput,
    setShowCommentInput,
    commentPosition,
    setCommentPosition,
    commentMessage,
    setCommentMessage,
    canvasPosition,
    setCanvasPosition,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    newCommentId,
    setNewCommentId,
    draggedElement,
    setDraggedElement,
    localElements,
    setLocalElements,
    dragOffset,
    setDragOffset,
    selectedTemplateElement,
    setSelectedTemplateElement,
    isResizing,
    setIsResizing,
    resizeHandle,
    setResizeHandle,
    resizeStartData,
    setResizeStartData,
    selectionBox,
    setSelectionBox,
    selectedElements,
    setSelectedElements,
    editableElements,
    setEditableElements,
    editingElementId,
    setEditingElementId,
    elementStableIds,
    setElementStableIds,
    userSessionId,
    contextMenu,
    setContextMenu,
    showBackgroundModal,
    setShowBackgroundModal,
    canvasBackground,
    setCanvasBackground,
    isSelecting,
    setIsSelecting,
    textEditingState,
    setTextEditingState,

    // Refs
    inputRef,
    canvasRef,
    editInputRef,
    textEditTimeoutRef,
  }
}
