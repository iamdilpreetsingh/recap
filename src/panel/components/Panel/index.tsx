import type { PanelProps } from "./Panel.types";
import PanelShell from "../PanelShell";
import CaptionPrompt from "../CaptionPrompt";
import BottomNav from "../BottomNav";
import { useCaptionStream, useDrag } from "../../../hooks";
import { useMeetingStore } from "../../../store/meetingStore";
import { getSpeakerColor, groupedCaptions } from "./Panel.helpers";
import { resumeObserving } from "../../../content/observers/captionObserver";
import { createMeeting } from "../../../db";
import { deleteMeeting } from "../../../db/meetings";

export default function Panel({ open, onClose }: PanelProps) {
  const { captions, bottomRef } = useCaptionStream();
  const captionsEnabled = useMeetingStore((state) => state.captionsEnabled);
  const isRecording = useMeetingStore((s) => s.isRecording);
  const showResumePrompt = useMeetingStore((s) => s.showResumePrompt);
  const activeMeetingId = useMeetingStore((s) => s.activeMeetingId);
  const { position, onMousedown } = useDrag();

  if (!open) return null;

  const handleDownload = () => {};

  const onToggleRecording = () => {
    if (!isRecording) resumeObserving();
    useMeetingStore.getState().setIsRecording(!isRecording);
  };

  const handleContinue = async () => {
    useMeetingStore.getState().setShowResumePrompt(false);
    useMeetingStore.getState().setIsRecording(true);
  };

  const handleStartFresh = async () => {
    if (!activeMeetingId) return;
    await deleteMeeting(activeMeetingId);
    await createMeeting(activeMeetingId);
    useMeetingStore.getState().setShowResumePrompt(false);
    useMeetingStore.getState().setIsRecording(true);
    useMeetingStore.getState().clearCaptions();
  };

  return (
    <div
      className="fixed right-0 h-[90vh] w-[320px] rounded-xl shadow-xl z-[999999] overflow-hidden"
      style={{
        top: "50%",
        transform: `translateY(-53%) translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={onMousedown}
    >
      <PanelShell onMinimize={onClose}>
        {!captionsEnabled ? (
          <CaptionPrompt />
        ) : (
          <>
            {!isRecording && !showResumePrompt && (
              <div className="mx-3 mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-xs text-amber-800 font-medium">
                  Transcription has been paused. To resume transcribing, click
                  the play button
                </p>
              </div>
            )}

            {showResumePrompt && (
              <div className="mx-3 mt-3 px-3 py-3 rounded-xl bg-[#f0ecff] border border-[#d4c8ff]">
                <p className="text-xs font-semibold text-[#3C3489] mb-1">
                  Back in the meeting?
                </p>
                <p className="text-xs text-[#6C47FF] leading-relaxed mb-3">
                  We found an earlier transcript for this meeting. Continue from
                  where you left off
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-1.5 rounded-lg bg-recap text-white text-xs font-medium cursor-pointer"
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleStartFresh}
                    className="flex-1 py-1.5 rounded-lg bg-recap text-white text-xs font-medium cursor-pointer"
                  >
                    Start fresh
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
              {captions.length === 0 && !showResumePrompt ? (
                <div className="px-1">
                  <span className="text-xs font-semibold text-recap">
                    Recap
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                    Start talking during the meeting to see the transcript here.
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
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <BottomNav
              canDownload={false}
              onDownload={handleDownload}
              isRecording={isRecording}
              onToggleRecording={onToggleRecording}
              showResumePrompt={showResumePrompt}
            />
          </>
        )}
      </PanelShell>
    </div>
  );
}
