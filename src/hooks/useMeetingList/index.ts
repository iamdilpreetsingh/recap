import { useEffect, useState } from "react";
import type { MeetingRecord } from "../../db/meetings/meeting.types";
import { useMeetingStore } from "../../store/meetingStore";
import { getAllMeetings } from "../../db";

export default function useMeetingsList() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const activeMeetingId = useMeetingStore((s) => s.activeMeetingId);

  useEffect(() => {
    getAllMeetings().then((all) => {
      setMeetings(all.filter((m) => m.id !== activeMeetingId));
    });
  }, [activeMeetingId]);

  return meetings;
}
