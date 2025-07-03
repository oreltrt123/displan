import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    console.log("Creating Firebase auth URL for project:", projectId)

    // Firebase uses Google OAuth for project access
    const firebaseAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    firebaseAuthUrl.searchParams.set("client_id", process.env.FIREBASE_OAUTH_CLIENT_ID!)
    // Fixed: Use correct redirect URI
    firebaseAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/firebase/callback`)
    firebaseAuthUrl.searchParams.set("response_type", "code")
    firebaseAuthUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/cloud-platform",
    )
    firebaseAuthUrl.searchParams.set("access_type", "offline")
    firebaseAuthUrl.searchParams.set("state", projectId)
    firebaseAuthUrl.searchParams.set("prompt", "consent") // Force consent screen

    console.log("Generated Firebase auth URL:", firebaseAuthUrl.toString())

    return NextResponse.json({ authUrl: firebaseAuthUrl.toString() })
  } catch (error) {
    console.error("Error creating Firebase auth URL:", error)
    return NextResponse.json({ error: "Failed to create auth URL" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
