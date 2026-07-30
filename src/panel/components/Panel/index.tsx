import { useState } from "react";
import type { PanelProps } from "./Panel.types";
import PanelShell from "../PanelShell";
import CaptionPrompt from "../CaptionPrompt";
import BottomNav from "../BottomNav";
import { useCaptionStream } from "../../../hooks";

export default function Panel({ open, onClose }: PanelProps) {
  const { session, isConnected, fmtTime, bottomRef } = useCaptionStream();
  const [activeTab, setActiveTab] = useState<"transcript" | "ai">("transcript");

  console.log("Inside panel", session, isConnected);

  if (!open) return null;

  // TODO: Wire this to actual caption container detection
  const captionsEnabled = true;

  const handleMinimize = () => {
    onClose();
  };

  const handleDownload = () => {
    // TODO
  };

  const sessionInfo = session
    ? `Session: ${session.id.slice(-6)} · ${session.captions.length} captions`
    : "Waiting for captions...";

  return (
    <div
      className="fixed right-0 h-[90vh] w-[420px] rounded-xl shadow-xl z-[999999]"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      <PanelShell
        isLive={isConnected}
        sessionInfo={sessionInfo}
        onMinimize={handleMinimize}
      >
        {!captionsEnabled ? (
          <CaptionPrompt />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-neutral-200 bg-white shrink-0">
              <button
                onClick={() => setActiveTab("transcript")}
                className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "transcript"
                    ? "text-neutral-900 border-b-2 border-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                Live Transcript
              </button>

              <button
                disabled
                className="flex-1 px-4 py-2.5 text-xs font-medium text-neutral-300 cursor-not-allowed flex items-center justify-center gap-1"
              >
                Ask AI
                {/* <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-400">
                  Soon
                </span> */}
              </button>
            </div>

            {/* Transcript */}
            {activeTab === "transcript" && (
              <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                {session?.captions.length === 0 && (
                  <div className="mt-8 text-center text-sm text-neutral-400">
                    Start talking during the meeting to see the transcript here.
                  </div>
                )}

                <div className="space-y-3">
                  {session?.captions.map((cap) => (
                    <div
                      key={cap.id}
                      className="rounded-lg bg-white p-3 shadow-sm border border-neutral-100"
                    >
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-medium text-neutral-700">
                          {cap.speaker}
                        </span>

                        <span>•</span>

                        <span>{fmtTime(cap.timestamp)}</span>
                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-neutral-800">
                        {cap.text}
                      </p>
                    </div>
                  ))}

                  <div ref={bottomRef} />
                </div>
              </div>
            )}

            {/* AI */}
            {activeTab === "ai" && (
              <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
                AI features coming soon
              </div>
            )}

            <BottomNav canDownload={false} onDownload={handleDownload} />
          </>
        )}
      </PanelShell>
    </div>
  );
}
