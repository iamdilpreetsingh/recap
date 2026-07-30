import type { PanelShellProps } from "./PanelShell.types";

export default function PanelShell({ onMinimize, children }: PanelShellProps) {
  return (
    <div className="flex h-full flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200 cursor-pointer">
      {/* Header / Drag handle */}
      <div className="bg-neutral-800 text-white px-4 py-2.5 select-none shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="text-sm cursor-grab active:cursor-grabbing">
              ⋮⋮
            </span> */}
            <span className="text-sm font-medium">Recap</span>
            {/* {isLive && (
              <span className="ml-2 flex items-center gap-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )} */}
          </div>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="text-neutral-400 hover:text-white text-xs px-1"
              title="Minimize"
            >
              ✕
            </button>
          )}
        </div>
        {/* {sessionInfo && (
          <p className="text-xs text-neutral-400 mt-0.5">{sessionInfo}</p>
        )} */}
      </div>

      {/* Content area — children handle scroll and layout */}
      <div className="flex-1 flex flex-col min-h-0 bg-neutral-50">
        {children}
      </div>
    </div>
  );
}
