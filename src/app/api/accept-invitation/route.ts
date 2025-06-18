import { supabase } from "@/lib/supabase-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, type, userEmail, userId } = await request.json()

    console.log("Processing invitation:", { token: token.substring(0, 10) + "...", type, userEmail, userId })

    if (!userEmail || !userId) {
      return NextResponse.json({ success: false, message: "User information missing" }, { status: 400 })
    }

    if (type === "collaborator") {
      // Handle collaborator invitation
      const { data, error } = await supabase.rpc("accept_folder_invitation", {
        p_invite_token: token,
        p_user_id: userId,
      })

      if (error) {
        console.error("Error accepting collaborator invitation:", error)
        return NextResponse.json({ success: false, message: "Failed to accept invitation" }, { status: 500 })
      }

      const result = data[0]
      if (!result || !result.success) {
        return NextResponse.json({ success: false, message: result?.message || "Invalid invitation" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: "Successfully joined the folder!",
        folderId: result.folder_id,
      })
    } else if (type === "invite_link") {
      // Handle invite link
      const { data: inviteLink, error: linkError } = await supabase
        .from("displan_invite_links")
        .select("*")
        .eq("token", token)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())
        .single()

      if (linkError || !inviteLink) {
        console.error("Invite link error:", linkError)
        return NextResponse.json({ success: false, message: "Invalid or expired invite link" }, { status: 400 })
      }

      // Check if user is already a collaborator
      const { data: existingCollab } = await supabase
        .from("displan_folder_collaborators")
        .select("*")
        .eq("folder_id", inviteLink.folder_id)
        .eq("user_email", userEmail)
        .single()

      if (existingCollab) {
        return NextResponse.json(
          {
            success: true,
            message: "You are already a member of this folder",
            folderId: inviteLink.folder_id,
          },
          { status: 200 },
        )
      }

      // Add user as collaborator
      const { error: insertError } = await supabase.from("displan_folder_collaborators").insert({
        folder_id: inviteLink.folder_id,
        user_email: userEmail,
        user_id: userId,
        role: inviteLink.role,
        status: "accepted",
        invited_by: inviteLink.created_by,
        invite_token: token,
      })

      if (insertError) {
        console.error("Error adding collaborator:", insertError)
        return NextResponse.json({ success: false, message: "Failed to join folder" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Successfully joined the folder!",
        folderId: inviteLink.folder_id,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid invitation type" }, { status: 400 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
