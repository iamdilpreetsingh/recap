import type { ReactNode } from "react";

export type SectionProps = {
  label: string;
  children: ReactNode;
  isEmpty?: boolean;
};
