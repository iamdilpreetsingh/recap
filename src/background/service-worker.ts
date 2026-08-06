console.log("[Recap] Service worker started");

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error("[Recap] Failed to set panel behavior:", err));

// ---------------------------------------------------------------------------
// Meeting Session
// ---------------------------------------------------------------------------

interface Caption {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
}

interface MeetingSession {
  id: string;
  url: string;
  startedAt: number;
  captions: Caption[];
  lastActivityAt: number;
}

let currentSession: MeetingSession | null = null;

function getOrCreateSession(tabUrl: string): MeetingSession {
  if (!currentSession) {
    currentSession = {
      id: `mtg-${Date.now()}`,
      url: tabUrl,
      startedAt: Date.now(),
      captions: [],
      lastActivityAt: Date.now(),
    };
    console.log("[Recap SW] 🎙 New session started:", currentSession.id);
  }
  return currentSession;
}

function addCaption(caption: Caption, tabUrl: string, tabId: number) {
  const session = getOrCreateSession(tabUrl);

  session.captions.push(caption);
  session.lastActivityAt = Date.now();
  broadcastToSidePanel(tabId, { type: "NEW_CAPTION", data: caption });
}

function broadcastToSidePanel(tabId: number, message: unknown) {
  // Send to all extension frames (side panel is frameId undefined or specific)
  chrome.tabs
    .sendMessage(tabId, message)
    .then((res) => {
      console.log("SW response:", res);
    })
    .catch((e) => {
      console.error("sendMessage error in broadcastToSidePanel:", e);
    });
}

// ---------------------------------------------------------------------------
// Message Router
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTION") {
    const caption = message.data as Caption;
    const tabUrl = sender.tab?.url || "unknown";
    const tabId = sender.tab?.id || undefined;
    if (tabId === undefined) {
      sendResponse({ ok: false, error: "No tab id found" });
      return;
    }
    addCaption(caption, tabUrl, tabId);
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === "OPEN_SIDE_PANEL") {
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.sidePanel
        .open({ tabId })
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err.message }));
    } else {
      sendResponse({ ok: false, error: "no tab id" });
    }
    return true;
  }

  if (message.type === "GET_SESSION") {
    sendResponse({
      ok: true,
      data: currentSession,
    });
    return true;
  }

  sendResponse({ ok: false, error: "unknown message type" });
  return true;
});
