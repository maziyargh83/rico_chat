import { create } from "zustand";
import type { ConversationsType } from "~/services/http/conversation.service";

interface useConversationsType {
  conversations: ConversationsType[];
  setConversations: (conversations: ConversationsType[]) => void;
}

export const useConversations = create<useConversationsType>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}));
