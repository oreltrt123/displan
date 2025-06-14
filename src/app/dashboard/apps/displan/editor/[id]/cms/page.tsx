"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, Search, Edit, Trash2, Database, ArrowLeft, FileText } from "lucide-react"
import "@/styles/sidebar_settings_editor.css"

interface CMSEntry {
  id: string
  title: string
  slug: string
  date: string
  categories: string[]
  status: "draft" | "published"
  content: string
  collection_id: string
}

interface CMSCollection {
  id: string
  name: string
  slug: string
  entries_count: number
}

export default function CMSPage() {
  const [collections, setCollections] = useState<CMSCollection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [entries, setEntries] = useState<CMSEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [showCreateEntry, setShowCreateEntry] = useState(false)
  const [showEditEntry, setShowEditEntry] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [currentEntry, setCurrentEntry] = useState<CMSEntry | null>(null)

  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    if (projectId) {
      loadCollections()
    }
  }, [projectId])

  const loadCollections = async () => {
    try {
      const response = await fetch(`/api/cms/collections?project_id=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
        if (data.length > 0) {
          setSelectedCollection(data[0].id)
          loadEntries(data[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to load collections:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadEntries = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/cms/collections/${collectionId}/entries`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error("Failed to load entries:", error)
      setEntries([])
    }
  }

  const createCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      const response = await fetch("/api/cms/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCollectionName,
          slug: newCollectionName.toLowerCase().replace(/\s+/g, "-"),
          project_id: projectId,
        }),
      })

      if (response.ok) {
        const newCollection = await response.json()
        setCollections([...collections, { ...newCollection, entries_count: 0 }])
        setNewCollectionName("")
        setShowCreateCollection(false)
        setSelectedCollection(newCollection.id)
        setEntries([])
      }
    } catch (error) {
      console.error("Failed to create collection:", error)
    }
  }

  const openCreateEntry = () => {
    setCurrentEntry({
      id: "",
      title: "",
      slug: "",
      date: new Date().toISOString().split("T")[0],
      categories: [],
      status: "draft",
      content: "",
      collection_id: selectedCollection,
    })
    setShowCreateEntry(true)
  }

  const openEditEntry = (entry: CMSEntry) => {
    setCurrentEntry(entry)
    setShowEditEntry(true)
  }

  const saveEntry = async () => {
    if (!currentEntry || !currentEntry.title.trim()) return

    try {
      const isNew = !currentEntry.id
      const url = isNew ? `/api/cms/collections/${selectedCollection}/entries` : `/api/cms/entries/${currentEntry.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentEntry,
          project_id: projectId,
          slug: currentEntry.title.toLowerCase().replace(/\s+/g, "-"),
        }),
      })

      if (response.ok) {
        const savedEntry = await response.json()
        if (isNew) {
          setEntries([...entries, savedEntry])
        } else {
          setEntries(entries.map((e) => (e.id === savedEntry.id ? savedEntry : e)))
        }
        setShowCreateEntry(false)
        setShowEditEntry(false)
        setCurrentEntry(null)
      }
    } catch (error) {
      console.error("Failed to save entry:", error)
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const response = await fetch(`/api/cms/entries/${entryId}`, { method: "DELETE" })
      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== entryId))
      }
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }

  const filteredEntries = entries.filter((entry) => entry.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-background border border-[#8888881A] h-screen">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push(`/dashboard/apps/displan/editor/${projectId}`)}
                className="p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">CMS</h2>
            </div>

            <div className="space-y-2 mb-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => {
                    setSelectedCollection(collection.id)
                    loadEntries(collection.id)
                  }}
                  className={`settings-nav-button ${
                    selectedCollection === collection.id ? "bg-[rgb(0,153,255)] text-white" : "text-gray-300"
                  }`}
                >
                      <Database className="settings-nav-icon" />
                      <span className="settings-nav-text">{collection.name}</span>
                    {/* <span className="text-xs bg-gray-600 px-2 py-1 rounded">{collection.entries_count}</span> */}
                  </div>
              ))}
            </div>

            <button
              onClick={() => setShowCreateCollection(true)}
              className="settings-nav-button w-full flex items-center justify-center px-4 py-2 bg-[#8888881A] text-white rounded-lg mb-4"
            >
              <Plus className="settings-nav-icon" />
              <span className="settings-nav-text">New Collection</span>
            </button>

            {selectedCollection && (
              <button
                onClick={openCreateEntry}
                className="settings-nav-button w-full flex items-center justify-center px-4 py-2 bg-[rgb(0,153,255)] text-white rounded-lg"
              >
                <Plus className="settings-nav-icon" />
              <span className="settings-nav-text">New Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Collections Yet</h3>
              <p className="text-gray-400 mb-6">Create your first collection to start managing content.</p>
              <button
                onClick={() => setShowCreateCollection(true)}
                className="px-6 py-3 bg-[rgb(0,153,255)] text-white rounded-lg transition-colors"
              >
                Create Collection
              </button>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="r2552esf25_252trewt3eSearchr"
                  />
                </div>
              </div>

              {/* Entries Table */}
              <div className="bg-[#8888881A] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#8888881A]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredEntries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          {selectedCollection
                            ? "No entries found. Click 'New Entry' to create your first entry."
                            : "Select a collection to view entries."}
                        </td>
                      </tr>
                    ) : (
                      filteredEntries.map((entry) => (
                        <tr key={entry.id} className="">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-3 text-gray-400" />
                              <span className="text-white font-medium">{entry.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{entry.date}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                entry.status === "published"
                                  ? "bg-[rgb(0,153,255)] text-white dark:text-white"
                                  : "bg-[#8888881A] text-white dark:text-white"
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openEditEntry(entry)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEntry(entry.id)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateCollection && (
        <div className="r2552esf25 bg-black bg-opacity-50">
          <div className="r2552esf25_2r">
              <button
                onClick={() => setShowCreateCollection(false)}
                className="SFAGWGASGCancel"
              >
              <img className="SFAGWGASGCancel2" src="/components/editor/close.png" alt="" />
              </button>
            <h3 className="text-lg font-medium text-white mb-4">Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection name (e.g., Blog Posts)"
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
                className="flex-1 px-4 py-2 bg-[rgb(0,153,255)] text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Entry Modal */}
      {(showCreateEntry || showEditEntry) && currentEntry && (
        <div className="r2552esf25">
          <div className="r2552esf25_2r">
            <h3 className="text-lg font-medium text-white mb-4">
              {showCreateEntry ? "Create New Entry" : "Edit Entry"}
               <button
                onClick={() => {
                  setShowCreateEntry(false)
                  setShowEditEntry(false)
                  setCurrentEntry(null)
                }}
                className="SFAGWGASGCancel"
              >
                <img className="SFAGWGASGCancel2" src="/components/editor/close.png" alt="" />
              </button>
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                  className="r2552esf25_252trewt3er"
                  placeholder="Enter title..."
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                  className="r2552esf25_252trewt3er"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={currentEntry.status}
                  onChange={(e) =>
                    setCurrentEntry({ ...currentEntry, status: e.target.value as "draft" | "published" })
                  }
                  className="r2552esf25_252trewt3er"
                >
                  <option value="draft" className="text-black">Draft</option>
                  <option value="published" className="text-black">Published</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  className="r2552esf25_252trewt3er"
                  rows={10}
                  placeholder="Write your content here..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveEntry}
                disabled={!currentEntry.title.trim()}
                className="flex-1 px-4 py-2 bg-[rgb(0,153,255)] text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                {showCreateEntry ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
