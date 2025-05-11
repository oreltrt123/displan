"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Play, Plus, MapPin, User, Users, BarChart3, Settings } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { icon: Play, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Create Project", path: "/project/create" },
    { icon: MapPin, label: "Locations", path: "/locations" },
    { icon: User, label: "Edit Profile", path: "/profile/edit" },
    { icon: Users, label: "Manage Users", path: "/users" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <aside className="w-64 min-h-screen border-r border-white/10 bg-black">
      <div className="p-4 border-b border-white/10">
        <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
          DisPlan
        </Link>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.path) ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
