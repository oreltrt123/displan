import { createClient } from "../../../../../supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Briefcase, Heart, Calendar, ExternalLink } from "lucide-react"
import FollowButton from "@/components/follow-button"
import Image from "next/image"
import DashboardNavbar from "@/components/dashboard-navbar"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePageEnhanced({ params }: ProfilePageProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const currentUser = session?.user

  // Get profile data with new fields
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

  // Get bio styling
  const getBioStyle = () => {
    const fontSize = profile.bio_font_size === "small" ? "14px" : profile.bio_font_size === "large" ? "18px" : "16px"
    return {
      fontSize,
      fontWeight: profile.bio_is_bold ? "bold" : "normal",
      fontStyle: profile.bio_is_italic ? "italic" : "normal",
    }
  }

  // Social media links
  const socialLinks = [
    { name: "LinkedIn", url: profile.linkedin_url, color: "text-blue-400", icon: "💼" },
    { name: "Facebook", url: profile.facebook_url, color: "text-blue-600", icon: "📘" },
    { name: "TikTok", url: profile.tiktok_url, color: "text-pink-400", icon: "🎵" },
    { name: "YouTube", url: profile.youtube_url, color: "text-red-500", icon: "📺" },
  ].filter((link) => link.url && link.url.trim() !== "")

  return (
    <div className="w-full min-h-screen text-white bg-background relative">
      <DashboardNavbar hasProfile={hasProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-1">
              <div className="shadow-sm">
                {/* Profile Avatar */}
                <div className="mb-6">
                  <div className="relative mb-4">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url || "/placeholder.svg"}
                        alt={profile.name}
                        width={144}
                        height={144}
                        className="w-36 h-36 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info - Left Aligned */}
                  <div className="space-y-3">
                    <div className="text-xl font-bold text-white">{profile.name}</div>
                    <div className="text-white/70 text-sm">@{profile.username || params.id}</div>
                    {!isOwnProfile && (
                      <div>
                        <FollowButton userId={params.id} />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <Link href={`/dashboard/profile/${params.id}/followers`} className="hover:text-white">
                        <span className="font-medium">{followers?.length || 0}</span> followers
                      </Link>
                      <Link href={`/dashboard/profile/${params.id}/following`} className="hover:text-white">
                        <span className="font-medium">{following?.length || 0}</span> following
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar size={14} />
                    <span>Joined {joinedDate}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin size={14} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.occupation && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Briefcase size={14} />
                      <span>{profile.occupation}</span>
                    </div>
                  )}
                  {profile.interests && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Heart size={14} />
                      <span>{profile.interests.split(",")[0]?.trim()}</span>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {socialLinks.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-medium text-white/80 mb-3">Social Media</h3>
                    <div className="space-y-2">
                      {socialLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-sm ${link.color} hover:opacity-80 transition-opacity`}
                        >
                          <span>{link.icon}</span>
                          <span>{link.name}</span>
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sites and Additional Content */}
            <div className="lg:col-span-2">
              <div className="shadow-sm">
                {/* Enhanced Bio Section */}
                {profile.bio && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <div style={getBioStyle()} className="text-white/80 whitespace-pre-line">
                      {profile.bio}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {projects && projects.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Public Projects</h3>
                    <div className="grid gap-3">
                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/dashboard/project/${project.id}`}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <h4 className="font-medium">{project.name}</h4>
                          {project.description && <p className="text-sm text-white/70 mt-1">{project.description}</p>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
