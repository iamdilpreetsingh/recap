import { useMeetingStore } from "../../../store/meetingStore";

export default function EnableCaptionPrompt() {
  const handleEnableCaptions = () => {
    const btn = document.querySelector<HTMLElement>(
      '[aria-label="Turn on captions"]',
    );

    if (btn) {
      btn.click();
      useMeetingStore.getState().setShowTranscription(true);
    } else {
      console.warn("[Recap] CC button not found");
    }
  };

  return (
    <div className="mt-2 rounded-2xl bg-zinc text-center p-3">
      <p className="text-white text-sm leading-relaxed m-0">
        Enable Google captions to start transcribing on Recap
      </p>
      <button
        onClick={handleEnableCaptions}
        className="bg-recap rounded-md text-white text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity cursor-pointer px-3 py-2 mt-2"
      >
        Enable Captions
      </button>
    </div>
  );
}
