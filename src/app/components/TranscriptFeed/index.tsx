import { useRef } from "react";
import { useCaptionStream } from "../../../hooks";
import { useMeetingStore } from "../../../store/meetingStore";
import { getSpeakerColor, groupedCaptions } from "./TranscriptFeed.helpers";
import type { TranscriptFeedProps } from "./TranscriptFeed.types";

export default function TranscriptFeed({
  captions: externalCaptions,
  showResumePrompt: externalShowResumePrompt,
  readOnly = false,
}: TranscriptFeedProps = {}) {
  const { captions: liveCaptions, bottomRef } = useCaptionStream();
  const liveShowResumePrompt = useMeetingStore((s) => s.showResumePrompt);

  const captions = externalCaptions ?? liveCaptions;
  const showResumePrompt = externalShowResumePrompt ?? liveShowResumePrompt;
  const internalBottomRef = useRef<HTMLDivElement>(null);
  const ref = externalCaptions ? internalBottomRef : bottomRef;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
      {captions.length === 0 && !showResumePrompt ? (
        <div className="px-1">
          <span className="text-xs font-semibold text-recap">Recap</span>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            {readOnly
              ? "No captions in this meeting."
              : "Start talking during the meeting to see the transcript here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {showResumePrompt && (
            <p className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase whitespace-nowrap">
              Earlier in this meeting
            </p>
          )}
          {groupedCaptions(captions).map((group, i) => (
            <div key={`${group.speaker}-${i}`}>
              <span
                className={`text-sm font-semibold ${getSpeakerColor(group.speaker)}`}
              >
                {group.speaker}
              </span>
              <div className="mt-1.5 space-y-2">
                {group.entries.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl px-3 py-2 border border-neutral-200"
                  >
                    <p className="text-sm leading-relaxed text-neutral-800">
                      {t.text}
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      {new Date(t.timestamp).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={ref} />
        </div>
      )}
    </div>
  );
}
