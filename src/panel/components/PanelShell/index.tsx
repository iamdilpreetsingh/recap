import { MinimizeIcon } from "../../../Assets";
import type { PanelShellProps } from "./PanelShell.types";

export default function PanelShell({ onMinimize, children }: PanelShellProps) {
  return (
    <div className="flex h-full flex-col bg-[#f5f5f7] rounded-xl shadow-2xl overflow-hidden border border-neutral-200">
      {/* Header */}
      <div className="bg-recap text-white px-4 py-2.5 select-none shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Recap</span>
          </div>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="text-neutral-400 hover:text-white text-xs px-1 cursor-pointer"
              title="Minimize"
            >
              <MinimizeIcon />
            </button>
          )}
        </div>
      </div>

      {/* Content area — children handle scroll and layout */}
      <div className="flex-1 flex flex-col min-h-0 bg-neutral-50">
        {children}
      </div>
    </div>
  );
}
