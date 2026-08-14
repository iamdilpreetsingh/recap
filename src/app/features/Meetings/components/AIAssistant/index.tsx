import { useState } from "react";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");

  return (
    <div className="flex flex-col h-full min-h-0 border-t border-neutral-100 pt-5">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <i
          className="ti ti-sparkles text-recap"
          style={{ fontSize: 13 }}
          aria-hidden="true"
        />
        <h2 className="text-sm font-semibold text-neutral-800">
          Recap AI Assistant
        </h2>
        <span className="text-[10px] font-medium bg-recap-light text-recap px-2 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="bg-[#f7f5ff] rounded-xl px-3.5 py-2.5 max-w-fit">
          <p className="text-xs text-neutral-700">
            Hi! I'm Recap's AI Assistant. How can I help you today?
          </p>
        </div>
      </div>

      <div className="flex gap-2 shrink-0 pt-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-recap"
        />
        <button
          disabled={!question.trim()}
          className="px-4 py-2 bg-recap text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
