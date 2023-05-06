import { v4 } from "uuid";
import { Message } from "~/components/Message/Message";
import { useMessage } from "~/store/useMessages";

export const RenderMessages = () => {
  const MessageState = useMessage();

  const item = Array.from(MessageState.Message).map(([id, item]) => (
    <Message key={v4()} message={item} />
  ));
  return <div className="flex flex-1 flex-col justify-end px-5">{item}</div>;
};
