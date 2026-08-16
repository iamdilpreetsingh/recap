import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MeetingRecord } from "../../../../lib/meeting.types";
import { getMeeting, regenerateSummary } from "../../../../lib/meetings";
import { useAuth } from "../../../../context/AuthContext";
import { getMeetingMeta } from "../../components/MeetingCard/MeetingCard.helpers";
import TranscriptList from "../../components/TranscriptList";
import AISummary from "../../components/AISummary";
import AIAssistant from "../../components/AIAssistant";
import { downloadTranscript } from "./MeetingDetail.helpers";

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState<MeetingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    getMeeting(id)
      .then(setMeeting)
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleRetrySummary = async () => {
    if (!id) return;
    const summary = await regenerateSummary(id);
    setMeeting((prev) => (prev ? { ...prev, summary } : prev));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-400">Meeting not found.</p>
      </div>
    );
  }

  const { speakers, mins } = getMeetingMeta(meeting);
  const startedAt = new Date(meeting.startedAt);
  const dateLabel = startedAt.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
  const timeLabel = startedAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-6 pb-4 shrink-0">
        <h1 className="text-lg font-semibold text-neutral-800">
          {meeting.title}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
          <span>
            {dateLabel}, {timeLabel}
          </span>
          <span>·</span>
          <span>{mins !== null ? `${mins}m` : "In progress"}</span>
          <span>·</span>
          <span>
            {speakers} speaker{speakers !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
            <AISummary summary={meeting.summary} onRetry={handleRetrySummary} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col px-8 pb-6">
            <AIAssistant
              meetingId={meeting.id}
              initialMessages={meeting.chatHistory}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 border-l border-neutral-100 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
            <span className="text-xs font-semibold text-recap pb-3 -mb-4">
              Transcription
            </span>
            <button
              onClick={() => downloadTranscript(meeting)}
              className="flex items-center gap-1.5 px-4 py-2 bg-recap text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <i
                className="ti ti-download"
                style={{ fontSize: 13 }}
                aria-hidden="true"
              />
              Download
            </button>
          </div>

          <TranscriptList captions={meeting.captions} />
        </div>
      </div>
    </div>
  );
}
