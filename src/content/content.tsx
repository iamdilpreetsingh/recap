import React from "react";
import ReactDOM from "react-dom/client";
import type { Caption } from "../types/global";
import tailwindStyles from "../panel/index.css?inline";
import App from "../panel/App";

console.log("[Recap] Content script loaded on:", window.location.href);

// ----------------------------------------------------------------------------
// Caption Observer Config
// ----------------------------------------------------------------------------
const STABILITY_DELAY_MS = 2000;
const CAPTIONS_CONTAINER_SELECTOR = '[role="region"][aria-label="Captions"]';
const AVATAR_FINGERPRINT = 'img[src*="googleusercontent.com"]';

// ----------------------------------------------------------------------------
// Caption State
// ----------------------------------------------------------------------------
type CaptionState = { text: string; timer: number | null };
const captionStates = new WeakMap<Element, CaptionState>();
const activeTimers = new Set<number>();

let captionIdCounter = 0;
const captionIds = new WeakMap<Element, string>();

let observer: MutationObserver | null = null;
let bodyObserver: MutationObserver | null = null;

// ----------------------------------------------------------------------------
// Caption Helpers
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Caption Debounce
// ----------------------------------------------------------------------------
function handleCaptionCandidate(el: Element) {
  const extracted = extractCaption(el);
  if (!extracted) return;

  const prev = captionStates.get(el);
  if (prev && prev.text === extracted.text) return;

  if (prev?.timer) {
    clearTimeout(prev.timer);
    activeTimers.delete(prev.timer);
  }

  const timer = window.setTimeout(() => {
    activeTimers.delete(timer);

    const caption: Caption = {
      id: getCaptionId(el),
      speaker: extracted.speaker,
      text: extracted.text,
      timestamp: Date.now(),
    };

    console.log("[Recap] ✅ Caption finalized:", caption);

    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      chrome.runtime
        .sendMessage({ type: "CAPTION", data: caption })
        .then((res) => {
          console.log("SW response:", res);
        })
        .catch((err) => {
          console.error("sendMessage error:", err);
        });
    }
  }, STABILITY_DELAY_MS);

  activeTimers.add(timer);
  captionStates.set(el, { text: extracted.text, timer });
}

// ----------------------------------------------------------------------------
// Caption Observer Lifecycle
// ----------------------------------------------------------------------------
function startObserving(container: Element) {
  console.log("[Recap] 🎙 Starting caption observer");

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

function stopObserving() {
  if (observer) {
    console.log("[Recap] 🛑 Stopping caption observer");
    observer.disconnect();
    observer = null;
  }
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers.clear();
}

function bootstrapObserver() {
  const container = document.querySelector(CAPTIONS_CONTAINER_SELECTOR);
  if (container) startObserving(container);

  const body = document.body;
  bodyObserver = new MutationObserver(() => {
    const container = document.querySelector(CAPTIONS_CONTAINER_SELECTOR);
    if (container && !observer) {
      startObserving(container);
    } else if (!container && observer) {
      stopObserving();
    }
  });

  bodyObserver.observe(body, {
    childList: true,
    subtree: true,
  });
}

function cleanupObserver() {
  stopObserving();
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
}

// ----------------------------------------------------------------------------
// Widget — React-based, uses panel/components/Widget (which uses useDrag hook)
// ----------------------------------------------------------------------------
const SHADOW_HOST_ID = "recap-widget-host";
let widgetHost: HTMLElement | null = null;
let reactRoot: ReactDOM.Root | null = null;

function injectShadowStyles(shadow: ShadowRoot) {
  const style = document.createElement("style");
  style.textContent = tailwindStyles;
  shadow.appendChild(style);
}

function injectWidget() {
  if (widgetHost) return;
  console.log("[Recap] 🟢 injecting widget");

  widgetHost = document.createElement("div");
  widgetHost.id = SHADOW_HOST_ID;
  document.body.appendChild(widgetHost);

  const shadow = widgetHost.attachShadow({ mode: "open" });
  injectShadowStyles(shadow);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  reactRoot = ReactDOM.createRoot(mountPoint);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

function removeWidget() {
  console.log("[Recap]  Removing widget");
  reactRoot?.unmount();
  widgetHost?.remove();
  reactRoot = null;
  widgetHost = null;
}

function cleanupWidget() {
  removeWidget();
}

// ----------------------------------------------------------------------------
// Meeting Detection
// ----------------------------------------------------------------------------
function isInActiveMeeting(): boolean {
  const path = window.location.pathname;
  if (path === "/" || path === "/new" || path === "/landing") return false;

  const hasMeetingId = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/.test(path);
  if (!hasMeetingId) return false;

  const callControls = document.querySelector('[aria-label="Call controls"]');
  return !!callControls;
}

// ----------------------------------------------------------------------------
// Message Router (from Service Worker)
// ----------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ENABLE_CAPTIONS") {
    // TODO: Programmatically click Meet's CC button
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

// ----------------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------------
function bootstrap() {
  bootstrapObserver();

  setInterval(() => {
    if (isInActiveMeeting()) {
      injectWidget();
    } else {
      removeWidget();
    }
  }, 2000);
}

window.addEventListener("beforeunload", () => {
  cleanupObserver();
  cleanupWidget();
});

bootstrap();
