"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../../../supabase/client"
import type { CreateDesignFormData } from "../types/design"
import { PlusCircle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateDesignDialogProps {
  children?: ReactNode
}

export default function CreateDesignDialog({ children }: CreateDesignDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateDesignFormData>({
    name: "",
    description: "",
    template: "blank",
  })
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, template: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      // Get template content based on selection
      let templateContent = {}
      if (formData.template === "landing") {
        templateContent = { type: "landing", sections: [] }
      } else if (formData.template === "portfolio") {
        templateContent = { type: "portfolio", sections: [] }
      }

      const { data, error } = await supabase
        .from("designs")
        .insert({
          name: formData.name,
          description: formData.description,
          user_id: user.id,
          content: templateContent,
          status: "Draft",
        })
        .select()
        .single()

      if (error) throw error

      // Close dialog and refresh page to show new design
      setOpen(false)
      router.refresh()

      // Optionally redirect to the editor page
      // router.push(`/editor/${data.id}`);
    } catch (error) {
      console.error("Error creating design:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Design
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription>Give your design a name and description to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Design"
                required
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief description of your design"
                rows={3}
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template">Template</Label>
              <Select value={formData.template} onValueChange={handleTemplateChange}>
                <SelectTrigger id="template" className="focus-visible:ring-primary">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">Blank Canvas</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? "Creating..." : "Create Design"}
              {!isLoading && <PlusCircle className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
