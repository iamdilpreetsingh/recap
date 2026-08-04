import { useEffect, useRef, useState } from "react";
import type { Position } from "./useDrag.types";

export default function useDrag() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const lastPosition = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;

      setPosition((prev) => {
        return {
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        };
      });

      lastPosition.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const onMousedown = (e) => {
    setIsDragging(true);
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  return { position, onMousedown };
}
