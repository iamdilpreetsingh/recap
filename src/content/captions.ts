import { CAPTIONS_CONTAINER_SELECTOR } from "./observers/bodyObserver";

const TURN_ON_CAPTIONS_SELECTOR = '[aria-label="Turn on captions"]';
const CALL_CONTROLS_SELECTOR = '[aria-label="Call controls"]';
const HIDE_STYLE_ID = "recap-hide-captions";
const HIDDEN_ATTR = "data-recap-hidden";
const MAX_ENABLE_ATTEMPTS = 6;
// Google Meet renders no call controls (including the captions toggle)
// while a participant is waiting in the lobby to be admitted, and there's
// no signal for how long that wait will be — allow a much longer retry
// window in that state than the normal "button briefly not found" case.
const MAX_ADMISSION_WAIT_ATTEMPTS = 1200; // 1200 * 500ms = 10 minutes
const ENABLE_RETRY_DELAY_MS = 500;

export function injectStaticHideStyles() {
  if (document.getElementById(HIDE_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = HIDE_STYLE_ID;
  style.textContent = `[aria-label="Turn off captions"] {
    background-color: rgba(255, 255, 255, 0.08) !important;
    color: #e8eaed !important;
  }`;
  document.head.appendChild(style);
}

export function hideCaptionsContainer(captionsRegion: Element) {
  const wrapper =
    captionsRegion.closest<HTMLElement>("[data-priority][data-side]") ??
    (captionsRegion as HTMLElement);

  if (wrapper.hasAttribute(HIDDEN_ATTR)) return;
  wrapper.setAttribute(HIDDEN_ATTR, "true");

  wrapper.style.setProperty("position", "fixed", "important");
  wrapper.style.setProperty("top", "-9999px", "important");
  wrapper.style.setProperty("left", "-9999px", "important");
  wrapper.style.setProperty("width", "1px", "important");
  wrapper.style.setProperty("height", "1px", "important");
  wrapper.style.setProperty("overflow", "hidden", "important");
  wrapper.style.setProperty("pointer-events", "none", "important");
}

export function autoEnableCaptions(attempt = 0) {
  if (document.querySelector(CAPTIONS_CONTAINER_SELECTOR)) return;

  const inCall = document.querySelector(CALL_CONTROLS_SELECTOR);
  const btn = inCall
    ? document.querySelector<HTMLElement>(TURN_ON_CAPTIONS_SELECTOR)
    : null;

  if (btn) {
    btn.click();
    return;
  }

  const maxAttempts = inCall ? MAX_ENABLE_ATTEMPTS : MAX_ADMISSION_WAIT_ATTEMPTS;
  if (attempt >= maxAttempts) {
    console.warn("[Recap] Could not auto-enable captions");
    return;
  }

  setTimeout(() => autoEnableCaptions(attempt + 1), ENABLE_RETRY_DELAY_MS);
}
