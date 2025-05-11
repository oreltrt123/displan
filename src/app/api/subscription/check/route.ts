import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"
import { cookies } from "next/headers"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get the current user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isPremium: false, error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has premium subscription in the database
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking subscription:", error)
    }

    // Check if subscription is active and not expired
    const isDbPremium =
      !!subscription && subscription.current_period_end && new Date(subscription.current_period_end) > new Date()

    // Check if premium cookie is set
    const cookieStore = cookies()
    const isPremiumCookie = cookieStore.get("isPremium")
    const isCookiePremium = isPremiumCookie?.value === "true"

    // If either the database or cookie indicates premium status, consider the user premium
    const isPremium = isDbPremium || isCookiePremium

    // If the user is premium but the cookie is not set, set it
    if (isPremium && !isCookiePremium) {
      cookieStore.set("isPremium", "true", {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        httpOnly: false,
        sameSite: "lax",
      })
    }

    // Log the subscription status for debugging
    console.log("Subscription check:", {
      userId: user.id,
      isDbPremium,
      isCookiePremium,
      isPremium,
      subscription: subscription || null,
    })

    return NextResponse.json({
      isPremium,
      subscription:
        isPremium && subscription
          ? {
              plan: subscription.plan,
              expiresAt: subscription.current_period_end,
            }
          : null,
    })
  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json({ isPremium: false, error: "Failed to check subscription status" }, { status: 500 })
  }
}