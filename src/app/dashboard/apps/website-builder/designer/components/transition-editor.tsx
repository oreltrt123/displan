"use client"

import React, { useState } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Transition {
  id: string
  property: string
  duration: number
  timingFunction: string
  delay: number
}

interface TransitionEditorProps {
  transitions: Transition[]
  onChange: (transitions: Transition[]) => void
}

export function TransitionEditor({ transitions = [], onChange }: TransitionEditorProps) {
  const [activeTransition, setActiveTransition] = useState<string | null>(
    transitions.length > 0 ? transitions[0].id : null
  )

  const properties = [
    "all", "opacity", "transform", "background-color", "color", 
    "border-color", "width", "height", "margin", "padding"
  ]
  
  const timingFunctions = [
    "ease", "ease-in", "ease-out", "ease-in-out", "linear", 
    "cubic-bezier(0.25, 0.1, 0.25, 1)"
  ]

  const addTransition = () => {
    const newTransition: Transition = {
      id: `transition-${Date.now()}`,
      property: "all",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    }
    
    const updatedTransitions = [...transitions, newTransition]
    onChange(updatedTransitions)
    setActiveTransition(newTransition.id)
  }

  const removeTransition = (id: string) => {
    const updatedTransitions = transitions.filter(t => t.id !== id)
    onChange(updatedTransitions)
    
    if (activeTransition === id) {
      setActiveTransition(updatedTransitions.length > 0 ? updatedTransitions[0].id : null)
    }
  }

  const updateTransition = (id: string, field: keyof Transition, value: any) => {
    const updatedTransitions = transitions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    )
    onChange(updatedTransitions)
  }

  const activeTransitionData = transitions.find(t => t.id === activeTransition)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Transitions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addTransition}
          className="h-8 px-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {transitions.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">
          No transitions added yet
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {transitions.map(transition => (
              <div 
                key={transition.id}
                className={`
                  px-3 py-1.5 text-xs rounded-full cursor-pointer flex items-center gap-1.5
                  ${activeTransition === transition.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"}
                `}
                onClick={() => setActiveTransition(transition.id)}
              >
                <span>{transition.property}</span>
                <Trash2 
                  className="h-3 w-3 opacity-70 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTransition(transition.id)
                  }}
                />
              </div>
            ))}
          </div>

          {activeTransitionData && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Property</Label>
                  <Select
                    value={activeTransitionData.property}
                    onValueChange={(value) => 
                      updateTransition(activeTransitionData.id, "property", value)
                    }
                  >
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map(prop => (
                        <SelectItem key={prop} value={prop}>
                          {prop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timing">Timing Function</Label>
                  <Select
                    value={activeTransitionData.timingFunction}
                    onValueChange={(value) => 
                      updateTransition(activeTransitionData.id, "timingFunction", value)
                    }
                  >
                    <SelectTrigger id="timing">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {timingFunctions.map(timing => (
                        <SelectItem key={timing} value={timing}>
                          {timing}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Duration: {activeTransitionData.duration}ms</Label>
                </div>
                <Slider
                  id="duration"
                  min={0}
                  max={2000}
                  step={50}
                  value={[activeTransitionData.duration]}
                  onValueChange={(value) => 
                    updateTransition(activeTransitionData.id, "duration", value[0])
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="delay">Delay: {activeTransitionData.delay}ms</Label>
                </div>
                <Slider
                  id="delay"
                  min={0}
                  max={1000}
                  step={50}
                  value={[activeTransitionData.delay]}
                  onValueChange={(value) => 
                    updateTransition(activeTransitionData.id, "delay", value[0])
                  }
                />
              </div>

              <div className="pt-2">
                <div className="p-4 border rounded-md">
                  <div 
                    className="w-16 h-16 bg-primary mx-auto"
                    style={{
                      transition: `${activeTransitionData.property} ${activeTransitionData.duration}ms ${activeTransitionData.timingFunction} ${activeTransitionData.delay}ms`
                    }}
                  />
                  <p className="text-center text-xs mt-2 text-muted-foreground">Preview</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}