"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { UserCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"

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

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <button
          className="asfasfawfasffwsadawdd"
          title="Open command palette"
        >
          <img
            className="dark:hidden"
            src="/components/editor/logo_light.png"
            alt="logo"
            width={44}
            height={30}
          />
          <img
            className="hidden dark:block"
            src="/components/editor/logo_dark.png"
            alt="logo"
            width={44}
            height={30}
          />
          <span className="Creator_span_ text-4xl font-black text-gray-900 dark:text-white">Creator Space</span>
        </button>
      </div>
    </header>
  )
}
