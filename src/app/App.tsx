import { useState } from "react";
import { Panel, Widget } from "./components";

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <Widget hidden={isPanelOpen} onOpenPanel={() => setIsPanelOpen(true)} />
      <Panel open={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}
