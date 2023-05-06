import { type LoaderArgs, defer, redirect } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { Fragment, useEffect } from "react";
import { Layout, Menu, SideBar } from "~/components";
import { authenticator } from "~/services/auth.server";
import {
  type ConversationsType,
  getJoinedConversations,
} from "~/services/http/conversation.service";
import type { storedUser } from "~/services/http/user.service";
import { useClient } from "~/store/useClient";
import { useConversations } from "~/store/useConversations";
import { useMessage } from "~/store/useMessages";
import type { BaseResponse } from "~/types/api/GenericResponseType";

export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(request)) as storedUser;
  if (!user) return redirect("/");
  const getConversations = getJoinedConversations(user.accessToken);
  return defer({
    conversations: getConversations,
    objectId: user.objectId,
  });
}
export default function () {
  const data = useLoaderData();
  const location = useLocation();
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
  useEffect(() => {
    // MessageState.clear();
  }, [location]);
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
