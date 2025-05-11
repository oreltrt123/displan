"use client"
import { Layout, Plus, Trash } from "lucide-react"
import type { Section } from "../types"

interface SectionsPanelProps {
  sections: Section[]
  selectedSection: string | null
  onSectionSelect: (sectionId: string) => void
  onAddSection: () => void
  onDeleteSection: (sectionId: string) => void
}

export function SectionsPanel({
  sections,
  selectedSection,
  onSectionSelect,
  onAddSection,
  onDeleteSection,
}: SectionsPanelProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700">Sections</h2>
          <button
            onClick={onAddSection}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Add Section"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sections?.map((section) => (
          <div
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={`flex items-center p-2 rounded cursor-pointer ${
              selectedSection === section.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <Layout className="h-4 w-4 mr-2 text-gray-500" />
            <span className="flex-1 truncate text-sm">{section.name}</span>
            {selectedSection === section.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSection(section.id)
                }}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete Section"
              >
                <Trash className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {!sections?.length && (
          <div className="text-center text-gray-500 py-4 text-sm">No sections yet. Click the + button to add one.</div>
        )}
      </div>
    </div>
  )
}
