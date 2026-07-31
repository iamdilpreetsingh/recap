import type { Caption } from "../types/global";

export interface MeetingState {
  meetingActive: boolean;
  captionsEnabled: boolean;
  isConnected: boolean;
  captions: Caption[];

  // actions
  setMeetingActive: (active: boolean) => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  addCaption: (caption: Caption) => void;
  clearCaptions: () => void;
}
