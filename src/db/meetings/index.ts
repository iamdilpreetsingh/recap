import { openDB } from "idb";
import type { Caption } from "../../types/global";

export const dbPromise = openDB("meetings", 1, {
  upgrade(db) {
    db.createObjectStore("meeting", { keyPath: "id" });
  },
});

export async function createMeeting(id: string) {
  const db = await dbPromise;
  await db.add("meeting", {
    id,
    title: `Meeting · ${new Date().toLocaleDateString()}`,
    startedAt: Date.now(),
    endedAt: null,
    captions: [],
  });
}

export async function appendCaption(id: string, caption: Caption) {
  const db = await dbPromise;
  const meeting = await db.get("meeting", id);

  if (!meeting) throw new Error("Meeting not found");

  await db.put("meeting", {
    ...meeting,
    captions: [...meeting.captions, caption],
  });
}

export async function closeMeeting(id: string) {
  const db = await dbPromise;
  const meeting = await db.get("meeting", id);

  if (!meeting) throw new Error("Meeting not found");

  await db.put("meeting", { ...meeting, endedAt: Date.now() });
}
