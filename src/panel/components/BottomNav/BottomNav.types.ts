export type ButtonConfig = {
  key: string;
  icon?: (props: BottomNavProps) => React.ReactNode;
  onClick: (props: BottomNavProps) => void;
  disabled?: (props: BottomNavProps) => boolean;
};

export interface BottomNavProps {
  isRecording?: boolean;
  onToggleRecording?: () => void;
  canDownload?: boolean;
  onDownload?: () => void;
  showResumePrompt?: boolean;
}
