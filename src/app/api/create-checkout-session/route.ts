import { NextResponse } from "next/server"
import { createClient } from "../../../../supabase/server"
import Stripe from "stripe"

// Initialize Stripe with the secret key
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
    const { projectId } = body

    // Get the origin for success and cancel URLs
    const origin = request.headers.get("origin") || "http://localhost:3000"

    // Create a Stripe customer if one doesn't exist
    let customerId: string

    // Check if user already has a Stripe customer ID
    const { data: customerData } = await supabase
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .single()

    if (customerData?.customer_id) {
      customerId = customerData.customer_id
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Save the customer ID to the database
      await supabase.from("stripe_customers").insert({
        user_id: user.id,
        customer_id: customerId,
        created_at: new Date().toISOString(),
      })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AI Assistant Subscription",
              description: "Monthly subscription to the AI Design Assistant",
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard/apps/website-builder/designer/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/apps/website-builder/designer/edit/${projectId}`,
      metadata: {
        user_id: user.id,
        project_id: projectId,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
