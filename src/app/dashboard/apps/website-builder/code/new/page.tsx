"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Code, Save, X } from "lucide-react"
import { createClient } from "../../../../../../../supabase/client"

export default function NewCodeProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [template, setTemplate] = useState("blank")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/sign-in")
        return
      }

      // Create initial content based on template
      let initialContent = {}

      if (template === "blank") {
        initialContent = {
          files: [
            {
              name: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This is a blank template. Start building your website!</p>
  
  <script src="script.js"></script>
</body>
</html>`,
            },
            {
              name: "styles.css",
              content: `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: #0066cc;
}`,
            },
            {
              name: "script.js",
              content: `// Your JavaScript code goes here
console.log("Website loaded successfully!");`,
            },
          ],
        }
      } else if (template === "landing") {
        initialContent = {
          files: [
            {
              name: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">Brand</div>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <section class="hero">
    <div class="hero-content">
      <h1>Welcome to Our Amazing Product</h1>
      <p>The best solution for your needs. Try it today!</p>
      <button class="cta-button">Get Started</button>
    </div>
  </section>
  
  <section id="features" class="features">
    <h2>Features</h2>
    <div class="feature-grid">
      <div class="feature">
        <h3>Feature 1</h3>
        <p>Description of feature 1</p>
      </div>
      <div class="feature">
        <h3>Feature 2</h3>
        <p>Description of feature 2</p>
      </div>
      <div class="feature">
        <h3>Feature 3</h3>
        <p>Description of feature 3</p>
      </div>
    </div>
  </section>
  
  <script src="script.js"></script>
</body>
</html>`,
            },
            {
              name: "styles.css",
              content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  z-index: 100;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0066cc;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 2rem;
}

nav ul li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #0066cc;
}

.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8ff;
  text-align: center;
  padding: 0 2rem;
}

.hero-content {
  max-width: 800px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #0066cc;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.cta-button {
  padding: 0.8rem 2rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #0055aa;
}

.features {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #0066cc;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #0066cc;
}

.feature p {
  color: #666;
}`,
            },
            {
              name: "script.js",
              content: `// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    window.scrollTo({
      top: targetElement.offsetTop - 70,
      behavior: 'smooth'
    });
  });
});

// Add event listener to CTA button
document.querySelector('.cta-button').addEventListener('click', function() {
  alert('Thanks for your interest! This is where you would start the sign-up process.');
});`,
            },
          ],
        }
      }

      // Create new project in database
      const { data: project, error: projectError } = await supabase
        .from("website_projects")
        .insert({
          user_id: user.id,
          name,
          description,
          type: "code",
          content: initialContent,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Redirect to the editor
      router.push(`/dashboard/apps/website-builder/code/edit/${project.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <header className="w-full border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
            DisPlan
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/apps/website-builder/code"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Code Editor
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Code size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">Create New Code Project</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <X size={18} className="text-red-400" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Project Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Awesome Website"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A brief description of your website project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Choose a Template</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "blank"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("blank")}
                  >
                    <div className="aspect-video bg-white/10 rounded flex items-center justify-center mb-3">
                      <span className="text-lg font-medium">Blank</span>
                    </div>
                    <h3 className="font-medium">Blank Template</h3>
                    <p className="text-sm text-white/70">Start with a clean slate</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      template === "landing"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setTemplate("landing")}
                  >
                    <div className="aspect-video bg-white/10 rounded flex items-center justify-center mb-3">
                      <span className="text-lg font-medium">Landing</span>
                    </div>
                    <h3 className="font-medium">Landing Page</h3>
                    <p className="text-sm text-white/70">A simple landing page template</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isLoading ? "Creating Project..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
