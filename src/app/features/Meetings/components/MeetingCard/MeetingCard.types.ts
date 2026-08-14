import type { MeetingRecord } from "../../../../lib/meeting.types";

export type MeetingCardProps = {
  meeting: MeetingRecord;
  onClick: () => void;
};
