import axios from "axios";
import { config } from "~/Config";
import { type BaseResponse } from "~/types/api/GenericResponseType";

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
export const getJoinedConversations = async () => {
  const res = await axios.get<BaseResponse<ConversationsType[]>>(
    config.conversationBaseUrl + "conversation/joined"
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
