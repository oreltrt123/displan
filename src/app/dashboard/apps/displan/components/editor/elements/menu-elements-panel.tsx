"use client"

import { ArrowLeft } from 'lucide-react'

interface MenuElementsPanelProps {
  onAddElement?: (elementType: string, x: number, y: number) => void
  onBack?: () => void
}

export function MenuElementsPanel({ onAddElement, onBack }: MenuElementsPanelProps) {
  const menuTemplates = [
    { id: "template-1", name: "Meet our leadership", preview: "/webbuild/template-1.png" },
    { id: "template-2", name: "Menu DisPlan", preview: "/webbuild/template-2.png" },
    { id: "empty-0", name: "From the blog", preview: "/webbuild/empty-0.png" }, 
    { id: "empty-1", name: "Contact sales", preview: "/webbuild/empty-1.png" }, 
    { id: "empty-2", name: "Join us DisPlan Template", preview: "/webbuild/empty-3.png" }, 
    { id: "empty-3", name: "Everything you need DisPlan", preview: "/webbuild/empty-4.png" }, 
    { id: "empty-4", name: "Data to enrich", preview: "/webbuild/empty-5.png" }, 
    { id: "empty-5", name: "Choose your DisPlan", preview: "/webbuild/empty-6.png" }, 
    { id: "empty-6", name: "Select filter", preview: "/webbuild/24.png" }, 
    // { id: "empty-7", name: "Select filter", preview: "/webbuild/empty-699.png" }, 
    { id: "empty-8", name: "Social Links Demo", preview: "/webbuild/23.png" }, 
    { id: "empty-9", name: "Flip Links", preview: "/webbuild/25.png" }, 
    { id: "empty-11", name: "AI Voice Input", preview: "/webbuild/26.png" }, 
    { id: "empty-12", name: "Testimonials Columns", preview: "/webbuild/27.png" }, 
    { id: "empty-13", name: "Text Generate Effect", preview: "/webbuild/28.png" }, 
    { id: "empty-14", name: "Text Generate Effect", preview: "/webbuild/29.png" }, 
    { id: "empty-15", name: "Text Generate Effect", preview: "/webbuild/29.png" }, 
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