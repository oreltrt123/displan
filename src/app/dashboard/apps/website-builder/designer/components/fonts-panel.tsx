"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"

interface FontsPanelProps {
  onClose: () => void
  onApply: (fontFamily: string) => void
  position?: { top?: string; right?: string; bottom?: string; left?: string }
}

export function FontsPanel({ onClose, onApply, position = { top: "0", right: "0" } }: FontsPanelProps) {
  const [fonts, setFonts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Google Fonts API integration
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoading(true)
        // Using Google Fonts API
        // Note: In a real implementation, you would need to add your API key
        const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBd0tCWjSSTCxolTyXEjDNofsnFezQqQy0&sort=popularity")

        if (!response.ok) {
          throw new Error("Failed to fetch fonts")
        }

        const data = await response.json()
        const fontFamilies = data.items.map((font: any) => font.family)
        setFonts(fontFamilies)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching fonts:", err)
        setError("Failed to load fonts. Using default fonts instead.")

        // Fallback to a list of common fonts if the API fails
        setFonts([
          "Arial",
          "Verdana",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Georgia",
          "Palatino",
          "Garamond",
          "Bookman",
          "Tahoma",
          "Trebuchet MS",
          "Impact",
          "Comic Sans MS",
          "Roboto",
          "Open Sans",
          "Lato",
          "Montserrat",
          "Raleway",
          "Oswald",
          "Merriweather",
          "Ubuntu",
          "Playfair Display",
          "Source Sans Pro",
          "Poppins",
          "Nunito",
          "Quicksand",
          "Rubik",
          "Work Sans",
          "Fira Sans",
          "Mukta",
        ])
        setLoading(false)
      }
    }

    fetchFonts()
  }, [])

  const filteredFonts = fonts.filter((font) => font.toLowerCase().includes(searchTerm.toLowerCase()))

  const positionStyle = {
    position: "absolute" as const,
    ...position,
    zIndex: 50,
  }

  return (
    <div
      className="bg-white rounded-lg shadow-xl w-[300px] border border-gray-200"
      style={positionStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium">Select Font</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search fonts..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="p-3 max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-2">{error}</div>
        ) : filteredFonts.length === 0 ? (
          <div className="text-gray-500 text-sm p-2">No fonts found matching "{searchTerm}"</div>
        ) : (
          <div className="space-y-2">
            {filteredFonts.map((font) => (
              <div
                key={font}
                className="p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                onClick={() => onApply(font)}
                style={{ fontFamily: font }}
              >
                <p className="text-base">{font}</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: font }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        <p>The fonts are allowed to work by Google Cloud.</p>
      </div>
    </div>
  )
}
