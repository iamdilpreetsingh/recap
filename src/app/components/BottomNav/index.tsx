import { useMeetingStore } from "../../../store/meetingStore";
import { buttonConfig } from "./BottomNav.constants";

export default function BottomNav() {
  const isRecording = useMeetingStore((s) => s.isRecording);

  return (
    <div className="flex items-center justify-center px-3 py-3 bg-white border-t border-neutral-200 shrink-0">
      {buttonConfig.map(({ key, icon, onClick, disabled }) => {
        const isDisabled = disabled?.() ?? false;

        return (
          <button
            key={key}
            onClick={onClick}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              isDisabled ? "opacity-40 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <div
              className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0 ${
                isDisabled ? "bg-neutral-100" : "bg-recap-light"
              }`}
            >
              {icon(isRecording)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
