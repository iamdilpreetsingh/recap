import { createMeeting, deleteMeeting } from "../../../db";
import { useMeetingStore } from "../../../store/meetingStore";

export default function RejoinMeetingBanner() {
  const activeMeetingId = useMeetingStore((s) => s.activeMeetingId);

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
    <div className="mx-3 mt-3 px-3 py-3 rounded-xl bg-[#f0ecff] border border-[#d4c8ff]">
      <p className="text-xs font-semibold text-[#3C3489] mb-1">
        Back in the meeting?
      </p>
      <p className="text-xs text-[#6C47FF] leading-relaxed mb-3">
        We found an earlier transcript for this meeting. Continue from where you
        left off
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
  );
}
