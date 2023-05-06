import { create } from "zustand";
import type { Socket } from "socket.io-client";
interface useClientState {
  userId?: string;
  token?: string;
  socket?: Socket;
  setUSerID: (id: string) => void;
  setSocket: (io: Socket) => void;
  setToken: (token: string) => void;
}

export const useClient = create<useClientState>((set) => ({
  userId: undefined,
  token: undefined,
  socket: undefined,
  setSocket(io) {
    set({ socket: io });
  },
  setUSerID: (id) => set({ userId: id }),
  setToken: (token) => set({ token }),
}));
