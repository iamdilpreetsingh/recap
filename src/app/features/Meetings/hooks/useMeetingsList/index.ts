import { useEffect, useState } from "react";
import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";
import { getAllMeetings } from "../../../../../db";

export default function useMeetingsList() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);

  useEffect(() => {
    getAllMeetings().then(setMeetings);
  }, []);

  return meetings;
}
