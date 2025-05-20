
import { useState, useRef } from "react";
import { CanvasElement, Comment } from "../../types/canvas";
import { cn } from "@/lib/utils";
import { Trash2, Edit, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CanvasElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onResize: (direction: string, dx: number, dy: number) => void;
}

export function CanvasElementComponent({
  element,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onUpdate,
  onResize,
}: CanvasElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState((element.type === "text" ? element.content : ""));
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const elementRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef<{x: number, y: number} | null>(null);
  const resizeDirection = useRef<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = () => {
    if (element.type === "text") {
      setIsEditing(true);
    }
  };

  const handleEditComplete = () => {
    if (element.type === "text") {
      onUpdate({ content: editText } as any);
    }
    setIsEditing(false);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    resizeDirection.current = direction;
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    e.preventDefault();
    
    if (!resizeStartPos.current || !resizeDirection.current) return;
    
    const dx = e.clientX - resizeStartPos.current.x;
    const dy = e.clientY - resizeStartPos.current.y;
    
    onResize(resizeDirection.current, dx, dy);
    
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleResizeEnd = () => {
    resizeDirection.current = null;
    resizeStartPos.current = null;
    
    window.removeEventListener("mousemove", handleResizeMove);
    window.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        text: newComment,
        author: "You",
        createdAt: new Date().toISOString(),
      };
      
      onUpdate({ 
        comments: [...(element.comments || []), comment] 
      });
      
      setNewComment("");
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditComplete}
            autoFocus
            className="w-full h-full p-0 border-0 bg-transparent resize-none focus:ring-0 focus:outline-none"
            style={{ 
              fontFamily: element.fontFamily || 'inherit',
              fontSize: `${element.fontSize || 16}px`,
              color: element.fontColor || 'currentColor',
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'left',
            }}
          />
        ) : (
          <div 
            style={{ 
              fontFamily: element.fontFamily || 'inherit',
              fontSize: `${element.fontSize || 16}px`,
              color: element.fontColor || 'currentColor',
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'left',
            }}
            onDoubleClick={handleDoubleClick}
          >
            {element.content}
          </div>
        );

      case "image":
        return (
          <img
            src={element.src}
            alt={element.alt || "Image"}
            className="w-full h-full object-cover"
          />
        );

      case "shape":
        if (element.shapeType === "rectangle") {
          return <div 
            className="w-full h-full rounded-sm" 
            style={{ 
              backgroundColor: element.backgroundColor || '#3b82f6',
              border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || 'transparent'}` : 'none',
            }} 
          />;
        } else if (element.shapeType === "circle") {
          return <div 
            className="w-full h-full rounded-full" 
            style={{ 
              backgroundColor: element.backgroundColor || '#22c55e',
              border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || 'transparent'}` : 'none', 
            }} 
          />;
        } else if (element.shapeType === "triangle") {
          return (
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-0 h-0" 
                style={{
                  borderLeft: '50px solid transparent',
                  borderRight: '50px solid transparent',
                  borderBottom: `86px solid ${element.backgroundColor || '#8b5cf6'}`,
                }}
              />
            </div>
          );
        }
        return null;

      default:
        return <div>Unknown element type</div>;
    }
  };

  const commentCount = (element.comments?.length || 0);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={elementRef}
          className={cn(
            "absolute cursor-move",
            isSelected && "outline outline-2 outline-blue-500",
          )}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            zIndex: element.zIndex,
            opacity: element.opacity,
            transform: `rotate(${element.rotation || 0}deg)`,
          }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          draggable={false} // Disable native drag
        >
          {renderElement()}

          {/* Resize handles - only show when selected */}
          {isSelected && (
            <>
              <div className="element-handle handle-n" onMouseDown={(e) => handleResizeStart(e, 'n')} />
              <div className="element-handle handle-e" onMouseDown={(e) => handleResizeStart(e, 'e')} />
              <div className="element-handle handle-s" onMouseDown={(e) => handleResizeStart(e, 's')} />
              <div className="element-handle handle-w" onMouseDown={(e) => handleResizeStart(e, 'w')} />
              <div className="element-handle handle-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
              <div className="element-handle handle-se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
              <div className="element-handle handle-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
              <div className="element-handle handle-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            </>
          )}

          {/* Element Controls - only show when selected */}
          {isSelected && (
            <div 
              className="absolute -right-12 top-0 flex flex-col gap-1"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 bg-white"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {element.type === "text" && (
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 bg-white"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 bg-white"
                onClick={() => setShowComments(true)}
              >
                <div className="relative">
                  <MessageCircle className="h-4 w-4" />
                  {commentCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 text-[8px] flex items-center justify-center text-white">
                      {commentCount}
                    </div>
                  )}
                </div>
              </Button>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onSelect()}>Select</ContextMenuItem>
        {element.type === "text" && (
          <ContextMenuItem onClick={() => setIsEditing(true)}>Edit Text</ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => setShowComments(true)}>
          {commentCount > 0 ? `Comments (${commentCount})` : "Add Comment"}
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600" onClick={onDelete}>Delete</ContextMenuItem>
      </ContextMenuContent>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          
          {(element.comments?.length || 0) > 0 ? (
            <ScrollArea className="h-60 rounded-md border p-4">
              {element.comments?.map((comment) => (
                <div key={comment.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
              No comments yet. Add your first comment below.
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment" className="text-sm">Add a comment</Label>
            <Textarea
              id="comment"
              placeholder="Type your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
}
