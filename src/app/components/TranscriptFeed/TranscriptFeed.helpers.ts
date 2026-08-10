import type { Caption } from "../../../types/global";
import { SpeakerColors } from "./TranscriptionFeed.constants";

export function getSpeakerColor(speaker: string): string {
  let hash = 0;
  for (const char of speaker) {
    hash = (hash * 31 + char.charCodeAt(0)) % SpeakerColors.length;
  }

  return SpeakerColors[hash];
}

export const groupedCaptions = (captions: Caption[]) => {
  const groups: { speaker: string; entries: Caption[] }[] = [];

  for (const cap of captions) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.speaker === cap.speaker) {
      lastGroup.entries.push(cap);
    } else {
      groups.push({ speaker: cap.speaker, entries: [cap] });
    }
  }

  return groups;
};
