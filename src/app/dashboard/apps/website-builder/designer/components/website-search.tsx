"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import "../styles/button.css"
interface Website {
  id: string
  name: string
  type: string
  created_at: string
  [key: string]: any
}

interface WebsiteSearchProps {
  websites: Website[]
  onFilteredWebsitesChange: (filteredWebsites: Website[]) => void
}

export default function WebsiteSearch({ websites, onFilteredWebsitesChange }: WebsiteSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!searchTerm.trim()) {
      onFilteredWebsitesChange(websites)
    } else {
      const filtered = websites.filter((website) => website.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      onFilteredWebsitesChange(filtered)
    }
  }, [searchTerm, websites, onFilteredWebsitesChange])

  return (
    <div className="relative w-80">
      {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" /> */}
      <input
        type="text"
        placeholder="Search sites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input_field "
        />
    </div>
  )
}
