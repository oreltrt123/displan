"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Settings, User, LogOut } from "lucide-react"
import { createClient } from "../../supabase/client"
import { useRouter } from "next/navigation"
import "../styles/navbar.css"
import "../app/dashboard/apps/website-builder/designer/styles/button.css"
interface DashboardNavbarProps {
  hasProfile?: boolean
}

export default function DashboardNavbar({ hasProfile = false }: DashboardNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="w-full bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-white link_button dsafafwf">
              <img 
    src="/logo_light_mode.png" 
    alt="Logo" 
    className="dark:hidden" 
  />
  <img 
    src="/logo_dark_mode.png" 
    alt="Logo" 
    className="hidden dark:block" 
  />
          </Link>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* <Link href="/dashboard/apps" className="new_site_button_r2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-grid icon"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <span>Apps</span>
          </Link> */}
          <button
            ref={avatarRef}
            onClick={toggleDropdown}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="User menu"
          >
            <User size={20} className="text-white" />
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="menu_container_t3"
            >
                <Link
                    href="/dashboard/apps"
                    className="menu_item"
                  >
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-grid icon"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
                    Apps
                  </Link>
              <div className="py-1">
                {hasProfile ? (
                  <Link
                    href="/dashboard/settings"
                    className="menu_item"
                  >
                   <Settings size={16} />
                    Settings
                  </Link>
                ) : (
                  <Link
                    href="/profile/create"
                    className="menu_item"
                  >
                    <User size={16} />
                    Create Profile
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="menu_item"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
