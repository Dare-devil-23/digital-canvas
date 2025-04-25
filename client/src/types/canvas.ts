export enum ToolType {
  SELECT = 'select',
  HAND = 'hand',
  PEN = 'pen',
  MARKER = 'marker',
  ERASER = 'eraser',
  SHAPES = 'shapes',
  TEXT = 'text',
  IMAGE = 'image'
}

export enum GridType {
  STANDARD = 'standard',
  QUAD = 'quad',
  DOTS = 'dots',
  LINED = 'lined',
  NONE = 'none',
}

export type ShapeType = 'rectangle' | 'circle' | 'arrow';

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  id: string;
  tool: ToolType;
  color: string;
  strokeWidth: number;
  points: Point[];
  opacity?: number;
}

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  rotation?: number;
  opacity?: number;
}

export interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface ImageElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  rotation?: number;
}

export type CanvasElement = Line | Shape | TextElement | ImageElement;

export interface CanvasHistory {
  elements: CanvasElement[];
  selectedElement: string | null;
}
