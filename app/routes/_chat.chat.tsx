import { type LoaderArgs, redirect } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { type KeyboardEvent, useState, useMemo, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { Avatar } from "~/components";
import { authenticator } from "~/services/auth.server";
import { CreateMessage } from "~/services/http/conversation.service";
import type { loginUserApiResponse } from "~/services/http/user.service";
import { useConversations } from "~/store/useConversations";
import { useMessage } from "~/store/useMessages";
import { createMessage } from "~/types/createMessage";
export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(
    request
  )) as loginUserApiResponse;
  if (!user) return redirect("/");
  return { token: user.accessToken };
}
export default function () {
  const [inputValue, setInputValue] = useState<string>("");
  let { id } = useParams();
  const { token } = useLoaderData();
  const location = useLocation();
  const MessageState = useMessage();

  const conversations = useConversations((store) => store.conversations);
  const activeConversation = useMemo(() => {
    if (!id || conversations.length == 0) return;
    return conversations.find((item) => item.objectId == id);
  }, [conversations, id]);

  const onCreateMessage = async () => {
    if (!id) return;
    const data = new createMessage(id, inputValue);
    const res = await CreateMessage(data, token);
    MessageState.setMessage(res.result);
    setInputValue("");
  };
  const detectEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      onCreateMessage();
    }
  };
  useEffect(() => {
    MessageState.clear();
  }, [location]);
  return (
    <div className="flex flex-col justify-between h-full">
      {activeConversation && (
        <div className="h-16 px-5 bg-primary border-b border-border flex items-center space-x-2">
          <Avatar small full conversation={activeConversation} />
          <span className="text-light">{activeConversation.title}</span>
        </div>
      )}
      <div className="flex-1 flex">
        <Outlet />
      </div>
      {id && (
        <div className="p-4 flex border-t border-border bg-primary">
          <input
            type="text"
            className="flex-1 bg-transparent rounded-sm outline-none text-light p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Message..."
            onKeyDown={detectEnter}
          />
          <button className="px-4 text-reverse" onClick={onCreateMessage}>
            <FiSend />
          </button>
        </div>
      )}
    </div>
  );
}
