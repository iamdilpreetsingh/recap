import type { Caption } from "../../types/global";
import { useMeetingStore } from "../../store/meetingStore";
import { appendCaption } from "../../db";

const STABILITY_DELAY_MS = 1000;
const AVATAR_FINGERPRINT = 'img[src*="googleusercontent.com"]';

let captionIdCounter = 0;
const captionIds = new WeakMap<Element, string>();

type CaptionState = {
  speaker: string;
  pendingText: string;
  committedText: string;
  timer: number | null;
};

const captionStates = new WeakMap<Element, CaptionState>();
const activeTimers = new Set<number>();

export let observer: MutationObserver | null = null;

function commitDeltaToState(el: Element, state: CaptionState) {
  const pending = state.pendingText;
  const committed = state.committedText;

  if (!pending || pending === committed) return;

  const delta = committed ? pending.slice(committed.length).trim() : pending;

  if (!delta) return;

  const caption: Caption = {
    id: getCaptionId(el) + `-${Date.now()}`,
    speaker: state.speaker,
    text: delta,
    timestamp: Date.now(),
  };
  const { activeMeetingId, isRecording } = useMeetingStore.getState();

  if (!isRecording) return;
  useMeetingStore.getState().addCaption(caption);

  if (activeMeetingId) {
    appendCaption(activeMeetingId, caption);
  }

  if (typeof chrome !== "undefined" && chrome.runtime?.id) {
    chrome.runtime
      .sendMessage({ type: "CAPTION", data: caption })
      .catch((err) => console.error("sendMessage error:", err));
  }

  state.committedText = pending;
}

function getCaptionId(el: Element): string {
  let id = captionIds.get(el);
  if (!id) {
    id = `cap-${Date.now()}-${++captionIdCounter}`;
    captionIds.set(el, id);
  }
  return id;
}

function extractCaption(el: Element): { speaker: string; text: string } | null {
  if (!el.querySelector(AVATAR_FINGERPRINT)) return null;

  const directDivs = Array.from(el.children).filter((c) => c.tagName === "DIV");
  const headerDiv = directDivs[0];
  const speakerEl = headerDiv?.querySelector("span");
  const speaker = speakerEl?.textContent?.trim() || "Unknown";

  const textEl = directDivs[directDivs.length - 1];
  const text = textEl?.textContent?.trim() || "";

  if (!text) return null;
  return { speaker, text };
}

function handleCaptionCandidate(el: Element) {
  const extracted = extractCaption(el);
  if (!extracted) return;

  let state = captionStates.get(el);

  if (!state) {
    state = {
      speaker: extracted.speaker,
      committedText: "",
      pendingText: extracted.text,
      timer: null,
    };
    captionStates.set(el, state);
  }

  if (state.pendingText === extracted.text) return;

  state.pendingText = extracted.text;

  if (state.timer) {
    clearTimeout(state.timer);
    activeTimers.delete(state.timer);
  }

  const timer = window.setTimeout(() => {
    activeTimers.delete(timer);
    const s = captionStates.get(el);
    if (s) commitDeltaToState(el, s);
  }, STABILITY_DELAY_MS);

  state.timer = timer;
  activeTimers.add(timer);
}

export function startObserving(container: Element) {
  console.log("[Recap] 🎙 Starting caption observer");
  useMeetingStore.getState().setIsConnected(true);
  useMeetingStore.getState().setIsRecording(true);

  observer = new MutationObserver(() => {
    const items = new Set<Element>();

    container.querySelectorAll(AVATAR_FINGERPRINT).forEach((avatar) => {
      let node: Element | null = avatar.parentElement;
      while (node && node !== container) {
        const directDivs = Array.from(node.children).filter(
          (c) => c.tagName === "DIV",
        );
        if (directDivs.length >= 2) {
          items.add(node);
          break;
        }
        node = node.parentElement;
      }
    });

    items.forEach(handleCaptionCandidate);
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

export function stopObserving() {
  if (observer) {
    console.log("[Recap] 🛑 Stopping caption observer");
    observer.disconnect();
    observer = null;
  }
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers.clear();
  useMeetingStore.getState().setIsRecording(false);
  useMeetingStore.getState().setIsConnected(false);
}
