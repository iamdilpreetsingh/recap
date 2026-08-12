import type { Caption } from "../../../types/global";

export type TranscriptFeedProps = {
  captions?: Caption[];
  showResumePrompt?: boolean;
  readOnly?: boolean;
  variant?: "dark" | "light";
};
