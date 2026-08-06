import type { ButtonConfig, BottomNavProps } from "./BottomNav.types";
import { DownloadIcon } from "../../../Assets";
import { PauseIcon } from "../../../Assets";
import { PlayIcon } from "../../../Assets";

export const buttonConfig: ButtonConfig[] = [
  {
    key: "toggleRecording",
    icon: (props: BottomNavProps) =>
      props.isRecording ? <PauseIcon /> : <PlayIcon />,
    onClick: (props: BottomNavProps) => props.onToggleRecording(),
    disabled: (props) => props.showResumePrompt,
  },
  {
    key: "download",
    icon: () => <DownloadIcon />,
    onClick: (props: BottomNavProps) => props.onDownload(),
    disabled: (props) => !props.canDownload,
  },
];
