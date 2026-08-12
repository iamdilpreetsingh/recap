import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  icon: (isActive: boolean) => ReactNode;
  to: string;
};

export type SidebarSection = {
  items: NavItem[];
};
