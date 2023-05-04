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
          "min-w-[100px] bg-primary text-sm font-normal text-light py-2 px-2 rounded-2xl inline-flex",
          {
            "float-right": isMine,
            "rounded-bl-none": !isMine,
            "rounded-br-none": isMine,
          }
        )}
      >
        {message.text}
      </div>
    </div>
  );
};
