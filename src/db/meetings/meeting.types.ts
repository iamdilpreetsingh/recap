import type { Caption } from "../../types/global";

// A meeting session in IndexedDB
export interface MeetingRecord {
  id: string;
  title: string;
  startedAt: number;
  endedAt: number | null;
  captions: Caption[];
}
