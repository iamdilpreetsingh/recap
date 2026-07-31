import { create } from "zustand";
import type { MeetingState } from "./meetingStore.types";

export const useMeetingStore = create<MeetingState>((set) => ({
  meetingActive: false,
  captionsEnabled: false,
  isConnected: false,
  captions: [],

  // actions
  setMeetingActive: (active) => set({ meetingActive: active }),
  setCaptionsEnabled: (enabled) => set({ captionsEnabled: enabled }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  addCaption: (caption) =>
    set((state) => ({ captions: [...state.captions, caption] })),
  clearCaptions: () => set({ captions: [] }),
}));
