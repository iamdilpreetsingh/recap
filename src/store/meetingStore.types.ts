import type { Caption } from "../types/global";

export interface MeetingState {
  meetingActive: boolean;
  captionsEnabled: boolean;
  isConnected: boolean;
  captions: Caption[];
  activeMeetingId: string | null;
  isRecording: boolean;
  showResumePrompt: boolean;

  // actions
  setMeetingActive: (active: boolean) => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  addCaption: (caption: Caption) => void;
  clearCaptions: () => void;
  setActiveMeetingId: (id: string | null) => void;
  setIsRecording: (connected: boolean) => void;
  setShowResumePrompt: (val: boolean) => void;
  loadCaptions: (captions: Caption[]) => void;
}
