"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ChevronLeft, Key, Palette, User } from "lucide-react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Account",
      href: "/dashboard/settings/account",
      icon: User,
      active: pathname === "/dashboard/settings/account",
    },
    {
      name: "Appearance",
      href: "/dashboard/settings/appearance",
      icon: Palette,
      active: pathname === "/dashboard/settings/appearance",
    },
    {
      name: "Notifications",
      href: "/dashboard/settings/notifications",
      icon: Bell,
      active: pathname === "/dashboard/settings/notifications",
    },
    {
      name: "Password",
      href: "/dashboard/settings/password",
      icon: Key,
      active: pathname === "/dashboard/settings/password",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {pathname.split("/").pop()?.charAt(0).toUpperCase() + pathname.split("/").pop()?.slice(1) || "Settings"}
            </div>
          </div>
        </div>
      </header>

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]">
        <aside className="hidden border-r md:block">
          <div className="sticky top-16 overflow-y-auto py-6 pr-6">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    item.active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
