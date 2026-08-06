import { injectWidget, removeWidget } from "./widget/inject";
import { getActiveMeetingIdFromUrl } from "./meeting/helpers";
import { useMeetingStore } from "../store/meetingStore";
import { closeMeeting, createMeeting, getMeeting } from "../db";

let handledMeetingUrl: string | null = null;

export async function onMeetingStart() {
  const meetingId = getActiveMeetingIdFromUrl();
  if (!meetingId) return;

  injectWidget();

  // already handled this meeting URL — skip
  if (meetingId === handledMeetingUrl) return;
  handledMeetingUrl = meetingId;

  await handleMeetingDetected(meetingId);
}

export function onMeetingEnd() {
  const { activeMeetingId } = useMeetingStore.getState();

  if (activeMeetingId) {
    closeMeeting(activeMeetingId);
  }

  handledMeetingUrl = null;
  useMeetingStore.getState().setActiveMeetingId(null);
  useMeetingStore.getState().clearCaptions();
  useMeetingStore.getState().setShowResumePrompt(false);
  useMeetingStore.getState().setMeetingActive(false);
  removeWidget();
}

async function handleMeetingDetected(meetingId: string) {
  const existing = await getMeeting(meetingId);

  if (existing) {
    useMeetingStore.getState().loadCaptions(existing.captions);
    useMeetingStore.getState().setShowResumePrompt(true);
    useMeetingStore.getState().setIsRecording(false);
  } else {
    await createMeeting(meetingId);
  }

  useMeetingStore.getState().setActiveMeetingId(meetingId);
  useMeetingStore.getState().setMeetingActive(true);
}
