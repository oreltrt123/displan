import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, connectionName, connectionConfig } = body

    console.log("Creating connection:", { projectId, connectionName })

    const { data: connection, error } = await supabase
      .from("sql_editor_connections")
      .insert({
        project_id: projectId,
        connection_name: connectionName,
        connection_config: connectionConfig,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating connection:", error)
      return NextResponse.json({ error: "Failed to create connection" }, { status: 500 })
    }

    return NextResponse.json({ connection })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
