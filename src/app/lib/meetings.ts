import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { BACKEND_URL } from "./config";
import type { MeetingRecord, MeetingSummary } from "./meeting.types";

const MEETINGS_COLLECTION = "meetings";

export async function getMeetings(userId: string): Promise<MeetingRecord[]> {
  const q = query(
    collection(db, MEETINGS_COLLECTION),
    where("userId", "==", userId),
    orderBy("startedAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as MeetingRecord);
}

export async function getMeeting(
  userId: string,
  id: string,
): Promise<MeetingRecord | null> {
  const snapshot = await getDoc(doc(db, MEETINGS_COLLECTION, id));
  if (!snapshot.exists()) return null;

  const meeting = snapshot.data() as MeetingRecord;
  if (meeting.userId !== userId) return null;

  return meeting;
}

export async function regenerateSummary(
  meetingId: string,
): Promise<MeetingSummary> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("Not signed in");

  const res = await fetch(`${BACKEND_URL}/api/regenerate-summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ meetingId }),
  });

  if (!res.ok) throw new Error("Failed to regenerate summary");

  const data = await res.json();
  return data.summary;
}

export async function askQuestion(
  meetingId: string,
  question: string,
): Promise<string> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("Not signed in");

  const res = await fetch(`${BACKEND_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ meetingId, question }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to get an answer");
  }

  const data = await res.json();
  return data.answer;
}
