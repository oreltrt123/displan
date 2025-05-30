"use client"

import { useState } from "react"
import { Home, Plus, Folder, FileText } from "lucide-react"
import { ElementsPanel } from "./elements-panel"

interface DisplanProjectDesignerCssPage {
  id: string
  name: string
  slug: string
  is_folder: boolean
}

interface LeftSidebarProps {
  pages: DisplanProjectDesignerCssPage[]
  currentPage: string
  onPageChange: (pageId: string) => void
  onCreatePage: (name: string, isFolder: boolean) => void
  onAddElement?: (elementType: string, x: number, y: number) => void
}

export function LeftSidebar({ pages, currentPage, onPageChange, onCreatePage, onAddElement }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<"pages" | "elements">("pages")
  const [showPageMenu, setShowPageMenu] = useState(false)
  const [newPageName, setNewPageName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"page" | "folder">("page")
  const [modalPageName, setModalPageName] = useState("")

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

  return (
    <>
      <div className="w-64 bg-white dark:bg-black dark:border-gray-900 h-full overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("pages")}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === "pages"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => setActiveTab("elements")}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === "elements"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Elements
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "pages" ? (
              <>
                <div className="flex items-center justify-between mb-2 relative">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Pages</span>
                  <button
                    onClick={() => setShowPageMenu(!showPageMenu)}
                    className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded text-center hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
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

                <div className="space-y-1 h-full overflow-y-auto">
                  <div
                    onClick={() => onPageChange("home")}
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      currentPage === "home"
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    <span className="text-sm">Home</span>
                  </div>

                  {pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => onPageChange(page.slug)}
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        currentPage === page.slug
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    >
                      {page.is_folder ? <Folder className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                      <span className="text-sm">{page.name}</span>
                      {!page.is_folder && (
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">DRAFT</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <ElementsPanel onAddElement={onAddElement} />
            )}
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
