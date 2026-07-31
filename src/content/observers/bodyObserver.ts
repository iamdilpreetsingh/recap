import { startObserving, stopObserving, observer } from "./captionObserver";
import { useMeetingStore } from "../../store/meetingStore";

export const CAPTIONS_CONTAINER_SELECTOR =
  '[role="region"][aria-label="Captions"]';

let bodyObserver: MutationObserver | null = null;

function syncCaptionsEnabled() {
  const container = document.querySelector(CAPTIONS_CONTAINER_SELECTOR);
  useMeetingStore.getState().setCaptionsEnabled(!!container);

  if (container && !observer) {
    startObserving(container);
  } else if (!container && observer) {
    stopObserving();
  }
}

export function bootstrapObserver() {
  syncCaptionsEnabled(); // sync on boot

  bodyObserver = new MutationObserver(syncCaptionsEnabled);

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
