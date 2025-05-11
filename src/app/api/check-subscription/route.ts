import { NextResponse } from "next/server"
import { createClient } from "../../../../supabase/server"

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

    // Check if user has premium subscription
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking subscription:", error)
      return NextResponse.json({ isPremium: false, error: "Failed to check subscription status" }, { status: 500 })
    }

    // Check if subscription is active and not expired
    const isPremium =
      !!subscription && subscription.current_period_end && new Date(subscription.current_period_end) > new Date()

    return NextResponse.json({
      isPremium,
      subscription: isPremium
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