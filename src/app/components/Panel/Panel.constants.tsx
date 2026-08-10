import { AskRecapAi, History, LiveTranscript } from "./views";

export const panelTabs = [
  { id: "transcript", label: "Transcript", content: <LiveTranscript /> },
  { id: "history", label: "History", content: <History /> },
  {
    id: "ai",
    label: "Ask AI",
    content: <AskRecapAi />,
    disabled: true,
  },
];
