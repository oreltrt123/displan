import { NextResponse } from "next/server"
import { createClient } from "../../../../supabase/server"
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
    const { sessionId, userId } = body

    // For debugging
    console.log("Verifying subscription:", { sessionId, userId, currentUser: user.id })

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log("Stripe session:", {
      id: session.id,
      paymentStatus: session.payment_status,
      customerId: session.customer,
      subscriptionId: session.subscription,
    })

    // Verify that the session was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get the subscription ID
    const subscriptionId = session.subscription as string

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    console.log("Stripe subscription:", {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    })

    // Check if subscription already exists in database
    const { data: existingSubscription, error: queryError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("subscription_id", subscriptionId)
      .single()

    if (queryError && queryError.code !== "PGRST116") {
      console.error("Error checking existing subscription:", queryError)
    }

    // Calculate expiration date
    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

    if (existingSubscription) {
      console.log("Updating existing subscription:", existingSubscription.id)
      // Update existing subscription
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          status: "active",
          current_period_end: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id)

      if (updateError) {
        console.error("Error updating subscription:", updateError)
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
      }
    } else {
      console.log("Creating new subscription for user:", user.id)
      // Add subscription to database
      const { error: insertError } = await supabase.from("user_subscriptions").insert([
        {
          user_id: user.id,
          status: "active",
          subscription_id: subscriptionId,
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

    console.log("Subscription verification successful, cookie set")

    // Return success
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscriptionId,
        plan: "ai_assistant",
        current_period_end: expiresAt,
      },
    })
  } catch (error) {
    console.error("Error verifying subscription:", error)
    return NextResponse.json({ error: "Failed to verify subscription" }, { status: 500 })
  }
}
