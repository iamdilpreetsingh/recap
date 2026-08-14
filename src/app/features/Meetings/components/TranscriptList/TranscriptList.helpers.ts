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

export function formatClockTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
