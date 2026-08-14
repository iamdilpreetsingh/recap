import { startObserving, stopObserving, observer } from "./captionObserver";
import { useMeetingStore } from "../../store/meetingStore";
import { onMeetingEnd, onMeetingStart } from "../meetingLifecycle";
import { hideCaptionsContainer } from "../captions";

export const CAPTIONS_CONTAINER_SELECTOR =
  '[role="region"][aria-label="Captions"]';
const CALL_CONTROLS_SELECTOR = '[aria-label="Call controls"]';

let bodyObserver: MutationObserver | null = null;
let meetingActive = false;

function syncCaptionsEnabled() {
  const container = document.querySelector(CAPTIONS_CONTAINER_SELECTOR);
  useMeetingStore.getState().setCaptionsEnabled(!!container);

  if (container && !observer) {
    hideCaptionsContainer(container);
    startObserving(container);
  } else if (!container && observer) {
    stopObserving();
  }
}

function syncMeetingActive() {
  const callControls = document.querySelector(CALL_CONTROLS_SELECTOR);
  const isActive = !!callControls;

  if (isActive && !meetingActive) {
    meetingActive = true;
    onMeetingStart();
  } else if (!isActive && meetingActive) {
    meetingActive = false;
    onMeetingEnd();
  }
}

function onDomChange() {
  syncCaptionsEnabled();
  syncMeetingActive();
}

export function bootstrapObserver() {
  onDomChange();

  bodyObserver = new MutationObserver(onDomChange);
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

export function cleanupObserver() {
  stopObserving();
  useMeetingStore.getState().setCaptionsEnabled(false);
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
}
