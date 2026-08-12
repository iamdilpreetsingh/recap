import { useMeetingStore } from "../../../store/meetingStore";

export default function RejoinMeetingBanner() {
  const activeMeetingId = useMeetingStore((s) => s.activeMeetingId);

  const handleContinue = async () => {
    useMeetingStore.getState().setShowResumePrompt(false);
    useMeetingStore.getState().setIsRecording(true);
  };

  const handleStartFresh = async () => {
    if (!activeMeetingId) return;

    await chrome.runtime.sendMessage({
      type: "DELETE_MEETING",
      meetingId: activeMeetingId,
    });
    await chrome.runtime.sendMessage({
      type: "CREATE_MEETING",
      meetingId: activeMeetingId,
    });

    useMeetingStore.getState().setShowResumePrompt(false);
    useMeetingStore.getState().setIsRecording(true);
    useMeetingStore.getState().clearCaptions();
  };

  return (
    <div className="w-full rounded-2xl bg-zinc px-5 py-4 space-y-3">
      <div>
        <p className="text-sm font-bold text-white mb-1">
          Back in the meeting?
        </p>
        <p className="text-sm text-white leading-relaxed">
          We found an earlier transcript for this meeting. Continue from where
          you left off.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleContinue}
          className="bg-recap rounded-md text-white text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity cursor-pointer px-3 py-2 mt-2"
        >
          Continue
        </button>
        <button
          onClick={handleStartFresh}
          className="bg-recap rounded-md text-white text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity cursor-pointer px-3 py-2 mt-2"
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
