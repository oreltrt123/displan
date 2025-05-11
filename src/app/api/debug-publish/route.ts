import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Debug endpoint for publish API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json()

    // Return debug information
    return NextResponse.json({
      message: "Debug information for publish API",
      receivedData: body,
      headers: Object.fromEntries(request.headers),
      method: request.method,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error in debug endpoint",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
