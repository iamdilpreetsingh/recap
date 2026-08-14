import { injectWidget, removeWidget } from "./widget/inject";
import { getActiveMeetingIdFromUrl } from "./meeting/helpers";
import { useMeetingStore } from "../store/meetingStore";
import { autoEnableCaptions } from "./captions";

let handledMeetingUrl: string | null = null;

export async function onMeetingStart() {
  const meetingId = getActiveMeetingIdFromUrl();
  if (!meetingId) return;

  injectWidget();
  autoEnableCaptions();
  if (meetingId === handledMeetingUrl) return;
  handledMeetingUrl = meetingId;

  await handleMeetingDetected(meetingId);
}

export function onMeetingEnd() {
  const { activeMeetingId } = useMeetingStore.getState();

  if (activeMeetingId) {
    chrome.runtime
      .sendMessage({ type: "CLOSE_MEETING", meetingId: activeMeetingId })
      .catch((err) => console.error("[Recap] CLOSE_MEETING failed:", err));
  }

  handledMeetingUrl = null;
  useMeetingStore.getState().setActiveMeetingId(null);
  useMeetingStore.getState().clearCaptions();
  useMeetingStore.getState().setShowResumePrompt(false);
  useMeetingStore.getState().setMeetingActive(false);
  removeWidget();
}

async function handleMeetingDetected(meetingId: string) {
  const res = await chrome.runtime.sendMessage({
    type: "GET_MEETING",
    meetingId,
  });

  const existing = res?.data ?? null;

  if (existing && existing.captions.length !== 0) {
    useMeetingStore.getState().loadCaptions(existing.captions);
    useMeetingStore.getState().setShowResumePrompt(true);
    useMeetingStore.getState().setIsRecording(false);
  } else if (!existing) {
    await chrome.runtime.sendMessage({ type: "CREATE_MEETING", meetingId });
  }

  useMeetingStore.getState().setActiveMeetingId(meetingId);
  useMeetingStore.getState().setMeetingActive(true);
}
