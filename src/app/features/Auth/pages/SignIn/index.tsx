import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import GoogleIcon from "../../components/GoogleIcon";

export default function SignIn() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/meetings" replace />;
  }

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("[Recap] Sign-in failed:", err);
      setError("Couldn't sign you in. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-20">
        <span className="text-2xl font-bold text-recap mb-10">Recap</span>
        <h1 className="text-5xl font-bold text-neutral-800 leading-tight mb-4">
          Welcome to Recap
        </h1>
        <p className="text-lg text-neutral-400">
          Your AI meeting assistant for Google Meet.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#f7f5ff]">
        <div className="w-[400px] bg-white rounded-2xl shadow-sm p-10">
          <h2 className="text-2xl font-bold text-neutral-800 text-center mb-2">
            Get started
          </h2>
          <p className="text-sm text-neutral-400 text-center mb-8">
            Sign in to view your meetings and summaries.
          </p>

          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
          >
            <GoogleIcon />
            {signingIn ? "Signing in..." : "Continue with Google"}
          </button>

          {error && (
            <p className="text-xs text-red-500 text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
