"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const SocialLoginButtons: React.FC = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error("Google login error:", error.message)
  }

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error("GitHub login error:", error.message)
  }

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error("Discord login error:", error.message)
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center my-8">
        <div className="flex-grow border-t border-[#f5f5f5]"></div>
        <span className="flex-shrink px-2 text-[9px] font-medium text-black">Or</span>
        <div className="flex-grow border-t border-[#f5f5f5]"></div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none"
        >
          <img src="/images/img_icons8google_1.svg" alt="Google icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with Google</span>
        </button>

        {/* Discord Login */}
        <button
          onClick={handleDiscordLogin}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none"
        >
          <img src="/images/discord-icon-svgrepo-com.svg" alt="Discord icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with Discord</span>
        </button>

        {/* GitHub Login */}
        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center h-[32px] px-4 bg-transparent border border-[#d9d9d9] text-black rounded-[10px] transition-colors duration-200 focus:outline-none"
        >
          <img src="/images/github-142-svgrepo-com.svg" alt="GitHub icon" className="w-6 h-6 mr-2" />
          <span className="text-[12px] font-medium text-black">Sign in with GitHub</span>
        </button>
      </div>
    </div>
  )
}

export default SocialLoginButtons
