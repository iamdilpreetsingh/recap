import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { EXTENSION_ID } from "../lib/config";

function notifyExtension(message: Record<string, unknown>) {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    console.warn("[Recap] chrome.runtime not available in this page");
    return;
  }
  try {
    chrome.runtime.sendMessage(EXTENSION_ID, message, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[Recap] Failed to message extension:",
          chrome.runtime.lastError.message,
        );
        return;
      }
      console.log("[Recap] Extension responded:", response);
    });
  } catch (err) {
    console.error("[Recap] sendMessage threw:", err);
  }
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    notifyExtension({
      type: "RECAP_AUTH",
      refreshToken: result.user.refreshToken,
      uid: result.user.uid,
      email: result.user.email,
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    notifyExtension({ type: "RECAP_SIGN_OUT" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
