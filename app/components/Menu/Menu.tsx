import { Link } from "@remix-run/react";
import { v4 } from "uuid";
import type { ConversationsType } from "~/services/http/conversation.service";
interface MenuType {
  conversations: ConversationsType[];
}
interface MenuItemType {
  conversation: ConversationsType;
}
export const Menu = ({ conversations }: MenuType) => {
  const items = conversations.map((item) => (
    <MenuItem key={v4()} conversation={item} />
  ));
  return (
    <div className="flex flex-col items-center space-y-4 mt-4">{items}</div>
  );
};

const MenuItem = ({ conversation }: MenuItemType) => {
  return (
    <Link
      to={"/chat/" + conversation.objectId}
      className="w-16 h-16 bg-slate-900 flex items-center  justify-center rounded-md"
    >
      <span className="text-white text-xl font-black uppercase select-none">
        {conversation.title[0]}
      </span>
    </Link>
  );
};
