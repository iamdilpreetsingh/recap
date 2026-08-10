import { useEffect, useState } from "react";
import { getAllMeetings } from "../../../../../db";
import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";
import TranscriptFeed from "../../../TranscriptFeed";
import { useMeetingStore } from "../../../../../store/meetingStore";

// ── helpers ───────────────────────────────────────────────────────────────────

function groupByDate(meetings: MeetingRecord[]) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = (ts: number) =>
    new Date(ts).toDateString() === today.toDateString();
  const isYesterday = (ts: number) =>
    new Date(ts).toDateString() === yesterday.toDateString();

  return {
    today: meetings.filter((m) => isToday(m.startedAt)),
    yesterday: meetings.filter((m) => isYesterday(m.startedAt)),
    earlier: meetings.filter(
      (m) => !isToday(m.startedAt) && !isYesterday(m.startedAt),
    ),
  };
}

function getMeetingMeta(meeting: MeetingRecord) {
  const speakers = new Set(meeting.captions.map((c) => c.speaker)).size;
  const captions = meeting.captions.length;
  const mins = meeting.endedAt
    ? Math.round((meeting.endedAt - meeting.startedAt) / 60000)
    : null;
  return { speakers, captions, mins };
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

// ── MeetingCard ───────────────────────────────────────────────────────────────

function MeetingCard({
  meeting,
  onClick,
}: {
  meeting: MeetingRecord;
  onClick: () => void;
}) {
  const { speakers, captions, mins } = getMeetingMeta(meeting);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl px-3 py-3 border border-neutral-200 flex items-center gap-3 cursor-pointer hover:border-[#c4b5fd] transition-colors"
    >
      <div>
        <p className="text-sm font-semibold text-neutral-800">
          Meeting · {formatDate(meeting.startedAt)}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {speakers} speaker{speakers !== 1 ? "s" : ""} · {captions} captions
          {mins !== null ? ` · ${mins} min` : ""}
        </p>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  label,
  meetings,
  onSelect,
}: {
  label: string;
  meetings: MeetingRecord[];
  onSelect: (m: MeetingRecord) => void;
}) {
  if (meetings.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase mb-3 px-1">
        {label}
      </p>
      <div className="space-y-2">
        {meetings.map((m) => (
          <MeetingCard key={m.id} meeting={m} onClick={() => onSelect(m)} />
        ))}
      </div>
    </div>
  );
}

// ── HistoryView ───────────────────────────────────────────────────────────────

export default function HistoryView() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [selected, setSelected] = useState<MeetingRecord | null>(null);
  const activeMeetingId = useMeetingStore((s) => s.activeMeetingId);

  useEffect(() => {
    getAllMeetings().then((all) => {
      setMeetings(all.filter((m) => m.id !== activeMeetingId));
    });
  }, [activeMeetingId]);

  const { today, yesterday, earlier } = groupByDate(meetings);
  const isEmpty = meetings.length === 0;

  if (selected) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-neutral-200 shrink-0">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#6C47FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-xs font-semibold text-neutral-800">
            Meeting · {formatDate(selected.startedAt)}
          </p>
        </div>
        <TranscriptFeed captions={selected.captions} readOnly />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0 bg-[#f5f5f7]">
      {isEmpty ? (
        <div className="px-1">
          <span className="text-xs font-semibold text-recap">Recap</span>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            Your past meetings will appear here.
          </p>
        </div>
      ) : (
        <>
          <Section label="Today" meetings={today} onSelect={setSelected} />
          <Section
            label="Yesterday"
            meetings={yesterday}
            onSelect={setSelected}
          />
          <Section label="Earlier" meetings={earlier} onSelect={setSelected} />
        </>
      )}
    </div>
  );
}
