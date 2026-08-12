export default function TranscriptionPausedBanner() {
  return (
    <div className="w-full rounded-2xl bg-zinc px-3 py-3">
      <p className="text-sm text-center leading-relaxed text-white">
        Transcription has been paused. To resume transcribing, click the play
        button
      </p>
    </div>
  );
}
