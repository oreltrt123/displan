import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    // For Supabase, we'll use their Management API OAuth
    // First, redirect to get access token
    const supabaseAuthUrl = new URL("https://api.supabase.com/v1/oauth/authorize")
    supabaseAuthUrl.searchParams.set("client_id", process.env.SUPABASE_OAUTH_CLIENT_ID!)
    supabaseAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/supabase/callback`)
    supabaseAuthUrl.searchParams.set("response_type", "code")
    supabaseAuthUrl.searchParams.set("scope", "all")
    supabaseAuthUrl.searchParams.set("state", projectId)

    console.log("Generated Supabase auth URL:", supabaseAuthUrl.toString())

    return NextResponse.json({ authUrl: supabaseAuthUrl.toString() })
  } catch (error) {
    console.error("Error creating Supabase auth URL:", error)
    return NextResponse.json({ error: "Failed to create auth URL" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
