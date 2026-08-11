import { useState } from "react";
import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";
import TranscriptFeed from "../../../TranscriptFeed";
import Section from "../../../Section";
import MeetingCard from "../../../MeetingCard";
import { useMeetingsList } from "../../../../../hooks";
import {
  formatMeetingDate,
  groupByDate,
} from "../../../../../helpers/meeting.helpers";
import { MeetingSections } from "./History.constants";
import { ChevronLeft } from "../../../../../Assets";

export default function History() {
  const meetings = useMeetingsList();
  const [selected, setSelected] = useState<MeetingRecord | null>(null);
  const { today, yesterday, earlier } = groupByDate(meetings);
  const hasNoPastMeeting = meetings.length === 0;

  if (selected) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-neutral-200 shrink-0">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ChevronLeft />
          </button>
          <p className="text-xs font-semibold text-neutral-800">
            Meeting · {formatMeetingDate(selected.startedAt)}
          </p>
        </div>
        <TranscriptFeed captions={selected.captions} readOnly />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0 bg-[#f5f5f7]">
      {hasNoPastMeeting ? (
        <div className="px-1">
          <span className="text-xs font-semibold text-recap">Recap</span>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            Your past meetings will appear here.
          </p>
        </div>
      ) : (
        <>
          {MeetingSections({ today, yesterday, earlier }).map(
            ({ label, meetings }) => (
              <Section
                key={label}
                label={label}
                isEmpty={meetings.length === 0}
              >
                {meetings.map((m) => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    onClick={() => setSelected(m)}
                  />
                ))}
              </Section>
            ),
          )}
        </>
      )}
    </div>
  );
}
