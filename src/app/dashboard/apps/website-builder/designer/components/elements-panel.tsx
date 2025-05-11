"use client"

import type React from "react"

import { useState } from "react"
import {
  Type,
  ImageIcon,
  Box,
  Layers,
  Square,
  AlignLeft,
  Grid,
  Columns,
  ListOrdered,
  Facebook,
  Youtube,
  Code,
  Terminal,
  Shield,
  Cpu,
  Zap,
  Server,
  Globe,
  Lock,
  X,
} from "lucide-react"

interface ElementsPanelProps {
  onAddElement: (type: string) => void
}

export function ElementsPanel({ onAddElement }: ElementsPanelProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "layout" | "media" | "cyber">("basic")
  const [showDesignModal, setShowDesignModal] = useState(false)
  const [selectedElement, setSelectedElement] = useState<{
    type: string
    name: string
    icon: React.ReactNode
  } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<{
    id: string
    name: string
    preview: React.ReactNode
  } | null>(null)

  // Function to handle element click
  const handleElementClick = (type: string, name: string, icon: React.ReactNode) => {
    setSelectedElement({ type, name, icon })
    setShowDesignModal(true)
  }

  // Function to handle design selection
  const handleDesignSelect = (design: { id: string; name: string; preview: React.ReactNode }) => {
    setSelectedDesign(design)
    setShowConfirmation(true)
  }

  // Function to confirm design selection
  const handleConfirmDesign = () => {
    if (selectedElement && selectedDesign) {
      onAddElement(`${selectedElement.type}:${selectedDesign.id}`)
    }
    setShowConfirmation(false)
    setShowDesignModal(false)
    setSelectedElement(null)
    setSelectedDesign(null)
  }

  // Function to cancel design selection
  const handleCancelDesign = () => {
    setShowConfirmation(false)
    setSelectedDesign(null)
  }

  // Function to close the design modal
  const handleCloseDesignModal = () => {
    setShowDesignModal(false)
    setSelectedElement(null)
    setSelectedDesign(null)
    setShowConfirmation(false)
  }

  // Get designs for the selected element
  const getDesignsForElement = () => {
    if (!selectedElement) return []

    switch (selectedElement.type) {
      case "heading":
        return [
          {
            id: "heading-1",
            name: "Standard Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-2",
            name: "Underlined Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground border-b-2 border-border pb-2">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-3",
            name: "Colored Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-blue-600">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-4",
            name: "Large Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-2xl font-bold text-foreground">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-5",
            name: "Centered Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground text-center">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-6",
            name: "Gradient Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Heading Example
                </h2>
              </div>
            ),
          },
          {
            id: "heading-7",
            name: "Shadowed Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground drop-shadow-md">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-8",
            name: "Uppercase Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-9",
            name: "Thin Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-light text-foreground">Heading Example</h2>
              </div>
            ),
          },
          {
            id: "heading-10",
            name: "Accent Heading",
            preview: (
              <div className="w-full p-3 bg-background">
                <h2 className="text-xl font-bold text-foreground border-l-4 border-blue-500 pl-2">Heading Example</h2>
              </div>
            ),
          },
        ]
      case "paragraph":
        return [
          {
            id: "paragraph-1",
            name: "Standard Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-foreground">This is a sample paragraph text that demonstrates how it would look.</p>
              </div>
            ),
          },
          {
            id: "paragraph-2",
            name: "Large Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-lg text-foreground">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-3",
            name: "Small Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-sm text-foreground">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-4",
            name: "Justified Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-justify text-foreground">
                  This is a sample paragraph text that demonstrates how it would look. It has more content to show the
                  justification effect properly.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-5",
            name: "Centered Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-center text-foreground">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-6",
            name: "Highlighted Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-foreground bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-7",
            name: "Bordered Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-foreground border border-border p-2 rounded">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-8",
            name: "Lead Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-foreground font-medium">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-9",
            name: "Italic Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-foreground italic">
                  This is a sample paragraph text that demonstrates how it would look.
                </p>
              </div>
            ),
          },
          {
            id: "paragraph-10",
            name: "Colored Paragraph",
            preview: (
              <div className="w-full p-3 bg-background">
                <p className="text-blue-600">This is a sample paragraph text that demonstrates how it would look.</p>
              </div>
            ),
          },
        ]
      case "button":
        return [
          {
            id: "button-1",
            name: "Primary Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-2",
            name: "Secondary Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-3",
            name: "Outline Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-4",
            name: "Rounded Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-5",
            name: "Large Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded text-lg hover:bg-primary/90 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-6",
            name: "Small Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-7",
            name: "Success Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-8",
            name: "Danger Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-9",
            name: "Gradient Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:from-blue-600 hover:to-purple-600 transition-colors">
                  Button
                </button>
              </div>
            ),
          },
          {
            id: "button-10",
            name: "Shadow Button",
            preview: (
              <div className="w-full p-3 flex justify-center bg-background">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded shadow-lg hover:shadow-xl transition-shadow">
                  Button
                </button>
              </div>
            ),
          },
        ]
      case "divider":
        return [
          {
            id: "divider-1",
            name: "Standard Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t border-border" />
              </div>
            ),
          },
          {
            id: "divider-2",
            name: "Thick Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t-2 border-border" />
              </div>
            ),
          },
          {
            id: "divider-3",
            name: "Dashed Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t border-dashed border-border" />
              </div>
            ),
          },
          {
            id: "divider-4",
            name: "Dotted Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t border-dotted border-border" />
              </div>
            ),
          },
          {
            id: "divider-5",
            name: "Colored Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t-2 border-blue-500" />
              </div>
            ),
          },
          {
            id: "divider-6",
            name: "Gradient Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </div>
            ),
          },
          {
            id: "divider-7",
            name: "Short Divider",
            preview: (
              <div className="w-full p-3 bg-background flex justify-center">
                <hr className="w-1/3 border-t-2 border-border" />
              </div>
            ),
          },
          {
            id: "divider-8",
            name: "Faded Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              </div>
            ),
          },
          {
            id: "divider-9",
            name: "Double Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border-t border-b border-border h-1"></div>
              </div>
            ),
          },
          {
            id: "divider-10",
            name: "Spaced Divider",
            preview: (
              <div className="w-full p-3 bg-background">
                <hr className="border-t-2 border-border my-3" />
              </div>
            ),
          },
        ]
      case "spacer":
        return [
          {
            id: "spacer-1",
            name: "Small Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-4 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Small
                </div>
              </div>
            ),
          },
          {
            id: "spacer-2",
            name: "Medium Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-8 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Medium
                </div>
              </div>
            ),
          },
          {
            id: "spacer-3",
            name: "Large Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Large
                </div>
              </div>
            ),
          },
          {
            id: "spacer-4",
            name: "Extra Large Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-24 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Extra Large
                </div>
              </div>
            ),
          },
          {
            id: "spacer-5",
            name: "Responsive Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-8 md:h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Responsive
                </div>
              </div>
            ),
          },
          {
            id: "spacer-6",
            name: "Tiny Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-2 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Tiny
                </div>
              </div>
            ),
          },
          {
            id: "spacer-7",
            name: "Custom Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-12 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Custom
                </div>
              </div>
            ),
          },
          {
            id: "spacer-8",
            name: "Section Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-32 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Section Spacer
                </div>
              </div>
            ),
          },
          {
            id: "spacer-9",
            name: "Minimal Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-1 bg-secondary flex items-center justify-center text-xs text-muted-foreground"></div>
              </div>
            ),
          },
          {
            id: "spacer-10",
            name: "Flexible Spacer",
            preview: (
              <div className="w-full p-3 bg-background border border-dashed border-border">
                <div className="h-full min-h-10 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                  Flexible
                </div>
              </div>
            ),
          },
        ]
      case "list":
        return [
          {
            id: "list-1",
            name: "Bulleted List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="list-disc pl-5 text-foreground">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-2",
            name: "Numbered List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ol className="list-decimal pl-5 text-foreground">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ol>
              </div>
            ),
          },
          {
            id: "list-3",
            name: "Check List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="space-y-1 text-foreground">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    First item
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Second item
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Third item
                  </li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-4",
            name: "Icon List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="space-y-1 text-foreground">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    First item
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Second item
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Third item
                  </li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-5",
            name: "Bordered List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="border rounded-md divide-y divide-border text-foreground">
                  <li className="px-3 py-2">First item</li>
                  <li className="px-3 py-2">Second item</li>
                  <li className="px-3 py-2">Third item</li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-6",
            name: "Spaced List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="space-y-2 text-foreground">
                  <li className="bg-secondary p-2 rounded">First item</li>
                  <li className="bg-secondary p-2 rounded">Second item</li>
                  <li className="bg-secondary p-2 rounded">Third item</li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-7",
            name: "Horizontal List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="flex space-x-4 text-foreground">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-8",
            name: "Styled List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="list-none pl-5 text-foreground">
                  <li className="relative before:absolute before:content-['•'] before:text-blue-500 before:left-[-1em]">
                    First item
                  </li>
                  <li className="relative before:absolute before:content-['•'] before:text-blue-500 before:left-[-1em]">
                    Second item
                  </li>
                  <li className="relative before:absolute before:content-['•'] before:text-blue-500 before:left-[-1em]">
                    Third item
                  </li>
                </ul>
              </div>
            ),
          },
          {
            id: "list-9",
            name: "Description List",
            preview: (
              <div className="w-full p-3 bg-background">
                <dl className="text-foreground">
                  <dt className="font-bold">First term</dt>
                  <dd className="pl-4 mb-2">First description</dd>
                  <dt className="font-bold">Second term</dt>
                  <dd className="pl-4">Second description</dd>
                </dl>
              </div>
            ),
          },
          {
            id: "list-10",
            name: "Compact List",
            preview: (
              <div className="w-full p-3 bg-background">
                <ul className="list-disc pl-5 text-sm text-foreground leading-tight">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
            ),
          },
        ]
      case "container":
        return [
          {
            id: "container-1",
            name: "Standard Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border border-border p-4 rounded">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-2",
            name: "Shadowed Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border border-border p-4 rounded shadow-md">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-3",
            name: "Colored Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded">
                  Container Content
                </div>
              </div>
            ),
          },
          {
            id: "container-4",
            name: "Card Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-card border border-border p-4 rounded-lg shadow">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-5",
            name: "Outlined Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border-2 border-dashed border-border p-4 rounded">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-6",
            name: "Gradient Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded border border-blue-100 dark:border-blue-800">
                  Container Content
                </div>
              </div>
            ),
          },
          {
            id: "container-7",
            name: "Accent Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border-l-4 border-blue-500 bg-secondary p-4">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-8",
            name: "Floating Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-card p-4 rounded-lg shadow-lg border border-border">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-9",
            name: "Padded Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border border-border p-6 rounded">Container Content</div>
              </div>
            ),
          },
          {
            id: "container-10",
            name: "Compact Container",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="border border-border p-2 rounded">Container Content</div>
              </div>
            ),
          },
        ]
      case "columns":
        return [
          {
            id: "columns-1",
            name: "Two Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-2 rounded">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-2",
            name: "Three Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary p-2 rounded">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                  <div className="bg-secondary p-2 rounded">Column 3</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-3",
            name: "Four Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-secondary p-2 rounded">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                  <div className="bg-secondary p-2 rounded">Column 3</div>
                  <div className="bg-secondary p-2 rounded">Column 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-4",
            name: "Responsive Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-secondary p-2 rounded">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                  <div className="bg-secondary p-2 rounded">Column 3</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-5",
            name: "Unequal Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary p-2 rounded col-span-2">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-6",
            name: "Bordered Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border p-2 rounded">Column 1</div>
                  <div className="border border-border p-2 rounded">Column 2</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-7",
            name: "Shadowed Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-2 rounded shadow">Column 1</div>
                  <div className="bg-card p-2 rounded shadow">Column 2</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-8",
            name: "Colored Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Column 1</div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Column 2</div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">Column 3</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-9",
            name: "Auto Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-none auto-cols-fr grid-flow-col gap-4">
                  <div className="bg-secondary p-2 rounded">Column 1</div>
                  <div className="bg-secondary p-2 rounded">Column 2</div>
                  <div className="bg-secondary p-2 rounded">Column 3</div>
                </div>
              </div>
            ),
          },
          {
            id: "columns-10",
            name: "Compact Columns",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-secondary p-1 rounded text-xs">Column 1</div>
                  <div className="bg-secondary p-1 rounded text-xs">Column 2</div>
                  <div className="bg-secondary p-1 rounded text-xs">Column 3</div>
                </div>
              </div>
            ),
          },
        ]
      case "grid":
        return [
          {
            id: "grid-1",
            name: "Standard Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="bg-secondary p-2 rounded">Item 1</div>
                  <div className="bg-secondary p-2 rounded">Item 2</div>
                  <div className="bg-secondary p-2 rounded">Item 3</div>
                  <div className="bg-secondary p-2 rounded">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-2",
            name: "Dense Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 grid-rows-3 gap-2">
                  <div className="bg-secondary p-2 rounded">Item 1</div>
                  <div className="bg-secondary p-2 rounded">Item 2</div>
                  <div className="bg-secondary p-2 rounded">Item 3</div>
                  <div className="bg-secondary p-2 rounded">Item 4</div>
                  <div className="bg-secondary p-2 rounded">Item 5</div>
                  <div className="bg-secondary p-2 rounded">Item 6</div>
                  <div className="bg-secondary p-2 rounded">Item 7</div>
                  <div className="bg-secondary p-2 rounded">Item 8</div>
                  <div className="bg-secondary p-2 rounded">Item 9</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-3",
            name: "Responsive Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-secondary p-2 rounded">Item 1</div>
                  <div className="bg-secondary p-2 rounded">Item 2</div>
                  <div className="bg-secondary p-2 rounded">Item 3</div>
                  <div className="bg-secondary p-2 rounded">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-4",
            name: "Masonry Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary p-2 rounded row-span-2">Item 1</div>
                  <div className="bg-secondary p-2 rounded">Item 2</div>
                  <div className="bg-secondary p-2 rounded">Item 3</div>
                  <div className="bg-secondary p-2 rounded col-span-2">Item 4</div>
                  <div className="bg-secondary p-2 rounded">Item 5</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-5",
            name: "Bordered Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="border border-border p-2 rounded">Item 1</div>
                  <div className="border border-border p-2 rounded">Item 2</div>
                  <div className="border border-border p-2 rounded">Item 3</div>
                  <div className="border border-border p-2 rounded">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-6",
            name: "Shadowed Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="bg-card p-2 rounded shadow">Item 1</div>
                  <div className="bg-card p-2 rounded shadow">Item 2</div>
                  <div className="bg-card p-2 rounded shadow">Item 3</div>
                  <div className="bg-card p-2 rounded shadow">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-7",
            name: "Colored Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Item 1</div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Item 2</div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">Item 3</div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-8",
            name: "Auto Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-none auto-cols-fr grid-flow-col gap-4">
                  <div className="bg-secondary p-2 rounded">Item 1</div>
                  <div className="bg-secondary p-2 rounded">Item 2</div>
                  <div className="bg-secondary p-2 rounded">Item 3</div>
                  <div className="bg-secondary p-2 rounded">Item 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-9",
            name: "Compact Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 grid-rows-3 gap-1">
                  <div className="bg-secondary p-1 rounded text-xs">Item 1</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 2</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 3</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 4</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 5</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 6</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 7</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 8</div>
                  <div className="bg-secondary p-1 rounded text-xs">Item 9</div>
                </div>
              </div>
            ),
          },
          {
            id: "grid-10",
            name: "Gallery Grid",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="grid grid-cols-3 gap-1">
                  <div className="bg-muted aspect-square rounded"></div>
                  <div className="bg-muted aspect-square rounded"></div>
                  <div className="bg-muted aspect-square rounded"></div>
                  <div className="bg-muted aspect-square rounded"></div>
                  <div className="bg-muted aspect-square rounded"></div>
                  <div className="bg-muted aspect-square rounded"></div>
                </div>
              </div>
            ),
          },
        ]
      case "image":
        return [
          {
            id: "image-1",
            name: "Standard Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-video rounded flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-2",
            name: "Rounded Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-video rounded-lg flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-3",
            name: "Circular Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-square rounded-full w-24 mx-auto flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-4",
            name: "Bordered Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-video rounded border-2 border-border flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-5",
            name: "Shadowed Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-video rounded shadow-lg flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-6",
            name: "Polaroid Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-card p-2 pb-8 shadow-md">
                  <div className="bg-muted aspect-video flex items-center justify-center text-muted-foreground">
                    Image
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "image-7",
            name: "Framed Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted aspect-video p-4 border-8 border-card shadow-lg flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-8",
            name: "Responsive Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-muted w-full max-w-md mx-auto aspect-video rounded flex items-center justify-center text-muted-foreground">
                  Image
                </div>
              </div>
            ),
          },
          {
            id: "image-9",
            name: "Captioned Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <figure>
                  <div className="bg-muted aspect-video rounded flex items-center justify-center text-muted-foreground">
                    Image
                  </div>
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">Image caption</figcaption>
                </figure>
              </div>
            ),
          },
          {
            id: "image-10",
            name: "Overlay Image",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="relative">
                  <div className="bg-muted aspect-video rounded flex items-center justify-center text-muted-foreground">
                    Image
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
                    Overlay Text
                  </div>
                </div>
              </div>
            ),
          },
        ]
      case "video":
        return [
          {
            id: "video-1",
            name: "Standard Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video rounded flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-2",
            name: "Rounded Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video rounded-lg flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-3",
            name: "Bordered Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video rounded border-2 border-border flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-4",
            name: "Shadowed Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video rounded shadow-lg flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-5",
            name: "Responsive Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 w-full max-w-md mx-auto aspect-video rounded flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-6",
            name: "Captioned Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <figure>
                  <div className="bg-gray-800 aspect-video rounded flex items-center justify-center text-white">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">Video caption</figcaption>
                </figure>
              </div>
            ),
          },
          {
            id: "video-7",
            name: "Overlay Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="relative">
                  <div className="bg-gray-800 aspect-video rounded flex items-center justify-center text-white">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
                    <span className="text-lg font-medium">Video Title</span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "video-8",
            name: "Framed Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video p-4 border-8 border-card shadow-lg flex items-center justify-center text-white">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "video-9",
            name: "Thumbnail Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="relative">
                  <div className="bg-muted aspect-video rounded flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "video-10",
            name: "Controls Video",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="bg-gray-800 aspect-video rounded flex flex-col">
                  <div className="flex-1 flex items-center justify-center text-white">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="h-8 bg-gray-900 flex items-center px-3 space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="h-1 bg-gray-600 flex-1 rounded-full">
                      <div className="h-1 w-1/3 bg-white rounded-full"></div>
                    </div>
                    <div className="text-white text-xs">1:23</div>
                  </div>
                </div>
              </div>
            ),
          },
        ]
      case "icon":
        return [
          {
            id: "icon-1",
            name: "Standard Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <svg
                    className="w-8 h-8 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "icon-2",
            name: "Colored Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "icon-3",
            name: "Large Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <svg
                    className="w-12 h-12 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "icon-4",
            name: "Circular Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <div className="p-3 bg-secondary rounded-full">
                    <svg
                      className="w-6 h-6 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "icon-5",
            name: "Bordered Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <div className="p-3 border-2 border-border rounded">
                    <svg
                      className="w-6 h-6 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "icon-6",
            name: "Colored Background Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-500 rounded">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "icon-7",
            name: "Shadowed Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <div className="p-3 bg-card rounded shadow-lg">
                    <svg
                      className="w-6 h-6 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "icon-8",
            name: "Gradient Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "icon-9",
            name: "Outlined Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <svg
                    className="w-8 h-8 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
          {
            id: "icon-10",
            name: "Animated Icon",
            preview: (
              <div className="w-full p-3 bg-background">
                <div className="flex justify-center">
                  <svg
                    className="w-8 h-8 text-blue-500 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
              </div>
            ),
          },
        ]
      case "cyber-button":
        return [
          {
            id: "cyber-button-1",
            name: "Neon Glow",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-black border-2 border-purple-500 text-purple-500 hover:text-white hover:bg-purple-900 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
                  Neon Button
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-2",
            name: "Digital Pulse",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-blue-900 border border-blue-400 text-blue-400 hover:text-white hover:border-blue-300 hover:shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-all duration-300">
                  Digital Button
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-3",
            name: "Tech Edge",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-300 hover:from-cyan-600 hover:to-blue-600 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300">
                  Tech Button
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-4",
            name: "Matrix",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-black border border-green-500 text-green-500 font-mono hover:bg-green-900/30 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-300">
                  &lt;MATRIX&gt;
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-5",
            name: "Hologram",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300">
                  Hologram
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-6",
            name: "Circuit",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-gray-900 border-t-2 border-l-2 border-purple-500 text-purple-400 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
                  Circuit
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-7",
            name: "Laser",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-red-900/50 border-b-2 border-red-500 text-red-400 hover:bg-red-800 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300">
                  Laser
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-8",
            name: "Synthwave",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-800 to-pink-500 text-white border border-purple-300 hover:from-purple-900 hover:to-pink-600 hover:shadow-[0_0_15px_rgba(216,180,254,0.5)] transition-all duration-300">
                  Synthwave
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-9",
            name: "Digital Rain",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-black border-r-2 border-green-400 text-green-400 font-mono hover:bg-green-900/20 hover:shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-300">
                  01010101
                </button>
              </div>
            ),
          },
          {
            id: "cyber-button-10",
            name: "Wireframe",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <button className="w-full px-4 py-2 bg-transparent border border-dashed border-white text-white hover:bg-white/10 hover:border-solid hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300">
                  Wireframe
                </button>
              </div>
            ),
          },
        ]
      case "cyber-card":
        return [
          {
            id: "cyber-card-1",
            name: "Holographic",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border border-purple-400 p-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <h3 className="text-purple-300 font-bold mb-2">Holographic Card</h3>
                  <p className="text-blue-200 text-sm">
                    This card features a holographic design with gradient background.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-2",
            name: "Neon Frame",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 border-2 border-cyan-500 p-4 rounded shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <h3 className="text-cyan-400 font-bold mb-2">Neon Frame</h3>
                  <p className="text-gray-300 text-sm">This card features a neon cyan border with glow effect.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-3",
            name: "Digital",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black border border-green-500 p-4 rounded shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  <h3 className="text-green-500 font-mono font-bold mb-2">&gt; DIGITAL_CARD</h3>
                  <p className="text-green-400 font-mono text-sm">System status: online. All systems operational.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-4",
            name: "Tech Panel",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-800 border-t-4 border-blue-500 p-4 rounded">
                  <h3 className="text-blue-400 font-bold mb-2">Tech Panel</h3>
                  <p className="text-gray-300 text-sm">Advanced interface panel with top border accent.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-5",
            name: "Cyberdeck",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 border-l-4 border-purple-500 p-4">
                  <h3 className="text-purple-400 font-bold mb-2">Cyberdeck</h3>
                  <p className="text-gray-300 text-sm">Modular interface with left border accent.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-6",
            name: "Glitch",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black border border-red-500 p-4 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  <h3 className="text-red-500 font-bold mb-2">GLITCH_ERR</h3>
                  <p className="text-red-400 text-sm">System malfunction detected. Recalibrating...</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-7",
            name: "Circuit Board",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 bg-[url('/placeholder.svg?height=100&width=100')] bg-opacity-10 border border-green-400 p-4 rounded">
                  <h3 className="text-green-400 font-bold mb-2">Circuit Board</h3>
                  <p className="text-gray-300 text-sm">Integrated circuit design with pattern background.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-8",
            name: "Neural Net",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b-2 border-blue-400 p-4 rounded-t">
                  <h3 className="text-blue-300 font-bold mb-2">Neural Net</h3>
                  <p className="text-gray-300 text-sm">Advanced AI processing unit with gradient background.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-9",
            name: "Datastream",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 border-r-4 border-cyan-400 p-4">
                  <h3 className="text-cyan-400 font-bold mb-2">Datastream</h3>
                  <p className="text-gray-300 text-sm">Real-time data processing interface with right border accent.</p>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-card-10",
            name: "Quantum",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black/80 backdrop-blur-sm border border-white/30 p-4 rounded shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <h3 className="text-white font-bold mb-2">Quantum</h3>
                  <p className="text-gray-300 text-sm">Quantum computing interface with translucent design.</p>
                </div>
              </div>
            ),
          },
        ]
      case "cyber-header":
        return [
          {
            id: "cyber-header-1",
            name: "Command Line",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black text-green-500 font-mono border-b border-green-500 p-4">
                  <h2 className="text-xl">&gt; SYSTEM_HEADER</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-2",
            name: "Neon Title",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 text-cyan-400 font-bold p-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  <h2 className="text-xl">NEON INTERFACE</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-3",
            name: "Digital Readout",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-blue-900 text-white font-mono border-l-4 border-blue-400 p-4">
                  <h2 className="text-xl">DIGITAL READOUT</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-4",
            name: "Cyberpunk",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold p-4">
                  <h2 className="text-xl">CYBERPUNK 2077</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-5",
            name: "Glitch Text",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black text-red-500 border-t border-red-500 p-4">
                  <h2 className="text-xl font-bold">ERR0R_SYST3M</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-6",
            name: "Hologram Title",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-transparent text-cyan-400 font-bold border border-cyan-400/50 p-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <h2 className="text-xl">HOLOGRAPHIC DISPLAY</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-7",
            name: "Neural",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 text-purple-400 font-bold border-b-2 border-purple-500 p-4">
                  <h2 className="text-xl">NEURAL INTERFACE</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-8",
            name: "Tech Spec",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-800 text-white font-mono border-l-2 border-r-2 border-yellow-400 p-4">
                  <h2 className="text-xl">TECH SPECIFICATIONS</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-9",
            name: "System Alert",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-red-900/50 text-white font-bold border-t-2 border-b-2 border-red-500 p-4">
                  <h2 className="text-xl">SYSTEM ALERT</h2>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-header-10",
            name: "Data Terminal",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black text-blue-400 font-mono border border-blue-500/50 p-4">
                  <h2 className="text-xl">&lt;DATA_TERMINAL&gt;</h2>
                </div>
              </div>
            ),
          },
        ]
      case "cyber-grid":
        return [
          {
            id: "cyber-grid-1",
            name: "Neon Grid",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 gap-1 p-1 border border-purple-500 grid grid-cols-2 grid-rows-2">
                  <div className="bg-purple-900/50 p-2 text-purple-300 text-xs">Grid 1</div>
                  <div className="bg-purple-900/50 p-2 text-purple-300 text-xs">Grid 2</div>
                  <div className="bg-purple-900/50 p-2 text-purple-300 text-xs">Grid 3</div>
                  <div className="bg-purple-900/50 p-2 text-purple-300 text-xs">Grid 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-2",
            name: "Digital Matrix",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black gap-2 p-2 border border-green-500 grid grid-cols-2 grid-rows-2">
                  <div className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">01</div>
                  <div className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">10</div>
                  <div className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">11</div>
                  <div className="bg-green-900/30 p-2 text-green-500 text-xs font-mono">00</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-3",
            name: "Tech Panels",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-800 gap-3 p-2 border-t-2 border-blue-400 grid grid-cols-2 grid-rows-2">
                  <div className="bg-gray-700 p-2 text-blue-400 text-xs">Panel A</div>
                  <div className="bg-gray-700 p-2 text-blue-400 text-xs">Panel B</div>
                  <div className="bg-gray-700 p-2 text-blue-400 text-xs">Panel C</div>
                  <div className="bg-gray-700 p-2 text-blue-400 text-xs">Panel D</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-4",
            name: "Holographic Display",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-blue-900/50 gap-1 p-1 border border-cyan-400 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <div className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">Holo 1</div>
                  <div className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">Holo 2</div>
                  <div className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">Holo 3</div>
                  <div className="bg-cyan-900/30 p-2 text-cyan-300 text-xs">Holo 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-5",
            name: "Circuit Board",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-green-900/20 gap-2 p-1 border border-green-400 grid grid-cols-3 grid-rows-2">
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C1</div>
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C2</div>
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C3</div>
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C4</div>
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C5</div>
                  <div className="bg-green-900/30 p-1 text-green-400 text-xs">C6</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-6",
            name: "Data Blocks",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-900 gap-1 p-1 border-b-2 border-purple-400 grid grid-cols-2 grid-rows-2">
                  <div className="bg-gray-800 p-2 text-purple-300 text-xs">Data 1</div>
                  <div className="bg-gray-800 p-2 text-purple-300 text-xs">Data 2</div>
                  <div className="bg-gray-800 p-2 text-purple-300 text-xs">Data 3</div>
                  <div className="bg-gray-800 p-2 text-purple-300 text-xs">Data 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-7",
            name: "Neural Network",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-purple-900/30 gap-2 p-2 border border-purple-500 grid grid-cols-3 grid-rows-3">
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                  <div className="bg-purple-800/50 p-1 rounded-full"></div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-8",
            name: "Quantum Cells",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-black gap-1 p-1 border border-blue-500 grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  <div className="bg-blue-900/30 p-2 text-blue-400 text-xs">Q1</div>
                  <div className="bg-blue-900/30 p-2 text-blue-400 text-xs">Q2</div>
                  <div className="bg-blue-900/30 p-2 text-blue-400 text-xs">Q3</div>
                  <div className="bg-blue-900/30 p-2 text-blue-400 text-xs">Q4</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-9",
            name: "System Modules",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gray-800 gap-3 p-2 border-l-2 border-cyan-500 grid grid-cols-2 grid-rows-2">
                  <div className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">Mod 1</div>
                  <div className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">Mod 2</div>
                  <div className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">Mod 3</div>
                  <div className="bg-gray-700 p-2 text-cyan-400 text-xs border-l border-cyan-500">Mod 4</div>
                </div>
              </div>
            ),
          },
          {
            id: "cyber-grid-10",
            name: "Virtual Reality",
            preview: (
              <div className="w-full p-3 bg-gray-900">
                <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 gap-2 p-2 border border-white/30 grid grid-cols-2 grid-rows-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <div className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">VR 1</div>
                  <div className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">VR 2</div>
                  <div className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">VR 3</div>
                  <div className="bg-white/10 backdrop-blur-sm p-2 text-white text-xs">VR 4</div>
                </div>
              </div>
            ),
          },
        ]
      default:
        return []
    }
  }

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-foreground">Elements</h2>
      </div>

      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "basic" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab("layout")}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "layout" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Layout
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "media" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab("cyber")}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "cyber" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Cyber
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "basic" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                handleElementClick("heading", "Heading", <Type className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Type className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Heading</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("paragraph", "Paragraph", <AlignLeft className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <AlignLeft className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Paragraph</span>
            </button>
            <button
              onClick={() => handleElementClick("button", "Button", <Box className="h-6 w-6 mb-2 text-foreground" />)}
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Box className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Button</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("divider", "Divider", <Layers className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Layers className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Divider</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("spacer", "Spacer", <Square className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Square className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Spacer</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("list", "List", <ListOrdered className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <ListOrdered className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">List</span>
            </button>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                handleElementClick("container", "Container", <Square className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Square className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Container</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("columns", "Columns", <Columns className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Columns className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Columns</span>
            </button>
            <button
              onClick={() => handleElementClick("grid", "Grid", <Grid className="h-6 w-6 mb-2 text-foreground" />)}
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Grid className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Grid</span>
            </button>
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                handleElementClick("image", "Image", <ImageIcon className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <ImageIcon className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Image</span>
            </button>
            <button
              onClick={() => handleElementClick("video", "Video", <Youtube className="h-6 w-6 mb-2 text-foreground" />)}
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Youtube className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Video</span>
            </button>
            <button
              onClick={() => handleElementClick("icon", "Icon", <Facebook className="h-6 w-6 mb-2 text-foreground" />)}
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Facebook className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Icon</span>
            </button>
          </div>
        )}

        {activeTab === "cyber" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                handleElementClick("cyber-button", "Cyber Button", <Zap className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Zap className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Button</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("cyber-card", "Cyber Card", <Shield className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Shield className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Card</span>
            </button>
            <button
              onClick={() =>
                handleElementClick(
                  "cyber-header",
                  "Cyber Header",
                  <Terminal className="h-6 w-6 mb-2 text-foreground" />,
                )
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Terminal className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Header</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("cyber-grid", "Cyber Grid", <Cpu className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Cpu className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Grid</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("cyber-code", "Cyber Code", <Code className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Code className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Code</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("cyber-server", "Cyber Server", <Server className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Server className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Server</span>
            </button>
            <button
              onClick={() =>
                handleElementClick("cyber-network", "Cyber Network", <Globe className="h-6 w-6 mb-2 text-foreground" />)
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Globe className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Network</span>
            </button>
            <button
              onClick={() =>
                handleElementClick(
                  "cyber-security",
                  "Cyber Security",
                  <Lock className="h-6 w-6 mb-2 text-foreground" />,
                )
              }
              className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Lock className="h-6 w-6 mb-2 text-foreground" />
              <span className="text-xs font-medium">Cyber Security</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Templates</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors">
            <div className="w-full h-16 bg-muted rounded mb-2 flex items-center justify-center text-muted-foreground">
              Header
            </div>
            <span className="text-xs font-medium">Header</span>
          </button>
          <button className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors">
            <div className="w-full h-16 bg-muted rounded mb-2 flex items-center justify-center text-muted-foreground">
              Hero
            </div>
            <span className="text-xs font-medium">Hero</span>
          </button>
        </div>
      </div>

      {/* Design Selection Modal */}
      {showDesignModal && selectedElement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">Select {selectedElement.name} Design</h2>
              <button onClick={handleCloseDesignModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {showConfirmation ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-medium mb-2 text-foreground">Use this design?</h3>
                    <p className="text-muted-foreground">
                      Do you want to add this {selectedElement.name.toLowerCase()} design to your canvas?
                    </p>
                  </div>

                  {selectedDesign && (
                    <div className="mb-8 w-full max-w-md">
                      {selectedDesign.preview}
                      <p className="text-center font-medium mt-2 text-foreground">{selectedDesign.name}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={handleCancelDesign}
                      className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDesign}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Use This Design
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {getDesignsForElement().map((design) => (
                    <div key={design.id} onClick={() => handleDesignSelect(design)} className="cursor-pointer group">
                      <div className="transition-all duration-200 group-hover:shadow-lg rounded-md overflow-hidden">
                        {design.preview}
                      </div>
                      <p className="text-sm font-medium text-center mt-2 text-foreground">{design.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}