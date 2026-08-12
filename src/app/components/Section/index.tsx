import type { ReactNode } from "react";

type SectionProps = {
  label: string;
  children: ReactNode;
  isEmpty?: boolean;
};

export default function Section({ label, children, isEmpty }: SectionProps) {
  if (isEmpty) return null;

  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase mb-3 px-1">
        {label}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
