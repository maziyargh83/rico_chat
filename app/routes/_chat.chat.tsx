import { Outlet, useParams } from "@remix-run/react";
import { type KeyboardEvent, useState, useMemo } from "react";
import { FiSend } from "react-icons/fi";
import { Avatar } from "~/components";
import { useConversations } from "~/store/useConversations";
export default function () {
  const [inputValue, setInputValue] = useState<string>("");
  let { id } = useParams();
  const conversations = useConversations((store) => store.conversations);
  const activeConversation = useMemo(() => {
    if (!id || conversations.length == 0) return;
    return conversations.find((item) => item.objectId == id);
  }, [conversations, id]);

  const createMessage = () => {
   
  };
  const detectEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      createMessage();
    }
  };
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
          <button className="px-4 text-reverse" onClick={createMessage}>
            <FiSend />
          </button>
        </div>
      )}
    </div>
  );
}
