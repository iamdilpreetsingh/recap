// Recap Service Worker (background)
// Runs invisibly in the background. Handles:
//   - Opening side panel when the extension icon is clicked
//   - Message routing between content script and side panel (later)
//   - Session state for the current meeting (later)

console.log('[Recap] Service worker started')

// Tell Chrome: when the user clicks the extension icon, open the side panel.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error('[Recap] Failed to set panel behavior:', err))

// Placeholder message listener — will expand as we build.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[Recap SW] Message received:', message)
  sendResponse({ received: true })
  return true // keep the message channel open for async responses
})
