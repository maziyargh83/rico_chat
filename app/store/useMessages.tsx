import { create } from "zustand";
import type { MessageType } from "~/services/http/conversation.service";

interface useMessageType {
  Message: Map<string, MessageType>;
  setMessages: (Messages: MessageType[]) => void;
  setMessage: (Messages: MessageType) => void;
  clear: () => void;
}

export const useMessage = create<useMessageType>((set) => ({
  Message: new Map(),
  setMessages: (Messages) => {
    set((prev) => {
      const data = new Map(prev.Message);
      Messages.forEach((item) => {
        data.set(item.objectId, item);
      });
      return { Message: data };
    });
  },

  setMessage: (Message) => {
    set((prev) => {
      const data = new Map(prev.Message);
      data.set(Message.conversationId, Message);
      return { Message: data };
    });
  },

  clear: () => {
    set({ Message: new Map() });
  },
}));
