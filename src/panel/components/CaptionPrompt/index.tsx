export default function CaptionPrompt() {
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
      <div className="text-4xl mb-4">🎙</div>
      <h3 className="text-sm font-semibold text-neutral-800 mb-2">
        Enable Google captions to start transcribing on Recap
      </h3>
      <p className="text-xs text-neutral-500 mb-4 max-w-[200px]">
        Recap reads live captions from your meeting. Turn on captions in Google
        Meet to get started.
      </p>
      <button
        onClick={handleEnableCaptions}
        className="px-4 py-2 bg-recap text-white text-xs font-medium rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
      >
        Enable Captions
      </button>
    </div>
  );
}
