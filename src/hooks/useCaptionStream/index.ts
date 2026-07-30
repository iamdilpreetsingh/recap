import { useEffect, useRef, useState } from "react";
import type { MeetingSession } from "./useCaptionStream.types";

export default function useCaptionStream() {
  const [session, setSession] = useState<MeetingSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.runtime
      .sendMessage({ type: "GET_SESSION" })
      .then((res: any) => {
        if (res?.ok && res.data) setSession(res.data);
      })
      .catch(() => {});

    const listener = (message: any) => {
      if (message.type === "NEW_CAPTION") {
        setSession((prev) => {
          if (!prev) {
            return {
              id: `mtg-${Date.now()}`,
              url: "unknown",
              startedAt: Date.now(),
              captions: [message.data],
            };
          }
          return {
            ...prev,
            captions: [...prev.captions, message.data],
          };
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    setIsConnected(true);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.captions.length]);

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return { session, isConnected, fmtTime, bottomRef };
}
