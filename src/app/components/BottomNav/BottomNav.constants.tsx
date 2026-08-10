import type { ButtonConfig } from "./BottomNav.types";
import { DownloadIcon, PauseIcon, PlayIcon } from "../../../Assets";
import { useMeetingStore } from "../../../store/meetingStore";
import { resumeObserving } from "../../../content/observers/captionObserver";

export const buttonConfig: ButtonConfig[] = [
  {
    key: "toggleRecording",
    icon: (isRecording) => (isRecording ? <PauseIcon /> : <PlayIcon />),
    onClick: () => {
      const { isRecording, setIsRecording } = useMeetingStore.getState();
      if (!isRecording) resumeObserving();
      setIsRecording(!isRecording);
    },
    disabled: () => useMeetingStore.getState().showResumePrompt,
  },
  {
    key: "download",
    icon: () => <DownloadIcon />,
    onClick: () => {},
    disabled: () => true,
  },
];
