import { createClient } from "../../../../../../supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import Image from "next/image";

interface FollowersPageProps {
  params: {
    id: string;
  };
}

// Define types
interface Profile {
  user_id: string;
  name: string;
  avatar_url: string | null;
}

interface Follower {
  follower_id: string;
  profiles: Profile;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const supabase = await createClient();

  // Get profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.id)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  // Get followers with their profiles
  const { data: followers, error: followersError } = await supabase
    .from("follows")
    .select(`
      follower_id,
      profiles:profiles(
        user_id,
        name,
        avatar_url
      )
    `)
    .eq("following_id", params.id);

  if (followersError) {
    console.error("Error fetching followers:", followersError);
  }

  // Fix the types properly
  const typedFollowers = (followers || []) as unknown as Follower[];

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
            href={`/profile/${params.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold">People following {profile.name}</h1>
            </div>

            {typedFollowers.length > 0 ? (
              <div className="space-y-4">
                {typedFollowers.map((follow) => (
                  <Link
                    key={follow.follower_id}
                    href={`/dashboard/profile/${follow.follower_id}`}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {follow.profiles.avatar_url ? (
                      <Image
                        src={follow.profiles.avatar_url}
                        alt={follow.profiles.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-400">
                          {follow.profiles.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{follow.profiles.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">No followers yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
