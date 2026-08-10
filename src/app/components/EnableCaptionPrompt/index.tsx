export default function EnableCaptionPrompt() {
  const handleEnableCaptions = () => {
    const btn = document.querySelector<HTMLElement>(
      '[aria-label="Turn on captions"]',
    );

    if (btn) {
      btn.click();
    } else {
      console.warn("[Recap] CC button not found");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <h3 className="text-sm font-semibold text-[#3C3489] mb-3">
        Enable Google captions to start transcribing on Recap
      </h3>
      <button
        onClick={handleEnableCaptions}
        className="px-4 py-2 bg-recap text-white text-xs font-medium rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
      >
        Enable Captions
      </button>
    </div>
  );
}
