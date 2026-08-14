import { autoEnableCaptions } from "../../../content/captions";

export default function EnableCaptionPrompt() {
  return (
    <div className="rounded-2xl bg-zinc text-center p-3">
      <p className="text-white text-sm leading-relaxed m-0">
        Transcription has been paused. Enable Google captions to start
        transcribing.
      </p>
      <button
        onClick={() => autoEnableCaptions()}
        className="bg-recap rounded-md text-white text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity cursor-pointer px-3 py-2 mt-2"
      >
        Enable Captions
      </button>
    </div>
  );
}
