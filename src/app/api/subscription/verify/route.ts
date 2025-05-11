import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"
import Stripe from "stripe"
import { cookies } from "next/headers"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
})

export async function POST(request: Request) {
  try {
    // Get the current user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    // Verify the session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 })
    }

    // Get the subscription from the session
    const subscription = session.subscription as Stripe.Subscription

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found in session" }, { status: 400 })
    }

    // Calculate expiration date (end of current period)
    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

    // Check if subscription already exists in database
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          status: "active",
          subscription_id: subscription.id,
          current_period_end: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id)

      if (updateError) {
        console.error("Error updating subscription:", updateError)
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
      }
    } else {
      // Add new subscription to database
      const { error: insertError } = await supabase.from("user_subscriptions").insert([
        {
          user_id: user.id,
          status: "active",
          subscription_id: subscription.id,
          plan: "ai_assistant",
          current_period_end: expiresAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        console.error("Error adding subscription to database:", insertError)
        return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
      }
    }

    // Set a cookie to persist the subscription status
    const cookieStore = cookies()
    cookieStore.set("isPremium", "true", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      httpOnly: false, // Allow JavaScript access
      sameSite: "lax",
    })

    // Return success
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: "ai_assistant",
        current_period_end: expiresAt,
      },
    })
  } catch (error) {
    console.error("Error verifying subscription:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify subscription" },
      { status: 500 },
    )
  }
}
