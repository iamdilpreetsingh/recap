export default function TranscriptionPausedBanner() {
  return (
    <div className="mx-3 mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
      <p className="text-xs text-amber-800 font-medium">
        Transcription has been paused. To resume transcribing, click the play
        button
      </p>
    </div>
  );
}
