import { useRevalidator } from "@remix-run/react";
import clsx from "clsx";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  deleteMessage,
  type MessageType,
} from "~/services/http/conversation.service";
import { useClient } from "~/store/useClient";
import { useMessage } from "~/store/useMessages";

interface MessageProps {
  message: MessageType;
}
export const Message = ({ message }: MessageProps) => {
  const objectID = useClient((store) => store.userId);
  const setEditMessage = useMessage((store) => store.setEditMessageId);
  const setDeleteMessage = useMessage((store) => store.setDeleteMessage);
  const isMine = objectID == message.userId;
  const token = useClient((store) => store.token);
  const revalite = useRevalidator();
  const doDeleteMessage = async () => {
    if (token) {
      await deleteMessage(message.objectId, token);
      setDeleteMessage(message.objectId);
      revalite.revalidate();
    }
  };
  const setEdit = async () => {
    setEditMessage(message.objectId);
  };
  return (
    <div className="relative my-3 ">
      <div
        className={clsx(
          "max-w-[300px]  bg-primary group relative text-base font-normal text-light p-3 rounded-2xl inline-flex",
          {
            "float-right": isMine,
            "rounded-bl-none": !isMine,
            "rounded-br-none": isMine,
            "bg-blue-950": isMine,
          }
        )}
      >
        <p className="break-words max-w-[100%]">{message.text}</p>
        <div className="group-hover:flex hidden z-[99999] flex-row border border-light bg-body space-x-2 bottom-[100%] rounded p-2 absolute -left-0">
          <FiTrash className="text-red-400" onClick={doDeleteMessage} />
          <FiEdit className="text-green-400" onClick={setEdit} />
        </div>
      </div>
    </div>
  );
};
