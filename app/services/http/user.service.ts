import axios from "axios";
import { config } from "~/Config";
import { ConversationsType } from "~/services/http/conversation.service";
import { GenericResponse } from "~/types/api";
import type { BaseResponse } from "~/types/api/GenericResponseType";
interface sendCodeApiResponse {
  timer: number;
}
export const sendCodeApi = async (email: string) => {
  const res = await axios.post<BaseResponse<sendCodeApiResponse>>(
    config.baseUrl + "sendCode",
    {
      email,
    }
  );
  return new GenericResponse<sendCodeApiResponse>(res.data);
};
export interface loginUserApiResponse {
  user: {
    objectId: string;
    email: string;
    createdAt: string;
    updateAt: string;
  };
  accessToken: string;
}
export interface storedUser {
  objectId: string;
  email: string;
  createdAt: string;
  updateAt: string;
  accessToken: string;
}
export const loginUserApi = async (email: string, code: string) => {
  const res = await axios.post<BaseResponse<loginUserApiResponse>>(
    config.baseUrl + "user/login",
    {
      email,
      code,
    }
  );
  return new GenericResponse<loginUserApiResponse>(res.data);
};
export const JoinConversation = async (
  conversationId: string,
  token: string
) => {
  const res = await axios.put<BaseResponse<ConversationsType>>(
    config.conversationBaseUrl + "conversation/add-user/" + conversationId,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return new GenericResponse<ConversationsType>(res.data);
};
