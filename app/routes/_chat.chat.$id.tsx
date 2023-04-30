import { redirect, type LoaderArgs, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { v4 } from "uuid";
import { RenderMessages } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  type MessageType,
  getConversationMessage,
} from "~/services/http/conversation.service";
import { type loginUserApiResponse } from "~/services/http/user.service";
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

  return (
    <Suspense fallback={<p>Loading package location...</p>}>
      <Await
        resolve={data.messages}
        errorElement={<p>Error loading package location!</p>}
      >
        {(messages: BaseResponse<MessageType[]>) => {
          return <RenderMessages key={v4()} messages={messages.result} />;
        }}
      </Await>
    </Suspense>
  );
}
