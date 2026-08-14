const SPEAKER_COLORS = [
  "text-blue-600",
  "text-purple-600",
  "text-green-600",
  "text-rose-600",
  "text-amber-600",
  "text-teal-600",
];

export function getSpeakerColor(speaker: string): string {
  let hash = 0;
  for (const char of speaker) {
    hash = (hash * 31 + char.charCodeAt(0)) % SPEAKER_COLORS.length;
  }
  return SPEAKER_COLORS[hash];
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}
