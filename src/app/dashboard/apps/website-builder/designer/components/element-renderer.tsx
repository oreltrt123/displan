"use client"

import React, { type CSSProperties, useState } from "react"
import type { ElementType } from "../types"
import {
  Play,
  Pause,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Zap,
  Shield,
  Terminal,
  Cpu,
  Code,
  Server,
  Globe,
  Lock,
  Trash2,
  Type,
  VideoIcon as Animation,
} from "lucide-react"
import { AnimationPanel } from "./animation-panel"
import { FontsPanel } from "./fonts-panel"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"

interface ElementRendererProps {
  element: ElementType
  isEditing: boolean
  isSelected: boolean
  onClick?: () => void
  onDelete?: (id: string) => void
  onUpdateElement?: (id: string, updates: Partial<ElementType>) => void
}

export function ElementRenderer({
  element,
  isEditing,
  isSelected,
  onClick,
  onDelete,
  onUpdateElement,
}: ElementRendererProps) {
  // Create a deep copy of the style and cast it to CSSProperties
  const styleCopy = { ...element.style } as CSSProperties
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAnimationPanel, setShowAnimationPanel] = useState(false)
  const [showFontsPanel, setShowFontsPanel] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // Apply transitions if they exist
  if (element.transitions) {
    styleCopy.transition = element.transitions
      .map((t) => `${t.property} ${t.duration}ms ${t.timingFunction} ${t.delay}ms`)
      .join(", ")
  }

  // Parse the element type to extract the base type and design ID
  const parseElementTypeAndDesign = () => {
    // Check if the type contains a design ID
    if (typeof element.type === "string" && element.type.includes(":")) {
      const [baseType, designId] = element.type.split(":")
      return { baseType, designId }
    }
    return { baseType: element.type, designId: null }
  }

  const { baseType, designId } = parseElementTypeAndDesign()

  // Debug logging to help identify issues
  console.log("Rendering element:", {
    id: element.id,
    type: element.type,
    baseType,
    designId,
    content: element.content,
  })

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirmation(true)
  }

  const handleAnimationClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAnimationPanel(true)
  }

  const handleFontsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowFontsPanel(true)
  }

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(element.id)
    }
    setShowDeleteConfirmation(false)
  }

  const handleApplyAnimation = (animationType: string) => {
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        transitions: [
          {
            property: "all",
            duration: 500,
            timingFunction: "ease",
            delay: 0,
            animation: animationType,
          },
        ],
      })
    }
    setShowAnimationPanel(false)
  }

  const handleApplyFont = (fontFamily: string) => {
    if (onUpdateElement) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          fontFamily,
        },
      })
    }
    setShowFontsPanel(false)
  }

  const renderElement = () => {
    // First check for cyber elements
    if (baseType.startsWith("cyber-")) {
      if (baseType === "cyber-button") {
        return renderCyberButton(designId)
      } else if (baseType === "cyber-card") {
        return renderCyberCard(designId)
      } else if (baseType === "cyber-header") {
        return renderCyberHeader(designId)
      } else if (baseType === "cyber-grid") {
        return renderCyberGrid(designId)
      } else if (baseType === "cyber-code") {
        return renderCyberCode(designId)
      } else if (baseType === "cyber-server") {
        return renderCyberServer(designId)
      } else if (baseType === "cyber-network") {
        return renderCyberNetwork(designId)
      } else if (baseType === "cyber-security") {
        return renderCyberSecurity(designId)
      }
    }

    // Then check for standard elements
    switch (baseType) {
      case "heading":
        // Use createElement instead of JSX for dynamic heading elements
        const headingLevel = element.content?.level || "h2"
        return React.createElement(headingLevel, { style: styleCopy }, element.content?.text || "Heading")

      case "paragraph":
        return <p style={styleCopy}>{element.content?.text || "Paragraph text"}</p>

      case "image":
        return (
          <img
            src={element.content?.src || "/placeholder.svg?height=300&width=500"}
            alt={element.content?.alt || ""}
            style={styleCopy}
          />
        )

      case "button":
        return (
          <a
            href={isEditing ? "#" : element.content?.href || "#"}
            style={styleCopy}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {element.content?.buttonText || "Button"}
          </a>
        )

      case "divider":
        return <hr style={styleCopy} />

      case "container":
        return (
          <div
            style={{ ...styleCopy, minHeight: "100px" } as CSSProperties}
            className="p-4 border border-dashed border-gray-300 rounded-lg"
          >
            {Array.isArray(element.content?.children)
              ? element.content.children.map((child: ElementType) => (
                  <ElementRenderer
                    key={child.id}
                    element={child}
                    isEditing={isEditing}
                    isSelected={false}
                    onDelete={onDelete}
                    onUpdateElement={onUpdateElement}
                  />
                ))
              : element.content?.text || "Container"}
          </div>
        )

      case "spacer":
        return <div style={{ ...styleCopy, height: element.content?.height || "50px" } as CSSProperties} />

      case "list":
        return (
          <ul style={styleCopy} className="list-disc pl-5">
            {Array.isArray(element.content?.items) ? (
              element.content.items.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
              </>
            )}
          </ul>
        )

      case "columns":
        // Ensure columns is an array before mapping
        const columns = Array.isArray(element.content?.columns) ? element.content.columns : []

        return (
          <div style={styleCopy} className="grid grid-cols-2 gap-4">
            {columns.length > 0 ? (
              columns.map((column, index) => (
                <div key={index} className="border border-dashed border-gray-300 p-4 rounded-lg">
                  {Array.isArray(column.children)
                    ? column.children.map((child: ElementType) => (
                        <ElementRenderer
                          key={child.id}
                          element={child}
                          isEditing={isEditing}
                          isSelected={false}
                          onDelete={onDelete}
                          onUpdateElement={onUpdateElement}
                        />
                      ))
                    : `Column ${index + 1}`}
                </div>
              ))
            ) : (
              <>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Column 1</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Column 2</div>
              </>
            )}
          </div>
        )

      case "grid":
        // Ensure cells is an array before mapping
        const cells = Array.isArray(element.content?.cells) ? element.content.cells : []

        return (
          <div style={styleCopy} className="grid grid-cols-3 gap-4">
            {cells.length > 0 ? (
              cells.map((cell, index) => (
                <div key={index} className="border border-dashed border-gray-300 p-4 rounded-lg">
                  {Array.isArray(cell.children)
                    ? cell.children.map((child: ElementType) => (
                        <ElementRenderer
                          key={child.id}
                          element={child}
                          isEditing={isEditing}
                          isSelected={false}
                          onDelete={onDelete}
                          onUpdateElement={onUpdateElement}
                        />
                      ))
                    : `Cell ${index + 1}`}
                </div>
              ))
            ) : (
              <>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 1</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 2</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 3</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 4</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 5</div>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg">Cell 6</div>
              </>
            )}
          </div>
        )

      case "video":
        return (
          <div style={styleCopy} className="relative">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {element.content?.videoUrl ? (
                <iframe
                  src={element.content.videoUrl}
                  title={element.content?.title || "Video"}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {isPlaying ? (
                        <Pause className="h-12 w-12 cursor-pointer" onClick={() => setIsPlaying(false)} />
                      ) : (
                        <Play className="h-12 w-12 cursor-pointer" onClick={() => setIsPlaying(true)} />
                      )}
                    </div>
                    <p>{element.content?.title || "Video placeholder"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "icon":
        const IconComponent = getIconComponent(element.content?.iconName || "facebook")
        return (
          <div style={styleCopy} className="flex justify-center">
            <IconComponent className="h-8 w-8" />
          </div>
        )

      default:
        console.error(`Unknown element type: ${element.type} (baseType: ${baseType}, designId: ${designId})`)
        return (
          <div className="p-4 border border-red-500 text-red-500">
            Unknown element type: {element.type}
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify({ baseType, designId, content: element.content }, null, 2)}
            </pre>
          </div>
        )
    }
  }

  // Helper function to get icon component
  function getIconComponent(iconName: string) {
    switch (iconName?.toLowerCase()) {
      case "facebook":
        return Facebook
      case "twitter":
        return Twitter
      case "instagram":
        return Instagram
      case "linkedin":
        return Linkedin
      case "youtube":
        return Youtube
      case "zap":
        return Zap
      case "shield":
        return Shield
      case "terminal":
        return Terminal
      case "cpu":
        return Cpu
      case "code":
        return Code
      case "server":
        return Server
      case "globe":
        return Globe
      case "lock":
        return Lock
      default:
        return Facebook
    }
  }

  // Cyber Button Renderer
  function renderCyberButton(designId: string | null) {
    const buttonText = element.content?.buttonText || "Cyber Button"

    switch (designId) {
      case "cb-1": // Neon Glow
        return (
          <button className="w-full px-4 py-2 bg-black border-2 border-purple-500 text-purple-500 hover:text-white hover:bg-purple-900 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-2": // Digital Pulse
        return (
          <button className="w-full px-4 py-2 bg-blue-900 border border-blue-400 text-blue-400 hover:text-white hover:border-blue-300 hover:shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-3": // Tech Edge
        return (
          <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-300 hover:from-cyan-600 hover:to-blue-600 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-4": // Matrix
        return (
          <button className="w-full px-4 py-2 bg-black border border-green-500 text-green-500 font-mono hover:bg-green-900/30 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-300">
            &lt;{buttonText}&gt;
          </button>
        )
      case "cb-5": // Hologram
        return (
          <button className="w-full px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-6": // Circuit
        return (
          <button className="w-full px-4 py-2 bg-gray-900 border-t-2 border-l-2 border-purple-500 text-purple-400 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-7": // Laser
        return (
          <button className="w-full px-4 py-2 bg-red-900/50 border-b-2 border-red-500 text-red-400 hover:bg-red-800 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-8": // Synthwave
        return (
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-800 to-pink-500 text-white border border-purple-300 hover:from-purple-900 hover:to-pink-600 hover:shadow-[0_0_15px_rgba(216,180,254,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-9": // Digital Rain
        return (
          <button className="w-full px-4 py-2 bg-black border-r-2 border-green-400 text-green-400 font-mono hover:bg-green-900/20 hover:shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      case "cb-10": // Wireframe
        return (
          <button className="w-full px-4 py-2 bg-transparent border border-dashed border-white text-white hover:bg-white/10 hover:border-solid hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300">
            {buttonText}
          </button>
        )
      default:
        return (
          <button className="w-full px-4 py-2 bg-black border-2 border-purple-500 text-purple-500 hover:bg-purple-900 transition-colors">
            {buttonText}
          </button>
        )
    }
  }

  // Cyber Card Renderer
  function renderCyberCard(designId: string | null) {
    const cardTitle = element.content?.title || "Cyber Card"
    const cardText = element.content?.text || "This is a cyber-styled card with futuristic design elements."

    switch (designId) {
      case "cc-1": // Holographic
        return (
          <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border border-purple-400 p-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <h3 className="text-purple-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-blue-200 text-sm">{cardText}</p>
          </div>
        )
      case "cc-2": // Neon Frame
        return (
          <div className="bg-gray-900 border-2 border-cyan-500 p-4 rounded shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <h3 className="text-cyan-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-3": // Digital
        return (
          <div className="bg-black border border-green-500 p-4 rounded shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            <h3 className="text-green-500 font-mono font-bold mb-2">&gt; {cardTitle}</h3>
            <p className="text-green-400 font-mono text-sm">{cardText}</p>
          </div>
        )
      case "cc-4": // Tech Panel
        return (
          <div className="bg-gray-800 border-t-4 border-blue-500 p-4 rounded">
            <h3 className="text-blue-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-5": // Cyberdeck
        return (
          <div className="bg-gray-900 border-l-4 border-purple-500 p-4">
            <h3 className="text-purple-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-6": // Glitch
        return (
          <div className="bg-black border border-red-500 p-4 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <h3 className="text-red-500 font-bold mb-2">{cardTitle}</h3>
            <p className="text-red-400 text-sm">{cardText}</p>
          </div>
        )
      case "cc-7": // Circuit Board
        return (
          <div className="bg-gray-900 bg-[url('/placeholder.svg?height=100&width=100')] bg-opacity-10 border border-green-400 p-4 rounded">
            <h3 className="text-green-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-8": // Neural Net
        return (
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b-2 border-blue-400 p-4 rounded-t">
            <h3 className="text-blue-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-9": // Datastream
        return (
          <div className="bg-gray-900 border-r-4 border-cyan-400 p-4">
            <h3 className="text-cyan-400 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      case "cc-10": // Quantum
        return (
          <div className="bg-black/80 backdrop-blur-sm border border-white/30 p-4 rounded shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h3 className="text-white font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 border-2 border-purple-500 p-4 rounded">
            <h3 className="text-purple-300 font-bold mb-2">{cardTitle}</h3>
            <p className="text-gray-300 text-sm">{cardText}</p>
          </div>
        )
    }
  }

  // Cyber Header Renderer
  function renderCyberHeader(designId: string | null) {
    const headerText = element.content?.text || "CYBER HEADER"

    switch (designId) {
      case "ch-1": // Command Line
        return (
          <div className="bg-black text-green-500 font-mono border-b border-green-500 p-4">
            <h2 className="text-xl">&gt; {headerText}</h2>
          </div>
        )
      case "ch-2": // Neon Title
        return (
          <div className="bg-gray-900 text-cyan-400 font-bold p-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-3": // Digital Readout
        return (
          <div className="bg-blue-900 text-white font-mono border-l-4 border-blue-400 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-4": // Cyberpunk
        return (
          <div className="bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-5": // Glitch Text
        return (
          <div className="bg-black text-red-500 border-t border-red-500 p-4">
            <h2 className="text-xl font-bold">{headerText}</h2>
          </div>
        )
      case "ch-6": // Hologram Title
        return (
          <div className="bg-transparent text-cyan-400 font-bold border border-cyan-400/50 p-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-7": // Neural
        return (
          <div className="bg-gray-900 text-purple-400 font-bold border-b-2 border-purple-500 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-8": // Tech Spec
        return (
          <div className="bg-gray-800 text-white font-mono border-l-2 border-r-2 border-yellow-400 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-9": // System Alert
        return (
          <div className="bg-red-900/50 text-white font-bold border-t-2 border-b-2 border-red-500 p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
      case "ch-10": // Data Terminal
        return (
          <div className="bg-black text-blue-400 font-mono border border-blue-500/50 p-4">
            <h2 className="text-xl">&lt;{headerText}&gt;</h2>
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 text-cyan-400 font-bold p-4">
            <h2 className="text-xl">{headerText}</h2>
          </div>
        )
    }
  }

  // Cyber Grid Renderer
  function renderCyberGrid(designId: string | null) {
    // Create grid items with default content
    const gridItems = Array(4)
      .fill(null)
      .map((_, index) => element.content?.items?.[index] || `Grid ${index + 1}`)

    switch (designId) {
      case "cg-1": // Neon Grid
        return (
          <div className="bg-gray-900 gap-1 p-1 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-purple-900/50 p-2 text-purple-300 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-2": // Digital Matrix
        return (
          <div className="bg-black gap-2 p-2 border border-green-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-3": // Tech Panels
        return (
          <div className="bg-gray-800 gap-3 p-2 border-t-2 border-blue-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 text-blue-400 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-4": // Holographic Display
        return (
          <div className="bg-blue-900/50 gap-1 p-1 border border-cyan-400 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-5": // Circuit Board
        return (
          <div className="bg-green-900/20 gap-2 p-1 border border-green-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-green-900/30 p-1 text-green-400 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-6": // Data Blocks
        return (
          <div className="bg-gray-900 gap-1 p-1 border-b-2 border-purple-400 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-800 p-2 text-purple-300 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-7": // Neural Network
        return (
          <div className="bg-purple-900/30 gap-2 p-2 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-purple-800/50 p-2 text-purple-300 text-xs rounded-full">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-8": // Quantum Cells
        return (
          <div className="bg-black gap-1 p-1 border border-blue-500 grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-blue-900/30 p-2 text-blue-400 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-9": // System Modules
        return (
          <div className="bg-gray-800 gap-3 p-2 border-l-2 border-cyan-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">
                {item}
              </div>
            ))}
          </div>
        )
      case "cg-10": // Virtual Reality
        return (
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 gap-2 p-2 border border-white/30 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">
                {item}
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="bg-gray-900 gap-2 p-2 border border-purple-500 grid grid-cols-2 grid-rows-2">
            {gridItems.map((item, index) => (
              <div key={index} className="bg-gray-800 p-2 text-purple-300 text-xs">
                {item}
              </div>
            ))}
          </div>
        )
    }
  }

  // Cyber Code Renderer
  function renderCyberCode(designId: string | null) {
    const codeText = element.content?.code || `function init() {\n  console.log("System online");\n  return true;\n}`

    return (
      <div className="bg-gray-900 border border-green-500 rounded overflow-hidden">
        <div className="bg-black px-4 py-2 border-b border-green-500 flex justify-between items-center">
          <span className="text-green-500 font-mono text-sm">system.js</span>
          <Code className="h-4 w-4 text-green-500" />
        </div>
        <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
          <code>{codeText}</code>
        </pre>
      </div>
    )
  }

  // Cyber Server Renderer
  function renderCyberServer(designId: string | null) {
    const serverName = element.content?.name || "MAIN-SERVER"
    const serverStatus = element.content?.status || "ONLINE"

    return (
      <div className="bg-gray-900 border border-blue-500 rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-mono font-bold">{serverName}</span>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-mono ${
              serverStatus === "ONLINE" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
            }`}
          >
            {serverStatus}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">CPU</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">MEMORY</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-purple-500 w-1/2"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">STORAGE</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 w-2/3"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">NETWORK</div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-green-500 w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cyber Network Renderer
  function renderCyberNetwork(designId: string | null) {
    return (
      <div className="bg-gray-900 border border-cyan-500 rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-cyan-400 font-bold">NETWORK STATUS</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((node) => (
            <div key={node} className="relative">
              <div
                className={`h-16 rounded flex items-center justify-center ${
                  node % 3 === 0
                    ? "bg-red-900/30 border border-red-500"
                    : node % 2 === 0
                      ? "bg-green-900/30 border border-green-500"
                      : "bg-blue-900/30 border border-blue-500"
                }`}
              >
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span
                  className={`text-xs font-mono ${
                    node % 3 === 0 ? "text-red-400" : node % 2 === 0 ? "text-green-400" : "text-blue-400"
                  }`}
                >
                  NODE-{node}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Cyber Security Renderer
  function renderCyberSecurity(designId: string | null) {
    return (
      <div className="bg-gray-900 border border-red-500 rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-400 font-bold">SECURITY SYSTEM</span>
          </div>
          <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs font-mono">ACTIVE</span>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-400">Firewall</span>
              <span className="text-xs text-green-400">ENABLED</span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-green-500 w-full"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-400">Encryption</span>
              <span className="text-xs text-green-400">ACTIVE</span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500 w-full"></div>
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-400">Intrusion Detection</span>
              <span className="text-xs text-yellow-400">MONITORING</span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-yellow-500 w-4/5 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div
        onClick={onClick}
        className={`
          element-wrapper relative group 
          ${isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:outline hover:outline-gray-200"}
          ${baseType === "container" ? "p-4 border border-dashed border-gray-300" : ""}
        `}
        data-element-type={baseType}
        data-element-id={element.id}
      >
        {renderElement()}

        {isSelected && (
          <>
            <div className="absolute -top-3 -left-3 bg-primary text-white text-xs px-1 rounded">
              {baseType}
              {designId ? `:${designId}` : ""}
            </div>

            {/* Element control buttons */}
            <div className="absolute -top-3 right-3 flex space-x-2">
              {/* Animation button */}
              <button
                onClick={handleAnimationClick}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 shadow-md"
                title="Add Animation"
              >
                <Animation className="h-4 w-4" />
              </button>

              {/* Fonts button - only for text elements */}
              {(baseType === "heading" || baseType === "paragraph") && (
                <button
                  onClick={handleFontsClick}
                  className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-1 shadow-md"
                  title="Change Font"
                >
                  <Type className="h-4 w-4" />
                </button>
              )}

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                title="Delete Element"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Animation panel */}
            {showAnimationPanel && (
              <AnimationPanel
                onClose={() => setShowAnimationPanel(false)}
                onApply={handleApplyAnimation}
                position={{ top: "-3px", right: "80px" }}
              />
            )}

            {/* Fonts panel */}
            {showFontsPanel && (
              <FontsPanel
                onClose={() => setShowFontsPanel(false)}
                onApply={handleApplyFont}
                position={{ top: "-3px", right: "80px" }}
              />
            )}

            {/* Delete confirmation dialog */}
            {showDeleteConfirmation && (
              <DeleteConfirmationDialog
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirmation(false)}
              />
            )}
          </>
        )}
      </div>
    )
  }

  return renderElement()
}
