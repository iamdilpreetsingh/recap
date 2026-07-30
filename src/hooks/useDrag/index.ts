import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DragPosition,
  UseDragOptions,
  UseDragReturn,
} from "./useDrag.types";

export default function useDrag<T extends HTMLElement = HTMLElement>(
  options: UseDragOptions = {},
): UseDragReturn<T> {
  const {
    initialPosition = { x: 0, y: 0 },
    viewportPadding = 0,
    onDragEnd,
  } = options;

  const [position, setPosition] = useState<DragPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef<T | null>(null);
  const dragState = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!ref.current?.contains(target)) return;
    if (!target.closest("[data-drag-handle]")) return;

    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: ref.current.offsetLeft,
      startTop: ref.current.offsetTop,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !ref.current) return;

      const deltaX = e.clientX - dragState.current.startX;
      const deltaY = e.clientY - dragState.current.startY;

      let newX = dragState.current.startLeft + deltaX;
      let newY = dragState.current.startTop + deltaY;

      const elWidth = ref.current.offsetWidth;
      const elHeight = ref.current.offsetHeight;

      newX = Math.max(
        viewportPadding,
        Math.min(newX, window.innerWidth - elWidth - viewportPadding),
      );
      newY = Math.max(
        viewportPadding,
        Math.min(newY, window.innerHeight - elHeight - viewportPadding),
      );

      setPosition({ x: newX, y: newY });
    },
    [isDragging, viewportPadding],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    onDragEnd?.(position);
  }, [isDragging, position, onDragEnd]);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return { position, isDragging, ref };
}
