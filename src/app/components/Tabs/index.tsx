import { useState, useRef } from "react";
import type { TabsProps } from "./Tabs.types";

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleArrowNav = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight") {
      const next = (i + 1) % tabs.length;
      setActiveTab(tabs[next].id);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      const prev = (i - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prev].id);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        role="tablist"
        className="flex border-b border-neutral-200 bg-white shrink-0 overflow-visible"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={tab.id === activeTab}
            aria-controls="tabpanel"
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            tabIndex={tab.id === activeTab ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            onKeyDown={handleArrowNav}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
              tab.id === activeTab
                ? "text-recap border-b-2 border-recap"
                : tab.disabled
                  ? "text-neutral-300 cursor-not-allowed"
                  : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="tabpanel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex flex-col flex-1 min-h-0"
      >
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
