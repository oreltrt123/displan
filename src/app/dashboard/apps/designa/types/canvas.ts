
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export type ElementType = 'text' | 'image' | 'shape';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  comments: Comment[];
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export type CanvasElement = TextElement | ImageElement | ShapeElement;

export interface CanvasData {
  id: string;
  name: string;
  elements: CanvasElement[];
  width: number;
  height: number;
  background: string;
}

export interface ElementTemplate {
  type: ElementType;
  name: string;
  shapeType?: ShapeType;
  content?: string;
  src?: string;
}
