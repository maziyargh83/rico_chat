import { create } from "zustand";

interface useClientState {
  userId?: string;
  setUSerID: (id: string) => void;
}

export const useClient = create<useClientState>((set) => ({
  userId: undefined,
  setUSerID: (id) => set({ userId: id }),
}));
