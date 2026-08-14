import { useEffect, useState } from "react";
import type { MeetingSummary } from "../../../../lib/meeting.types";

const FALLBACK_DELAY_MS = 15_000;

type AISummaryProps = {
  summary: MeetingSummary | null;
  onRetry: () => Promise<void>;
};

function summaryToPlainText(summary: MeetingSummary) {
  const overview = summary.detailedOverview
    .map((s) => `- ${s.label}: ${s.text}`)
    .join("\n");
  return `Meeting Summary: ${summary.meetingSummary}\n\nDetailed Overview\n${overview}\n\nNext Steps\n${summary.nextSteps}`;
}

export default function AISummary({ summary, onRetry }: AISummaryProps) {
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (summary) {
      setShowFallback(false);
      return;
    }
    const timer = setTimeout(() => setShowFallback(true), FALLBACK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [summary]);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summaryToPlainText(summary));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-800">Summary</h2>
        {summary && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <i
              className={`ti ${copied ? "ti-check" : "ti-copy"}`}
              style={{ fontSize: 13 }}
              aria-hidden="true"
            />
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {!summary && (
        <div className="flex flex-col items-start gap-3 py-2">
          <div className="flex items-center gap-2">
            <i
              className="ti ti-loader-2 animate-spin text-recap"
              style={{ fontSize: 14 }}
              aria-hidden="true"
            />
            <p className="text-xs text-neutral-400">
              {showFallback
                ? "Still generating... if this doesn't finish soon, it may have failed."
                : "Generating summary..."}
            </p>
          </div>
          {showFallback && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ecff] text-recap text-xs font-medium rounded-lg hover:bg-[#e4dcff] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
            >
              <i
                className={`ti ${retrying ? "ti-loader-2 animate-spin" : "ti-refresh"}`}
                style={{ fontSize: 13 }}
                aria-hidden="true"
              />
              {retrying ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-800">
              Meeting Summary:{" "}
            </span>
            {summary.meetingSummary}
          </p>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              Detailed Overview
            </p>
            <ul className="space-y-2">
              {summary.detailedOverview.map((section, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed"
                >
                  <span className="mt-2 w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                  <span>
                    <span className="font-semibold text-neutral-800">
                      {section.label}{" "}
                    </span>
                    {section.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              Next Steps
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {summary.nextSteps}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
