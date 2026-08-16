import { useNavigate } from "react-router-dom";
import { useMeetingsList } from "../../hooks";
import Section from "../../../../components/Section";
import MeetingCard from "../../components/MeetingCard";
import Skeleton from "../../../../components/Skeleton";
import { groupByDate } from "./MeetingList.helpers";

export default function MeetingList() {
  const { meetings, loading } = useMeetingsList();
  const navigate = useNavigate();
  const { today, yesterday, earlier } = groupByDate(meetings);
  const isEmpty = meetings.length === 0;

  return (
    <div className="px-10 py-8">
      <h1 className="text-xl font-semibold text-neutral-800 mb-6">
        My Meetings
      </h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl px-4 py-3 border border-neutral-200 flex items-center gap-3"
            >
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <p className="text-sm text-neutral-400">
          No meetings yet. Join a Google Meet call with Recap to start
          transcribing.
        </p>
      ) : (
        <>
          {[
            { label: "Today", meetings: today },
            { label: "Yesterday", meetings: yesterday },
            { label: "Earlier", meetings: earlier },
          ].map(({ label, meetings }) => (
            <Section key={label} label={label} isEmpty={meetings.length === 0}>
              {meetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  onClick={() => navigate(`/meetings/${m.id}`)}
                />
              ))}
            </Section>
          ))}
        </>
      )}
    </div>
  );
}
