import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"
import { createInvitationEmailTemplate } from "./email-template"

export async function POST(request: NextRequest) {
  try {
    const { email, token, boardId, role, boardName } = await request.json()

    const supabase = await getSupabaseClient()

    // Get current user info
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create the invitation URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`

    // Create email template
    const emailTemplate = createInvitationEmailTemplate(boardName, role, inviteUrl, user.email || "Unknown")

    // Send email using Supabase Auth admin
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        invitation_type: "board_collaboration",
        board_id: boardId,
        role: role,
        board_name: boardName,
        invite_url: inviteUrl,
        custom_subject: emailTemplate.subject,
        custom_html: emailTemplate.html,
        custom_text: emailTemplate.text,
      },
      redirectTo: inviteUrl,
    })

    if (error) {
      console.error("Failed to send invitation email:", error)
      return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in send-invitation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
