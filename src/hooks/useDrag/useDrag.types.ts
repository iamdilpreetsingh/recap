import type { RefObject } from "react";

export interface DragPosition {
  x: number;
  y: number;
}

export interface UseDragReturn<T extends HTMLElement = HTMLElement> {
  position: DragPosition;
  isDragging: boolean;
  ref: RefObject<T | null>;
}

export interface UseDragOptions {
  initialPosition?: DragPosition;
  viewportPadding?: number;
  onDragEnd?: (position: DragPosition) => void;
}
