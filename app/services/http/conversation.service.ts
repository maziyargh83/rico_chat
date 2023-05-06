import axios from "axios";
import { config } from "~/Config";
import { type BaseResponse } from "~/types/api/GenericResponseType";
import { createConversation } from "~/types/createConversations";
import { createMessage } from "~/types/createMessage";

export interface ConversationsType {
  createdAt: string;
  description: string;
  objectId: string;
  ownerId: string;
  status: number;
  title: string;
  updatedAt: string;
  users: string[];
}
export interface MessageType {
  conversationId: string;
  createdAt: string;
  objectId: string;
  senderName: string;
  text: string;
  updatedAt: string;
  userId: string;
}
export const getAllConversations = async (token: string) => {
  const res = await axios.get<BaseResponse<ConversationsType[]>>(
    config.conversationBaseUrl + "conversation",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return res.data;
};
export const getJoinedConversations = async (token: string) => {
  const res = await axios.get<BaseResponse<ConversationsType[]>>(
    config.conversationBaseUrl + "conversation/joined",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const getConversationMessage = async (id: string, token: string) => {
  const res = await axios.get<BaseResponse<MessageType[]>>(
    config.conversationBaseUrl + "message/" + id,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};
export const CreateConversation = async (
  conversation: createConversation,
  token: string
) => {
  const res = await axios.post<BaseResponse<ConversationsType>>(
    config.conversationBaseUrl + "conversation",
    conversation,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};
export const updateConversation = async (
  conversation: createConversation,
  objectId: string,
  token: string
) => {
  const res = await axios.put<BaseResponse<ConversationsType>>(
    config.conversationBaseUrl + "conversation",
    { ...conversation, objectId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const CreateMessage = async (message: createMessage, token: string) => {
  const res = await axios.post<BaseResponse<MessageType>>(
    config.conversationBaseUrl + "message",
    message,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};
export const UpdateMessage = async (
  text: string,
  objectId: string,
  token: string
) => {
  const res = await axios.put<BaseResponse<MessageType>>(
    config.conversationBaseUrl + "message",
    { text, objectId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const leaveChat = async (
  conversation: string,
  user: string,
  token: string
) => {
  const res = await axios.delete<BaseResponse<MessageType>>(
    config.conversationBaseUrl +
      "conversation/leave-kick/" +
      conversation +
      "/" +
      user,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const deleteMessage = async (messageId: string, token: string) => {
  const res = await axios.delete<BaseResponse<MessageType>>(
    config.conversationBaseUrl + "message/" + messageId,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};
