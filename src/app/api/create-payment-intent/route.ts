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
    const { userId, projectId } = body

    if (userId !== user.id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 })
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5.00
      currency: "usd",
      metadata: {
        userId: user.id,
        projectId,
        plan: "ai_assistant",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
