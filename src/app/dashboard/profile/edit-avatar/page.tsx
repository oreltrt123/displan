"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../../supabase/client"
import { ArrowLeft, Upload, X, Camera } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function EditAvatarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("File must be an image")
        return
      }

      setAvatarFile(file)
      setAvatarUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!avatarFile) {
      setError("Please select an image")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to update your profile")
      }

      const fileName = `avatar-${user.id}-${Date.now()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image")
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) throw updateError

      router.push(`/profile/${user.id}`)
      router.refresh()
    } catch (err) {
      console.error("Error updating avatar:", err)
      setError(err instanceof Error ? err.message : "Failed to update avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const removeSelectedImage = () => {
    setAvatarFile(null)
    setAvatarUrl(null)
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
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold tracking-tighter mb-6">Change Profile Picture</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                {avatarUrl ? (
                  <div className="relative">
                    <Image
                      src={avatarUrl || "/placeholder.svg"}
                      alt="Profile preview"
                      width={150}
                      height={150}
                      className="w-36 h-36 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <Camera size={36} className="text-white/50 mb-2" />
                    <p className="text-white/70 text-sm">Select an image</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  {avatarUrl ? "Choose another image" : "Choose an image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 justify-center">
              <button
                type="submit"
                disabled={isLoading || !avatarFile}
                className="px-5 py-3 text-base tracking-tight no-underline bg-white font-[560] rounded-[100px] text-black hover:bg-opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Uploading..." : "Save Profile Picture"}
              </button>

              <Link
                href="/profile/edit"
                className="px-5 py-3 text-base tracking-tight no-underline bg-white bg-opacity-10 font-[560] rounded-[100px] text-white hover:bg-opacity-20 transition-opacity"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
