import recapLogo from "../../../Assets/recapLogo.png";
import { useDrag } from "../../../hooks";
import { WIDGET_WIDTH } from "./Widget.contants";
import type { WidgetProps } from "./Widget.types";

export default function Widget({ hidden, onOpenPanel }: WidgetProps) {
  const { position, isDragging, ref } = useDrag<HTMLDivElement>({
    initialPosition: {
      x: window.innerWidth - WIDGET_WIDTH,
      y: window.innerHeight / 2,
    },
    viewportPadding: 10,
  });

  const logoUrl = chrome.runtime.getURL(recapLogo);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${WIDGET_WIDTH}px`,
        zIndex: 999999,
        cursor: isDragging ? "grabbing" : "pointer",
        display: hidden ? "none" : "block",
      }}
      className="flex items-center justify-center bg-white backdrop-blur-md rounded-l-lg shadow-[0_8px_30px_rgba(59,130,246,0.25)] overflow-hidden font-sans select-none border-2 border-blue-500/30 cursor-pointer"
    >
      <button
        onClick={onOpenPanel}
        className="w-full py-1 flex items-center justify-center hover:bg-blue-50/50 transition-colors"
      >
        <img src={logoUrl} alt="Recap logo" width="35" height="35" />
      </button>
    </div>
  );
}
