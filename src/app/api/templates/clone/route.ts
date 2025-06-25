import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase_mesges"

export async function POST(request: NextRequest) {
  try {
    const { templateId, userId, userEmail, folderId } = await request.json()

    console.log("🎨 CLONING TEMPLATE:", {
      templateId,
      userId,
      userEmail,
      folderId,
    })

    // Call the SQL function to clone the template
    const { data, error } = await supabase.rpc("clone_template_to_project", {
      p_template_id: templateId,
      p_user_id: userId,
      p_user_email: userEmail,
      p_folder_id: folderId,
    })

    if (error) {
      console.error("❌ CLONE TEMPLATE ERROR:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }

    console.log("✅ TEMPLATE CLONED SUCCESSFULLY:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ CLONE TEMPLATE ROUTE ERROR:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to clone template",
    })
  }
}
