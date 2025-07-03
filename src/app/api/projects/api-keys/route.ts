import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received API key creation request:", body)

    const { projectId, provider, externalProjectId, projectName, config, isManual = false } = body

    // Validate required fields
    if (!projectId || !provider || !projectName) {
      console.error("Missing required fields:", { projectId, provider, projectName })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure config is an object
    const configData = config || {}

    console.log("Inserting API key config:", {
      project_id: projectId,
      provider,
      external_project_id: externalProjectId,
      project_name: projectName,
      config: configData,
      is_connected: !isManual,
      is_manual: isManual,
    })

    // Create API key configuration
    const { data: apiKey, error } = await supabase
      .from("api_keys_config")
      .insert({
        project_id: projectId,
        provider,
        external_project_id: externalProjectId,
        project_name: projectName,
        config: configData,
        is_connected: !isManual,
        is_manual: isManual,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error creating API key:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("Successfully created API key:", apiKey)
    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error("Unexpected error in API key creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
