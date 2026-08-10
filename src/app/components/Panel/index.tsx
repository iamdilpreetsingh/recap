import type { PanelProps } from "./Panel.types";
import PanelShell from "../PanelShell";
import EnableCaptionPrompt from "../EnableCaptionPrompt";
import { useDrag } from "../../../hooks";
import { useMeetingStore } from "../../../store/meetingStore";
import Tabs from "../Tabs";
import { panelTabs } from "./Panel.constants";

export default function Panel({ open, onClose }: PanelProps) {
  const captionsEnabled = useMeetingStore((s) => s.captionsEnabled);
  const { position, onMousedown } = useDrag();

  if (!open) return null;

  return (
    <div
      className="fixed right-0 h-[90vh] w-[320px] rounded-xl shadow-xl z-[999999] overflow-hidden"
      style={{
        top: "50%",
        transform: `translateY(-53%) translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={onMousedown}
    >
      <PanelShell onMinimize={onClose}>
        {!captionsEnabled ? <EnableCaptionPrompt /> : <Tabs tabs={panelTabs} />}
      </PanelShell>
    </div>
  );
}
