import { auth } from "./firebase";
import { BACKEND_URL } from "./config";
import type { MeetingRecord, MeetingSummary } from "./meeting.types";

async function authedFetch(path: string, init?: RequestInit) {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("Not signed in");

  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function getMeetings(): Promise<MeetingRecord[]> {
  const res = await authedFetch("/api/v1/meetings");
  if (!res.ok) throw new Error("Failed to load meetings");

  const data = await res.json();
  return data.meetings;
}

export async function getMeeting(id: string): Promise<MeetingRecord | null> {
  const res = await authedFetch(`/api/v1/meetings/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load meeting");

  const data = await res.json();
  return data.meeting;
}

export async function regenerateSummary(
  meetingId: string,
): Promise<MeetingSummary> {
  const res = await authedFetch(
    `/api/v1/meetings/${encodeURIComponent(meetingId)}/regenerate-summary`,
    { method: "POST" },
  );

  if (!res.ok) throw new Error("Failed to regenerate summary");

  const data = await res.json();
  return data.summary;
}

export async function askQuestion(
  meetingId: string,
  question: string,
): Promise<string> {
  const res = await authedFetch(
    `/api/v1/meetings/${encodeURIComponent(meetingId)}/ask`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to get an answer");
  }

  const data = await res.json();
  return data.answer;
}
