import { redirect } from "next/navigation"
import { createClient } from "../../../../../../../supabase/server"
import Editor from "../../components/editor/editor"
import Script from "next/script"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditorPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Fetch the design
  const { data: design, error } = await supabase.from("designs").select("*").eq("id", params.id).single()

  if (error || !design) {
    return redirect("/dashboard")
  }

  // Log the design structure to help debug
  console.log("Design structure from Supabase:", Object.keys(design))

  return (
      <Editor design={design} />
  )
}
