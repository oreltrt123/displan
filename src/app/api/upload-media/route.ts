import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("project_id") as string
    const fileType = formData.get("file_type") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/ogg"],
    }

    const isValidType =
      fileType === "image" ? allowedTypes.image.includes(file.type) : allowedTypes.video.includes(file.type)

    if (!isValidType) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), "public", "uploads", projectId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${fileType}-${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate file URL
    const fileUrl = `/uploads/${projectId}/${filename}`

    // Here you would typically save to your database using the enhanced schema
    // For now, we'll return the file information
    const mediaData = {
      id: `media-${timestamp}`,
      project_id: projectId,
      filename: filename,
      original_name: file.name,
      file_path: filepath,
      file_url: fileUrl,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
      canvas_properties: {
        fit: fileType === "image" ? "cover" : "contain",
        border_radius: "8px",
        controls: fileType === "video" ? true : undefined,
      },
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      file_url: fileUrl,
      media_data: mediaData,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
