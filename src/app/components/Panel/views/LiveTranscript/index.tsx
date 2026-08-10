import { useMeetingStore } from "../../../../../store/meetingStore";
import BottomNav from "../../../BottomNav";
import RejoinMeetingBanner from "../../../RejoinMeetingBanner";
import TranscriptFeed from "../../../TranscriptFeed";
import TranscriptionPausedBanner from "../../../TranscriptionPausedBanner";

export default function LiveTranscript() {
  const isRecording = useMeetingStore((s) => s.isRecording);
  const showResumePrompt = useMeetingStore((s) => s.showResumePrompt);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {!isRecording && !showResumePrompt && <TranscriptionPausedBanner />}
      {showResumePrompt && <RejoinMeetingBanner />}
      <TranscriptFeed />
      <BottomNav />
    </div>
  );
}
