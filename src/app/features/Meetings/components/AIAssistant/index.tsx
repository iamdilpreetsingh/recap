import { useState } from "react";
import { askQuestion } from "../../../../lib/meetings";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type AIAssistantProps = {
  meetingId: string;
};

export default function AIAssistant({ meetingId }: AIAssistantProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [asking, setAsking] = useState(false);

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed || asking) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setQuestion("");
    setAsking(true);

    try {
      const answer = await askQuestion(meetingId, trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", text: message }]);
    } finally {
      setAsking(false);
    }
  };

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

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5">
        <div className="bg-[#f7f5ff] rounded-xl px-3.5 py-2.5 max-w-fit">
          <p className="text-xs text-neutral-700">
            Hi! I'm Recap's AI Assistant. Ask me anything about this meeting.
          </p>
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3.5 py-2.5 w-fit max-w-[85%] ${
              m.role === "user"
                ? "bg-recap text-white ml-auto"
                : "bg-[#f7f5ff] text-neutral-700"
            }`}
          >
            <p className="text-xs">{m.text}</p>
          </div>
        ))}

        {asking && (
          <div className="bg-[#f7f5ff] rounded-xl px-3.5 py-2.5 max-w-fit flex items-center gap-2">
            <i
              className="ti ti-loader-2 animate-spin text-recap"
              style={{ fontSize: 13 }}
              aria-hidden="true"
            />
            <p className="text-xs text-neutral-400">Thinking...</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 shrink-0 pt-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Enter your question"
          className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-500 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-recap"
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || asking}
          className="px-4 py-2 bg-recap text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
