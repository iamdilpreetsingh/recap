import type { MeetingRecord } from "../../../../lib/meeting.types";

export function downloadTranscript(meeting: MeetingRecord) {
  const lines = meeting.captions.map((c) => {
    const time = new Date(c.timestamp).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `[${time}] ${c.speaker}: ${c.text}`;
  });

  const text = [
    `Meeting Transcript`,
    `Date: ${new Date(meeting.startedAt).toLocaleDateString()}`,
    `─────────────────────────`,
    ...lines,
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `recap-${meeting.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
