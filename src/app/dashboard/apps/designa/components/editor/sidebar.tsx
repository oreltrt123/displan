
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, Image, Shapes } from "lucide-react";
import { ElementTemplate } from "../../types/canvas";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ElementsSidebarProps {
  onAddElement: (element: ElementTemplate) => void;
}

export function ElementsSidebar({ onAddElement }: ElementsSidebarProps) {
  // Text element templates
  const textElements = [
    { id: "heading", name: "Heading", content: "Heading" },
    { id: "subheading", name: "Subheading", content: "Subheading" },
    { id: "paragraph", name: "Paragraph", content: "Add your text here" },
    { id: "quote", name: "Quote", content: "A meaningful quote" },
    { id: "caption", name: "Caption", content: "Image caption" },
  ];

  // Image element templates
  const imageElements = [
    {
      id: "image-1",
      name: "Nature",
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80",
    },
    {
      id: "image-2",
      name: "City",
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
    },
    {
      id: "image-3",
      name: "Abstract",
      src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
    },
    {
      id: "image-4",
      name: "People",
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    },
  ];

  // Shape element templates
  const shapeElements = [
    { id: "rectangle", name: "Rectangle", shapeType: "rectangle" },
    { id: "circle", name: "Circle", shapeType: "circle" },
    { id: "triangle", name: "Triangle", shapeType: "triangle" },
  ];

  return (
    <div className="w-16 border-r bg-sidebar flex flex-col text-sidebar-foreground">
      <Tabs defaultValue="text" orientation="vertical" className="h-full flex flex-col">
        <TabsList className="bg-transparent flex flex-col h-auto items-center justify-start gap-1 pt-4">
          <TabsTrigger 
            value="text" 
            className="w-12 h-12 data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Type className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Text</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text Elements</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          
          <TabsTrigger 
            value="images" 
            className="w-12 h-12 data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Image className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Images</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Add Images</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          
          <TabsTrigger 
            value="shapes" 
            className="w-12 h-12 data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Shapes className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Shapes</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Add Shapes</TooltipContent>
            </Tooltip>
          </TabsTrigger>
        </TabsList>

        <div className="bg-white border-l border-r w-64 h-full absolute left-16 top-0 pt-16 overflow-hidden transition-all">
          <ScrollArea className="h-full">
            <div className="p-4">
              <TabsContent value="text" className="space-y-2 mt-0">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Text Elements</h3>
                {textElements.map((element) => (
                  <Button
                    key={element.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 hover:border-primary"
                    onClick={() => 
                      onAddElement({ 
                        type: "text", 
                        name: element.name, 
                        content: element.content
                      })
                    }
                  >
                    <div>
                      <div className={element.id === "heading" ? "text-lg font-bold" : 
                                    element.id === "subheading" ? "text-base font-semibold" :
                                    element.id === "quote" ? "text-sm italic" :
                                    element.id === "caption" ? "text-xs" : ""}>
                        {element.name}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Click to add</p>
                    </div>
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="images" className="space-y-2 mt-0">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Images</h3>
                {imageElements.map((element) => (
                  <Button
                    key={element.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-0 overflow-hidden flex flex-col hover:border-primary"
                    onClick={() => 
                      onAddElement({ 
                        type: "image", 
                        name: element.name, 
                        src: element.src 
                      })
                    }
                  >
                    <div className="w-full h-24 overflow-hidden">
                      <img
                        src={element.src}
                        alt={element.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 w-full">
                      <p className="text-sm">{element.name}</p>
                    </div>
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="shapes" className="space-y-2 mt-0">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Shapes</h3>
                {shapeElements.map((element) => (
                  <Button
                    key={element.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 hover:border-primary"
                    onClick={() => 
                      onAddElement({ 
                        type: "shape", 
                        name: element.name, 
                        shapeType: element.shapeType as any
                      })
                    }
                  >
                    <div className="flex items-center gap-3">
                      {element.shapeType === "rectangle" && (
                        <div className="w-8 h-8 bg-blue-500 rounded-sm"></div>
                      )}
                      {element.shapeType === "circle" && (
                        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                      )}
                      {element.shapeType === "triangle" && (
                        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-b-[28px] border-b-purple-500 border-r-[16px] border-r-transparent"></div>
                      )}
                      <span>{element.name}</span>
                    </div>
                  </Button>
                ))}
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}