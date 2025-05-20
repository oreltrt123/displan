export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  opacity?: number;

  // Text specific properties
  content?: string;
  style?: string;

  // Image specific properties
  url?: string;

  // Shape specific properties
  shapeType?: string;
  color?: string;

  // Common properties
  name?: string;
}
