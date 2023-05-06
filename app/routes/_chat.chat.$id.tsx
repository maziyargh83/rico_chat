import { redirect, type LoaderArgs, defer } from "@remix-run/node";
import {
  Await,
  useLoaderData,
  useLocation,
  useRevalidator,
} from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { v4 } from "uuid";
import { RenderMessages } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  type MessageType,
  getConversationMessage,
} from "~/services/http/conversation.service";
import { type loginUserApiResponse } from "~/services/http/user.service";
import { useMessage } from "~/store/useMessages";
import { type BaseResponse } from "~/types/api/GenericResponseType";
export async function loader({ params, request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(
    request
  )) as loginUserApiResponse;
  if (!user) return redirect("/");

  const getMessages = getConversationMessage(params.id!, user.accessToken);

  return defer({
    messages: getMessages,
  });
}

export default function () {
  const data = useLoaderData();
  const MessageState = useMessage();
  const location = useLocation();

  useEffect(() => {
    data.messages.then((data: BaseResponse<MessageType[]>) => {
      MessageState.setMessages(data.result);
    });
  }, [location]);

  return <RenderMessages key={v4()} />;
}
