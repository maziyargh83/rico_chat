import { v4 } from "uuid";
import { Message } from "~/components/Message/Message";
import type { MessageType } from "~/services/http/conversation.service";
interface RenderMessagesType {
  messages: MessageType[];
}
export const RenderMessages = ({ messages }: RenderMessagesType) => {
  const item = messages.map((item) => <Message key={v4()} message={item} />);
  return <div className="flex flex-1 flex-col justify-end px-5">{item}</div>;
};
