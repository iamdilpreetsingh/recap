import {
  createMeeting,
  appendCaption,
  closeMeeting,
  deleteMeeting,
  getMeeting,
} from "../db";
import type { Caption } from "../types/global";

console.log("[Recap] Service worker started");

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
      .catch((err) => sendResponse({ ok: false, error: err.message }));
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
    chrome.tabs.create({ url: chrome.runtime.getURL("src/app/index.html") });
    sendResponse({ ok: true });
    return true;
  }

  return false;
});
