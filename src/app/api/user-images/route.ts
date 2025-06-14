import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Load user images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Missing projectId" }, { status: 400 })
    }

    console.log("Loading user images for project:", projectId)

    // Query the database for user images
    const { data, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to load images" }, { status: 500 })
    }

    // Transform the data to match our interface
    const images = data.map((img) => ({
      id: img.id,
      url: img.storage_url,
      name: img.original_name,
      size: img.file_size,
      uploadedAt: img.created_at,
    }))

    console.log("Loaded", images.length, "images")

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error loading user images:", error)
    return NextResponse.json({ success: false, error: "Failed to load images" }, { status: 500 })
  }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const projectId = formData.get("projectId") as string

    if (!image || !projectId) {
      return NextResponse.json({ success: false, error: "Missing image or projectId" }, { status: 400 })
    }

    console.log("Uploading image:", image.name, "for project:", projectId)

    // Validate file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = image.name.split(".").pop()
    const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-images")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("user-images").getPublicUrl(fileName)

    if (!urlData.publicUrl) {
      return NextResponse.json({ success: false, error: "Failed to get image URL" }, { status: 500 })
    }

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from("user_images")
      .insert({
        project_id: projectId,
        user_id: null, // You can add user authentication later
        original_name: image.name,
        file_name: fileName,
        file_size: image.size,
        mime_type: image.type,
        storage_url: urlData.publicUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      // Try to clean up uploaded file
      await supabase.storage.from("user-images").remove([fileName])
      return NextResponse.json({ success: false, error: "Failed to save image metadata" }, { status: 500 })
    }

    const imageRecord = {
      id: dbData.id,
      url: dbData.storage_url,
      name: dbData.original_name,
      size: dbData.file_size,
      uploadedAt: dbData.created_at,
    }

    console.log("Image uploaded successfully:", imageRecord)

    return NextResponse.json({
      success: true,
      image: imageRecord,
      message: "Image uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 })
  }
}
