import { createClient } from "../../../../../supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import "../../../../styles/background.css"

export default async function WebsiteBuilderPage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in?message=Please sign in to access the website builder")
  }

  const user = session.user
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const hasProfile = !!profile

  return (
    <div className="grid-background min-h-screen w-full flex items-center justify-center relative">
      <div className="card-container bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-start mb-4">
          <div className="cube-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#4285F4" fillOpacity="0.1" />
              <path
                d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
                fill="#4285F4"
                stroke="#4285F4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 18V12" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M17 9L12 12L7 9"
                stroke="#4285F4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-medium text-gray-800 mb-2">Bring your ideas to life with DisPlan</h1>

        <div className="typing-container mb-6">
          <p id="typing-text" className="text-gray-600 text-sm leading-relaxed">
            You can choose to generate code or design your site visually with drag-and-drop elements that you can
            customize and arrange freely.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/dashboard/apps/website-builder/designer"
            className="button-primary flex items-center justify-center gap-2 py-3 rounded-full text-white font-medium transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                fill="currentColor"
              />
            </svg>
            Start designing
          </Link>

          <Link
            href="/dashboard/apps/website-builder/code"
            className="button-secondary flex items-center justify-center gap-2 py-3 rounded-full text-gray-700 font-medium transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M16 18L22 12L16 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6L2 12L8 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Start coding
          </Link>
        </div>

<p className="text-gray-400 text-xs text-center px-4">
  La IA puede cometer errores, por lo que debes verificar que los resultados sean precisos antes de usarlos y asegurarte de que la información sea correcta. 
  No compartas información personal. Además, utilizamos la inteligencia artificial{" "}
  <a 
    href="https://gemini.google.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-blue-500 hover:underline"
  >
    Gemini
  </a>{" "}
  de Google.
</p>

      </div>
    </div>
  )
}
