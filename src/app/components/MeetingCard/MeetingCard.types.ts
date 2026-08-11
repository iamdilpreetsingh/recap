import type { MeetingRecord } from "../../../db/meetings/meeting.types";

export type MeetingCardProps = {
  meeting: MeetingRecord;
  onClick: () => void;
};
