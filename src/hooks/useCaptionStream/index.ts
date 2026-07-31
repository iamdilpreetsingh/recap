import { useEffect, useRef } from "react";
import { useMeetingStore } from "../../store/meetingStore";

export default function useCaptionStream() {
  const captions = useMeetingStore((state) => state.captions);
  const isConnected = useMeetingStore((state) => state.isConnected);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [captions.length]);

  return { captions, isConnected, bottomRef };
}
