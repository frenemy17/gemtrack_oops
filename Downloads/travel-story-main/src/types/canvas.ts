export enum ElementType {
  IMAGE = 'image',
  TEXT = 'text'
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextStyle {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface Element {
  id: string;
  type: ElementType;
  content: string;
  position: Position;
  size: Size;
  zIndex: number;
  rotation?: number;
  style?: TextStyle;
}