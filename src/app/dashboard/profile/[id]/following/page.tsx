import { createClient } from "../../../../../../supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UserPlus } from 'lucide-react'
import Image from "next/image"

interface FollowingPageProps {
  params: {
    id: string
  }
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const supabase = await createClient()

  // Get profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.id)
    .single()

  if (profileError || !profile) {
    return notFound()
  }

  // Get following with their profiles
  const { data: following, error: followingError } = await supabase
    .from("follows")
    .select(`
      following_id,
      profiles:following_id!inner(
        user_id,
        name,
        avatar_url
      )
    `)
    .eq("follower_id", params.id)

  if (followingError) {
    console.error("Error fetching following:", followingError)
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
          <Link href={`/dashboard/profile/${params.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">People {profile.name} follows</h1>
            </div>

            {following && following.length > 0 ? (
              <div className="space-y-4">
                {following.map((follow) => (
                  <Link
                    key={follow.following_id}
                    href={`/profile/${follow.following_id}`}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {Array.isArray(follow.profiles) && follow.profiles.length > 0 ? (
                      follow.profiles[0]?.avatar_url ? (
                        <Image
                          src={follow.profiles[0].avatar_url || "/placeholder.svg"}
                          alt={follow.profiles[0].name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-400">{follow.profiles[0]?.name?.charAt(0)}</span>
                        </div>
                      )
                    ) : null}
                    <div>
                      <h3 className="font-medium">{follow.profiles[0]?.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">Not following anyone yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
