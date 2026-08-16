export function isInActiveMeeting(): boolean {
  const path = window.location.pathname;
  if (path === "/" || path === "/new" || path === "/landing") return false;

  const hasMeetingId = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/.test(path);
  if (!hasMeetingId) return false;

  const callControls = document.querySelector('[aria-label="Call controls"]');
  return !!callControls;
}

export function getActiveMeetingIdFromUrl(): string | undefined {
  const path = window.location.pathname;
  if (path === "/" || path === "/new" || path === "/landing") return undefined;

  const hasMeetingId = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/.test(path);
  if (!hasMeetingId) return undefined;

  return path.split("/")[1]?.toLowerCase();
}

// Google Meet sets the tab title to "<event name> - Google Meet" for
// calendar-scheduled calls, or just "Meet" for anonymous/ad-hoc ones.
export function getMeetingTitleFromDocument(): string | undefined {
  const raw = document.title.trim();
  if (!raw) return undefined;

  const cleaned = raw.replace(/\s*[-–]\s*Google Meet\s*$/i, "").trim();
  if (!cleaned || cleaned.toLowerCase() === "meet") return undefined;

  return cleaned;
}
