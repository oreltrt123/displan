"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface CanvasResizeHandleProps {
  position: "left" | "right"
  onResize: (delta: number) => void
}

export function CanvasResizeHandle({ position, onResize }: CanvasResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      // Prevent text selection during resize
      e.preventDefault()

      const delta = position === "right" ? e.clientX - startXRef.current : startXRef.current - e.clientX
      startXRef.current = e.clientX
      onResize(delta)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Prevent text selection during resize
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onResize, position])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    startXRef.current = e.clientX
  }

  return (
    <div
      ref={handleRef}
      className={`absolute top-0 ${position === "left" ? "left-0" : "right-0"} h-full w-1 cursor-ew-resize group z-10`}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`absolute ${
          position === "left" ? "-left-1.5" : "-right-1.5"
        } top-1/2 -translate-y-1/2 h-16 w-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        <div className="h-10 w-1 bg-primary rounded-full"></div>
      </div>
    </div>
  )
}
