import clsx from "clsx";
import type { MessageType } from "~/services/http/conversation.service";
import { useClient } from "~/store/useClient";

interface MessageProps {
  message: MessageType;
}
export const Message = ({ message }: MessageProps) => {
  const objectID = useClient((store) => store.userId);
  const isMine = objectID == message.userId;
  return (
    <div className="relative my-3">
      <div
        className={clsx(
          "min-w-[100px] bg-slate-600 py-4 px-2 rounded-2xl inline-flex",
          {
            "float-right": isMine,
            "rounded-tl-none": !isMine,
            "rounded-tr-none": isMine,
          }
        )}
      >
        {message.text}
      </div>
    </div>
  );
};
