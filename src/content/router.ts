chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ENABLE_CAPTIONS") {
    const btn = document.querySelector<HTMLElement>(
      '[aria-label="Turn on captions"]',
    );

    if (btn) {
      btn.click();
      
      sendResponse({ ok: true });
    } else {
      sendResponse({ ok: false, reason: "CC button not found" });
    }
    return true;
  }

  return false;
});
