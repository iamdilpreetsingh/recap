import type { MeetingRecord } from "../../../../lib/meeting.types";

export function groupByDate(meetings: MeetingRecord[]) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = (ts: number) =>
    new Date(ts).toDateString() === today.toDateString();
  const isYesterday = (ts: number) =>
    new Date(ts).toDateString() === yesterday.toDateString();

  return {
    today: meetings.filter((m) => isToday(m.startedAt)),
    yesterday: meetings.filter((m) => isYesterday(m.startedAt)),
    earlier: meetings.filter(
      (m) => !isToday(m.startedAt) && !isYesterday(m.startedAt),
    ),
  };
}

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
