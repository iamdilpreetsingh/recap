import recapLogo from "../../../Assets/recapLogo.png";
import { WIDGET_WIDTH } from "./Widget.contants";
import type { WidgetProps } from "./Widget.types";

export default function Widget({ hidden, onOpenPanel }: WidgetProps) {
  const logoUrl = chrome.runtime.getURL(recapLogo);

  return (
    <div
      style={{
        position: "fixed",
        left: `${window.innerWidth - WIDGET_WIDTH}px`,
        top: `${window.innerHeight / 2}px`,
        width: `${WIDGET_WIDTH}px`,
        zIndex: 999999,
        cursor: "pointer",
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
