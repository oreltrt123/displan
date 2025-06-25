import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log("🏪 LOADING MARKETPLACE:", { category, search, limit, offset })

    const { data, error } = await supabase.rpc("get_marketplace_working", {
      p_category: category,
      p_search: search,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) {
      console.error("❌ MARKETPLACE ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ MARKETPLACE LOADED!")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to get marketplace" }, { status: 500 })
  }
}

// 👇 This line prevents the static generation error
export const dynamic = "force-dynamic"
