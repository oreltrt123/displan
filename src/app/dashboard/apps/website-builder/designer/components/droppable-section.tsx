"use client"
import { useRef, useEffect } from "react"
import type { Section, ElementType } from "../types"
import { useDragDrop } from "./drag-drop-context"
import { ElementRenderer } from "./element-renderer"

interface DroppableSectionProps {
  section: Section
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  onElementPositionChange?: (elementId: string, x: number, y: number) => void
  onElementResize?: (id: string, width: number, height: number) => void
  onDeleteElement?: (id: string) => void
  onUpdateElement?: (id: string, updates: Partial<ElementType>) => void
}

export function DroppableSection({
  section,
  selectedElement,
  onElementSelect,
  onElementPositionChange,
  onElementResize,
  onDeleteElement,
  onUpdateElement,
}: DroppableSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { registerDropTarget, unregisterDropTarget, showGrid } = useDragDrop()

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
      className="mb-8"
      data-section-id={section.id}
      style={{ position: "relative", minHeight: "200px" }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-400 border-b border-gray-200 pb-2">{section.name}</h2>

      <div className="relative min-h-[100px]">
        {/* Grid background when grid is enabled */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(81, 92, 230, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(81, 92, 230, 0.05) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
        )}

        {section.elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            isEditing={true}
            isSelected={selectedElement === element.id}
            onClick={() => onElementSelect(element.id)}
            onDelete={onDeleteElement}
            onUpdateElement={onUpdateElement}
            onPositionChange={onElementPositionChange}
          />
        ))}

        {section.elements.length === 0 && (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <p>Drag elements here or add new ones from the Elements panel</p>
          </div>
        )}
      </div>
    </div>
  )
}
