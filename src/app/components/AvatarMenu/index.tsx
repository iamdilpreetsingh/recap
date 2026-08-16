import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "../../assets";
import { useAuth } from "../../context/AuthContext";

export default function AvatarMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = (user.displayName ?? user.email ?? "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 cursor-pointer"
        title="Account menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? user.email ?? "Account"}
            className="w-9 h-9 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-recap-light text-recap flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
        )}
        <span
          className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-sm p-2 z-20">
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 rounded-lg bg-neutral-100 text-sm font-medium text-neutral-700 hover:bg-recap-light transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
