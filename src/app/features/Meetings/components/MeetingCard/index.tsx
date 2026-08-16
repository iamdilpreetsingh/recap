import { useAuth } from "../../../../context/AuthContext";
import { formatMeetingDateTime } from "./MeetingCard.helpers";
import type { MeetingCardProps } from "./MeetingCard.types";

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const { user } = useAuth();
  const initial = (user?.displayName ?? user?.email ?? "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl px-4 py-3 border border-neutral-200 flex items-center justify-between gap-3 cursor-pointer hover:border-recap transition-colors"
    >
      <p className="text-sm font-semibold text-neutral-800 truncate">
        {meeting.title}
      </p>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-neutral-400">
          {formatMeetingDateTime(meeting.startedAt)}
        </span>
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? user.email ?? "Account"}
            className="w-6 h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-recap-light text-recap flex items-center justify-center text-[10px] font-semibold">
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}
