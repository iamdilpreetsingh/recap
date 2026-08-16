import type { Caption } from "../../types/global";

export type SummarySection = {
  label: string;
  text: string;
};

export type MeetingSummary = {
  meetingSummary: string;
  detailedOverview: SummarySection[];
  nextSteps: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export interface MeetingRecord {
  id: string;
  userId: string;
  title: string;
  startedAt: number;
  endedAt: number | null;
  captions: Caption[];
  summary: MeetingSummary | null;
  chatHistory?: ChatMessage[];
}
