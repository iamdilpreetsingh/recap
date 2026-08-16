import type { ReactNode } from "react";
import Sidebar from "../Sidebar";
import AvatarMenu from "../AvatarMenu";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="fixed top-4 right-6 z-20">
        <AvatarMenu />
      </div>
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
