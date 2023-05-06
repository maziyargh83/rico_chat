import { create } from "zustand";
import type { MessageType } from "~/services/http/conversation.service";

interface useMessageType {
  Message: Map<string, MessageType>;
  editMessageId: string | undefined;
  setEditMessageId: (editMessageId?: string) => void;
  setMessages: (Messages: MessageType[]) => void;
  setMessage: (Messages: MessageType) => void;
  setUpdateMessage: (Messages: MessageType) => void;
  setDeleteMessage: (id: string) => void;
  clear: () => void;
}

export const useMessage = create<useMessageType>((set) => ({
  editMessageId: undefined,
  Message: new Map(),
  setEditMessageId(editMessageId) {
    set({ editMessageId });
  },
  setDeleteMessage(Messages) {
    set((prev) => {
      const data = new Map(prev.Message);
      data.delete(Messages);
      return { Message: data };
    });
  },
  setUpdateMessage(Messages) {
    set((prev) => {
      const data = new Map(prev.Message);
      data.set(Messages.objectId, Messages);
      return { Message: data };
    });
  },
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
    const _Message = new Map(useMessage.getState().Message).set(
      Message.objectId,
      Message
    );
    set({
      Message: _Message,
    });
  },

  clear: () => {
    set({ Message: new Map() });
  },
}));
