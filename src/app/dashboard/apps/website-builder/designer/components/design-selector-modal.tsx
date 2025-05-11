"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface DesignSelectorModalProps {
  elementType: string
  onSelect: (designId: string) => void
  onClose: () => void
}

export function DesignSelectorModal({ elementType, onSelect, onClose }: DesignSelectorModalProps) {
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock designs based on element type
  const getDesigns = () => {
    switch (elementType) {
      case "cyber-button":
        return [
          {
            id: "cb-1",
            name: "Neon Glow",
            preview: "bg-black border-2 border-purple-500 text-purple-500 hover:bg-purple-900",
          },
          {
            id: "cb-2",
            name: "Digital Pulse",
            preview: "bg-blue-900 border border-blue-400 text-blue-400 hover:text-white",
          },
          { id: "cb-3", name: "Tech Edge", preview: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" },
          { id: "cb-4", name: "Matrix", preview: "bg-black border border-green-500 text-green-500 hover:bg-green-900" },
          {
            id: "cb-5",
            name: "Hologram",
            preview: "bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900/30",
          },
          {
            id: "cb-6",
            name: "Circuit",
            preview: "bg-gray-900 border-t-2 border-l-2 border-purple-500 text-purple-400",
          },
          {
            id: "cb-7",
            name: "Laser",
            preview: "bg-red-900/50 border-b-2 border-red-500 text-red-400 hover:bg-red-800",
          },
          { id: "cb-8", name: "Synthwave", preview: "bg-gradient-to-r from-purple-800 to-pink-500 text-white" },
          { id: "cb-9", name: "Digital Rain", preview: "bg-black border-r-2 border-green-400 text-green-400" },
          {
            id: "cb-10",
            name: "Wireframe",
            preview: "bg-transparent border border-dashed border-white text-white hover:bg-white/10",
          },
        ]
      case "cyber-card":
        return [
          {
            id: "cc-1",
            name: "Holographic",
            preview: "bg-gradient-to-br from-purple-900/80 to-blue-900/80 border border-purple-400",
          },
          {
            id: "cc-2",
            name: "Neon Frame",
            preview: "bg-gray-900 border-2 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]",
          },
          {
            id: "cc-3",
            name: "Digital",
            preview: "bg-black border border-green-500 shadow-[0_0_10px_rgba(0,255,0,0.3)]",
          },
          { id: "cc-4", name: "Tech Panel", preview: "bg-gray-800 border-t-4 border-blue-500" },
          { id: "cc-5", name: "Cyberdeck", preview: "bg-gray-900 border-l-4 border-purple-500" },
          { id: "cc-6", name: "Glitch", preview: "bg-black border border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]" },
          {
            id: "cc-7",
            name: "Circuit Board",
            preview:
              "bg-gray-900 bg-[url('/placeholder.svg?height=100&width=100')] bg-opacity-10 border border-green-400",
          },
          {
            id: "cc-8",
            name: "Neural Net",
            preview: "bg-gradient-to-r from-blue-900 to-purple-900 border-b-2 border-blue-400",
          },
          { id: "cc-9", name: "Datastream", preview: "bg-gray-900 border-r-4 border-cyan-400" },
          { id: "cc-10", name: "Quantum", preview: "bg-black/80 backdrop-blur-sm border border-white/30" },
        ]
      case "cyber-header":
        return [
          { id: "ch-1", name: "Command Line", preview: "bg-black text-green-500 font-mono border-b border-green-500" },
          {
            id: "ch-2",
            name: "Neon Title",
            preview: "bg-gray-900 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,255,255,0.5)]",
          },
          {
            id: "ch-3",
            name: "Digital Readout",
            preview: "bg-blue-900 text-white font-mono border-l-4 border-blue-400",
          },
          {
            id: "ch-4",
            name: "Cyberpunk",
            preview: "bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold",
          },
          { id: "ch-5", name: "Glitch Text", preview: "bg-black text-red-500 font-glitch border-t border-red-500" },
          {
            id: "ch-6",
            name: "Hologram Title",
            preview: "bg-transparent text-cyan-400 font-bold border border-cyan-400/50",
          },
          { id: "ch-7", name: "Neural", preview: "bg-gray-900 text-purple-400 font-bold border-b-2 border-purple-500" },
          {
            id: "ch-8",
            name: "Tech Spec",
            preview: "bg-gray-800 text-white font-mono border-l-2 border-r-2 border-yellow-400",
          },
          {
            id: "ch-9",
            name: "System Alert",
            preview: "bg-red-900/50 text-white font-bold border-t-2 border-b-2 border-red-500",
          },
          { id: "ch-10", name: "Data Terminal", preview: "bg-black text-blue-400 font-mono border border-blue-500/50" },
        ]
      case "cyber-grid":
        return [
          { id: "cg-1", name: "Neon Grid", preview: "bg-gray-900 gap-1 p-1 border border-purple-500" },
          { id: "cg-2", name: "Digital Matrix", preview: "bg-black gap-2 p-2 border border-green-500" },
          { id: "cg-3", name: "Tech Panels", preview: "bg-gray-800 gap-3 p-2 border-t-2 border-blue-400" },
          { id: "cg-4", name: "Holographic Display", preview: "bg-blue-900/50 gap-1 p-1 border border-cyan-400" },
          { id: "cg-5", name: "Circuit Board", preview: "bg-green-900/20 gap-2 p-1 border border-green-400" },
          { id: "cg-6", name: "Data Blocks", preview: "bg-gray-900 gap-1 p-1 border-b-2 border-purple-400" },
          { id: "cg-7", name: "Neural Network", preview: "bg-purple-900/30 gap-2 p-2 border border-purple-500" },
          { id: "cg-8", name: "Quantum Cells", preview: "bg-black gap-1 p-1 border border-blue-500" },
          { id: "cg-9", name: "System Modules", preview: "bg-gray-800 gap-3 p-2 border-l-2 border-cyan-500" },
          {
            id: "cg-10",
            name: "Virtual Reality",
            preview: "bg-gradient-to-br from-blue-900/50 to-purple-900/50 gap-2 p-2 border border-white/30",
          },
        ]
      default:
        return []
    }
  }

  const designs = getDesigns()

  const handleDesignClick = (designId: string) => {
    setSelectedDesign(designId)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (selectedDesign) {
      onSelect(selectedDesign)
    }
    onClose()
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedDesign(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Select {elementType.replace("-", " ")} Design</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {showConfirmation ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium mb-2">Use this design?</h3>
                <p className="text-gray-600">
                  Do you want to add this {elementType.replace("-", " ")} design to your canvas?
                </p>
              </div>

              {selectedDesign && (
                <div className="mb-8 w-full max-w-md">
                  <div
                    className={`h-20 ${designs.find((d) => d.id === selectedDesign)?.preview} rounded-md flex items-center justify-center mb-2`}
                  >
                    <span className="text-white font-medium">Preview</span>
                  </div>
                  <p className="text-center font-medium">{designs.find((d) => d.id === selectedDesign)?.name}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Use This Design
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {designs.map((design) => (
                <div key={design.id} onClick={() => handleDesignClick(design.id)} className="cursor-pointer group">
                  <div
                    className={`h-24 ${design.preview} rounded-md flex items-center justify-center mb-2 transition-all duration-200 group-hover:shadow-lg`}
                  >
                    <span className="text-white font-medium">Preview</span>
                  </div>
                  <p className="text-sm font-medium text-center">{design.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
