"use client"

import { useState, useEffect } from "react"
import { UserPlus, UserCheck } from "lucide-react"
import { createClient } from "../../supabase/client"

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkFollowStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .single()

        setIsFollowing(!!data)
      } catch (error) {
        console.error("Error checking follow status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFollowStatus()
  }, [userId, supabase])

  const toggleFollow = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to follow users")
      }

      if (isFollowing) {
        // Unfollow
        await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId)
      } else {
        // Follow
        await supabase.from("follows").insert({
          follower_id: user.id,
          following_id: userId,
          created_at: new Date().toISOString(),
        })
      }

      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 text-sm tracking-tight no-underline font-[560] rounded-[100px] flex items-center gap-2 transition-colors ${
        isFollowing
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
      }`}
    >
      {isFollowing ? (
        <>
          <UserCheck size={16} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={16} />
          Follow
        </>
      )}
    </button>
  )
}
