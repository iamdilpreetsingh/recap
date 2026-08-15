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

export type TranscriptChunk = {
  text: string;
  vector: number[];
};

export interface MeetingRecord {
  id: string;
  userId: string;
  title: string;
  startedAt: number;
  endedAt: number | null;
  captions: Caption[];
  summary: MeetingSummary | null;
  chunks?: TranscriptChunk[];
}
