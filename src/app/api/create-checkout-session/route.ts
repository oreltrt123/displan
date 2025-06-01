import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    // Get user ID from request headers
    const userId = request.headers.get("x-user-id")
    const userEmail = request.headers.get("x-user-email")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("Creating checkout session for user:", userId)

    // First, get the product to find its default price
    const product = await stripe.products.retrieve(productId)

    if (!product.default_price) {
      return NextResponse.json({ error: "Product has no default price" }, { status: 400 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.default_price as string,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?subscription=cancelled`,
      client_reference_id: userId,
      customer_email: userEmail || undefined,
      subscription_data: {
        metadata: {
          userId: userId,
          productId: productId,
        },
      },
      metadata: {
        userId: userId,
        productId: productId,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    console.log("Checkout session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
