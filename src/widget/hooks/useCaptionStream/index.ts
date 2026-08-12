import { useEffect, useRef } from "react";
import { useMeetingStore } from "../../../store/meetingStore";

export default function useCaptionStream() {
  const captions = useMeetingStore((state) => state.captions);
  const isConnected = useMeetingStore((state) => state.isConnected);
  const bottomRef = useRef<HTMLDivElement>(null);

  const previousCaptionCount = useRef(captions.length);

  useEffect(() => {
    const previousCount = previousCaptionCount.current;
    const currentCount = captions.length;

    if (currentCount > previousCount) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    previousCaptionCount.current = currentCount;
  }, [captions.length]);

  return {
    captions,
    isConnected,
    bottomRef,
  };
}
