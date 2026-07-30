import { useState } from "react";
import Widget from "./components/Widget";
import Panel from "./components/Panel";

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <Widget hidden={isPanelOpen} onOpenPanel={() => setIsPanelOpen(true)} />
      <Panel open={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}
