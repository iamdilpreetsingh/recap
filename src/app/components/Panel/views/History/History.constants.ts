import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";

export function MeetingSections(groups: {
  today: MeetingRecord[];
  yesterday: MeetingRecord[];
  earlier: MeetingRecord[];
}) {
  return [
    { label: "Today", meetings: groups.today },
    { label: "Yesterday", meetings: groups.yesterday },
    { label: "Earlier", meetings: groups.earlier },
  ];
}
