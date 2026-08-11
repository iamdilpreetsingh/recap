import {
  formatMeetingDate,
  getMeetingMeta,
} from "../../../helpers/meeting.helpers";
import type { MeetingCardProps } from "./MeetingCard.types";

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const { speakers, captions, mins } = getMeetingMeta(meeting);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl px-3 py-3 border border-neutral-200 flex items-center gap-3 cursor-pointer hover:border-[#c4b5fd] transition-colors"
    >
      <div>
        <p className="text-sm font-semibold text-neutral-800">
          Meeting · {formatMeetingDate(meeting.startedAt)}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {speakers} speaker{speakers !== 1 ? "s" : ""} · {captions} captions
          {mins !== null ? ` · ${mins} min` : ""}
        </p>
      </div>
    </div>
  );
}
