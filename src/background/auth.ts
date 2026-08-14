import { FIREBASE_API_KEY } from "../shared/config";

type StoredAuth = {
  refreshToken: string;
  uid: string;
  email: string;
  idToken?: string;
  idTokenExpiresAt?: number;
};

const STORAGE_KEY = "recapAuth";

export async function storeAuth(auth: {
  refreshToken: string;
  uid: string;
  email: string;
}) {
  await chrome.storage.local.set({ [STORAGE_KEY]: auth });
}

export async function clearAuth() {
  await chrome.storage.local.remove(STORAGE_KEY);
}

async function getStoredAuth(): Promise<StoredAuth | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as StoredAuth | undefined) ?? null;
}

async function refreshIdToken(refreshToken: string) {
  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  );

  if (!res.ok) throw new Error("Failed to refresh auth token");

  const data = await res.json();
  return {
    idToken: data.id_token as string,
    refreshToken: data.refresh_token as string,
    expiresIn: Number(data.expires_in),
  };
}

export async function getIdToken(): Promise<string | null> {
  const stored = await getStoredAuth();
  if (!stored) return null;

  const now = Date.now();
  if (stored.idToken && stored.idTokenExpiresAt && stored.idTokenExpiresAt > now + 60_000) {
    return stored.idToken;
  }

  const refreshed = await refreshIdToken(stored.refreshToken);
  const updated: StoredAuth = {
    ...stored,
    refreshToken: refreshed.refreshToken,
    idToken: refreshed.idToken,
    idTokenExpiresAt: now + refreshed.expiresIn * 1000,
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: updated });

  return refreshed.idToken;
}
