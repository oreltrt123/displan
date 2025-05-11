"use client"

import React, { useRef, useEffect } from "react"
import type { Section } from "../types"
import { DraggableElement } from "./draggable-element"
import { useDragDrop } from "./drag-drop-context"

interface DroppableSectionProps {
  section: Section
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
}

export function DroppableSection({ section, selectedElement, onElementSelect }: DroppableSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { registerDropTarget, unregisterDropTarget, isDragging, draggedElementId } = useDragDrop()

  // Register this section as a drop target
  useEffect(() => {
    if (sectionRef.current) {
      registerDropTarget(section.id, sectionRef)
    }
    return () => {
      unregisterDropTarget(section.id)
    }
  }, [section.id, registerDropTarget, unregisterDropTarget])

  return (
    <div 
      ref={sectionRef}
      className={`mb-8 ${isDragging ? "relative" : ""}`}
      data-section-id={section.id}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-400 border-b border-gray-200 pb-2">
        {section.name}
      </h2>
      
      <div className="relative min-h-[100px]">
        {section.elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            onClick={() => onElementSelect(element.id)}
          />
        ))}
        
        {section.elements.length === 0 && (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <p>Drag elements here or add new ones from the Elements panel</p>
          </div>
        )}
        
        {/* Drop indicator when dragging */}
        {isDragging && draggedElementId && draggedElementId !== section.id && (
          <div className="absolute inset-0 border-2 border-dashed border-primary-300 rounded-lg pointer-events-none"></div>
        )}
      </div>
    </div>
  )
}