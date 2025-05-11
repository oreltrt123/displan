import { createClient } from "../../../../../supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Briefcase, Heart, Calendar, ArrowLeft, Users, UserPlus, Camera } from 'lucide-react'
import FollowButton from "@/components/follow-button"
import Image from "next/image"
import DashboardNavbar from "@/components/dashboard-navbar"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const currentUser = session?.user

  // Get profile data
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", params.id).single()

  if (error || !profile) {
    return notFound()
  }

  // Get follower count
  const { data: followers, error: followersError } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", params.id)

  if (followersError) {
    console.error("Error fetching followers:", followersError)
  }

  // Get following count
  const { data: following, error: followingError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", params.id)

  if (followingError) {
    console.error("Error fetching following:", followingError)
  }

  // Get public projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", params.id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Format date
  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const isOwnProfile = currentUser?.id === params.id
  const hasProfile = !!profile

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
        <DashboardNavbar hasProfile={hasProfile} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={profile.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">{profile.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <Link 
                      href="/dashboard/profile/edit-avatar" 
                      className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 hover:bg-blue-600 transition-colors"
                      title="Change profile picture"
                    >
                      <Camera size={14} />
                    </Link>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.occupation && (
                    <p className="text-white/70 flex items-center gap-1 mt-1">
                      <Briefcase size={14} />
                      {profile.occupation}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-white/70 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {profile.location}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Link href={`/dashboard/profile/${params.id}/followers`} className="text-white/80 hover:text-white flex items-center gap-1">
                      <Users size={14} />
                      <span className="font-medium">{followers?.length || 0}</span> Followers
                    </Link>
                    <Link href={`/dashboard/profile/${params.id}/following`} className="text-white/80 hover:text-white flex items-center gap-1">
                      <UserPlus size={14} />
                      <span className="font-medium">{following?.length || 0}</span> Following
                    </Link>
                  </div>
                </div>
              </div>

              {!isOwnProfile && <FollowButton userId={params.id} />}

              {isOwnProfile && (
                <Link
                  href="/dashboard/profile/edit"
                  className="px-4 py-2 text-sm tracking-tight no-underline bg-white/10 font-[560] rounded-[100px] text-white hover:bg-white/20 transition-opacity"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {profile.bio && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-white/80 whitespace-pre-line">{profile.bio}</p>
              </div>
            )}

            {profile.interests && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Heart size={16} className="text-pink-400" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.split(",").map((interest: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {projects && projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Public Projects</h2>
                <div className="grid gap-3">
                  {projects.map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/dashboard/project/${project.id}`}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-white/70 mt-1">{project.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-white/50 flex items-center gap-1">
              <Calendar size={14} />
              Joined {joinedDate}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
