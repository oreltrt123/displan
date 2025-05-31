import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const uploadType = formData.get("uploadType") as string // 'favicon_light', 'favicon_dark', 'social_preview'

    if (!file || !projectId || !uploadType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Create a unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uploadType}_${projectId}_${Date.now()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("project-assets")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("project-assets").getPublicUrl(fileName)

    // Save file info to database
    const { error: dbError } = await supabase.from("displan_uploaded_files").insert({
      project_id: projectId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_url: publicUrl,
      upload_type: uploadType,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Don't fail the request if DB insert fails, file is already uploaded
    }

    // Update the project with the new URL
    const updateField = `${uploadType}_url`
    const { error: updateError } = await supabase
      .from("displan_project_designer_css_projects")
      .update({ [updateField]: publicUrl })
      .eq("id", projectId)
      .eq("owner_id", user.id)

    if (updateError) {
      console.error("Project update error:", updateError)
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
