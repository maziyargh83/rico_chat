import { create } from "zustand";

interface useClientState {
  userId?: string;
  token?: string;
  setUSerID: (id: string) => void;
  setToken: (token: string) => void;
}

export const useClient = create<useClientState>((set) => ({
  userId: undefined,
  token: undefined,
  setUSerID: (id) => set({ userId: id }),
  setToken: (token) => set({ token }),
}));
