import { CAPTIONS_CONTAINER_SELECTOR } from "./observers/bodyObserver";

const TURN_ON_CAPTIONS_SELECTOR = '[aria-label="Turn on captions"]';
const HIDE_STYLE_ID = "recap-hide-captions";
const HIDDEN_ATTR = "data-recap-hidden";
const MAX_ENABLE_ATTEMPTS = 6;
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

  const btn = document.querySelector<HTMLElement>(TURN_ON_CAPTIONS_SELECTOR);
  if (btn) {
    btn.click();
    return;
  }

  if (attempt >= MAX_ENABLE_ATTEMPTS) {
    console.warn("[Recap] Could not auto-enable captions");
    return;
  }

  setTimeout(() => autoEnableCaptions(attempt + 1), ENABLE_RETRY_DELAY_MS);
}
