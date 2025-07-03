import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get("access_token")

    console.log("Fetching Firebase projects with token:", !!accessToken)

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 })
    }

    // Fetch user's Firebase projects
    const response = await fetch("https://firebase.googleapis.com/v1beta1/projects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Firebase API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to fetch Firebase projects:", response.status, errorText)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: response.status })
    }

    const data = await response.json()
    const projects = data.projects || []
    console.log("Fetched Firebase projects:", projects.length)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching Firebase projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
