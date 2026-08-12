import { useMeetingStore } from "../store/meetingStore";
import { EnableCaptionPrompt, LiveTranscript } from "./components";
import { getButtonConfig, WIDGET_WIDTH } from "./constants";
import { useDrag } from "./hooks";

export default function App() {
  const { position, onMousedown } = useDrag();
  const isRecording = useMeetingStore((s) => s.isRecording);
  const captionsEnabled = useMeetingStore((s) => s.captionsEnabled);
  const showResumePrompt = useMeetingStore((s) => s.showResumePrompt);
  const showTranscription = useMeetingStore((s) => s.showTranscription);

  const buttons = getButtonConfig(
    isRecording,
    showTranscription,
    showResumePrompt,
  );

  return (
    <div
      onMouseDown={onMousedown}
      style={{
        left: "50%",
        top: "16px",
        width: `${WIDGET_WIDTH}px`,
        transform: `translateX(-50%) translate(${position.x}px, ${position.y}px)`,
      }}
      className="p-2.5 pt-1 rounded-xl bg-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] select-none fixed max-h-[400px] z-[999999] cursor-grab flex flex-col overflow-hidden"
    >
      {/* Sticky Header */}
      <div className="flex items-center justify-between shrink-0 sticky top-0 pb-1">
        <span className="text-white font-bold text-[20px] tracking-tight">
          Recap
        </span>

        <div className="flex items-center gap-3">
          {buttons
            .filter((btn) => btn.show?.() ?? true)
            .map((btn) => (
              <button
                key={btn.key}
                onClick={btn.onClick}
                disabled={btn.disabled?.()}
                title={btn.title}
                className="bg-transparent border-none p-0 m-0 cursor-pointer text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[18px] [&_svg]:h-[18px]"
              >
                {btn.icon()}
              </button>
            ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 overflow-y-auto flex-1 [overscroll-behavior:contain]">
        {!captionsEnabled && <EnableCaptionPrompt />}

        {showTranscription && <LiveTranscript />}
      </div>
    </div>
  );
}
