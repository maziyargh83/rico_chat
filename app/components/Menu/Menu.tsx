import { Link } from "@remix-run/react";
import clsx from "clsx";
import { v4 } from "uuid";
import type { ConversationsType } from "~/services/http/conversation.service";
import { useConversations } from "~/store/useConversations";

interface MenuItemType {
  conversation: ConversationsType;
}
export const Menu = () => {
  const conversations = useConversations((store) => store.conversations);
  if (!conversations) return <p>"loading..."</p>;
  const items = conversations.map((item) => (
    <MenuItem key={v4()} conversation={item} />
  ));
  return (
    <div className="flex flex-col items-center space-y-4 mt-4">{items}</div>
  );
};

const MenuItem = ({ conversation }: MenuItemType) => {
  return (
    <Link to={"/chat/" + conversation.objectId}>
      <Avatar conversation={conversation} />
    </Link>
  );
};

export const Avatar = ({
  conversation,
  full,
  small,
}: MenuItemType & { full?: boolean; small?: boolean }) => {
  return (
    <div
      className={clsx(" bg-slate-900 flex items-center  justify-center", {
        "rounded-md": !full,
        "rounded-full": full,
        "w-16 h-16": !small,
        "w-10 h-10": small,
      })}
    >
      <span className="text-white text-xl font-black uppercase select-none">
        {conversation.title[0]}
      </span>
    </div>
  );
};
