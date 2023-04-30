import { type LoaderArgs, defer, redirect } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Fragment, Suspense, useEffect } from "react";
import { Layout, Menu, SideBar } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  type ConversationsType,
  getAllConversations,
} from "~/services/http/conversation.service";
import {
  storedUser,
  type loginUserApiResponse,
} from "~/services/http/user.service";
import { useClient } from "~/store/useClient";
import type { BaseResponse } from "~/types/api/GenericResponseType";

export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(request)) as storedUser;
  if (!user) return redirect("/");
  const getConversations = getAllConversations(user.accessToken);
  console.log("====================================");
  console.log(user);
  console.log("====================================");

  return defer({
    conversations: getConversations,
    objectId: user.objectId,
  });
}
export default function () {
  const data = useLoaderData();
  const setUSerID = useClient((store) => store.setUSerID);
  useEffect(() => {
    if (data.objectId) setUSerID(data.objectId);
    console.log("====================================");
    console.log(data);
    console.log("====================================");
  }, [data.objectId]);
  return (
    <Fragment>
      <Layout>
        <SideBar>
          <Suspense fallback={<p>Loading package location...</p>}>
            <Await
              resolve={data.conversations}
              errorElement={<p>Error loading package location!</p>}
            >
              {(conversations: BaseResponse<ConversationsType[]>) => {
                return <Menu conversations={conversations.result} />;
              }}
            </Await>
          </Suspense>
        </SideBar>
      </Layout>
    </Fragment>
  );
}
