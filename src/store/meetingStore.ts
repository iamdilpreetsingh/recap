import { create } from "zustand";
import type { MeetingState } from "./meetingStore.types";
import type { Caption } from "../types/global";

export const useMeetingStore = create<MeetingState>((set) => ({
  meetingActive: false,
  captionsEnabled: false,
  captionsToggleAvailable: false,
  isConnected: false,
  captions: [],
  activeMeetingId: null,
  isRecording: false,
  showResumePrompt: false,
  showTranscription: true,

  // actions
  setMeetingActive: (active) => set({ meetingActive: active }),
  setCaptionsEnabled: (enabled) => set({ captionsEnabled: enabled }),
  setCaptionsToggleAvailable: (available) =>
    set({ captionsToggleAvailable: available }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  addCaption: (caption) =>
    set((state) => ({ captions: [...state.captions, caption] })),
  clearCaptions: () => set({ captions: [] }),
  setActiveMeetingId: (id) => set({ activeMeetingId: id }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setShowResumePrompt: (val) => set({ showResumePrompt: val }),
  setShowTranscription: (val) => set({ showTranscription: val }),
  loadCaptions: (captions: Caption[]) => set({ captions }),
}));
