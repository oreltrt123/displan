import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { templateId, userId, userEmail, newProjectId } = await request.json()

    console.log("🎨 Cloning template:", { templateId, userId, newProjectId })

    // Here you would typically:
    // 1. Fetch the original template/project data
    // 2. Clone all elements, pages, and settings
    // 3. Generate new unique IDs for everything
    // 4. Save the cloned project to database

    // For now, we'll simulate the cloning process
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/clone_template_project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({
        p_template_id: templateId,
        p_cloner_user_id: userId,
        p_cloner_email: userEmail,
        p_new_project_id: newProjectId,
      }),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        newProjectId,
        templateName: result.template_name || "Cloned Template",
        message: "Template cloned successfully!",
      })
    } else {
      throw new Error(result.error || "Failed to clone template")
    }
  } catch (error) {
    console.error("❌ Template cloning error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to clone template",
      },
      { status: 500 },
    )
  }
}
