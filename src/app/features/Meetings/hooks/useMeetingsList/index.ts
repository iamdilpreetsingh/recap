import { useEffect, useState } from "react";
import type { MeetingRecord } from "../../../../lib/meeting.types";
import { getMeetings } from "../../../../lib/meetings";
import { useAuth } from "../../../../context/AuthContext";

export default function useMeetingsList() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMeetings(user.uid)
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, [user]);

  return { meetings, loading };
}
