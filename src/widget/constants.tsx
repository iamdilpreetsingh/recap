import {
  Collapse,
  Expand,
  OpenExternalLink,
  PauseIcon,
  PlayIcon,
} from "../Assets";
import { resumeObserving } from "../content/observers/captionObserver";
import { useMeetingStore } from "../store/meetingStore";

export const WIDGET_WIDTH = 442;
export const WIDGET_Z_INDEX = 999999;

export type ButtonConfig = {
  key: string;
  title: string;
  icon: () => React.ReactNode;
  onClick: () => void;
  disabled?: () => boolean;
  show?: () => boolean;
};

export const getButtonConfig = (
  isRecording: boolean,
  showTranscription: boolean,
  showResumePrompt: boolean,
): ButtonConfig[] => [
  {
    key: "toggleRecording",
    title: isRecording ? "Pause" : "Resume",
    icon: () => (isRecording ? <PauseIcon /> : <PlayIcon />),
    onClick: () => {
      if (!isRecording) resumeObserving();
      useMeetingStore.getState().setIsRecording(!isRecording);
    },
    disabled: () => showResumePrompt,
    show: () => useMeetingStore.getState().captionsEnabled,
  },
  {
    key: "openRecap",
    title: "Open Recap",
    icon: () => <OpenExternalLink />,
    onClick: () => {
      console.log("[Recap] Sending OPEN_APP message");
      chrome.runtime.sendMessage({ type: "OPEN_APP" });
    },
  },
  {
    key: "toggleTranscription",
    title: showTranscription ? "Collapse" : "Expand",
    icon: () => (showTranscription ? <Collapse /> : <Expand />),
    onClick: () =>
      useMeetingStore.getState().setShowTranscription(!showTranscription),
    show: () => useMeetingStore.getState().captionsEnabled,
  },
];
