import type { ReactNode } from "react";

export interface BottomNavProps {
  canDownload?: boolean;
  onDownload?: () => void;
}

export interface ButtonConfig {
  key: string;
  icon: (isRecording: boolean) => ReactNode;
  onClick: () => void;
  disabled?: () => boolean;
}
