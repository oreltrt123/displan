"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "../../supabase/client"
import { useRouter } from "next/navigation"
import { UserCircle } from "lucide-react"
import { LanguageSwitcher } from "./language-switcher"
import type { User } from "@supabase/supabase-js"
import "../styles/actions.css"
import "../styles/navbar.css"

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
          return
        }

        if (data?.session?.user) {
          console.log("User is logged in:", data.session.user.email)
          setUser(data.session.user)
        } else {
          console.log("No active session found")
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to check authentication status:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, session: { user: User | null }) => {
        console.log("Auth state changed:", event, session ? "Logged in" : "Not logged in")

        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Toggle user menu dropdown
  const handleToggleMenu = () => {
    setMenuOpen((open) => !open)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      router.refresh()
      setMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      // variants={navVariants}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-lg bg-white/80 dark:bg-background/80"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-bold tracking-tight text-black dark:text-white link_button dsafafwf">
            <img src="/logo_light_mode.png" alt="Logo" className="dark:hidden" />
            <img src="/logo_dark_mode.png" alt="Logo" className="hidden dark:block" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors link_button"
              data-i18n="features"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors link_button"
              data-i18n="blog"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors link_button"
              data-i18n="about"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors link_button"
              data-i18n="projects"
            >
              Projects
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Show LanguageSwitcher only if no user */}
          {!user && <LanguageSwitcher />}

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 animate-pulse"></div>
          ) : user ? (
            // User is logged in - custom dropdown without third-party components
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleToggleMenu}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                className="post-actions-menu-button text-black dark:text-white flex items-center gap-1"
              >
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </button>

              {menuOpen && (
                <div
                  className="menu_container"
                  role="menu"
                  aria-label="User menu"
                >
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    <button
                      className="menu_item"
                      role="menuitem"
                    >
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="menu_item"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors link_button"
                data-i18n="signIn"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-black/90 dark:hover:bg-white/90 transition-colors link_button"
                data-i18n="getStarted"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
