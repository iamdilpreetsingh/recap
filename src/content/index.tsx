import { bootstrapObserver, cleanupObserver } from "./observers/bodyObserver";
import { injectWidget, removeWidget } from "./widget/inject";
import {
  isInActiveMeeting,
  getActiveMeetingIdFromUrl,
} from "./meeting/helpers";
import { useMeetingStore } from "../store/meetingStore";
import "./router";
import { closeMeeting, createMeeting } from "../db";

function bootstrap() {
  bootstrapObserver();

  setInterval(() => {
    const active = isInActiveMeeting();
    const meetingId = getActiveMeetingIdFromUrl();
    const activeMeetingId = useMeetingStore.getState().activeMeetingId;

    if (active) {
      injectWidget();

      if (meetingId && meetingId !== activeMeetingId) {
        createMeeting(meetingId);
        useMeetingStore.getState().setActiveMeetingId(meetingId);
      }
    }

    if (!active && activeMeetingId) {
      closeMeeting(activeMeetingId);
      useMeetingStore.getState().setActiveMeetingId(null);
      useMeetingStore.getState().clearCaptions();
      removeWidget();
    }

    useMeetingStore.getState().setMeetingActive(active);
  }, 2000);
}

window.addEventListener("beforeunload", () => {
  cleanupObserver();
  removeWidget();
});

bootstrap();
