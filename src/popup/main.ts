chrome.tabs.create({
  url: chrome.runtime.getURL("src/app/index.html"),
});
window.close();
