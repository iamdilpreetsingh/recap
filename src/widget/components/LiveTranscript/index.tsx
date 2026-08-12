import { useEffect, useRef } from "react";
import { useMeetingStore } from "../../../store/meetingStore";
import RejoinMeetingBanner from "../RejoinMeetingBanner";
import TranscriptFeed from "../TranscriptFeed";
import TranscriptionPausedBanner from "../TranscriptionPausedBanner";

export default function LiveTranscript() {
  const isRecording = useMeetingStore((s) => s.isRecording);
  const showResumePrompt = useMeetingStore((s) => s.showResumePrompt);
  const pausedBannerRef = useRef<HTMLDivElement>(null);
  const showPausedBanner = !isRecording && !showResumePrompt;

  useEffect(() => {
    if (!showPausedBanner) return;
    requestAnimationFrame(() => {
      pausedBannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [showPausedBanner]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {showPausedBanner && (
        <div ref={pausedBannerRef}>
          <TranscriptionPausedBanner />
        </div>
      )}

      {showResumePrompt && <RejoinMeetingBanner />}

      <TranscriptFeed />
    </div>
  );
}
