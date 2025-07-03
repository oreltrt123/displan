import type { NextRequest } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the projectId
    const error = searchParams.get("error")

    console.log("Supabase callback received:", { code: !!code, state, error })

    if (error) {
      console.error("OAuth error:", error)
      return redirect(`/dashboard/projects/${state}/settings?error=${error}`)
    }

    if (!code || !state) {
      console.error("Missing code or state")
      return redirect(`/dashboard/projects/${state}/settings?error=missing_code`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.supabase.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.SUPABASE_OAUTH_CLIENT_ID!,
        client_secret: process.env.SUPABASE_OAUTH_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/supabase/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log("Token exchange response:", tokenResponse.ok ? "Success" : "Failed")

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData)
      return redirect(`/dashboard/projects/${state}/settings?error=token_exchange_failed`)
    }

    // Store the access token in a secure way (you might want to encrypt this)
    // For now, we'll redirect with success and let the frontend handle project fetching
    return redirect(
      `/dashboard/projects/${state}/settings?supabase_connected=true&access_token=${tokenData.access_token}`,
    )
  } catch (error) {
    console.error("Supabase callback error:", error)
    return redirect(`/dashboard/projects/settings?error=callback_failed`)
  }
}
export const dynamic = "force-dynamic";
