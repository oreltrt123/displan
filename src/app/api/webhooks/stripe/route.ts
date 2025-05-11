import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"
import Stripe from "stripe"
import { headers } from "next/headers"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-01-27.acacia",
})

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: Request) {
  const payload = await request.text()
  const headersList = headers()
  const sig = headersList.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  const supabase = createClient()

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Skip if this is not a subscription
        if (session.mode !== "subscription") break

        const subscriptionId = session.subscription as string
        const userId = session.metadata?.user_id

        if (!userId || !subscriptionId) {
          console.error("Missing user_id or subscription_id in session metadata")
          break
        }

        // Retrieve the subscription
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // Calculate expiration date
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("subscription_id", subscriptionId)
          .single()

        if (existingSubscription) {
          // Update existing subscription
          await supabase
            .from("user_subscriptions")
            .update({
              status: subscription.status === "active" ? "active" : "inactive",
              current_period_end: expiresAt,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSubscription.id)
        } else {
          // Create new subscription
          await supabase.from("user_subscriptions").insert([
            {
              user_id: userId,
              status: subscription.status === "active" ? "active" : "inactive",
              subscription_id: subscriptionId,
              plan: "ai_assistant",
              current_period_end: expiresAt,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Find the user by customer ID
        const { data: customerData } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("customer_id", subscription.customer as string)
          .single()

        if (!customerData) {
          console.error("No customer found for subscription:", subscription.id)
          break
        }

        // Calculate expiration date
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

        // Update subscription in database
        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status === "active" ? "active" : "inactive",
            current_period_end: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("subscription_id", subscription.id)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status in database
        await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("subscription_id", subscription.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
