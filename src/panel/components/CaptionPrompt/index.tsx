export default function CaptionPrompt() {
  const handleEnable = () => {
    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      chrome.runtime.sendMessage({ type: "ENABLE_CAPTIONS" }).catch(() => {});
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
        onClick={handleEnable}
        className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-700 transition-colors"
      >
        Enable Captions
      </button>
    </div>
  );
}
