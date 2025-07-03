import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          error: "Template ID is required",
        },
        { status: 400 },
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_template_reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({
        p_template_id: templateId,
      }),
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      reviews: result.reviews || [],
    })
  } catch (error) {
    console.error("❌ Error fetching reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { templateId, reviewerId, reviewerEmail, rating, reviewText } = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/add_template_review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({
        p_template_id: templateId,
        p_reviewer_id: reviewerId,
        p_reviewer_email: reviewerEmail,
        p_rating: rating,
        p_review_text: reviewText,
      }),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Review added successfully!",
      })
    } else {
      throw new Error(result.error || "Failed to add review")
    }
  } catch (error) {
    console.error("❌ Error adding review:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add review",
      },
      { status: 500 },
    )
  }
}
