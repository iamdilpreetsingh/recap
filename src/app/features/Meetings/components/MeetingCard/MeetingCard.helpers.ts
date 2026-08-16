import type { MeetingRecord } from "../../../../lib/meeting.types";

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

export function formatMeetingDateTime(ts: number) {
  const date = new Date(ts).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
  const time = new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date}, ${time}`;
}
