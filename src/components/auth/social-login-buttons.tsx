"use client"

import type React from "react"
import { createClient } from "../../../supabase/client"

const SocialLoginButtons: React.FC = () => {
  const supabase = createClient()

  const handleOAuthLogin = async (provider: "google" | "github" | "discord") => {
    try {
      // Determine redirect URL based on environment
      const redirectHost =
        process.env.NODE_ENV === "development" ? window.location.origin : "https://www.displan.design"

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${redirectHost}`,
        },
      })

      if (error) {
        console.error(`${provider} login error:`, error.message)
        alert(`Login failed with ${provider}. Please try again. `)
      }
    } catch (err) {
      console.error(`Unexpected error during ${provider} login:`, err)
      alert(`An unexpected error occurred with ${provider}.`)
    }
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center my-8">
        <div className="flex-grow border-t border-[#f5f5f5]" />
        <span className="flex-shrink px-2 text-[9px] font-medium text-black">Or</span>
        <div className="flex-grow border-t border-[#f5f5f5]" />
      </div>

      <div className="flex flex-col gap-[10px]">
        {/* Google Login */}
        <button
          onClick={() => handleOAuthLogin("google")}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none hover:bg-gray-50"
        >
          <img src="/images/img_icons8google_1.svg" alt="Google icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with Google</span>
        </button>

        {/* Discord Login */}
        <button
          onClick={() => handleOAuthLogin("discord")}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none hover:bg-gray-50"
        >
          <img src="/images/discord-icon-svgrepo-com.svg" alt="Discord icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with Discord</span>
        </button>

        {/* GitHub Login */}
        <button
          onClick={() => handleOAuthLogin("github")}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none hover:bg-gray-50"
        >
          <img src="/images/github-142-svgrepo-com.svg" alt="GitHub icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with GitHub</span>
        </button>
      </div>
    </div>
  )
}

export default SocialLoginButtons
