"use client"

import type { User } from "@supabase/supabase-js"
import { Button } from "./ui/button"
import { CheckCircle2 } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { supabase } from "../../supabase/supabase"

export default function PricingCard({
  item,
  user,
}: {
  item: any
  user: User | null
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing"
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke("supabase-functions-create-checkout", {
        body: {
          price_id: priceId,
          user_id: user.id,
          return_url: `${window.location.origin}/dashboard`,
        },
        headers: {
          "X-Customer-Email": user.email || "",
        },
      })

      if (error) {
        throw error
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  // Mock features for each plan
  const features = {
    basic: ["Up to 5 active projects", "Basic collaboration tools", "Standard support", "7-day payment protection"],
    pro: [
      "Unlimited active projects",
      "Advanced collaboration tools",
      "Priority support",
      "30-day payment protection",
      "Custom project templates",
    ],
    enterprise: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "90-day payment protection",
      "Enterprise-grade security",
    ],
  }

  // Determine which feature set to use based on price
  const getFeatures = () => {
    const amount = item?.amount || 0
    if (amount <= 1000) return features.basic
    if (amount <= 3000) return features.pro
    return features.enterprise
  }

  return (
    <Card
      className={`relative overflow-hidden bg-gray-800 border-gray-700 ${item.popular ? "border-2 border-purple-500 shadow-xl scale-105" : ""}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div
            className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-fit mb-4"
            data-i18n="mostPopular"
          >
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-white">{item.name}</CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-white">${item?.amount / 100}</span>
          <span className="text-gray-400">/{item?.interval}</span>
        </CardDescription>

        <div className="mt-6 space-y-3">
          {getFeatures().map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm" data-i18n={`feature${index + 1}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id)
          }}
          className={`w-full py-6 text-lg font-medium ${item.popular ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90" : "bg-gray-700 hover:bg-gray-600"}`}
          data-i18n="getStarted"
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}
