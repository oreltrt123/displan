"use client"

import React, { useState } from "react"
import { X } from "lucide-react"

interface DeleteConfirmationDialogProps {
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({ onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Check if user has previously chosen to not show the confirmation
  const [skipConfirmation, setSkipConfirmation] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("skipDeleteConfirmation") === "true"
    }
    return false
  })

  // If user has chosen to skip confirmation, confirm immediately
  React.useEffect(() => {
    if (skipConfirmation) {
      onConfirm()
    }
  }, [skipConfirmation, onConfirm])

  const handleConfirm = () => {
    if (dontShowAgain) {
      // Save preference to localStorage
      localStorage.setItem("skipDeleteConfirmation", "true")
      setSkipConfirmation(true)
    }
    onConfirm()
  }

  // If user has chosen to skip confirmation, don't render the dialog
  if (skipConfirmation) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Delete Element</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this element? This action cannot be undone.
          </p>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="dontShowAgain" className="ml-2 text-sm text-gray-700">
              Don't show this confirmation again
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
