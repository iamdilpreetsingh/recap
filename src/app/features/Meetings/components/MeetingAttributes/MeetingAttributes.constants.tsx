import { Calendar, Clock, Users } from "../../../../../Assets";
import { getSpeakerColor } from "../../../../../widget/components/TranscriptFeed/TranscriptFeed.helpers";
import {
  formatMeetingDate,
  getMeetingMeta,
} from "../MeetingCard/MeetingCard.helpers";
import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";
import type { ReactNode } from "react";
import Message from "../../../../../Assets/icons/message";

export type AttributeConfig = {
  key: string;
  icon: ReactNode;
  label: string;
  value: (meeting: MeetingRecord) => ReactNode;
};

export const getAttributeConfig = (
  meeting: MeetingRecord,
): AttributeConfig[] => {
  const { speakers, captions, mins } = getMeetingMeta(meeting);
  const speakerNames = [...new Set(meeting.captions.map((c) => c.speaker))];

  return [
    {
      key: "date",
      icon: <Calendar />,
      label: "Date",
      value: () => formatMeetingDate(meeting.startedAt),
    },
    {
      key: "duration",
      icon: <Clock />,
      label: "Duration",
      value: () => (mins !== null ? `${mins} min` : "In progress"),
    },
    {
      key: "speakers",
      icon: <Users />,
      label: "Speakers",
      value: () => (
        <>
          <p className="text-xs font-medium text-neutral-800">
            {speakers} speaker{speakers !== 1 ? "s" : ""}
          </p>
          <div className="mt-1.5 space-y-0.5">
            {speakerNames.map((name) => (
              <p
                key={name}
                className={`text-[10px] font-medium ${getSpeakerColor(name)}`}
              >
                {name}
              </p>
            ))}
          </div>
        </>
      ),
    },
    {
      key: "captions",
      icon: <Message />,
      label: "Captions",
      value: () => `${captions} total`,
    },
  ];
};
