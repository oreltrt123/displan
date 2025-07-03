import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get("access_token")

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 })
    }

    // Fetch user's Supabase projects using the Management API
    const response = await fetch("https://api.supabase.com/v1/projects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch Supabase projects:", response.status)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: response.status })
    }

    const projects = await response.json()
    console.log("Fetched Supabase projects:", projects.length)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching Supabase projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
