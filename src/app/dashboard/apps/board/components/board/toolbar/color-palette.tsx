"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const colors = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
  "#6b7280",
]

export function ColorPalette() {
  const [selectedColor, setSelectedColor] = useState("#3b82f6")

  return (
    <div className="flex items-center space-x-2">
      {colors.slice(0, 6).map((color) => (
        <Button
          key={color}
          className="h-8 w-8 p-0 rounded-full border-2"
          style={{
            backgroundColor: color,
            borderColor: selectedColor === color ? "#000" : "transparent",
          }}
          onClick={() => setSelectedColor(color)}
        />
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="h-8 w-8 p-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-8 gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                className="h-8 w-8 p-0 rounded"
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
