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
