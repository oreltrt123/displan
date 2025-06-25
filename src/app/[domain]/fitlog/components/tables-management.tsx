"use client"

import { useState } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Plus,
  Clock,
  Trash2,
  MoreVertical,
} from "lucide-react"
import { CreateTableDialog } from "./create-table-dialog"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import "@/app/dashboard/apps/website-builder/designer/styles/button.css"

interface TablesManagementProps {
  user: User
  initialTables: any[]
}

export function TablesManagement({ user, initialTables }: TablesManagementProps) {
  const [tables, setTables] = useState(initialTables)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const supabase = createClientComponentClient()

  const refreshTables = async () => {
    try {
      const { data } = await supabase
        .from("fitlog_weekly_tables")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setTables(data || [])
    } catch (error) {
      console.error("Error refreshing tables:", error)
    }
  }

  const deleteTable = async (tableId: string) => {
    if (
      !confirm("Are you sure you want to delete this table? This will also delete all associated daily plans and check-ins.")
    ) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("fitlog_weekly_tables")
        .delete()
        .eq("id", tableId)
        .eq("user_id", user.id)

      if (error) throw error

      await refreshTables()
    } catch (error) {
      console.error("Error deleting table:", error)
      alert("Error deleting table. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleTableStatus = async (tableId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("fitlog_weekly_tables")
        .update({ is_active: !currentStatus })
        .eq("id", tableId)
        .eq("user_id", user.id)

      if (error) throw error

      await refreshTables()
    } catch (error) {
      console.error("Error updating table status:", error)
      alert("Error updating table status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = (tableId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [tableId]: !prev[tableId],
    }))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB') // e.g., 22/06/2025
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Weekly Planning Tables
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your weekly fitness plans
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/fitlog">
              <button className="button_rrui">Back to Dashboard</button>
            </Link>
            <button onClick={() => setShowCreateDialog(true)} className="button_rrui1">
              Create New Table
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        {tables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => {
              const today = new Date().toISOString().split("T")[0]
              const isCurrentWeek = today >= table.start_date && today <= table.end_date
              const isPastWeek = today > table.end_date
              const isFutureWeek = today < table.start_date

              return (
                <Card key={table.id} className={`${!table.is_active ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{table.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {table.description || "No description provided"}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {isCurrentWeek && <Badge variant="default">Current</Badge>}
                          {isPastWeek && <Badge variant="secondary">Past</Badge>}
                          {isFutureWeek && <Badge variant="outline">Future</Badge>}
                          {!table.is_active && <Badge variant="destructive">Inactive</Badge>}
                          <button onClick={() => toggleMenu(table.id)} className="p-1 hover:bg-muted rounded">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        {openMenus[table.id] && (
                          <div className="menu_container">
                            <button
                              onClick={() => toggleTableStatus(table.id, table.is_active)}
                              disabled={loading}
                              className="menu_item"
                            >
                              {table.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => deleteTable(table.id)}
                              disabled={loading}
                              className="menu_item"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 cursor-pointer" onClick={() => window.location.href = `/tables/${table.id}`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDate(table.start_date)} - {formatDate(table.end_date)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Created: {formatDate(table.created_at)}</p>
                      <p>Last updated: {formatDate(table.updated_at)}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Planning Tables Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first weekly planning table to start organizing your fitness journey
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Table
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Table Dialog */}
        <CreateTableDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          userId={user.id}
          onSuccess={refreshTables}
        />
      </div>
    </div>
  )
}
