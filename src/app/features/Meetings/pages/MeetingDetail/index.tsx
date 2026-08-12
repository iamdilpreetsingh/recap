import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { MeetingRecord } from "../../../../../db/meetings/meeting.types";
import { getMeeting } from "../../../../../db";
import { formatMeetingDate } from "../../components/MeetingCard/MeetingCard.helpers";
import { TranscriptFeed } from "../../../../../widget/components";
import { MeetingAttributes } from "../../components";
import { ChevronLeft } from "../../../../../Assets";
import { downloadTranscript } from "./MeetingDetail.helpers";

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getMeeting(id)
      .then(setMeeting)
      .finally(() => setLoading(false));
  }, [id]);

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

  return (
    <div className="flex h-full">
      {/* Transcript area */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-neutral-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/meetings")}
              className="flex items-center gap-1 text-xs text-recap w-fit cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <h1 className="text-sm font-semibold text-neutral-800">
              Meeting · {formatMeetingDate(meeting.startedAt)}
            </h1>
          </div>
          <button
            onClick={() => downloadTranscript(meeting)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ecff] text-recap text-xs font-medium rounded-lg hover:bg-[#e4dcff] transition-colors cursor-pointer"
          >
            <i
              className="ti ti-download"
              style={{ fontSize: 13 }}
              aria-hidden="true"
            />
            Download
          </button>
        </div>

        <TranscriptFeed captions={meeting.captions} readOnly variant="light" />
      </div>

      <MeetingAttributes meeting={meeting} />
    </div>
  );
}
