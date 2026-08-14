import type { Caption } from "../../../../../types/global";
import { getSpeakerColor, formatElapsed } from "./TranscriptList.helpers";

type TranscriptListProps = {
  captions: Caption[];
};

export default function TranscriptList({ captions }: TranscriptListProps) {
  const startedAt = captions[0]?.timestamp ?? 0;

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
      {captions.length === 0 ? (
        <p className="text-sm leading-relaxed text-center text-neutral-400 mt-6">
          No captions in this meeting.
        </p>
      ) : (
        captions.map((t, i) => (
          <div
            key={t.id ?? i}
            className="flex gap-4 py-3 border-b border-neutral-100 last:border-0"
          >
            <span className="text-recap font-semibold text-xs shrink-0 w-12 pt-0.5">
              {formatElapsed(t.timestamp - startedAt)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-800 leading-relaxed">
                {t.text}
              </p>
              <span
                className={`text-xs font-medium mt-1.5 block ${getSpeakerColor(t.speaker)}`}
              >
                {t.speaker}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
