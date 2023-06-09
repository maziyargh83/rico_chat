import { Link } from "@remix-run/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { FiList, FiLogOut, FiPlus } from "react-icons/fi";
import { v4 } from "uuid";
import type { ConversationsType } from "~/services/http/conversation.service";
import { useConversations } from "~/store/useConversations";

interface MenuItemType {
  conversation: ConversationsType;
  className?: string;
}
export const Menu = () => {
  const conversations = useConversations((store) => store.conversations);
  if (!conversations) return <p>"loading..."</p>;
  const items = conversations.map((item) => (
    <MenuItem key={v4()} conversation={item} />
  ));
  return (
    <div className="flex flex-col justify-between h-full py-10 pt-5">
      <div className="flex flex-col items-center space-y-4 mt-4">{items}</div>
      <div className="flex flex-col items-center space-y-5 justify-center ">
        <Link to={"/auth/logout"}>
          <FiLogOut className="text-red-400" size={20} />
        </Link>
        <Link to={"/chat/conversation/join"}>
          <FiList className="text-light" size={20} />
        </Link>
        <Link to={"/chat/conversation/create"}>
          <FiPlus className="text-light" size={20} />
        </Link>
      </div>
    </div>
  );
};

export const MenuItem = ({
  conversation,
  children,
  className,
}: PropsWithChildren<MenuItemType>) => {
  return (
    <Link to={"/chat/" + conversation.objectId} className={className}>
      <Avatar conversation={conversation} />
      {children}
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
