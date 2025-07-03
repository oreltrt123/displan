import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, query, connectionId, queryName } = body

    console.log("Executing SQL query:", { projectId, queryName, hasConnection: !!connectionId })

    if (!projectId || !query) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const startTime = Date.now()
    let result = null
    let error = null
    let status = "success"

    try {
      // Get connection config if connectionId is provided
      let connectionConfig = null
      if (connectionId) {
        const { data: connection } = await supabase
          .from("sql_editor_connections")
          .select("connection_config")
          .eq("id", connectionId)
          .single()

        connectionConfig = connection?.connection_config
        console.log("Using connection config:", !!connectionConfig)
      }

      // Execute the query
      if (connectionConfig?.url && connectionConfig?.key) {
        // Execute on user's Supabase instance
        console.log("Executing on user's Supabase instance")
        const userSupabase = createClient(connectionConfig.url, connectionConfig.key)

        // For safety, only allow SELECT queries on user databases
        const trimmedQuery = query.trim().toLowerCase()
        if (
          !trimmedQuery.startsWith("select") &&
          !trimmedQuery.startsWith("show") &&
          !trimmedQuery.startsWith("describe")
        ) {
          throw new Error("Only SELECT, SHOW, and DESCRIBE queries are allowed on external databases")
        }

        const { data, error: queryError } = await userSupabase.rpc("execute_sql", {
          query: query,
        })

        if (queryError) {
          throw queryError
        }
        result = data
      } else {
        // Execute on main database with restrictions
        console.log("Executing on main database")
        const trimmedQuery = query.trim().toLowerCase()

        // Allow only safe queries on main database
        if (
          trimmedQuery.startsWith("select") ||
          trimmedQuery.startsWith("show") ||
          trimmedQuery.startsWith("describe")
        ) {
          const { data, error: queryError } = await supabase.rpc("execute_sql", {
            query: query,
          })

          if (queryError) {
            throw queryError
          }
          result = data
        } else {
          throw new Error("Only SELECT, SHOW, and DESCRIBE queries are allowed")
        }
      }
    } catch (err: any) {
      console.error("Query execution error:", err)
      error = err.message
      status = "error"
      result = null
    }

    const executionTime = Date.now() - startTime

    // Save query to history
    const { data: savedQuery, error: saveError } = await supabase
      .from("sql_editor_queries")
      .insert({
        project_id: projectId,
        query_name: queryName || "Untitled Query",
        sql_query: query,
        query_result: result,
        execution_time: executionTime,
        status,
        error_message: error,
      })
      .select()
      .single()

    if (saveError) {
      console.error("Failed to save query:", saveError)
    }

    return NextResponse.json({
      result,
      error,
      status,
      executionTime,
      queryId: savedQuery?.id,
    })
  } catch (error) {
    console.error("SQL execution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
