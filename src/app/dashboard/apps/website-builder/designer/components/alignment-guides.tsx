"use client"

import React from "react"

interface AlignmentGuide {
  position: number
  type: 'horizontal' | 'vertical'
  length: number
  start: number
}

interface AlignmentGuidesProps {
  guides: AlignmentGuide[]
}

export function AlignmentGuides({ guides }: AlignmentGuidesProps) {
  if (!guides.length) return null;
  
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {guides.map((guide, index) => (
        <div
          key={`guide-${index}`}
          className="absolute bg-blue-500"
          style={{
            left: guide.type === 'vertical' ? `${guide.position}px` : `${guide.start}px`,
            top: guide.type === 'horizontal' ? `${guide.position}px` : `${guide.start}px`,
            width: guide.type === 'horizontal' ? `${guide.length}px` : '1px',
            height: guide.type === 'vertical' ? `${guide.length}px` : '1px',
          }}
        />
      ))}
    </div>
  )
}