import type { BottomNavProps } from "./BottomNav.types";

export default function BottomNav({
  canDownload = false,
  onDownload,
}: BottomNavProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-neutral-200 shrink-0">
      <button
        onClick={onDownload}
        disabled={!canDownload}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
          canDownload
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
        }`}
      >
        ↓ Download
      </button>
    </div>
  );
}
