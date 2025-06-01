import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
export const dynamic = 'force-dynamic'
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    // Get user ID from session or request
    // This is a placeholder - you would get the actual user ID from your auth system
    const userId = request.headers.get("x-user-id") || "anonymous"

    if (!userId || userId === "anonymous") {
      return NextResponse.json({ hasActiveSubscription: false })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check subscription status in your database
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ hasActiveSubscription: false })
    }

    // Check if subscription is active and not expired
    const isActive = data.status === "active" && new Date(data.current_period_end) > new Date()

    return NextResponse.json({ hasActiveSubscription: isActive })
  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json({ hasActiveSubscription: false })
  }
}
