import type { Caption } from "../types/global";

export interface MeetingState {
  meetingActive: boolean;
  captionsEnabled: boolean;
  // Whether the "Turn on captions" toggle exists in the DOM yet. Google
  // Meet renders no call controls (including this toggle) while a
  // participant is waiting in the lobby to be admitted, so this doubles
  // as the "has a host admitted this user" signal.
  captionsToggleAvailable: boolean;
  isConnected: boolean;
  captions: Caption[];
  activeMeetingId: string | null;
  isRecording: boolean;
  showResumePrompt: boolean;
  showTranscription: boolean;

  // actions
  setMeetingActive: (active: boolean) => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setCaptionsToggleAvailable: (available: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  addCaption: (caption: Caption) => void;
  clearCaptions: () => void;
  setActiveMeetingId: (id: string | null) => void;
  setIsRecording: (connected: boolean) => void;
  setShowResumePrompt: (val: boolean) => void;
  setShowTranscription: (val: boolean) => void;
  loadCaptions: (captions: Caption[]) => void;
}
