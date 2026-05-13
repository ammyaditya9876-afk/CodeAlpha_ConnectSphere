import { create } from 'zustand';

interface MeetingState {
  roomId: string | null;
  isHost: boolean;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  participants: any[];
  setRoomId: (id: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  setParticipants: (participants: any[]) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  roomId: null,
  isHost: false,
  isAudioMuted: false,
  isVideoOff: false,
  isScreenSharing: false,
  participants: [],
  setRoomId: (id) => set({ roomId: id }),
  setIsHost: (isHost) => set({ isHost }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  setParticipants: (participants) => set({ participants }),
  reset: () => set({
    roomId: null,
    isHost: false,
    isAudioMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    participants: [],
  }),
}));
