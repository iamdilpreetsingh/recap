import { DASHBOARD_URL } from "../shared/config";

chrome.tabs.create({ url: DASHBOARD_URL });
window.close();
