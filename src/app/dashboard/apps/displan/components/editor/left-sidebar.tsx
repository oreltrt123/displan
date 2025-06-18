"use client"

import { useState, useEffect } from "react"
import { Home, Plus, Folder, FileText, Database } from "lucide-react"
import { ElementsPanel } from "./elements-panel"
import { DisplanAI } from "./displan-ai"
import { StripeSubscription } from "./stripe-subscription"
import { CMSPanel } from "./cms-panel"
import { NavigatorPanel } from "./navigator-panel"

interface DisplanProjectDesignerCssPage {
  id: string
  name: string
  slug: string
  is_folder: boolean
}

interface CMSCollection {
  id: string
  name: string
  slug: string
  entries_count: number
}
interface LeftSidebarProps {
  pages: DisplanProjectDesignerCssPage[]
  currentPage: string
  onPageChange: (pageId: string) => void
  onCreatePage: (name: string, isFolder: boolean) => void
  onAddElement?: (elementType: string, x: number, y: number) => void
  projectId: string
  canvasElements?: any[]
  onElementVisibilityToggle?: (elementId: string, visible: boolean) => void
  onElementSelect?: (elementId: string) => void
  userEmail?: string
}
interface CMSEntry {
  id: string
  title: string
  slug: string
  date: string
  status: "draft" | "published"
  content: string
  collection_id: string
}

interface LeftSidebarProps {
  pages: DisplanProjectDesignerCssPage[]
  currentPage: string
  onPageChange: (pageId: string) => void
  onCreatePage: (name: string, isFolder: boolean) => void
  onAddElement?: (elementType: string, x: number, y: number) => void
  projectId: string
}

export function LeftSidebar({
  pages,
  currentPage,
  onPageChange,
  onCreatePage,
  onAddElement,
  projectId,
  canvasElements = [],
  onElementVisibilityToggle,
  onElementSelect,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<"pages" | "elements" | "ai" | "cms" | "navigator">("elements")
  const [showPageMenu, setShowPageMenu] = useState(false)
  const [newPageName, setNewPageName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"page" | "folder">("page")
  const [modalPageName, setModalPageName] = useState("")
  const [hasSubscription, setHasSubscription] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)

  // FIX: Initialize as empty array and ensure it stays an array
  const [cmsCollections, setCmsCollections] = useState<CMSCollection[]>([])
  const [showCmsPages, setShowCmsPages] = useState<{ [key: string]: boolean }>({})
  const [cmsLoading, setCmsLoading] = useState(false)
  const [cmsError, setCmsError] = useState<string | null>(null)
  const [cmsEntries, setCmsEntries] = useState<{ [key: string]: CMSEntry[] }>({})
  const [loadingEntries, setLoadingEntries] = useState<{ [key: string]: boolean }>({})

  // Check subscription status on component mount and when returning from Stripe
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Check URL parameters for successful subscription
        const urlParams = new URLSearchParams(window.location.search)
        const subscriptionStatus = urlParams.get("subscription")
        const sessionId = urlParams.get("session_id")

        if (subscriptionStatus === "success" && sessionId) {
          // Verify the subscription with the server
          const verifyResponse = await fetch(`/api/verify-subscription?session_id=${sessionId}`)
          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            setHasSubscription(true)
            // Store subscription info in localStorage
            localStorage.setItem(
              "displan_ai_subscription",
              JSON.stringify({
                active: true,
                expiresAt: new Date(verifyData.subscription.current_period_end * 1000).toISOString(),
              }),
            )
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
            setIsCheckingSubscription(false)
            return
          }
        }

        // Check if subscription info exists in localStorage
        const subscriptionData = localStorage.getItem("displan_ai_subscription")

        if (subscriptionData) {
          const { expiresAt } = JSON.parse(subscriptionData)
          // Check if subscription is still valid
          if (new Date(expiresAt) > new Date()) {
            setHasSubscription(true)
            setIsCheckingSubscription(false)
            return
          }
        }

        // If no valid subscription in localStorage, check with server
        const response = await fetch("/api/check-subscription", {
          headers: {
            "x-user-id": "current_user_id", // Replace with actual user ID from your auth system
          },
        })
        const data = await response.json()

        if (data.hasActiveSubscription) {
          // Store subscription info in localStorage
          localStorage.setItem(
            "displan_ai_subscription",
            JSON.stringify({
              active: true,
              expiresAt: data.subscription.current_period_end,
            }),
          )
          setHasSubscription(true)
        }
      } catch (error) {
        console.error("Failed to check subscription status:", error)
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    checkSubscription()
    loadCmsCollections()
  }, [projectId])

  // FIX: Proper error handling and array validation
  const loadCmsCollections = async () => {
    setCmsLoading(true)
    setCmsError(null)

    try {
      const response = await fetch(`/api/cms/collections?project_id=${projectId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // FIX: Ensure we always set an array
      if (Array.isArray(data)) {
        setCmsCollections(data)
      } else if (data && Array.isArray(data.collections)) {
        setCmsCollections(data.collections)
      } else if (data && data.success && Array.isArray(data.data)) {
        setCmsCollections(data.data)
      } else {
        console.warn("CMS API returned non-array data:", data)
        setCmsCollections([]) // Fallback to empty array
      }
    } catch (error) {
      console.error("Failed to load CMS collections:", error)
      setCmsError(error instanceof Error ? error.message : "Failed to load CMS collections")
      setCmsCollections([]) // Ensure it's still an array on error
    } finally {
      setCmsLoading(false)
    }
  }

  const handleCreatePage = (isFolder: boolean) => {
    if (newPageName.trim()) {
      onCreatePage(newPageName, isFolder)
      setNewPageName("")
      setShowPageMenu(false)
    }
  }

  const handleModalCreate = () => {
    if (modalPageName.trim()) {
      onCreatePage(modalPageName, modalType === "folder")
      setModalPageName("")
      setShowModal(false)
    }
  }

  const openModal = (type: "page" | "folder") => {
    setModalType(type)
    setShowModal(true)
    setShowPageMenu(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalPageName("")
  }

  const handleSubscriptionSuccess = () => {
    setHasSubscription(true)
    // Store subscription info in localStorage
    localStorage.setItem(
      "displan_ai_subscription",
      JSON.stringify({
        active: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }),
    )
  }

  const toggleCmsPages = async (collectionId: string) => {
    const isCurrentlyOpen = showCmsPages[collectionId]

    setShowCmsPages((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }))

    // If opening and we haven't loaded entries yet, load them
    if (!isCurrentlyOpen && !cmsEntries[collectionId]) {
      await loadCmsEntries(collectionId)
    }
  }

  const loadCmsEntries = async (collectionId: string) => {
    setLoadingEntries((prev) => ({ ...prev, [collectionId]: true }))

    try {
      const response = await fetch(`/api/cms/collections/${collectionId}/entries`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const entries = await response.json()

      setCmsEntries((prev) => ({
        ...prev,
        [collectionId]: Array.isArray(entries) ? entries : [],
      }))
    } catch (error) {
      console.error(`Failed to load entries for collection ${collectionId}:`, error)
      setCmsEntries((prev) => ({
        ...prev,
        [collectionId]: [],
      }))
    } finally {
      setLoadingEntries((prev) => ({ ...prev, [collectionId]: false }))
    }
  }

  const handleCmsEntryClick = (entry: CMSEntry) => {
    // Use a special prefix to distinguish CMS entries from regular pages
    onPageChange(`cms-${entry.collection_id}-${entry.slug}`)
  }

  return (
    <>
      <div
        className="w-[300px] bg-white dark:bg-black  h-full overflow-hidden flex"
        style={{ minWidth: "400px", maxWidth: "400px" }}
      >
        <div className="w-12 sdadwdsdawdsd flex flex-col border-r border-[#8888881A] dark:border-[#1D1D1D]">
          <button
            onClick={() => setActiveTab("elements")}
            className={`Butyet_23REr ${
              activeTab === "elements"
                ? "bg-[#8888881A] text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:bg-[#8888881A] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="Elements"
          >
            <img className="dark:hidden" src="/components/editor/element_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/element_dark.png" alt="" />
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`Butyet_23REr ${
              activeTab === "pages"
                ? "bg-[#8888881A] text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:bg-[#8888881A] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="Pages"
          >
            <img className="dark:hidden" src="/components/editor/folders_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/folders_dark.png" alt="" />
          </button>
           <button
            onClick={() => setActiveTab("navigator")}
            className={`Butyet_23REr ${
              activeTab === "navigator"
                ? "bg-[#8888881A] text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:bg-[#8888881A] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="NavigatorPanel"
          >
            <img className="dark:hidden" src="/components/editor/navigator_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/navigator_dark.png" alt="" />
          </button>
                    <button
            onClick={() => setActiveTab("ai")}
            className={`Butyet_23REr ${
              activeTab === "ai"
                ? "bg-[#8888881A] text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:bg-[#8888881A] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="AI"
          >
            <img className="dark:hidden" src="/components/editor/ai_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/ai_dark.png" alt="" />
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`Butyet_23REr ${
              activeTab === "cms"
                ? "bg-[#8888881A] text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:bg-[#8888881A] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="CMS"
          >
            <img className="dark:hidden" src="/components/editor/cms_light.png" alt="" />
            <img className="hidden dark:block" src="/components/editor/database_dark.png" alt="" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              {activeTab === "pages" ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white Elements_dw22er">Pages</h2>
                    <button
                      onClick={() => setShowPageMenu(!showPageMenu)}
                      className="w-8 h-8 bg-[#8888881A] rounded-lg text-center hover:bg-[#8888881A]  flex items-center justify-center transition-colors Elements_dw22er13"
                    >
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>

                    {showPageMenu && (
                      <div className="menu_container12123_d">
                        <button onClick={() => openModal("page")} className="menu_item">
                          <FileText className="w-4 h-4 mr-2" />
                          New Page
                        </button>
                        <button onClick={() => openModal("folder")} className="menu_item">
                          <Folder className="w-4 h-4 mr-2" />
                          New Folder
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="h-full overflow-y-auto">
                    <div
                      onClick={() => onPageChange("home")}
                      className={`flex items-center p-3 cursor-pointer transition-colors ${
                        currentPage === "home"
                          ? "bg-[#8888881A] text-gray-700 dark:border-blue-800"
                          : "hover:bg-[#8888881A] text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Home className="w-4 h-4 mr-3" />
                      <span className="text-sm font-medium">Home</span>
                    </div>

                    {pages.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => onPageChange(page.slug)}
                        className={`flex items-center p-3 cursor-pointer transition-colors ${
                          currentPage === page.slug
                            ? "bg-[#8888881A] text-gray-700 dark:border-blue-800"
                            : "hover:bg-[#8888881A] text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {page.is_folder ? <Folder className="w-4 h-4 mr-3" /> : <FileText className="w-4 h-4 mr-3" />}
                        <span className="text-sm font-medium flex-1">{page.name}</span>
                        {!page.is_folder && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 bg-[#8888881A] px-2 py-1 rounded">
                            DRAFT
                          </span>
                        )}
                      </div>
                    ))}

                    {/* CMS Pages Section - FIX: Added proper error handling and loading states */}
                    {cmsLoading && (
                      <div className="flex items-center p-3 text-gray-500">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                        <span className="text-sm">Loading CMS collections...</span>
                      </div>
                    )}

                    {cmsError && (
                      <div className="flex items-center p-3 text-red-500">
                        <span className="text-sm">Error: {cmsError}</span>
                        <button onClick={loadCmsCollections} className="ml-2 text-xs underline hover:no-underline">
                          Retry
                        </button>
                      </div>
                    )}

                    {/* FIX: Added Array.isArray check as extra safety */}
                    {!cmsLoading &&
                      !cmsError &&
                      Array.isArray(cmsCollections) &&
                      cmsCollections.map((collection) => (
                        <div key={collection.id}>
                          <div
                            onClick={() => toggleCmsPages(collection.id)}
                            className="flex items-center p-3 cursor-pointer transition-colors hover:bg-[#8888881A] text-gray-700 dark:text-gray-300"
                          >
                            <Database className="w-4 h-4 mr-3" />
                            <span className="text-sm font-medium flex-1">{collection.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 bg-[#8888881A] px-2 py-1 rounded">
                              {collection.entries_count}
                            </span>
                          </div>
                          {showCmsPages[collection.id] && (
                            <div className="ml-6">
                              {loadingEntries[collection.id] ? (
                                <div className="flex items-center p-2 text-gray-500">
                                  <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                                  <span className="text-xs">Loading entries...</span>
                                </div>
                              ) : cmsEntries[collection.id] && cmsEntries[collection.id].length > 0 ? (
                                cmsEntries[collection.id].map((entry) => (
                                  <div
                                    key={entry.id}
                                    onClick={() => handleCmsEntryClick(entry)}
                                    className={`flex items-center p-2 cursor-pointer transition-colors hover:bg-[#8888881A] ${
                                      currentPage === `cms-${entry.collection_id}-${entry.slug}`
                                        ? "bg-[#8888881A] text-gray-700 dark:text-gray-200"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                                  >
                                    <FileText className="w-3 h-3 mr-2" />
                                    <span className="text-xs flex-1">{entry.title}</span>
                                    <span
                                      className={`text-xs px-1 py-0.5 rounded ${
                                        entry.status === "published"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      }`}
                                    >
                                      {entry.status}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="flex items-center p-2 text-gray-500">
                                  <span className="text-xs">No entries found</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                    {/* Show message when no CMS collections */}
                    {!cmsLoading && !cmsError && Array.isArray(cmsCollections) && cmsCollections.length === 0 && (
                      <div className="flex items-center p-3 text-gray-500">
                        <span className="text-sm">No CMS collections found</span>
                      </div>
                    )}
                  </div>
                </>
              ) : activeTab === "elements" ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 Elements_dw22er">Elements</h2>
                  <ElementsPanel onAddElement={onAddElement} />
                </div>
              ) : activeTab === "cms" ? (
                <div>
                  <CMSPanel onCollectionUpdate={loadCmsCollections} projectId={projectId} />
                </div>
                ) : activeTab === "navigator" ? (
                <div>
                  <NavigatorPanel
                  elements={canvasElements}
                  currentPage={currentPage}
                  onElementVisibilityToggle={onElementVisibilityToggle}
                  onElementSelect={onElementSelect}
                />
                </div>
              ) : (
                // AI Panel
                <div>
                  {isCheckingSubscription ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                    </div>
                  ) : hasSubscription ? (
                    <div className="min-h-screen bg-[#8888881A] dark:bg-[#1D1D1D] p-4">
                      <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold mb-4">AI Chat Demo</h1>
                        <div className="h-[800px]">
                          <DisplanAI />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <StripeSubscription onSubscriptionSuccess={handleSubscriptionSuccess} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg_13_fsdf">
            <div className="flex items-center justify-between mb-4 text_simple_css_code1">
              <h3 className="text-white text_simple_css_code">Create New {modalType === "page" ? "Page" : "Folder"}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={`Enter ${modalType} name...`}
                  value={modalPageName}
                  onChange={(e) => setModalPageName(e.target.value)}
                  className="input_field"
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && handleModalCreate()}
                />
              </div>
              <span className="Text_span_css_codecss">
                You can {modalType === "page" ? "Page" : "Folder"} create and update each one individually.
              </span>
              <div className="flex space-x-3">
                <button onClick={closeModal} className="button_edit_projectsfdafgfwf12_dfdd_none">
                  Cancel
                </button>
                <button
                  onClick={handleModalCreate}
                  disabled={!modalPageName.trim()}
                  className="button_edit_projectsfdafgfwf12_dfdd"
                >
                  Create {modalType === "page" ? "Page" : "Folder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showPageMenu && <div className="fixed inset-0 z-0" onClick={() => setShowPageMenu(false)} />}
    </>
  )
}
