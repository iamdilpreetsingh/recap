import type { ReactNode } from "react";
import Sidebar from "../Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
