import { CAPTIONS_CONTAINER_SELECTOR } from "./observers/bodyObserver";

export const TURN_ON_CAPTIONS_SELECTOR = '[aria-label="Turn on captions"]';
const HIDE_STYLE_ID = "recap-hide-captions";
const HIDDEN_ATTR = "data-recap-hidden";

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

// Clicks the captions toggle if it exists right now. The caller is
// responsible for knowing *when* to call this — driven reactively by the
// DOM observer in bodyObserver.ts (which tracks whether the button exists
// at all) rather than by polling here, since the button is absent for an
// unbounded, unpredictable amount of time while a participant is waiting
// in the lobby to be admitted by a host.
export function autoEnableCaptions() {
  if (document.querySelector(CAPTIONS_CONTAINER_SELECTOR)) return;

  const btn = document.querySelector<HTMLElement>(TURN_ON_CAPTIONS_SELECTOR);
  btn?.click();
}
