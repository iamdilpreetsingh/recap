import { bootstrapObserver, cleanupObserver } from "./observers/bodyObserver";
import { injectWidget, removeWidget } from "./widget/inject";
import { isInActiveMeeting } from "./meeting/detector";
import { useMeetingStore } from "../store/meetingStore";
import "./router";

function bootstrap() {
  bootstrapObserver();

  setInterval(() => {
    const active = isInActiveMeeting();
    useMeetingStore.getState().setMeetingActive(active);

    if (active) {
      injectWidget();
    } else {
      removeWidget();
      useMeetingStore.getState().clearCaptions();
    }
  }, 2000);
}

window.addEventListener("beforeunload", () => {
  cleanupObserver();
  removeWidget();
});

bootstrap();
