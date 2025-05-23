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
    },
    {
      name: "Appearance",
      href: "/dashboard/settings/appearance",
      icon: Palette,
    },
    {
      name: "Notifications",
      href: "/dashboard/settings/notifications",
      icon: Bell,
    },
    {
      name: "Password",
      href: "/dashboard/settings/password",
      icon: Key,
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

      {/* Mobile Top Nav */}
      <nav className="md:hidden overflow-x-auto border-b bg-background whitespace-nowrap flex gap-1 px-4 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shrink-0 ${
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon size={16} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block border-r">
          <div className="sticky top-16 overflow-y-auto py-6 pr-6">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
