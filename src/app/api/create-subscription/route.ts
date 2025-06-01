import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Initialize Supabase client (only if credentials are provided)
let supabase: any = null
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function POST(request: Request) {
  try {
    const { paymentMethodId, userEmail, projectId } = await request.json()
    const userId = request.headers.get("x-user-id")

    console.log("=== Creating Subscription ===")
    console.log("User ID:", userId)
    console.log("Email:", userEmail)
    console.log("Payment Method ID:", paymentMethodId)

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    // Step 1: Create or find customer
    let customer: Stripe.Customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
        console.log("Found existing customer:", customer.id)
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            userId: userId,
            projectId: projectId || "",
          },
        })
        console.log("Created new customer:", customer.id)
      }
    } catch (error) {
      console.error("Customer creation error:", error)
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
    }

    // Step 2: Attach payment method
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      })

      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
      console.log("Payment method attached successfully")
    } catch (error) {
      console.error("Payment method attachment error:", error)
      return NextResponse.json({ error: "Failed to attach payment method" }, { status: 500 })
    }

    // Step 3: Create or get price
    let priceId: string
    try {
      // First, let's create a price if it doesn't exist
      const prices = await stripe.prices.list({
        product: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID,
        active: true,
        limit: 1,
      })

      if (prices.data.length > 0) {
        priceId = prices.data[0].id
        console.log("Found existing price:", priceId)
      } else {
        // Create a new price
        const price = await stripe.prices.create({
          product: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID,
          unit_amount: 500, // $5.00 in cents
          currency: "usd",
          recurring: {
            interval: "month",
          },
        })
        priceId = price.id
        console.log("Created new price:", priceId)
      }
    } catch (error) {
      console.error("Price creation/retrieval error:", error)
      return NextResponse.json({ error: "Failed to get pricing information" }, { status: 500 })
    }

    // Step 4: Create subscription
    let subscription: Stripe.Subscription
    try {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: userId,
          projectId: projectId || "",
        },
      })

      console.log("Subscription created successfully:", subscription.id)
    } catch (error) {
      console.error("Subscription creation error:", error)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Step 5: Store in database (optional)
    if (supabase) {
      try {
        await supabase.from("ai_subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        console.log("Subscription stored in database")
      } catch (dbError) {
        console.error("Database error (non-critical):", dbError)
      }
    }

    // Step 6: Handle payment
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent

    if (paymentIntent.status === "requires_action") {
      return NextResponse.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
      })
    }

    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        customerId: customer.id,
      })
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      customerId: customer.id,
    })
  } catch (error) {
    console.error("=== SUBSCRIPTION CREATION FAILED ===")
    console.error("Error details:", error)
    return NextResponse.json(
      {
        error: "Failed to create subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
