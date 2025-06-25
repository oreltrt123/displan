"use client"

import { ArrowLeft } from 'lucide-react'

interface MenuElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function MenuTemplatesPanel({ onAddElement, onBack }: MenuElementsPanelProps) {
  const menuTemplates = [
    { id: "template_11", name: "Dirtny", preview: "/webbuild/17.png" },
    { id: "template_12", name: "UI website", preview: "/webbuild/18.png" },
    { id: "template_13", name: "UI website - Open-Source Web Template", preview: "/webbuild/19.png" },
    { id: "template_14", name: "Link profile", preview: "/webbuild/20.png" },
    { id: "template_15", name: "Link profile", preview: "/webbuild/21.png" },
    { id: "template_16", name: "Scroll animation", preview: "/webbuild/22.png" },
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
            className="" 
          > 
            <div className="flex flex-col p-2">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-auto object-cover"
                />
                <br />
              <div className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}