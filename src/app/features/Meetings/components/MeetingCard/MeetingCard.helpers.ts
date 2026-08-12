import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";

export function getMeetingMeta(meeting: MeetingRecord) {
  const speakers = new Set(meeting.captions.map((c) => c.speaker)).size;
  const captions = meeting.captions.length;
  const mins = meeting.endedAt
    ? Math.round((meeting.endedAt - meeting.startedAt) / 60000)
    : null;
  return { speakers, captions, mins };
}

export function formatMeetingDate(ts: number) {
  return new Date(ts).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}
