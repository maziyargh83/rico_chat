import { type LoaderArgs, defer, redirect } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Fragment, Suspense, useEffect } from "react";
import { Layout, Menu, SideBar } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  type ConversationsType,
  getAllConversations,
} from "~/services/http/conversation.service";
import type { storedUser } from "~/services/http/user.service";
import { useClient } from "~/store/useClient";
import { useConversations } from "~/store/useConversations";
import type {
  BaseResponse,
  GenericResponse,
} from "~/types/api/GenericResponseType";

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
  const conversationsController = useConversations();
  useEffect(() => {
    if (data.objectId) setUSerID(data.objectId);
    data.conversations.then(
      (ConversationsType: BaseResponse<ConversationsType[]>) => {
        conversationsController.setConversations(ConversationsType.result);
      }
    );
  }, [data]);
  return (
    <Fragment>
      <Layout>
        <SideBar>
          <Menu />
        </SideBar>
      </Layout>
    </Fragment>
  );
}
