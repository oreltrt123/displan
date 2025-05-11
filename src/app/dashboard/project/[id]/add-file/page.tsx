"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "../../../../../../supabase/client"
import { ArrowLeft, Save, AlertCircle, File, Code } from "lucide-react"

interface AddFilePageProps {
  params: {
    id: string
  }
}

export default function AddFilePage({ params }: AddFilePageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null)

  const [fileName, setFileName] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [fileType, setFileType] = useState("html")

  useEffect(() => {
    async function loadProject() {
      try {
        setIsLoading(true)

        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError || !userData.user) {
          router.push("/sign-in")
          return
        }

        // Get project data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single()

        if (projectError || !projectData) {
          throw new Error("Project not found")
        }

        // Check if user has access to this project
        if (projectData.owner_id !== userData.user.id) {
          // Check if user is a collaborator with edit permissions
          const { data: collaborator, error: collabError } = await supabase
            .from("project_collaborators")
            .select("*")
            .eq("project_id", params.id)
            .eq("user_id", userData.user.id)
            .single()

          if (collabError || !collaborator || collaborator.role === "viewer") {
            throw new Error("You don't have permission to add files to this project")
          }
        }

        setProject(projectData)
      } catch (err) {
        console.error("Error loading project:", err)
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  const getFileTemplate = (type: string): string => {
    switch (type) {
      case "html":
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a new page.</p>
  
  <script src="script.js"></script>
</body>
</html>`
      case "css":
        return `/* Main Styles */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: #0066cc;
}

p {
  margin-bottom: 15px;
}`
      case "js":
        return `// JavaScript code
document.addEventListener('DOMContentLoaded', function() {
  console.log('Document ready!');
  
  // Your code here
});

function greet(name) {
  return 'Hello, ' + name + '!';
}`
      case "json":
        return `{
  "name": "My Project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "",
  "license": "MIT"
}`
      case "md":
        return `# Project Title

## Description
A brief description of what this project does and who it's for.

## Installation
\`\`\`
npm install my-project
\`\`\`

## Usage
\`\`\`javascript
import { myFunction } from 'my-project';

// Example usage
myFunction();
\`\`\`

## License
[MIT](https://choosealicense.com/licenses/mit/)`
      default:
        return ""
    }
  }

  useEffect(() => {
    // Set default file content based on type
    setFileContent(getFileTemplate(fileType))
  }, [fileType])

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value
    setFileType(newType)

    // Update file extension if the user hasn't manually changed it
    if (!fileName || fileName.endsWith(`.${fileType}`)) {
      setFileName(`file.${newType}`)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      if (!fileName) {
        throw new Error("File name is required")
      }

      // Check if file already exists
      const { data: existingFiles, error: existingError } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", params.id)
        .eq("name", fileName)

      if (existingError) throw existingError

      if (existingFiles && existingFiles.length > 0) {
        throw new Error(`A file with the name "${fileName}" already exists in this project`)
      }

      // Create new file
      const { data: newFile, error: insertError } = await supabase
        .from("project_files")
        .insert({
          project_id: params.id,
          name: fileName,
          content: fileContent,
          path: fileName,
          type: "file",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect to file view
      router.push(`/dashboard/project/${params.id}/file/${newFile.id}`)
    } catch (err) {
      console.error("Error creating file:", err)
      setError(err instanceof Error ? err.message : "Failed to create file")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-white bg-black relative flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error && !project) {
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
          <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="bg-red-500/20 border border-red-500/50 text-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
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
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/dashboard/project/${params.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <File size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">Create New File</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="fileName" className="block text-sm font-medium text-white/80 mb-1">
                    File Name
                  </label>
                  <input
                    id="fileName"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. index.html"
                    className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="fileType" className="block text-sm font-medium text-white/80 mb-1">
                    File Type
                  </label>
                  <select
                    id="fileType"
                    value={fileType}
                    onChange={handleFileTypeChange}
                    className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="js">JavaScript</option>
                    <option value="json">JSON</option>
                    <option value="md">Markdown</option>
                    <option value="txt">Text</option>
                  </select>
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !fileName}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save File"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="fileContent" className="block text-sm font-medium text-white/80 mb-1">
                  File Content
                </label>
                <div className="relative">
                  <div className="absolute top-2 right-2 bg-white/10 px-2 py-1 rounded text-xs text-white/60 flex items-center gap-1">
                    <Code size={12} />
                    {fileType.toUpperCase()}
                  </div>
                  <textarea
                    id="fileContent"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    rows={20}
                    className="block w-full px-3 py-2 bg-[#1e1e1e] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
