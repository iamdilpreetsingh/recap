import { HollowVideo } from "../../../../../Assets";
import { formatMeetingDate, getMeetingMeta } from "./MeetingCard.helpers";
import type { MeetingCardProps } from "./MeetingCard.types";

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const { speakers, captions, mins } = getMeetingMeta(meeting);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl px-4 py-3 border border-neutral-200 flex items-center gap-3 cursor-pointer hover:border-recap transition-colors"
    >
      <div className="w-9 h-9 flex items-center justify-center shrink-0">
        <HollowVideo />
      </div>
      <div className="flex-1">
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
