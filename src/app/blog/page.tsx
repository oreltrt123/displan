"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User, Search } from "lucide-react"
import { createClient } from "../../../supabase/client"
import Navbar from "@/components/navbar"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Categories for the sidebar
const categories = [
  { name: "All", slug: "all" },
  { name: "Security", slug: "security" },
  { name: "Project Management", slug: "project-management" },
  { name: "Collaboration", slug: "collaboration" },
  { name: "Payments", slug: "payments" },
  { name: "Development", slug: "development" },
  { name: "Design", slug: "design" },
]

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "How DisPlan Prevents Collaboration Scams",
    excerpt: "Learn how our secure payment system and escrow features protect both parties in a collaboration.",
    date: "2023-10-15",
    author: "John Doe",
    category: "Security",
    image: "/blog/blog1.png",
    likes: 24,
  },
  {
    id: 2,
    title: "Best Practices for Managing Remote Development Teams",
    excerpt:
      "Discover effective strategies for coordinating developers across different time zones and ensuring project success.",
    date: "2023-10-10",
    author: "Jane Smith",
    category: "Project Management",
    image: "/blog/blog2.png",
    likes: 18,
  },
  {
    id: 3,
    title: "Content Creator's Guide to Finding Technical Partners",
    excerpt:
      "A comprehensive guide for content creators looking to partner with developers for their next big project.",
    date: "2023-10-05",
    author: "Alex Johnson",
    category: "Collaboration",
    image: "/blog/blog3.png",
    likes: 32,
  },
  {
    id: 4,
    title: "Understanding Payment Protection in Project Collaboration",
    excerpt: "A deep dive into how milestone-based payments and escrow services protect both clients and freelancers.",
    date: "2023-09-28",
    author: "Michael Chen",
    category: "Payments",
    image: "/blog/blog4.png",
    likes: 15,
  },
  {
    id: 5,
    title: "The Future of Open Source Collaboration",
    excerpt: "How community-driven development is changing the landscape of software creation and distribution.",
    date: "2023-09-20",
    author: "Sarah Williams",
    category: "Development",
    image: "/blog/blog5.png",
    likes: 42,
  },
  {
    id: 6,
    title: "Design Systems That Scale: Lessons from DisPlan",
    excerpt: "Learn how we built a design system that supports thousands of components while maintaining consistency.",
    date: "2023-09-15",
    author: "David Lee",
    category: "Design",
    image: "/blog/blog6.png",
    likes: 29,
  },
]

export default function BlogPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    // Filter posts based on category and search query
    let filtered = blogPosts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchQuery])

  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen text-white bg-black relative">
        <main className="flex flex-col pt-24 pb-20">
          <div className="px-4 sm:px-6 mx-auto max-w-7xl w-full">
            <div className="flex flex-col items-center text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">DisPlan Blog</h1>
              <p className="text-lg text-white/70 max-w-3xl">
                Explore the latest DisPlan blogs featuring the most exciting news and updates.
              </p>
            </div>

            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-4 top-3 text-white/40" size={20} />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with categories */}
              <aside className="w-full lg:w-64 mb-6 lg:mb-0">
                <div className="sticky top-24">
                  <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                  <nav className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                          selectedCategory === category.slug
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Blog posts grid */}
              <div className="flex-1">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <article
                        key={post.id}
                        className="group bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden hover:from-white/10 transition-all duration-300"
                      >
                        <Link href={`/blog/${post.id}`} className="block h-56 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                          <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-110">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                          <div className="absolute top-3 left-3 z-20">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600/80 backdrop-blur-sm text-white">
                              {post.category}
                            </span>
                          </div>
                        </Link>
                        <div className="p-6 flex flex-col flex-grow">
                          <h2 className="text-xl font-bold mb-3 line-clamp-2">
                            <Link href={`/blog/${post.id}`} className="hover:text-blue-400 transition-colors">
                              {post.title}
                            </Link>
                          </h2>

                          <p className="text-white/70 mb-4 line-clamp-3">{post.excerpt}</p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                            <div className="flex items-center text-sm text-white/60">
                              <User className="h-4 w-4 mr-1" />
                              <span className="truncate max-w-[120px]">{post.author}</span>
                              <span className="mx-2">•</span>
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{post.date}</span>
                            </div>

                            <Link
                              href={`/blog/${post.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center text-sm group-hover:underline"
                            >
                              Read more
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
                      <p className="text-white/60">
                        Try adjusting your search or category filter to find what you're looking for.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
