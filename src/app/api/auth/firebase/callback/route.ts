import type { NextRequest } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the projectId
    const error = searchParams.get("error")

    console.log("Firebase callback received:", {
      code: !!code,
      state,
      error,
      fullUrl: request.url,
    })

    if (error) {
      console.error("OAuth error:", error)
      return redirect(`/dashboard/apps/displan/editor/${state}/settings/keys?error=${error}`)
    }

    if (!code || !state) {
      console.error("Missing code or state:", { code: !!code, state })
      return redirect(`/dashboard/apps/displan/editor/${state || "unknown"}/settings/keys?error=missing_code`)
    }

    console.log("Attempting token exchange...")

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.FIREBASE_OAUTH_CLIENT_ID!,
        client_secret: process.env.FIREBASE_OAUTH_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/firebase/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log("Token exchange response:", {
      ok: tokenResponse.ok,
      status: tokenResponse.status,
      hasAccessToken: !!tokenData.access_token,
      error: tokenData.error,
    })

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData)
      return redirect(
        `/dashboard/apps/displan/editor/${state}/settings/keys?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`,
      )
    }

    if (!tokenData.access_token) {
      console.error("No access token received:", tokenData)
      return redirect(`/dashboard/apps/displan/editor/${state}/settings/keys?error=no_access_token`)
    }

    console.log("Token exchange successful, redirecting...")

    // Store the access token temporarily and redirect to success page
    return redirect(
      `/dashboard/apps/displan/editor/${state}/settings/keys?firebase_connected=true&access_token=${encodeURIComponent(tokenData.access_token)}`,
    )
  } catch (error) {
    console.error("Firebase callback error:", error)

    // Try to get state from URL for better error handling
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")

    if (state) {
      return redirect(
        `/dashboard/apps/displan/editor/${state}/settings/keys?error=callback_failed&details=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
      )
    } else {
      return redirect(`/dashboard/apps/displan?error=callback_failed`)
    }
  }
}
export const dynamic = "force-dynamic";
