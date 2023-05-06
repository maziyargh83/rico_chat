import { type LoaderArgs, defer, redirect } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Fragment, Suspense } from "react";
import { v4 } from "uuid";
import { MenuItem } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  ConversationsType,
  getAllConversations,
} from "~/services/http/conversation.service";
import type { storedUser } from "~/services/http/user.service";
import { BaseResponse } from "~/types/api/GenericResponseType";

export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(request)) as storedUser;
  if (!user) return redirect("/");
  const getConversations = getAllConversations(user.accessToken);
  return defer({
    conversations: getConversations,
    objectId: user.objectId,
    token: user.accessToken,
  });
}
export default function () {
  const { conversations, objectId } = useLoaderData();

  return (
    <div className="flex flex-col flex-1 p-10">
      <h1 className="text-center text-light text-2xl font-bold">
        Join Conversation
      </h1>
      <Suspense fallback={<p>Loading package location...</p>}>
        <Await
          resolve={conversations}
          errorElement={<p>Error loading package location!</p>}
        >
          {(conversation: BaseResponse<ConversationsType[]>) => {
            return (
              <div className=" w-full">
                <div className="flex flex-1">
                  {conversation.result.map((item) => {
                    const isJoined = item.users.find(
                      (_item) => _item == objectId
                    );
                    return (
                      <MenuItem
                        className="flex flex-col items-center space-y-3 bg-primary w-full sm:w-1/6 m-2 p-3 rounded"
                        key={v4()}
                        conversation={item}
                      >
                        <div className="text-light text-center">
                          <p>{item.title}</p>
                          <p>{item.description}</p>
                        </div>
                        {!isJoined && (
                          <div className="px-2 py-2 border-body border hover:bg-body border-body/25 w-full text-center text-light ">
                            Join
                          </div>
                        )}
                      </MenuItem>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
