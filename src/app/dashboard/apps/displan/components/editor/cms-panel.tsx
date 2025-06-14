"use client"

import { useState, useEffect } from "react"
import { Plus, Database } from 'lucide-react'
import { useRouter } from "next/navigation"
import "@/styles/sidebar_settings_editor.css"

interface CMSCollection {
  id: string
  name: string
  slug: string
  entries_count: number
  created_at: string
}

interface CMSPanelProps {
  onCollectionUpdate: () => void
  projectId: string // Add this prop
}

export function CMSPanel({ onCollectionUpdate, projectId }: CMSPanelProps) {
  const [collections, setCollections] = useState<CMSCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      const response = await fetch(`/api/cms/collections?project_id=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setCollections(Array.isArray(data) ? data : [])
      } else {
        setCollections([])
      }
    } catch (error) {
      console.error("Failed to load collections:", error)
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  const createCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      const response = await fetch("/api/cms/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCollectionName,
          slug: newCollectionName.toLowerCase().replace(/\s+/g, "-"),
          project_id: projectId,
        }),
      })

      if (response.ok) {
        const newCollection = await response.json()
        setCollections([...collections, newCollection])
        setNewCollectionName("")
        setShowCreateModal(false)
        onCollectionUpdate()

        // Navigate to the new collection
        router.push(`/dashboard/apps/displan/editor/${projectId}/cms`)
      }
    } catch (error) {
      console.error("Failed to create collection:", error)
    }
  }

  const navigateToCollection = (collectionId: string) => {
    router.push(`/dashboard/apps/displan/editor/${projectId}/cms`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-8 p-[4px]">
        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No CMS Collections</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Create your first collection to start managing content
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="settings-nav-button1252dgseg3 inline-flex items-center px-4 py-2 bg-[rgb(0,153,255)] text-white rounded-lg transition-colors"
        >
          <Plus className="settings-nav-icon" />
          <span className="settings-nav-text">Add Blog</span>
        </button>

            {showCreateModal && (
          <div className="r2552esf25 bg-black bg-opacity-50">
            <div className="r2552esf25_2r">
                          <button
            onClick={() => setShowCreateModal(false)}
                className="SFAGWGASGCancel"
              >
              <img className="SFAGWGASGCancel2" src="/components/editor/close.png" alt="" />
              </button>
              <h3 className="text-lg font-medium text-white dark:text-white mb-4 dfdsgesgdsgseg">Create New Collection</h3>
              <input
                type="text"
                placeholder="Collection name (e.g., Blog, News)"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="r2552esf25_252trewt3er"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && createCollection()}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={createCollection}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between safafawfafsfw">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 Elements_dw22er">CMS</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-8 h-8 bg-[#8888881A] rounded-lg text-center hover:bg-[#8888881A]  flex items-center justify-center transition-colors Elements_dw22er13"
        >
          <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="space-y-2 fgdhdrhfdhdrhhrh">
        {Array.isArray(collections) && collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => navigateToCollection(collection.id)}
            className="settings-nav-button3535"
          >
            <Database className="settings-nav-icon" />
              <span className="settings-nav-text">{collection.name} - {collection.entries_count} Entries</span>
          </div>
        ))}
      </div>

              {showCreateModal && (
          <div className="r2552esf25 bg-black bg-opacity-50 gfjftjfgjftjfgjft">
            <div className="r2552esf25_2r">
                          <button
            onClick={() => setShowCreateModal(false)}
                className="SFAGWGASGCancel"
              >
              <img className="SFAGWGASGCancel2" src="/components/editor/close.png" alt="" />
              </button>
              <h3 className="text-lg font-medium text-white dark:text-white mb-4">Create New Collection</h3>
              <input
                type="text"
                placeholder="Collection name (e.g., Blog, News)"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="r2552esf25_252trewt3er"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && createCollection()}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={createCollection}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
