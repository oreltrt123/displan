"use client"

import { ArrowLeft } from 'lucide-react'

interface MenuElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function MenuTemplatesPanel({ onAddElement, onBack }: MenuElementsPanelProps) {
  const menuTemplates = [
    {
      id: "template_11",
      name: "Dirtny",
      preview: "/webbuild/17.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_12",
      name: "UI website",
      preview: "/webbuild/18.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_13",
      name: "UI website - Open-Source Web Template",
      preview: "/webbuild/19.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_14",
      name: "Link profile",
      preview: "/webbuild/20.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_15",
      name: "Link profile",
      preview: "/webbuild/21.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_16",
      name: "Scroll animation",
      preview: "/webbuild/22.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
    {
      id: "template_17",
      name: "Connect with Supabase",
      preview: "/webbuild/30.png",
      creator: "DisPlan",
      profileUrl: "/dashboard/profile/7807e9c2-1401-4043-b744-a68e80c4051e"
    },
        {
      id: "template_19",
      name: "Header menu",
      preview: "/webbuild/31.png",
      creator: "Gabi Shalmiev",
      profileUrl: "/dashboard/profile/254a756f-0a36-406c-b522-fcc2495c28f8"
    },
  ]

  const handleAddMenu = (templateId: string) => {
    if (onAddElement) {
      onAddElement(`menu-${templateId}`, 400, 300)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">Menu Templates</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[700px] pr-2">
        {menuTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleAddMenu(template.id)}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2"
          >
            <div className="flex flex-col">
              <img
                src={template.preview || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-auto object-cover rounded"
              />
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{template.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                By{" "}
                <a
                  href={template.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={(e) => e.stopPropagation()} // prevent triggering the template click
                >
                  {template.creator}
                </a>
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
