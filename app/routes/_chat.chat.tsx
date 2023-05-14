import { type LoaderArgs, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { type KeyboardEvent, useState, useMemo, useEffect } from "react";
import { FiEdit, FiSend, FiTrash, FiX } from "react-icons/fi";
import { Avatar } from "~/components";
import { Join } from "~/components/Join";
import { authenticator } from "~/services/auth.server";
import {
  CreateMessage,
  UpdateMessage,
  leaveChat,
} from "~/services/http/conversation.service";
import {
  JoinConversation,
  type storedUser,
} from "~/services/http/user.service";
import { useConversations } from "~/store/useConversations";
import { useMessage } from "~/store/useMessages";
import { createMessage } from "~/types/createMessage";
export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(request)) as storedUser;
  if (!user) return redirect("/");
  return { token: user.accessToken, objectId: user.objectId };
}
export default function () {
  const [inputValue, setInputValue] = useState<string>("");
  let { id } = useParams();
  const { token, objectId } = useLoaderData();
  const location = useLocation();
  const MessageState = useMessage();
  const revalidate = useRevalidator();
  const conversations = useConversations((store) => store.conversations);
  const navigate = useNavigate();

  const activeConversation = useMemo(() => {
    if (!id || conversations.length == 0) return;
    return conversations.find((item) => item.objectId == id);
  }, [conversations, id]);
  const isJoined = useMemo(() => {
    return activeConversation?.users.filter((item) => item == objectId);
  }, [activeConversation]);
  const onCreateMessage = async () => {
    if (!id) return;
    if (MessageState.editMessageId) {
      const res = await UpdateMessage(
        inputValue,
        MessageState.editMessageId,
        token
      );

      resetEdit();
      setInputValue("");
      MessageState.setUpdateMessage(res.result);
    } else {
      const data = new createMessage(id, inputValue);
      const res = await CreateMessage(data, token);
      setInputValue("");
      MessageState.setMessage(res.result);
    }
  };
  const detectEnter = (e: KeyboardEvent) => {
    if ((e.key === "Enter" && e.metaKey) || (e.key === "Enter" && e.ctrlKey)) {
      onCreateMessage();
    }
  };
  useEffect(() => {
    if (MessageState.editMessageId) {
      const data = MessageState.Message.get(MessageState.editMessageId);
      if (data) setInputValue(data?.text!);
    }
  }, [MessageState.editMessageId]);
  const join = async () => {
    if (!id) return;
    await JoinConversation(id, token);

    revalidate.revalidate();
  };
  const leave = async () => {
    if (!id) return;
    await leaveChat(id, objectId, token);
    navigate("/chat");
    revalidate.revalidate();
  };
  const resetEdit = () => {
    MessageState.setEditMessageId(undefined);
  };
  useEffect(() => {
    MessageState.clear();
  }, [location]);
  return (
    <div className="flex flex-col max-h-screen justify-between h-full">
      {activeConversation && (
        <div className="h-16 px-5 bg-primary border-b border-border flex items-center space-x-2">
          <Avatar small full conversation={activeConversation} />
          <span className="text-light">{activeConversation.title}</span>
          <div className="flex-1" />
          <FiTrash onClick={leave} className="text-red-400" />
          <Link to={"/chat/conversation/edit/" + id}>
            <FiEdit className="text-green-400" />
          </Link>
        </div>
      )}
      <div className="overflow-auto h-full">
        {!isJoined && id ? <Join /> : <Outlet />}
      </div>
      {id && isJoined && (
        <div>
          {MessageState.editMessageId && (
            <div className="flex p-3 px-4 bg-primary">
              <span className="text-light mr-5">Editing :</span>
              <p className=" text-white/25 flex-1">
                {(
                  MessageState.Message.get(MessageState.editMessageId)?.text ||
                  ""
                ).slice(0, 40) + "..."}
              </p>
              <FiX className="text-red-400" onClick={resetEdit} />
            </div>
          )}
          <div className="p-4 relative flex border-t border-border bg-primary">
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
        </div>
      )}
      {!isJoined && id && (
        <div className="flex justify-center mb-4">
          <p
            onClick={join}
            className="bg-primary rounded border border-light cursor-pointer w-[300px] p-4 text-center text-light"
          >
            join
          </p>
        </div>
      )}
    </div>
  );
}
