import { useState, useEffect } from "react";
import { CanvasElement, TextElement, ImageElement, ShapeElement } from "../../types/canvas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ChevronDown, 
  ChevronUp, 
  RotateCw, 
  Palette
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (updates: Partial<CanvasElement>) => void;
}

export function PropertiesPanel({ 
  selectedElement, 
  onUpdateElement
}: PropertiesPanelProps) {
  const [color, setColor] = useState("#000000"); // Default text color
  const [bgColor, setBgColor] = useState("#3b82f6"); // Default background color

  // Initialize color state when selected element changes
  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.type === "text") {
        setColor(selectedElement.fontColor || "#000000");
      } else if (selectedElement.type === "shape") {
        setBgColor(selectedElement.backgroundColor || "#3b82f6");
      }
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="w-64 border-l border-gray-200 bg-white p-4">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
          <p>No element selected</p>
          <p className="text-xs mt-2">Click on an element to edit its properties</p>
        </div>
      </div>
    );
  }

  // Common properties section
  const renderCommonProperties = () => {
    return (
      <AccordionItem value="position">
        <AccordionTrigger className="text-sm">Position & Size</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs" htmlFor="element-x">X Position</Label>
                <Input 
                  id="element-x"
                  type="number" 
                  value={Math.round(selectedElement.x)} 
                  onChange={(e) => onUpdateElement({ x: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="element-y">Y Position</Label>
                <Input 
                  id="element-y"
                  type="number" 
                  value={Math.round(selectedElement.y)} 
                  onChange={(e) => onUpdateElement({ y: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs" htmlFor="element-width">Width</Label>
                <Input 
                  id="element-width"
                  type="number" 
                  value={Math.round(selectedElement.width)} 
                  onChange={(e) => {
                    const width = parseFloat(e.target.value);
                    if (width >= 10) onUpdateElement({ width });
                  }}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="element-height">Height</Label>
                <Input 
                  id="element-height"
                  type="number" 
                  value={Math.round(selectedElement.height)} 
                  onChange={(e) => {
                    const height = parseFloat(e.target.value);
                    if (height >= 10) onUpdateElement({ height });
                  }}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs" htmlFor="element-opacity">Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(selectedElement.opacity * 100)}%
                </span>
              </div>
              <Slider 
                id="element-opacity"
                min={0}
                max={1}
                step={0.01}
                value={[selectedElement.opacity]}
                onValueChange={([opacity]) => onUpdateElement({ opacity })}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs" htmlFor="element-rotation">Rotation</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(selectedElement.rotation || 0)}°
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Slider 
                  id="element-rotation"
                  min={0}
                  max={359}
                  step={1}
                  value={[selectedElement.rotation || 0]}
                  onValueChange={([rotation]) => onUpdateElement({ rotation })}
                  className="flex-1"
                />
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateElement({ rotation: 0 })}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Layer</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onUpdateElement({ zIndex: selectedElement.zIndex + 1 })}
                >
                  <ChevronUp className="h-3.5 w-3.5 mr-1" /> Bring Forward
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onUpdateElement({ zIndex: Math.max(0, selectedElement.zIndex - 1) })}
                >
                  <ChevronDown className="h-3.5 w-3.5 mr-1" /> Send Back
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Text-specific properties section
  const renderTextProperties = () => {
    if (selectedElement.type !== "text") return null;
    
    const textElement = selectedElement as TextElement;
    
    return (
      <AccordionItem value="text">
        <AccordionTrigger className="text-sm">Text Properties</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label className="text-xs" htmlFor="text-content">Text Content</Label>
              <textarea
                id="text-content"
                value={textElement.content || ""}
                onChange={(e) => onUpdateElement({ content: e.target.value } as any)}
                className="w-full min-h-[80px] p-2 border rounded-md text-sm mt-1 resize-none"
                placeholder="Enter text content..."
              />
            </div>
            
            <div>
              <Label className="text-xs" htmlFor="font-family">Font Family</Label>
              <Select 
                value={textElement.fontFamily || "Arial"}
                onValueChange={(value) => onUpdateElement({ fontFamily: value } as any)}
              >
                <SelectTrigger id="font-family" className="h-8 text-xs">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs" htmlFor="font-size">Font Size</Label>
                <span className="text-xs text-muted-foreground">
                  {textElement.fontSize || 16}px
                </span>
              </div>
              <Slider 
                id="font-size"
                min={8}
                max={72}
                step={1}
                value={[textElement.fontSize || 16]}
                onValueChange={([fontSize]) => onUpdateElement({ fontSize } as any)}
              />
            </div>
            
            <div>
              <Label className="text-xs mb-1 block">Style</Label>
              <ToggleGroup type="multiple" className="justify-start">
                <ToggleGroupItem 
                  value="bold" 
                  aria-label="Toggle bold" 
                  className="h-8 w-8"
                  data-state={textElement.fontWeight === 'bold' ? 'on' : 'off'}
                  onClick={() => 
                    onUpdateElement({ 
                      fontWeight: textElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                    } as any)
                  }
                >
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="italic" 
                  aria-label="Toggle italic"
                  className="h-8 w-8"
                >
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <Label className="text-xs mb-1 block">Text Alignment</Label>
              <ToggleGroup 
                type="single" 
                value={textElement.textAlign || "left"}
                onValueChange={(value) => {
                  if (value) onUpdateElement({ textAlign: value as any } as any);
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="left" aria-label="Align left" className="h-8 w-8">
                  <AlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center" className="h-8 w-8">
                  <AlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right" className="h-8 w-8">
                  <AlignRight className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Text Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    <div 
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: textElement.fontColor || color }} 
                    />
                    {textElement.fontColor || color}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3">
                  <Tabs defaultValue="swatches">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="swatches" className="text-xs">Swatches</TabsTrigger>
                      <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="swatches">
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          "#000000", "#5E5E5E", "#A1A1A1", "#FFFFFF",
                          "#FF6663", "#FEB144", "#FDFD97", "#9EE09E",
                          "#9EC1CF", "#CC99C9", "#1D4ED8", "#7C3AED",
                          "#F59E0B", "#10B981", "#831843", "#701A75"
                        ].map(color => (
                          <button 
                            key={color} 
                            className="w-8 h-8 rounded-sm border border-gray-200"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setColor(color);
                              onUpdateElement({ fontColor: color } as any);
                            }}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom">
                      <div className="space-y-2">
                        <Label className="text-xs">Pick a color</Label>
                        <Input 
                          type="color" 
                          value={textElement.fontColor || color}
                          onChange={(e) => {
                            setColor(e.target.value);
                            onUpdateElement({ fontColor: e.target.value } as any);
                          }}
                          className="w-full h-8"
                        />
                        <Input 
                          type="text" 
                          value={textElement.fontColor || color}
                          onChange={(e) => {
                            setColor(e.target.value);
                            onUpdateElement({ fontColor: e.target.value } as any);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Shape-specific properties section
  const renderShapeProperties = () => {
    if (selectedElement.type !== "shape") return null;
    
    const shapeElement = selectedElement as ShapeElement;
    
    return (
      <AccordionItem value="shape">
        <AccordionTrigger className="text-sm">Shape Properties</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label className="text-xs" htmlFor="shape-type">Shape Type</Label>
              <Select 
                value={shapeElement.shapeType || "rectangle"}
                onValueChange={(value: any) => onUpdateElement({ shapeType: value } as any)}
              >
                <SelectTrigger id="shape-type" className="h-8 text-xs">
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Background Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    <div 
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: shapeElement.backgroundColor || bgColor }} 
                    />
                    {shapeElement.backgroundColor || bgColor}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3">
                  <Tabs defaultValue="swatches">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="swatches" className="text-xs">Swatches</TabsTrigger>
                      <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="swatches">
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          "#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD",
                          "#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7",
                          "#10B981", "#34D399", "#6EE7B7", "#D1FAE5",
                          "#EC4899", "#F472B6", "#F9A8D4", "#FCE7F3", 
                          "#7C3AED", "#8B5CF6", "#A78BFA", "#DDD6FE",
                          "#111827", "#374151", "#6B7280", "#F3F4F6"
                        ].map(color => (
                          <button 
                            key={color} 
                            className="w-8 h-8 rounded-sm border border-gray-200"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setBgColor(color);
                              onUpdateElement({ backgroundColor: color } as any);
                            }}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom">
                      <div className="space-y-2">
                        <Label className="text-xs">Pick a color</Label>
                        <Input 
                          type="color" 
                          value={shapeElement.backgroundColor || bgColor}
                          onChange={(e) => {
                            setBgColor(e.target.value);
                            onUpdateElement({ backgroundColor: e.target.value } as any);
                          }}
                          className="w-full h-8"
                        />
                        <Input 
                          type="text" 
                          value={shapeElement.backgroundColor || bgColor}
                          onChange={(e) => {
                            setBgColor(e.target.value);
                            onUpdateElement({ backgroundColor: e.target.value } as any);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Border</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs" htmlFor="border-width">Width</Label>
                  <Input 
                    id="border-width"
                    type="number" 
                    min="0"
                    max="20"
                    value={shapeElement.borderWidth || 0} 
                    onChange={(e) => onUpdateElement({ borderWidth: parseInt(e.target.value) || 0 } as any)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs" htmlFor="border-color">Color</Label>
                  <div className="flex items-center h-8 mt-1">
                    <Input 
                      type="color" 
                      value={shapeElement.borderColor || "#000000"}
                      onChange={(e) => onUpdateElement({ borderColor: e.target.value } as any)}
                      className="w-8 h-8 p-0 mr-1"
                    />
                    <Input 
                      type="text" 
                      value={shapeElement.borderColor || "#000000"}
                      onChange={(e) => onUpdateElement({ borderColor: e.target.value } as any)}
                      className="h-8 text-xs flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Image-specific properties section
  const renderImageProperties = () => {
    if (selectedElement.type !== "image") return null;
    
    const imageElement = selectedElement as ImageElement;
    
    return (
      <AccordionItem value="image">
        <AccordionTrigger className="text-sm">Image Properties</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label className="text-xs" htmlFor="image-source">Image Source</Label>
              <Input 
                id="image-source"
                value={imageElement.src} 
                onChange={(e) => onUpdateElement({ src: e.target.value } as any)}
                className="h-8 text-xs mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a valid URL for the image
              </p>
            </div>
            
            <div>
              <Label className="text-xs" htmlFor="image-alt">Alt Text</Label>
              <Input 
                id="image-alt"
                value={imageElement.alt || ""} 
                onChange={(e) => onUpdateElement({ alt: e.target.value } as any)}
                className="h-8 text-xs mt-1"
                placeholder="Describe the image"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="w-64 border-l border-gray-200 bg-white h-full">
      <div className="p-3 border-b">
        <h2 className="text-sm font-medium flex items-center">
          <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
          Element Properties
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["position"]}>
            {renderCommonProperties()}
            {renderTextProperties()}
            {renderShapeProperties()}
            {renderImageProperties()}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
