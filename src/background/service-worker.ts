import {
  createMeeting,
  appendCaption,
  closeMeeting,
  deleteMeeting,
  getMeeting,
} from "../db";
import type { Caption } from "../types/global";
import { DASHBOARD_URL, BACKEND_URL } from "../shared/config";
import { storeAuth, clearAuth, getIdToken } from "./auth";

console.log("[Recap] Service worker started");

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({ url: DASHBOARD_URL });
  }
});

async function syncMeetingToBackend(meetingId: string): Promise<boolean> {
  console.log("[Recap] Syncing meeting to backend:", meetingId);

  const meeting = await getMeeting(meetingId);
  if (!meeting) {
    console.warn("[Recap] Meeting not found in IndexedDB, aborting sync");
    return false;
  }

  const idToken = await getIdToken();
  if (!idToken) {
    console.warn("[Recap] Not signed in, skipping backend sync");
    return false;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(meeting),
  });

  const body = await res.text().catch(() => "");

  if (!res.ok) {
    console.error("[Recap] Backend responded with error:", res.status, body);
    return false;
  }

  console.log("[Recap] Meeting synced successfully:", meetingId, body);
  return true;
}

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (!sender.url?.startsWith(DASHBOARD_URL)) {
      sendResponse({ ok: false, error: "Untrusted sender" });
      return true;
    }

    if (message.type === "RECAP_AUTH") {
      console.log("[Recap] Received auth from dashboard:", message.email);
      storeAuth({
        refreshToken: message.refreshToken,
        uid: message.uid,
        email: message.email,
      })
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err.message }));
      return true;
    }

    if (message.type === "RECAP_SIGN_OUT") {
      clearAuth()
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err.message }));
      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "CREATE_MEETING") {
    createMeeting(message.meetingId)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === "APPEND_CAPTION") {
    const caption = message.caption as Caption;
    appendCaption(message.meetingId, caption)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === "CLOSE_MEETING") {
    closeMeeting(message.meetingId)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }))
      .finally(() => {
        syncMeetingToBackend(message.meetingId)
          .then((synced) => {
            if (synced) {
              chrome.tabs.create({
                url: `${DASHBOARD_URL}/meetings/${message.meetingId}`,
              });
            }
          })
          .catch((err) => console.error("[Recap] Backend sync failed:", err));
      });
    return true;
  }

  if (message.type === "DELETE_MEETING") {
    deleteMeeting(message.meetingId)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === "GET_MEETING") {
    getMeeting(message.meetingId)
      .then((meeting) => sendResponse({ ok: true, data: meeting }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === "OPEN_APP") {
    chrome.tabs.create({ url: DASHBOARD_URL });
    sendResponse({ ok: true });
    return true;
  }

  return false;
});
