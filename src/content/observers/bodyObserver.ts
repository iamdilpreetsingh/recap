import { startObserving, stopObserving, observer } from "./captionObserver";
import { useMeetingStore } from "../../store/meetingStore";
import { onMeetingEnd, onMeetingStart } from "../meetingLifecycle";
import {
  hideCaptionsContainer,
  autoEnableCaptions,
  TURN_ON_CAPTIONS_SELECTOR,
} from "../captions";

export const CAPTIONS_CONTAINER_SELECTOR =
  '[role="region"][aria-label="Captions"]';
const CALL_CONTROLS_SELECTOR = '[aria-label="Call controls"]';

let bodyObserver: MutationObserver | null = null;
let meetingActive = false;
let captionsToggleAvailable = false;

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

function syncCaptionsToggleAvailable() {
  const available = !!document.querySelector(TURN_ON_CAPTIONS_SELECTOR);
  if (available === captionsToggleAvailable) return;

  captionsToggleAvailable = available;
  useMeetingStore.getState().setCaptionsToggleAvailable(available);

  // The toggle just appeared — most likely a host just admitted this
  // participant into the call. Auto-enable captions right away instead
  // of waiting for the next unrelated DOM mutation to trigger a re-check.
  if (available) autoEnableCaptions();
}

function onDomChange() {
  syncCaptionsEnabled();
  syncMeetingActive();
  syncCaptionsToggleAvailable();
}

export function bootstrapObserver() {
  onDomChange();

  bodyObserver = new MutationObserver(onDomChange);
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

export function cleanupObserver() {
  stopObserving();
  useMeetingStore.getState().setCaptionsEnabled(false);
  useMeetingStore.getState().setCaptionsToggleAvailable(false);
  captionsToggleAvailable = false;
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
}
