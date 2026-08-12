import { useNavigate } from "react-router-dom";
import { useMeetingsList } from "../../hooks";
import Section from "../../../../components/Section";
import MeetingCard from "../../components/MeetingCard";
import { groupByDate } from "./MeetingList.helpers";

export default function MeetingList() {
  const meetings = useMeetingsList();
  const navigate = useNavigate();
  const { today, yesterday, earlier } = groupByDate(meetings);
  const isEmpty = meetings.length === 0;

  return (
    <div className="px-10 py-8">
      <h1 className="text-xl font-semibold text-neutral-800 mb-6">
        My Meetings
      </h1>

      {isEmpty ? (
        <p className="text-sm text-neutral-400">
          No meetings yet. Join a Google Meet call with Recap active to start
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
