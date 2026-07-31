import type { PanelProps } from "./Panel.types";
import PanelShell from "../PanelShell";
import CaptionPrompt from "../CaptionPrompt";
// import BottomNav from "../BottomNav";
import { useCaptionStream } from "../../../hooks";
import { useMeetingStore } from "../../../store/meetingStore";
import { getSpeakerColor, groupedCaptions } from "./Panel.helpers";

export default function Panel({ open, onClose }: PanelProps) {
  const { captions, bottomRef } = useCaptionStream();
  const captionsEnabled = useMeetingStore((state) => state.captionsEnabled);

  if (!open) return null;

  return (
    <div
      className="fixed right-0 h-[90vh] w-[320px] rounded-xl shadow-xl z-[999999]"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      <PanelShell onMinimize={onClose}>
        {!captionsEnabled ? (
          <CaptionPrompt />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
            {captions.length === 0 && (
              <div>
                <span className={`text-xs font-medium text-recap`}>Recap</span>
                <div className="mt-1 space-y-1">
                  <p className="text-sm leading-relaxed text-neutral-800">
                    Start talking during the meeting to see the transcript here.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {groupedCaptions(captions).map((group, i) => (
                <div key={`${group.speaker}-${i}`}>
                  <span
                    className={`text-xs font-medium ${getSpeakerColor(group.speaker)}`}
                  >
                    {group.speaker}
                  </span>
                  <div className="mt-1 space-y-1">
                    {group.entries.map((t) => (
                      <p
                        key={t.id}
                        className="text-sm leading-relaxed text-neutral-800"
                      >
                        {t.text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
          // <BottomNav canDownload={false} onDownload={handleDownload} />
        )}
      </PanelShell>
    </div>
  );
}
