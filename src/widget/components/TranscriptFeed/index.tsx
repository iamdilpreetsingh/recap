import { useRef } from "react";
import { useMeetingStore } from "../../../store/meetingStore";
import { getSpeakerColor } from "./TranscriptFeed.helpers";
import type { TranscriptFeedProps } from "./TranscriptFeed.types";
import { useCaptionStream } from "../../hooks";

export default function TranscriptFeed({
  captions: externalCaptions,
  showResumePrompt: externalShowResumePrompt,
  readOnly = false,
  variant = "dark",
}: TranscriptFeedProps = {}) {
  const { captions: liveCaptions, bottomRef } = useCaptionStream();
  const liveShowResumePrompt = useMeetingStore((s) => s.showResumePrompt);
  const isRecording = useMeetingStore((s) => s.isRecording);

  const captions = externalCaptions ?? liveCaptions;
  const showResumePrompt = externalShowResumePrompt ?? liveShowResumePrompt;
  const internalBottomRef = useRef<HTMLDivElement>(null);
  const ref = externalCaptions ? internalBottomRef : bottomRef;

  const isDark = variant === "dark";

  const bubbleClass = isDark
    ? "w-full mt-2 rounded-2xl bg-zinc px-3 py-3 space-y-2"
    : "bg-white rounded-xl px-4 py-3 border border-neutral-200 space-y-2";

  const textClass = isDark ? "text-white" : "text-neutral-800";
  const timeClass = isDark ? "text-slate-400" : "text-neutral-400";
  const speakerClass = isDark
    ? "text-white font-bold text-md"
    : "font-semibold text-sm";

  return (
    <div
      className={`flex-1 overflow-y-auto min-h-0 space-y-2 ${!isDark ? "bg-[#f7f7f8] p-4" : ""}`}
    >
      {captions.length === 0 && !showResumePrompt && isRecording ? (
        <div className={bubbleClass}>
          <p className={`text-sm leading-relaxed text-center ${textClass}`}>
            {readOnly
              ? "No captions in this meeting."
              : "Start talking during the meeting to see the transcript here."}
          </p>
        </div>
      ) : (
        <>
          {showResumePrompt && (
            <p
              className={`text-[11px] mt-2 font-semibold tracking-widest uppercase whitespace-nowrap px-1 ${timeClass}`}
            >
              Earlier in this meeting
            </p>
          )}

          {captions.map((t, i) => (
            <div key={t.id ?? i} className={bubbleClass}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${timeClass}`}>
                  {new Date(t.timestamp).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
                <span
                  className={`${speakerClass} ${isDark ? "" : getSpeakerColor(t.speaker)}`}
                >
                  {t.speaker}
                </span>
              </div>

              <p className={`text-sm leading-relaxed m-0 ${textClass}`}>
                {t.text}
              </p>
            </div>
          ))}

          <div ref={ref} />
        </>
      )}
    </div>
  );
}
