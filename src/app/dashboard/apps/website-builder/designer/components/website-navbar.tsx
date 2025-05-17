"use client"

interface WebsiteNavbarProps {
  siteName: string
  pages: { name: string; path: string }[]
  activePage?: string
}

export function WebsiteNavbar({ siteName, pages, activePage }: WebsiteNavbarProps) {
  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl">{siteName}</div>
          <nav className="flex space-x-1">
            {pages.map((page) => (
              <a
                key={page.path}
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`px-4 py-2 rounded ${
                  activePage === page.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {page.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
